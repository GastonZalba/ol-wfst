var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Feature, Overlay } from 'ol';
import { WFS } from 'ol/format';
import { Vector as VectorSource, TileWMS } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { unByKey } from 'ol/Observable';
import { MultiPoint } from 'ol/geom';
import { bbox, all } from 'ol/loadingstrategy';
import { getCenter } from 'ol/extent';
import { Fill, Circle as CircleStyle, Stroke, Style } from 'ol/style';
import Modal from 'modal-vanilla';
/**
 * @constructor
 * @param {class} map
 * @param {object} opt_options
 */
export default class Wfst {
    constructor(map, opt_options) {
        this.layerMode = opt_options.layerMode || 'wms';
        this.evtType = opt_options.evtType || 'singleclick';
        this.wfsStrategy = opt_options.wfsStrategy || 'bbox';
        // const active = ('active' in opt_options) ? opt_options.active : true;
        const layers = (opt_options.layers) ? (Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers]) : null;
        this.urlGeoserverWms = opt_options.urlWms;
        this.urlGeoserverWfs = opt_options.urlWfs;
        if (opt_options.showError) {
            this.showError = (msg) => opt_options.showError(msg);
        }
        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._editedFeatures = [];
        this._layers = [];
        this._layersData = {};
        this.insertFeatures = [];
        this.updateFeatures = [];
        this.deleteFeatures = [];
        this.formatWFS = new WFS();
        this.formatGeoJSON = new GeoJSON();
        this.xs = new XMLSerializer();
        this.countRequests = 0;
        this.init(layers);
    }
    init(layers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (layers) {
                this.createLayers(layers);
                yield this.getLayersData(layers);
            }
            this.createEditLayer();
            this.addLayerModeInteractions();
            this.addInteractions();
            this.addHandlers();
            this.addDrawInteraction(layers[0]);
            this.addKeyboardEvents();
        });
    }
    // Layer to store temporary all the elements to edit
    createEditLayer() {
        this.editLayer = new VectorLayer({
            source: new VectorSource(),
            zIndex: 5
        });
        this.map.addLayer(this.editLayer);
    }
    // Add already created layers to the map
    addLayers(layers) {
        layers = Array.isArray(layers) ? layers : [layers];
        const layersStr = [];
        if (!layers.length)
            return;
        layers.forEach(layer => {
            if (layer instanceof VectorLayer) {
                layer.set('type', '_wfs_');
            }
            else {
                layer.set('type', '_wms_');
            }
            this.map.addLayer((layer));
            const layerName = layer.get('name');
            this._layers[layerName] = layer;
            layersStr.push(layerName);
        });
        this.getLayersData(layersStr);
    }
    getLayersData(layers) {
        return __awaiter(this, void 0, void 0, function* () {
            const getLayerData = (layerName) => __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    version: '2.0.0',
                    request: 'DescribeFeatureType',
                    typeNames: layerName,
                    outputFormat: 'application/json',
                    exceptions: 'application/json'
                });
                const url_fetch = this.urlGeoserverWfs + '?' + params.toString();
                try {
                    const response = yield fetch(url_fetch);
                    const data = yield response.json();
                    return data;
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            });
            for (const layerName of layers) {
                const data = yield getLayerData(layerName);
                if (data) {
                    const targetNamespace = data.targetNamespace;
                    const properties = data.featureTypes[0].properties;
                    // Fixme
                    const geom = properties[0];
                    this._layersData[layerName] = {
                        namespace: targetNamespace,
                        properties: properties,
                        geomType: geom.localType
                    };
                }
            }
        });
    }
    createLayers(layers) {
        const newWmsLayer = (layerName) => {
            const layer = new TileLayer({
                source: new TileWMS({
                    url: this.urlGeoserverWms,
                    params: {
                        'LAYERS': layerName,
                        'TILED': true
                    },
                    serverType: 'geoserver'
                }),
                zIndex: 4
            });
            layer.setProperties({
                name: layerName,
                type: "_wms_"
            });
            return layer;
        };
        const newWfsLayer = (layerName) => {
            const source = new VectorSource({
                format: new GeoJSON(),
                strategy: (this.wfsStrategy === 'bbox') ? bbox : all,
                loader: (extent) => __awaiter(this, void 0, void 0, function* () {
                    const params = new URLSearchParams({
                        version: '1.0.0',
                        request: 'GetFeature',
                        typename: layerName,
                        outputFormat: 'application/json',
                        exceptions: 'application/json',
                        srsName: 'urn:ogc:def:crs:EPSG::4326'
                    });
                    // If bbox, add extent to the request
                    if (this.wfsStrategy === 'bbox')
                        params.append('bbox', extent.join(','));
                    const url_fetch = this.urlGeoserverWfs + '?' + params.toString();
                    try {
                        const response = yield fetch(url_fetch);
                        const data = yield response.json();
                        const features = source.getFormat().readFeatures(data);
                        features.forEach((feature) => {
                            feature.set('_layerName_', layerName, /* silent = */ true);
                        });
                        source.addFeatures(features);
                    }
                    catch (err) {
                        console.error(err);
                        source.removeLoadedExtent(extent);
                    }
                })
            });
            const layer = new VectorLayer({
                source: source,
                zIndex: 2
            });
            layer.setProperties({
                name: layerName,
                type: "_wfs_"
            });
            return layer;
        };
        layers.forEach(layerName => {
            let layer;
            if (this.layerMode === 'wms') {
                layer = newWmsLayer(layerName);
            }
            else {
                layer = newWfsLayer(layerName);
            }
            this.map.addLayer(layer);
            this._layers[layerName] = layer;
        });
    }
    showError(msg) {
        Modal.alert(msg).show();
    }
    transactWFS(mode, feature) {
        return __awaiter(this, void 0, void 0, function* () {
            const cloneFeature = (feature) => {
                delete this._editedFeatures[feature.getId()];
                const featureProperties = feature.getProperties();
                delete featureProperties.boundedBy;
                delete featureProperties._layerName_;
                const clone = new Feature(featureProperties);
                clone.setId(feature.getId());
                return clone;
            };
            const refreshWmsLayer = (layer) => {
                const source = layer.getSource();
                // Refrescamos el wms
                source.refresh();
                // Force refresh the tiles
                const params = source.getParams();
                params.t = new Date().getMilliseconds();
                source.updateParams(params);
            };
            const refreshWfsLayer = (layer) => {
                const source = layer.getSource();
                // Refrescamos el wms
                source.refresh();
            };
            const clone = cloneFeature(feature);
            // Peevent fire multiples times
            this.countRequests++;
            const numberRequest = this.countRequests;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (numberRequest !== this.countRequests)
                    return;
                const layerName = feature.get('_layerName_');
                const options = {
                    featureNS: this._layersData[layerName].namespace,
                    featureType: layerName,
                    srsName: 'urn:ogc:def:crs:EPSG::4326',
                    featurePrefix: null,
                    nativeElements: null
                };
                switch (mode) {
                    case 'insert':
                        this.insertFeatures = [...this.insertFeatures, clone];
                        break;
                    case 'update':
                        this.updateFeatures = [...this.updateFeatures, clone];
                        break;
                    case 'delete':
                        this.deleteFeatures = [...this.deleteFeatures, clone];
                        break;
                }
                const transaction = this.formatWFS.writeTransaction(this.insertFeatures, this.updateFeatures, this.deleteFeatures, options);
                let payload = this.xs.serializeToString(transaction);
                // Fixes geometry name
                payload = payload.replaceAll(`geometry`, `geom`);
                try {
                    const response = yield fetch(this.urlGeoserverWfs, {
                        method: 'POST',
                        body: payload,
                        headers: {
                            'Content-Type': 'text/xml',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                    const parseResponse = this.formatWFS.readTransactionResponse(response);
                    if (!Object.keys(parseResponse).length) {
                        const findError = String(response).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                        if (findError)
                            this.showError(findError[1]);
                    }
                    if (mode !== 'delete')
                        this.editLayer.getSource().removeFeature(feature);
                    if (this.layerMode === 'wfs')
                        refreshWfsLayer(this._layers[layerName]);
                    else if (this.layerMode === 'wms')
                        refreshWmsLayer(this._layers[layerName]);
                }
                catch (err) {
                    console.error(err);
                }
                this.insertFeatures = [];
                this.updateFeatures = [];
                this.deleteFeatures = [];
                this.countRequests = 0;
            }), 300);
        });
    }
    addLayerModeInteractions() {
        // Select the wfs feature already downloaded
        const addWfsInteraction = () => {
            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature) => this.styleFunction(feature),
                filter: (feature, layer) => {
                    return layer && layer.get('type') === '_wfs_';
                }
            });
            this.map.addInteraction(this.interactionWfsSelect);
            this.interactionWfsSelect.on('select', ({ selected, deselected }) => {
                if (deselected.length) {
                    deselected.forEach(feature => {
                        this.map.removeOverlay(this.map.getOverlayById(feature.getId()));
                    });
                }
                if (selected.length) {
                    selected.forEach(feature => {
                        if (!this._editedFeatures[feature.getId()]) {
                            // Remove the feature from the original layer                            
                            const layer = this.interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            this.addFeatureToEdit(feature);
                        }
                    });
                }
            });
        };
        // Call the geoserver to get the clicked feature
        const addWmsInteraction = () => {
            const getFeatures = (evt) => __awaiter(this, void 0, void 0, function* () {
                for (const layerName in this._layers) {
                    const layer = this._layers[layerName];
                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    const buffer = (this.view.getZoom() > 10) ? 10 : 5;
                    const url = layer.getSource().getFeatureInfoUrl(evt.coordinate, this.view.getResolution(), this.view.getProjection(), {
                        'INFO_FORMAT': 'application/json',
                        'BUFFER': buffer,
                        'FEATURE_COUNT': 1,
                        'EXCEPTIONS': 'application/json',
                    });
                    try {
                        const response = yield fetch(url);
                        const data = yield response.json();
                        const features = this.formatGeoJSON.readFeatures(data);
                        if (!features.length)
                            return;
                        features.forEach(feature => this.addFeatureToEdit(feature, layerName));
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
            this.keyClickWms = this.map.on(this.evtType, (evt) => __awaiter(this, void 0, void 0, function* () {
                if (this.map.hasFeatureAtPixel(evt.pixel))
                    return;
                yield getFeatures(evt);
            }));
        };
        if (this.layerMode === 'wfs')
            addWfsInteraction();
        else if (this.layerMode === 'wms')
            addWmsInteraction();
    }
    addFeatureToEditedList(feature) {
        this._editedFeatures.push(String(feature.getId()));
    }
    isFeatureEdited(feature) {
        return this._editedFeatures[String(feature.getId())];
    }
    addInteractions() {
        this.interactionSelect = new Select({
            style: (feature) => this.styleFunction(feature),
            layers: [this.editLayer]
        });
        this.map.addInteraction(this.interactionSelect);
        this.interactionModify = new Modify({
            features: this.interactionSelect.getFeatures()
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new Snap({
            source: this.editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);
    }
    addDrawInteraction(layerName) {
        this.interactionDraw = new Draw({
            source: this.editLayer.getSource(),
            type: this._layersData[layerName].geomType
        });
        this.map.addInteraction(this.interactionDraw);
        this.activateDrawMode(false);
        const drawHandler = () => {
            this.interactionDraw.on('drawend', (evt) => {
                unByKey(this.keyRemove);
                const feature = evt.feature;
                feature.set('_layerName_', layerName, /* silent = */ true);
                //feature.setId(feature.id_);
                this.transactWFS('insert', feature);
                setTimeout(() => {
                    this.removeFeatureHandler();
                }, 150);
            });
        };
        drawHandler();
    }
    selectFeatureHandler() {
        // This is fired when a feature is deselected and fires the transaction process
        // and update the geoserver
        this.keySelect = this.interactionSelect.getFeatures().on('remove', (evt) => {
            const feature = evt.element;
            unByKey(this.keyRemove);
            if (this.isFeatureEdited(feature)) {
                this.transactWFS('update', feature);
            }
            else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (this.layerMode === 'wfs') {
                    const layer = this._layers[feature.get('_layerName_')];
                    layer.getSource().addFeature(feature);
                }
                this.editLayer.getSource().removeFeature(feature);
                this.interactionSelect.getFeatures().clear();
            }
            setTimeout(() => {
                this.removeFeatureHandler();
            }, 150);
        });
    }
    removeFeatureHandler() {
        // If a feature is removed from the edit layer
        this.keyRemove = this.editLayer.getSource().on('removefeature', (evt) => {
            unByKey(this.keySelect);
            const feature = evt.feature;
            this.transactWFS('delete', feature);
            setTimeout(() => {
                this.selectFeatureHandler();
            }, 150);
        });
    }
    addHandlers() {
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', (evt) => {
            this.addFeatureToEditedList(evt.features.item(0));
        });
        this.selectFeatureHandler();
        this.removeFeatureHandler();
    }
    styleFunction(feature) {
        const showVerticesStyle = new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#ffffff'
                }),
                stroke: new Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                }),
            }),
            geometry: (feature) => {
                const geometry = feature.getGeometry();
                let coordinates = geometry.getCoordinates();
                const type = geometry.getType();
                if (type == 'Polygon' ||
                    type == 'MultiLineString') {
                    coordinates = coordinates.flat(1);
                }
                if (!coordinates.length)
                    return;
                return new MultiPoint(coordinates);
            }
        });
        const type = feature.getGeometry().getType();
        switch (type) {
            case 'Point':
            case 'MultiPoint':
                return [
                    new Style({
                        image: new CircleStyle({
                            radius: 5,
                            stroke: new Stroke({
                                color: 'rgba( 255, 255, 255, 0.8)',
                                width: 12
                            })
                        })
                    }),
                ];
            default:
                return [
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba( 255, 0, 0, 1)',
                            width: 4
                        })
                    }),
                    showVerticesStyle,
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba( 255, 255, 255, 0.7)',
                            width: 2
                        })
                    }),
                ];
        }
    }
    deleteElement(feature) {
        const features = Array.isArray(feature) ? feature : [feature];
        features.forEach(feature => this.editLayer.getSource().removeFeature(feature));
        this.interactionSelect.getFeatures().clear();
    }
    addKeyboardEvents() {
        document.addEventListener('keydown', ({ key }) => {
            if (key === "Delete") {
                const selectedFeatures = this.interactionSelect.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(feature => {
                        this.deleteElement(feature);
                    });
                }
            }
        });
    }
    addFeatureToEdit(feature, layerName = null) {
        const prepareOverlay = () => {
            const svg = `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="448" height="448" viewBox="0 0 448 448">
            <path d="M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z"></path>
            </svg>`;
            const editEl = document.createElement('div');
            editEl.innerHTML = `<button class="ol-wfst--edit-button" type="button">${svg}</button>`;
            editEl.onclick = () => {
                this.initModal(feature);
            };
            const buttons = document.createElement('div');
            buttons.append(editEl);
            const buttonsOverlay = new Overlay({
                id: feature.getId(),
                position: getCenter(feature.getGeometry().getExtent()),
                element: buttons,
                stopEvent: true
            });
            this.map.addOverlay(buttonsOverlay);
        };
        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }
        const props = (feature) ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                this.editLayer.getSource().addFeature(feature);
                this.interactionSelect.getFeatures().push(feature);
                prepareOverlay();
            }
        }
    }
    activateDrawMode(bool = true) {
        this.interactionDraw.setActive(bool);
    }
    activateEditMode(bool = true) {
        this.interactionSelect.setActive(bool);
        this.interactionModify.setActive(bool);
        // FIXME
        // if (this.layerMode === 'wms') {
        //     if (!bool) unByKey(this.clickWmsKey);
        // }
    }
    initModal(feature) {
        this.editFeature = feature;
        const properties = feature.getProperties();
        const layer = feature.get('_layerName_');
        // Data schema from the geoserver
        const dataSchema = this._layersData[layer].properties;
        let content = '';
        Object.keys(properties).forEach(key => {
            // If the feature field exists in the geoserver and is not added by openlayers
            const field = dataSchema.find(data => data.name === key);
            if (field) {
                const typeXsd = field.type;
                let type;
                switch (typeXsd) {
                    case 'xsd:string':
                        type = 'text';
                        break;
                    case 'xsd:int':
                        type = 'number';
                        break;
                    case 'xsd:date-time':
                        type = 'datetime';
                        break;
                    default:
                        type = 'text';
                }
                if (type) {
                    content += `
                    <div class="ol-wfst--input-field-container">
                        <label class="ol-wfst--input-field-label" for="${key}">${key}</label>
                        <input placeholder="NULL" class="ol-wfst--input-field-input" type="${type}" name="${key}" value="${properties[key] || ''}">
                    </div>
                    `;
                }
            }
        });
        const footer = `
            <button type="button" class="btn btn-danger" data-action="delete" data-dismiss="modal">Eliminar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" data-action="save" data-dismiss="modal">Guardar</button>
        `;
        this.modal = new Modal({
            header: true,
            headerClose: true,
            title: `Editar elemento ${this.editFeature.getId()}`,
            content: content,
            footer: footer,
            animateInClass: 'in',
        }).show();
        this.modal.on('dismiss', (modal, event) => {
            if (event.target.dataset.action === 'save') {
                const inputs = modal.el.querySelectorAll('input');
                inputs.forEach((el) => {
                    const value = el.value;
                    const field = el.name;
                    this.editFeature.set(field, value, /*isSilent = */ true);
                });
                this.editFeature.changed();
                this.addFeatureToEditedList(this.editFeature);
                this.transactWFS('update', this.editFeature);
            }
            else if (event.target.dataset.action === 'delete') {
                this.map.removeOverlay(this.map.getOverlayById(feature.getId()));
                this.deleteElement(this.editFeature);
            }
        });
    }
}
