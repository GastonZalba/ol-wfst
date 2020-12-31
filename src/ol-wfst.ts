import { Feature, PluggableMap, View, Overlay } from 'ol';
import { WFS } from 'ol/format';
import { Vector as VectorSource, TileWMS } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { unByKey } from 'ol/Observable';
import { Geometry, MultiPoint } from 'ol/geom';
import { bbox, all } from 'ol/loadingstrategy';
import { getCenter } from 'ol/extent';
import { EventsKey } from 'ol/events';
import { Fill, Circle as CircleStyle, Stroke, Style } from 'ol/style';
import { primaryAction } from 'ol/events/condition';
import Control from 'ol/control/Control';
import OverlayPositioning from 'ol/OverlayPositioning';

import Modal from 'modal-vanilla';

// Images
import drawSvg from './assets/images/draw.svg';
import selectSvg from './assets/images/select.svg';
import editGeomSvg from './assets/images/editGeom.svg';
import editFieldsSvg from './assets/images/editFields.svg';

/**
 * @constructor
 * @param {class} map 
 * @param {object} opt_options
 */
export default class Wfst {

    // Ol
    public map: PluggableMap;
    public view: View;
    public overlay: Overlay;
    public viewport: HTMLElement;

    protected layerMode: string;
    protected editMode: string;

    protected evtType: string;
    protected wfsStrategy: string;

    protected urlGeoserverWms: string;
    protected urlGeoserverWfs: string;

    protected _editedFeatures: Set<string>;
    protected _layers: Array<VectorLayer | TileLayer>;
    protected _layersData: LayerData;
    protected _editLayer: VectorLayer;

    protected _isEditMode: boolean;
    protected _isDrawMode: boolean;

    // Interactions
    protected interactionWfsSelect: Select;
    protected interactionSelectModify: Select;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;

    // Obserbable keys
    protected _keyClickWms: EventsKey | EventsKey[]
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;

    protected insertFeatures: Array<Feature>;
    protected updateFeatures: Array<Feature>;
    protected deleteFeatures: Array<Feature>;

    protected _countRequests: number;

    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _xs: XMLSerializer;

    protected modal: typeof Modal;
    protected _editFeature: Feature;
    protected _editFeaturOriginal: Feature;
    protected _controlChanges: Control;
    protected _controlTools: Control;
    protected _insertNewLayer: string;

    constructor(map: PluggableMap, opt_options?: Options) {

        this.layerMode = opt_options.layerMode || 'wms';
        this.evtType = opt_options.evtType || 'singleclick';
        this.editMode = opt_options.editMode || 'button';

        this.wfsStrategy = opt_options.wfsStrategy || 'bbox';

        const active = ('active' in opt_options) ? opt_options.active : true;
        const layers = (opt_options.layers) ? (Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers]) : null;
        const showControl = ('showControl' in opt_options) ? opt_options.showControl : true;

        this.urlGeoserverWms = opt_options.urlWms;
        this.urlGeoserverWfs = opt_options.urlWfs;

        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();

        this._editedFeatures = new Set();
        this._layers = [];

        // By default, the first layer is ready to accept new draws
        this._insertNewLayer = layers[0];

        this._layersData = {};

        this.insertFeatures = [];
        this.updateFeatures = [];
        this.deleteFeatures = [];

        this._formatWFS = new WFS();
        this._formatGeoJSON = new GeoJSON();
        this._xs = new XMLSerializer();

        this._countRequests = 0;

        if (this.editMode === 'alwaysOn')
            this._isEditMode = true;
        else
            this._isEditMode = false;

        this.init(layers);

        if (showControl)
            this.addToolsControl();

