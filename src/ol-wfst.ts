import 'ol/ol.css';
import './css/custom.css';
import './css/bootstrap.css';
import './css/bootstrap-theme.css';

import { WFS } from 'ol/format';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import Feature from 'ol/Feature';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { unByKey } from 'ol/observable';
import { Fill, Circle as CircleStyle, Stroke, Style } from 'ol/style';
import MultiPoint from 'ol/geom/multipoint';
import { bbox, all } from 'ol/loadingstrategy';
import { Overlay } from 'ol';
import { getCenter } from 'ol/extent';
import { MapBrowserEvent, PluggableMap, View } from 'ol';

import axios from 'axios';
import Modal from 'modal-vanilla';
import { EventsKey } from 'ol/events';


/**
 * 
 * @param {class} map 
 * @param {object} opt_options
 * @param {'wms' | 'wfs'} opt_options.layerMode
 * @param {'singleclick' | 'dblclick'} opt_options.evntType
 * @param {'bbox' | 'all'} opt_options.wfsStrategy
 * @param {boolean} opt_options.active
 * @param {array} opt_options.layers
 * @param {function} opt_options.showError
 */
class Wfst {

    // Ol
    public map: PluggableMap;
    public view: View;
    public overlay: Overlay;
    public viewport: HTMLElement;

    protected layerMode: string;
    protected evtType: string;
    protected wfsStrategy: string;

    protected urlGeoserverWms: string;
    protected urlGeoserverWfs: string;

    protected _editedFeatures: {};
    protected _layers: Array<VectorLayer | TileLayer>;
    protected _layersData: {};
    protected editLayer: VectorLayer;

    // Interactions
    protected interactionWfsSelect: Select;
    protected interactionSelect: Select;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;

    // Obserbable keys
    protected keyClickWms: EventsKey | EventsKey[]
    protected keyRemove: EventsKey;
    protected keySelect: EventsKey;

    protected insertFeatures: Array<Feature>;
    protected updateFeatures: Array<Feature>;
    protected deleteFeatures: Array<Feature>;

    protected countRequests: number;

    protected formatWFS: WFS;
    protected formatGeoJSON: GeoJSON;
    protected xs: XMLSerializer;

    protected modal: Modal;
    protected editFeature: Feature;

    constructor(map, opt_options?: Options) {

        this.layerMode = opt_options.layerMode || 'wms';
        this.evtType = opt_options.evtType || 'singleclick';
        this.wfsStrategy = opt_options.wfsStrategy || 'bbox';

        let active = ('active' in opt_options) ? opt_options.active : true;
        let layers = (opt_options.layers) ? (Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers]) : null;

        this.urlGeoserverWms = opt_options.urlWms;
        this.urlGeoserverWfs = opt_options.urlWfs;

        if (opt_options.showError) {
            this.showError = (msg) => opt_options.showError(msg)
        }

        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();

        this.formatWFS = new WFS();
        this.formatGeoJSON = new GeoJSON();
        this.xs = new XMLSerializer();

        this.countRequests = 0;