        this.activateEditMode(active);

    }

    async init(layers: Array<string>): Promise<void> {

        this.createEditLayer();

        this.addLayerModeInteractions();
        this.addInteractions();
        this.addHandlers();

        if (layers) {
            this.createLayers(layers);
            await this.getLayersData(layers);
        }

        this.addKeyboardEvents();

    }

    /**
     * Layer to store temporary all the elements to edit
     */
    createEditLayer(): void {

        this._editLayer = new VectorLayer({
            source: new VectorSource(),
            zIndex: 5
        });

        this.map.addLayer(this._editLayer);

    }


    /**
     * Add already created layers to the map
     * @param layers 
     */
    addLayers(layers: Array<VectorLayer | TileLayer>): void {

        layers = Array.isArray(layers) ? layers : [layers];
        const layersStr = [];

        if (!layers.length) return;

        layers.forEach(layer => {

            if (layer instanceof VectorLayer) {
                layer.set('type', '_wfs_');
            } else {
                layer.set('type', '_wms_');
            }

            this.map.addLayer((layer))
            const layerName = layer.get('name')
            this._layers[layerName] = layer;
            layersStr.push(layerName);
        })

        this.getLayersData(layersStr);
    }

    /**
     * 
     * @param layers 
     */
    async getLayersData(layers: Array<string>): Promise<void> {

        const getLayerData = async (layerName: string): Promise<DescribeFeatureType> => {
            const params = new URLSearchParams({
                version: '2.0.0',
                request: 'DescribeFeatureType',
                typeNames: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });

            const url_fetch = this.urlGeoserverWfs + '?' + params.toString();

            try {

                const response = await fetch(url_fetch);
                const data = await response.json();
                return data;

            } catch (err) {
                console.error(err);
                return null;
            }
        }

        for (const layerName of layers) {

            const data = await getLayerData(layerName);

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

    }

    /**
     * 
     * @param layers 
     */
    createLayers(layers: Array<string>): void {

        const newWmsLayer = (layerName: string) => {
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
            })

            return layer;

        }

        const newWfsLayer = (layerName: string) => {

            const source = new VectorSource({
                format: new GeoJSON(),
                strategy: (this.wfsStrategy === 'bbox') ? bbox : all,
                loader: async (extent) => {

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

                        const response = await fetch(url_fetch);
                        const data = await response.json();
                        const features = source.getFormat().readFeatures(data);

                        features.forEach((feature: Feature) => {
                            feature.set('_layerName_', layerName, /* silent = */ true);
                        })

                        source.addFeatures((features as Feature<Geometry>[]));

                    } catch (err) {
                        console.error(err);
                        source.removeLoadedExtent(extent);
                    }

                }

            });

            const layer = new VectorLayer({
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

    showError(msg: string): void {
        Modal.alert('Error: ' + msg, {
            animateInClass: 'in'
        }).show();
    }

    async transactWFS(mode: string, feature: Feature): Promise<void> {

        const cloneFeature = (feature: Feature) => {

            this.removeFeatureFromEditList(feature);

            const featureProperties = feature.getProperties();

            delete featureProperties.boundedBy;
            delete featureProperties._layerName_;

            const clone = new Feature(featureProperties);
            clone.setId(feature.getId());

            return clone;
        }

        const refreshWmsLayer = (layer) => {

            const source = layer.getSource();

            // Refrescamos el wms
            source.refresh();

            // Force refresh the tiles
            const params = source.getParams();
            params.t = new Date().getMilliseconds();
            source.updateParams(params);
        }

        const refreshWfsLayer = (layer) => {

            const source = layer.getSource();
            // Refrescamos el wms
            source.refresh();
        }

        const clone = cloneFeature(feature);

        // Peevent fire multiples times
        this._countRequests++;
        const numberRequest = this._countRequests;

        setTimeout(async () => {

            if (numberRequest !== this._countRequests) return;

            const layerName = feature.get('_layerName_');

            const options = {
                featureNS: this._layersData[layerName].namespace,
                featureType: layerName,
                srsName: 'urn:ogc:def:crs:EPSG::4326',
                featurePrefix: null,
                nativeElements: null
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

            const transaction = this._formatWFS.writeTransaction(this.insertFeatures, this.updateFeatures, this.deleteFeatures, options);

            let payload = this._xs.serializeToString(transaction);

            // Fixes geometry name
            payload = payload.replaceAll(`geometry`, `geom`);

            try {

                const response = await fetch(this.urlGeoserverWfs, {
                    method: 'POST',
                    body: payload,
                    headers: {
                        'Content-Type': 'text/xml',
                        'Access-Control-Allow-Origin': '*'
                    }
                })

                const parseResponse = this._formatWFS.readTransactionResponse(response);

                if (!Object.keys(parseResponse).length) {

                    let responseStr = await response.text();
                    const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);

                    if (findError)
                        this.showError(findError[1]);

                }

                if (mode !== 'delete') this._editLayer.getSource().removeFeature(feature);

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

            this._countRequests = 0;

        }, 300)



    }


    /**
     * 
     */
    addLayerModeInteractions(): void {
        // Select the wfs feature already downloaded
        const addWfsInteraction = () => {
            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature: Feature) => this.styleFunction(feature),
                filter: (feature, layer) => {
                    return layer && layer.get('type') === '_wfs_';
                }
            });

            this.map.addInteraction(this.interactionWfsSelect);

            this.interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {

                let coordinate = mapBrowserEvent.coordinate;

                if (selected.length) {
                    selected.forEach(feature => {
                        if (!this._editedFeatures.has(String(feature.getId()))) {
                            // Remove the feature from the original layer                            
                            const layer = this.interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            this.addFeatureToEdit(feature, coordinate);
                        }
                    })
                }

            });

        }

        // Call the geoserver to get the clicked feature
        const addWmsInteraction = (): void => {

            const getFeatures = async (evt) => {

                for (const layerName in this._layers) {

                    const layer = this._layers[layerName];
                    let coordinate = evt.coordinate;

                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    const buffer = (this.view.getZoom() > 10) ? 10 : 5;

                    const url = (layer.getSource() as TileWMS).getFeatureInfoUrl(
                        coordinate,
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

                        const response = await fetch(url);
                        const data = await response.json();
                        const features = this._formatGeoJSON.readFeatures(data);

                        if (!features.length) return;

                        features.forEach(feature => this.addFeatureToEdit(feature, coordinate, layerName))

                    } catch (err) {
                        console.error(err);
                    }

                }
            }

            this._keyClickWms = this.map.on(this.evtType, async (evt) => {
                if (this.map.hasFeatureAtPixel(evt.pixel)) return;
                await getFeatures(evt)
            });
        }

        if (this.layerMode === 'wfs') addWfsInteraction();
        else if (this.layerMode === 'wms') addWmsInteraction();

    }

    removeFeatureFromEditList(feature: Feature): void {
        this._editedFeatures.delete(String(feature.getId()));
    }

    addFeatureToEditedList(feature: Feature): void {
        this._editedFeatures.add(String(feature.getId()));
    }

    isFeatureEdited(feature: Feature): boolean {
        return this._editedFeatures.has(String(feature.getId()));
    }

    addInteractions(): void {

        this.interactionSelectModify = new Select({
            style: (feature: Feature) => this.styleFunction(feature),
            layers: [this._editLayer],
            toggleCondition: (evt) => false, // Prevent add feature to the current selection
            removeCondition: (evt) => (this.editMode === 'button' && this._isEditMode) ? true : false
        });

        this.map.addInteraction(this.interactionSelectModify);

        this.interactionModify = new Modify({
            style: () => {
                if (this._isEditMode) {
                    return new Style({
                        image: new CircleStyle({
                            radius: 6,
                            fill: new Fill({
                                color: '#ff0000'
                            }),
                            stroke: new Stroke({
                                width: 2,
                                color: 'rgba(5, 5, 5, 0.9)'
                            })
                        })
                    })
                } else {
                    return;
                }
            },
            features: this.interactionSelectModify.getFeatures(),
            condition: (evt) => {
                return primaryAction(evt) && this._isEditMode
            }
        });

        this.map.addInteraction(this.interactionModify);

        this.interactionSnap = new Snap({
            source: this._editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);

    }

    addDrawInteraction(layerName: string): void {

        this.activateEditMode(false);

        // If already exists, remove
        if (this.interactionDraw)
            this.map.removeInteraction(this.interactionDraw);

        this.interactionDraw = new Draw({
            source: this._editLayer.getSource(),
            type: this._layersData[layerName].geomType,
            style: (feature: Feature) => this.styleFunction(feature)
        })

        this.map.addInteraction(this.interactionDraw);

        const drawHandler = () => {

            this.interactionDraw.on('drawend', (evt) => {
                unByKey(this._keyRemove);

                const feature: Feature = evt.feature;
                feature.set('_layerName_', layerName, /* silent = */true);
                this.transactWFS('insert', feature);

                setTimeout(() => {
                    this.removeFeatureHandler();
                }, 150)
            })
        }

        drawHandler();
    }


    cancelEditFeature(feature: Feature): void {

        this.removeOverlayHelper(feature);

        if (this.editMode === 'button') {
            this.editModeOff();
        }
    }

    finishEditFeature(feature: Feature): void {

        unByKey(this._keyRemove);

        if (this.isFeatureEdited(feature)) {
            this.transactWFS('update', feature);

        } else {

            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (this.layerMode === 'wfs') {
                const layer = this._layers[feature.get('_layerName_')];
                (layer.getSource() as VectorSource).addFeature(feature);
                this.interactionWfsSelect.getFeatures().remove(feature);
            }

            this.interactionSelectModify.getFeatures().remove(feature);
            this._editLayer.getSource().removeFeature(feature);
        }

        setTimeout(() => {
            this.removeFeatureHandler();
        }, 150)

    }

    selectFeatureHandler(): void {

        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', (evt) => {
            const feature = evt.element;
            this.cancelEditFeature(feature);
            this.finishEditFeature(feature);
        });

    }

    removeFeatureHandler(): void {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', (evt) => {

            if (this._keySelect) unByKey(this._keySelect);

            const feature = evt.feature;

            this.transactWFS('delete', feature);

            this.cancelEditFeature(feature);

            if (this._keySelect) {
                setTimeout(() => {
                    this.selectFeatureHandler();
                }, 150)
            }

        })
    }

    addHandlers(): void {

        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', (evt) => {
            this.addFeatureToEditedList(evt.features.item(0));
        });

        this.selectFeatureHandler();
        this.removeFeatureHandler();

    }

    styleFunction(feature: Feature): Array<Style> {

        const type = feature.getGeometry().getType();

        switch (type) {
            case 'Point':
            case 'MultiPoint':
                if (this._isEditMode) {
                    return [
                        new Style({
                            image: new CircleStyle({
                                radius: 6,
                                fill: new Fill({
                                    color: '#000000'
                                })
                            })
                        }),
                        new Style({
                            image: new CircleStyle({
                                radius: 4,
                                fill: new Fill({
                                    color: '#ff0000'
                                })
                            })
                        })
                    ];
                } else {
                    return [
                        new Style({
                            image: new CircleStyle({
                                radius: 5,
                                fill: new Fill({
                                    color: '#ff0000'
                                })
                            })
                        }),
                        new Style({
                            image: new CircleStyle({
                                radius: 2,
                                fill: new Fill({
                                    color: '#000000'
                                })
                            })
                        })
                    ];
                }
            default:
                if (this._isEditMode || this._isDrawMode) {
                    return [
                        new Style({
                            stroke: new Stroke({
                                color: 'rgba( 255, 0, 0, 1)',
                                width: 4
                            }),
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.7)',
                            })
                        }),
                        new Style({
                            image: new CircleStyle({
                                radius: 4,
                                fill: new Fill({
                                    color: '#ff0000'
                                }),
                                stroke: new Stroke({
                                    width: 2,
                                    color: 'rgba(5, 5, 5, 0.9)'
                                }),
                            }),
                            geometry: (feature) => {
                                const geometry: any = feature.getGeometry();
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
                        }),
                        new Style({
                            stroke: new Stroke({
                                color: 'rgba(255, 255, 255, 0.7)',
                                width: 2
                            })
                        }),
                    ];
                } else {
                    return [
                        new Style({
                            image: new CircleStyle({
                                radius: 2,
                                fill: new Fill({
                                    color: '#000000'
                                })
                            }),
                            geometry: (feature) => {
                                const geometry: any = feature.getGeometry();
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
                        }),
                        new Style({
                            stroke: new Stroke({
                                color: '#ff0000',
                                width: 4
                            }),
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.7)',
                            })
                        })
                    ];
                }
        }


    }

    editModeOn(feature: Feature) {

        this._editFeaturOriginal = feature.clone();

        this._isEditMode = true;

        // To refresh the style
        this._editLayer.getSource().changed();

        this.removeOverlayHelper(feature);

        let controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--changes-control';

        let elements = document.createElement('div');
        elements.className = 'ol-wfst--changes-control-el';

        let elementId = document.createElement('div');
        elementId.className = 'ol-wfst--changes-control-id';
        elementId.innerHTML = `<b>Modo Edición</b> - <i>${String(feature.getId())}</i>`;

        let acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = 'Aplicar cambios';
        acceptButton.className = 'btn btn-danger';
        acceptButton.onclick = () => {
            this.interactionSelectModify.getFeatures().remove(feature);
        };

        let cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.onclick = () => {
            feature.setGeometry(this._editFeaturOriginal.getGeometry());
            this.removeFeatureFromEditList(feature);
            this.interactionSelectModify.getFeatures().remove(feature);
        };

        elements.append(elementId);
        elements.append(acceptButton);
        elements.append(cancelButton);

        controlDiv.append(elements);

        this._controlChanges = new Control({
            element: controlDiv
        });

        this.map.addControl(this._controlChanges)

    }

    editModeOff() {
        this._isEditMode = false;
        this.map.removeControl(this._controlChanges);
    }

    deleteElement(feature: Feature): void {
        const features = Array.isArray(feature) ? feature : [feature];
        features.forEach(feature => this._editLayer.getSource().removeFeature(feature));
        this.interactionSelectModify.getFeatures().clear();
    }

    addKeyboardEvents(): void {
        document.addEventListener('keydown', ({ key }) => {
            let inputFocus = document.querySelector('input:focus');
            if (inputFocus) return;
            if (key === "Delete") {
                const selectedFeatures = this.interactionSelectModify.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(feature => {
                        this.deleteElement(feature)
                    })
                }
            }
        })

    }

    addFeatureToEdit(feature: Feature, coordinate = null, layerName = null): void {

        const prepareOverlay = () => {
            const svgFields = `<img src="${editFieldsSvg}"/>`
            const editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt'
            editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="Editar campos">${svgFields}</button>`;
            editFieldsEl.onclick = () => {
                this.initModal(feature);
            }

            const buttons = document.createElement('div');
            buttons.append(editFieldsEl);

            if (this.editMode === 'button') {

                const svgGeom = `<img src="${editGeomSvg}"/>`;

                const editGeomEl = document.createElement('div');
                editGeomEl.className = 'ol-wfst--edit-button-cnt'
                editGeomEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="Editar geometría">${svgGeom}</button>`;
                editGeomEl.onclick = () => {
                    this.editModeOn(feature);
                }
                buttons.append(editGeomEl);

            }

            let position = coordinate || getCenter(feature.getGeometry().getExtent());

            const buttonsOverlay = new Overlay({
                id: feature.getId(),
                position: position,
                positioning: OverlayPositioning.CENTER_CENTER,
                element: buttons,
                offset: [0, -40],
                stopEvent: true
            });

            this.map.addOverlay(buttonsOverlay);

        }


        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }

        const props = (feature) ? feature.getProperties() : '';

        if (props) {

            if (feature.getGeometry()) {
                this._editLayer.getSource().addFeature(feature);
                this.interactionSelectModify.getFeatures().push(feature);
                prepareOverlay();
            }

        }

    }

    resetStateButtons() {
        let activeBtn = document.querySelector('.ol-wfst--tools-control-btn.active');
        if (activeBtn) activeBtn.classList.remove('active');
    }

    addToolsControl() {

        const createLayerElement = (layerName: string): string => {
            return `
                <div>       
                    <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${(layerName === this._insertNewLayer) ? 'checked="checked"' : ''}>
                    <label for="wfst--${layerName}">
                        ${layerName}
                    </label>
                </div>
            `

        }

        let controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--tools-control';

        let selectionButton = document.createElement('button');
        selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
        selectionButton.type = 'button';
        selectionButton.innerHTML = `<img src="${selectSvg}"/>`;
        selectionButton.title = 'Seleccionar';
        selectionButton.onclick = () => {
            this.resetStateButtons();
            this.activateEditMode();
        }

        let drawButton = document.createElement('button');
        drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
        drawButton.type = 'button';
        drawButton.innerHTML = `<img src="${drawSvg}"/>`;
        drawButton.title = 'Añadir elemento';
        drawButton.onclick = () => {
            this.resetStateButtons();
            this.activateDrawMode(this._insertNewLayer);
        }

        let buttons = document.createElement('div');
        buttons.className = 'wfst--tools-control--buttons';
        buttons.append(selectionButton);
        buttons.append(drawButton);

        this._controlTools = new Control({
            element: controlDiv
        })

        controlDiv.append(buttons);

        if (Object.keys(this._layers).length > 1) {
            let html = Object.keys(this._layers).map(key => createLayerElement(key))
            let selectLayers = document.createElement('div');
            selectLayers.className = 'wfst--tools-control--layers';
            selectLayers.innerHTML = html.join('');

            let radioInputs = selectLayers.querySelectorAll('input');
            radioInputs.forEach(radioInput => {
                radioInput.onchange = () => {
                    this._insertNewLayer = radioInput.value;
                    this.resetStateButtons();
                    this.activateDrawMode(this._insertNewLayer);
                }
            })
            controlDiv.append(selectLayers);
        }

        this.map.addControl(this._controlTools);
    }


    activateDrawMode(bool: string | boolean): void {
        
        if (!this.interactionDraw && !bool) return;

        this._isDrawMode = (bool) ? true : false;

        if (bool) {
            
            let btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
            if (btn) btn.classList.add('active');

            this.addDrawInteraction(String(bool));
        } else {
            this.map.removeInteraction(this.interactionDraw);
        }

    }

    activateEditMode(bool = true): void {

        if (bool) {
            let btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
            if (btn) btn.classList.add('active');
        }

        this.activateDrawMode(false);

        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);

        if (this.layerMode === 'wms') {
            // if (!bool) unByKey(this.clickWmsKey);
        } else {
            this.interactionWfsSelect.setActive(bool);
        }
    }


    initModal(feature: Feature): void {

        this._editFeature = feature;

        const properties = feature.getProperties();
        const layer = feature.get('_layerName_');

        // Data schema from the geoserver
        const dataSchema = this._layersData[layer].properties;

        let content = '<form autocomplete="false">';
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
                    case 'xsd:number':
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

        })

        content += '</form>';

        const footer = `
            <button type="button" class="btn btn-danger" data-action="delete" data-dismiss="modal">Eliminar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" data-action="save" data-dismiss="modal">Guardar</button>
        `;

        this.modal = new Modal({
            header: true,
            headerClose: true,
            title: `Editar elemento ${this._editFeature.getId()}`,
            content: content,
            footer: footer,
            animateInClass: 'in'
        }).show()

        this.modal.on('dismiss', (modal, event) => {

            if (event.target.dataset.action === 'save') {

                const inputs = modal.el.querySelectorAll('input');

                inputs.forEach((el: HTMLInputElement) => {
                    const value = el.value;
                    const field = el.name;
                    this._editFeature.set(field, value, /*isSilent = */ true);
                })

                this._editFeature.changed();
                this.addFeatureToEditedList(this._editFeature);
                this.transactWFS('update', this._editFeature);

            } else if (event.target.dataset.action === 'delete') {

                this.removeOverlayHelper(feature);
                this.deleteElement(this._editFeature);

            }

        })

    }

    removeOverlayHelper(feature: Feature) {

        let featureId = feature.getId();

        if (!featureId) return;

        let overlay = this.map.getOverlayById(featureId);

        if (!overlay) return;

        this.map.removeOverlay(overlay);
    }

}

/**
 * **_[interface]_** - Data obtainen from geoserver
 * @protected
 */
interface LayerData {
    namespace?: string;
    properties?: Record<string, unknown>;
    geomType?: string;
}
/**
 * **_[interface]_** - Geoserver response on DescribeFeature request
 * @protected
 */
interface DescribeFeatureType {
    elementFormDefault: string,
    targetNamespace: string;
    targetPrefix: string;
    featureTypes: Array<{
        typeName: string,
        properties: Array<{
            name: string,
            nillable: boolean,
            maxOccurs: number,
            minOccurs: number,
            type: boolean,
            localType: string
        }>
    }>;
}
/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 */
interface Options {
    /**
     * Url for WFS requests
     */
    urlWfs: string;
    /**
     * Url for WMS requests
     */
    urlWms: string;
    /**
     * Service to use as base layer. Yo can choose to use vectors or raster images
     */
    layerMode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features on WFS requests
     */
    wfsStrategy?: string;
    /**
     * Click event to select features
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Show button to initalyze edition mode
     */
    editMode?: 'button' | 'alwaysOn';
    /**
     * Initialize activated
     */
    active?: boolean;
    /**
     * Layers names
     */
    layers?: Array<string>;
    /**
     * Display the control map
     */
    showControl: boolean;
}

export { Options };