        this.init(layers);

    }

    async init(layers) {

        if (layers) {
            this.createLayers(layers);
            await this.getLayersData(layers);
        }

        this.createEditLayer();

        this.addLayerModeInteractions();
        this.addInteractions();
        this.addHandlers();

        this.addDrawInteraction(layers[0]);

        this.addKeyboardEvents();

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

        if (!layers.length) return;

        layers.forEach(layer => {

            if (layer instanceof VectorSource) {
                layer.set('type', '_wfs_');
            } else {
                layer.set('type', '_wms_');
            }

            this.map.addLayer(layer)
            this._layers[layer.get('name')] = layer;
        })

        this.getLayersData(layers);
    }

    async getLayersData(layers) {

        const getLayerData = (layerName): Promise<DescribeFeatureType> => {
            return new Promise(async (resolve) => {
                const params = new URLSearchParams({
                    version: '2.0.0',
                    request: 'DescribeFeatureType',
                    typeNames: layerName,
                    outputFormat: 'application/json',
                    exceptions: 'application/json'
                });

                const url_fetch = this.urlGeoserverWfs + '?' + params.toString();

                try {

                    let { data } = await axios.get(url_fetch);
                    resolve(data);

                } catch (err) {
                    console.error(err);
                    resolve(null);
                }
            })

        }

        for (let layerName of layers) {

            let data = await getLayerData(layerName);

            if (data) {
                let targetNamespace = data.targetNamespace;
                let properties = data.featureTypes[0].properties;

                // Fixme
                let geom = properties[0];

                this._layersData[layerName] = {
                    namespace: targetNamespace,
                    properties: properties,
                    geomType: geom.localType
                };
            }

        }

    }

    createLayers(layers: Array<any>) {

        const newWmsLayer = (layerName: string) => {
            let layer = new TileLayer({
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
            })

            return layer;

        }

        const newWfsLayer = (layerName: string) => {

            let source = new VectorSource({
                format: new GeoJSON(),
                strategy: (this.wfsStrategy === 'bbox') ? bbox : all,
                loader: async (extent, resolution, projection) => {

                    const params = new URLSearchParams({
                        version: '1.0.0',
                        request: 'GetFeature',
                        typename: layerName,
                        outputFormat: 'application/json',
                        exceptions: 'application/json',
                        srsName: 'urn:ogc:def:crs:EPSG::4326'

                    });

                    // If bbox, add extent to the request
                    if (this.wfsStrategy === 'bbox') params.append('bbox', extent.join(','));

                    const url_fetch = this.urlGeoserverWfs + '?' + params.toString();

                    try {

                        let { data } = await axios.get(url_fetch);
                        let features = source.getFormat().readFeatures(data);

                        features.forEach((feature: Feature) => {
                            feature.set('_layerName_', layerName);
                        })

                        source.addFeatures(features);

                    } catch (err) {
                        console.error(err);
                        source.removeLoadedExtent(extent);

                    }

                }

            });

            let layer = new VectorLayer({
                source: source,
                zIndex: 2
            })

            layer.setProperties({
                name: layerName,
                type: "_wfs_"
            })

            return layer;

        }

        layers.forEach(layerName => {

            let layer: VectorLayer | TileLayer;

            if (this.layerMode === 'wms') {
                layer = newWmsLayer(layerName);
            } else {
                layer = newWfsLayer(layerName);
            }

            this.map.addLayer(layer)
            this._layers[layerName] = layer;
        })

    }

    showError(msg) {
        Modal.alert(msg).show();
    }

    async transactWFS(mode: string, feature: Feature) {

        const cloneFeature = (feature: Feature) => {

            delete this._editedFeatures[feature.getId()];

            let featureProperties = feature.getProperties();

            delete featureProperties.boundedBy;
            delete featureProperties._layerName_;

            let clone = new Feature(featureProperties);
            clone.setId(feature.getId());

            return clone;
        }

        const refreshWmsLayer = (layer) => {

            let source = layer.getSource();

            // Refrescamos el wms
            source.refresh();

            // Esto porque lo aterior no aprece refrescar los tiles
            let params = source.getParams();
            params.t = new Date().getMilliseconds();
            source.updateParams(params);
        }

        const refreshWfsLayer = (layer) => {

            let source = layer.getSource();
            // Refrescamos el wms
            source.refresh();
        }

        let clone = cloneFeature(feature);

        // Peevent fire multiples times
        this.countRequests++;
        let numberRequest = this.countRequests;

        setTimeout(async () => {

            if (numberRequest !== this.countRequests) return;

            // Propiedad guardada provisoriamente con el nombre de la capa original
            let layerName = feature.get('_layerName_');

            let options = {
                featureNS: this._layersData[layerName].namespace,
                featureType: layerName,
                srsName: 'urn:ogc:def:crs:EPSG::4326'
            }

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

            let transaction = this.formatWFS.writeTransaction(this.insertFeatures, this.updateFeatures, this.deleteFeatures, options);

            let payload = this.xs.serializeToString(transaction);

            // Fixes geometry name
            payload = payload.replaceAll(`geometry`, `geom`);

            try {

                let { data } = await axios.post(this.urlGeoserverWfs, payload, {
                    headers: {
                        'Content-Type': 'text/xml',
                        'Access-Control-Allow-Origin': '*'
                    }
                })

                let parseResponse = this.formatWFS.readTransactionResponse(data);

                if (!parseResponse.length) {

                    let findError = data.match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);

                    if (findError)
                        this.showError(findError[1]);

                }

                // Limpiamos el vector
                if (mode !== 'delete') this.editLayer.getSource().removeFeature(feature);

                if (this.layerMode === 'wfs')
                    refreshWfsLayer(this._layers[layerName]);
                else if (this.layerMode === 'wms')
                    refreshWmsLayer(this._layers[layerName]);

            } catch (err) {
                console.error(err);
            }

            this.insertFeatures = [];
            this.updateFeatures = [];
            this.deleteFeatures = [];

            this.countRequests = 0;

        }, 300)



    };


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
                        this.map.removeOverlay(this.map.getOverlayById(feature.getId()))
                    })
                }

                if (selected.length) {
                    selected.forEach(feature => {
                        if (!this._editedFeatures[feature.getId()]) {
                            // Remove the feature from the original layer                            
                            let layer = this.interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            this.addFeatureToEdit(feature);
                        }
                    })
                }

            });

        }

        // Call the geoserver to get the clicked feature
        const addWmsInteraction = () => {

            const getFeatures = async (evt) => {

                for (let layerName in this._layers) {

                    let layer = this._layers[layerName];

                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    let buffer = (this.view.getZoom() > 10) ? 10 : 5;

                    let url = layer.getSource().getFeatureInfoUrl(
                        evt.coordinate,
                        this.view.getResolution(),
                        this.view.getProjection(),
                        {
                            'INFO_FORMAT': 'application/json',
                            'BUFFER': buffer,// Buffer es el "hit tolerance" para capas ráster
                            'FEATURE_COUNT': 1,
                            'EXCEPTIONS': 'application/json',
                        }
                    );


                    try {

                        let { data } = await axios.get(url);
                        let features = this.formatGeoJSON.readFeatures(data);

                        if (!features.length) return;

                        features.forEach(feature => this.addFeatureToEdit(feature, layerName))

                    } catch (err) {
                        console.error(err);
                    }

                }
            }

            this.keyClickWms = this.map.on(this.evtType, async (evt) => {
                if (this.map.hasFeatureAtPixel(evt.pixel)) return;
                await getFeatures(evt)
            });
        }

        if (this.layerMode === 'wfs') addWfsInteraction();
        else if (this.layerMode === 'wms') addWmsInteraction();

    }

    addFeatureToEditedList(feature) {
        this._editedFeatures[feature.getId()] = true;
    }

    isFeatureEdited(feature) {
        return this._editedFeatures[feature.getId()];
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
        })

        this.map.addInteraction(this.interactionDraw);
        this.activateDrawMode(false);

        const drawHandler = () => {

            this.interactionDraw.on('drawend', (evt) => {
                unByKey(this.keyRemove);

                let feature = evt.feature;
                feature.set('_layerName_', layerName, /* silent = */true);
                feature.setId(feature.id_);
                this.transactWFS('insert', feature);

                setTimeout(() => {
                    this.removeFeatureHandler();
                }, 150)
            })
        }

        drawHandler();
    }

    selectFeatureHandler() {
        // This is fired when a feature is deselected and fires the transaction process
        // and update the geoserver
        this.keySelect = this.interactionSelect.getFeatures().on('remove', (evt) => {

            let feature = evt.element;
            unByKey(this.keyRemove);

            if (this.isFeatureEdited(feature)) {

                this.transactWFS('update', feature);

            } else {

                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (this.layerMode === 'wfs') {
                    let layer:VectorLayer = this._layers[feature.get('_layerName_')];
                    layer.getSource().addFeature(feature);
                }

                this.editLayer.getSource().removeFeature(feature);
                this.interactionSelect.getFeatures().clear();

            }

            setTimeout(() => {
                this.removeFeatureHandler();
            }, 150)

        });
    }

    removeFeatureHandler() {
        // If a feature is removed from the edit layer
        this.keyRemove = this.editLayer.getSource().on('removefeature', (evt) => {

            unByKey(this.keySelect);

            let feature = evt.feature;

            this.transactWFS('delete', feature);

            setTimeout(() => {
                this.selectFeatureHandler();
            }, 150)

        })
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
                // return the coordinates of the first ring of the polygon
                let geometry = feature.getGeometry();
                let coordinates = geometry.getCoordinates();
                let type = geometry.getType();

                if (type == 'Polygon' ||
                    type == 'MultiLineString') {
                    coordinates = coordinates.flat(1);
                }

                if (!coordinates.length)
                    return;

                return new MultiPoint(coordinates);
            }
        });

        let type = feature.getGeometry().getType();

        switch (type) {
            case 'Point':
            case 'MultiPoint':
                return [
                    new Style({
                        zIndex: -1, // para que quede por debajo del ícono
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
        let features = Array.isArray(feature) ? feature : [feature];
        features.forEach(feature => this.editLayer.getSource().removeFeature(feature));
        this.interactionSelect.getFeatures().clear();
    }

    addKeyboardEvents() {
        document.addEventListener('keydown', ({ key }) => {
            if (key === "Delete") {
                let selectedFeatures = this.interactionSelect.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(feature => {
                        this.deleteElement(feature)
                    })
                }
            }
        })

    }

    addFeatureToEdit(feature, layerName = null) {

        const prepareOverlay = () => {
            let svg = `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="448" height="448" viewBox="0 0 448 448">
            <path d="M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z"></path>
            </svg>`

            let editEl = document.createElement('div');
            editEl.innerHTML = `<button class="ol-wfst--edit-button" type="button">${svg}</button>`;
            editEl.onclick = (evt) => {
                this.initModal(feature);
            }

            let buttons = document.createElement('div');
            buttons.append(editEl);

            let buttonsOverlay = new Overlay({
                id: feature.getId(),
                position: getCenter(feature.getGeometry().getExtent()),
                positioning: 'center-center',
                element: buttons,
                stopEvent: true
            });

            this.map.addOverlay(buttonsOverlay);

        }


        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }

        let props = (feature) ? feature.getProperties() : '';

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

        let properties = feature.getProperties();
        let layer = feature.get('_layerName_');

        // Data schema from the geoserver
        let dataSchema = this._layersData[layer].properties;

        let content = '';
        Object.keys(properties).forEach(key => {

            // If the feature field exists in the geoserver and is not added by openlayers
            let field = dataSchema.find(data => data.name === key);

            if (field) {

                let typeXsd = field.type;
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
                    default:
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

        })

        let footer = `
            <button type="button" class="btn btn-danger" data-action="delete" data-dismiss="modal">Eliminar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" data-action="save" data-dismiss="modal">Guardar</button>
        `;

        this.modal = new Modal({
            header: true,
            headerClose: true,
            title: `Editar elemento ${this.editFeature.getId()}`,
            content: content,
            footer: footer
        }).show()

        this.modal.on('dismiss', (modal, event) => {

            if (event.target.dataset.action === 'save') {

                let inputs = modal.el.querySelectorAll('input');

                inputs.forEach(el => {
                    let value = el.value;
                    let field = el.name;
                    this.editFeature.set(field, value, /*isSilent = */ true);
                })

                this.editFeature.changed();
                this.addFeatureToEditedList(this.editFeature);
                this.transactWFS('update', this.editFeature);

            } else if (event.target.dataset.action === 'delete') {

                this.map.removeOverlay(this.map.getOverlayById(feature.getId()))
                this.deleteElement(this.editFeature);

            } else {


            }

        })

    }

}

interface DescribeFeatureType {
    targetNamespace: string;
    featureTypes: Array<any>;
}
/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 * Default values:
 * ```javascript
 * {

 * }
 * ```
 */
interface Options {

    urlWfs?: string;
    urlWms?: string;

    layerMode?: string;
    evtType?: string;
    wfsStrategy?: string;

    active?: boolean;
    layers?: Array<string>;

    showError?: Function;
}

export { Options };
