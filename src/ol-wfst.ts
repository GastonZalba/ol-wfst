// Ol
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
import { never, primaryAction } from 'ol/events/condition';
import Control from 'ol/control/Control';
import OverlayPositioning from 'ol/OverlayPositioning';

// External
import Modal from 'modal-vanilla';

// Images
import drawSvg from './assets/images/draw.svg';
import selectSvg from './assets/images/select.svg';
import editGeomSvg from './assets/images/editGeom.svg';
import editFieldsSvg from './assets/images/editFields.svg';
import uploadSvg from './assets/images/upload.svg';


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

    protected options: Options;

    protected _editedFeatures: Set<string>;
    protected _mapLayers: Array<VectorLayer | TileLayer>;
    protected _geoServerData: LayerData;
    protected _useLockFeature: boolean;
    protected _hasLockFeature: boolean;
    protected _hasTransaction: boolean;
    protected _geoServerCapabilities: XMLDocument;

    // Edit elements
    protected _editLayer: VectorLayer;
    protected _isEditModeOn: boolean;
    protected _isDrawModeOn: boolean;
    protected _editFeature: Feature;
    protected _editFeatureOriginal: Feature;
    protected _layerToInsertElements: string;
    protected _insertFeatures: Array<Feature>;
    protected _updateFeatures: Array<Feature>;
    protected _deleteFeatures: Array<Feature>;

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

    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _xs: XMLSerializer;
    protected _countRequests: number;

    protected modal: typeof Modal;

    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetTools: Control;

    protected _isVisible: boolean;
    protected _currentZoom: number;
    protected _lastZoom: number;

    constructor(map: PluggableMap, opt_options?: Options) {

        // Default options
        this.options = {
            layerMode: 'wms',
            evtType: 'singleclick',
            active: true,
            layers: null,
            showControl: true,
            useLockFeature: true,
            minZoom: 9,
            geoServerUrl: null,
            beforeInsertFeature: (feature: Feature) => feature
        }

        // Assign user options
        this.options = { ...this.options, ...opt_options };

        // GeoServer
        this._hasLockFeature = false;
        this._hasTransaction = false;
        this._geoServerCapabilities = null;
        this._geoServerData = {};

        // Ol
        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();

        this._isVisible = this.view.getZoom() > this.options.minZoom;

        this._editedFeatures = new Set();
        this._mapLayers = [];

        // By default, the first layer is ready to accept new draws
        this._layerToInsertElements = this.options.layers[0];

        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];

        this._formatWFS = new WFS();
        this._formatGeoJSON = new GeoJSON();
        this._xs = new XMLSerializer();

        this._countRequests = 0;

        this._isEditModeOn = false;

        this._initAsyncOperations(this.options.layers, this.options.showControl, this.options.active);

    }

    /**
     * 
     * @param layers 
     * @param showControl 
     * @param active 
     * @private
     */
    async _initAsyncOperations(layers: Array<string>, showControl: boolean, active: boolean) {

        try {

            await this._connectToGeoServer();

            if (layers) {
                await this._getLayersData(layers, this.options.geoServerUrl);
                this._createLayers(layers);
            }

            this._initMapElements(showControl, active);

        } catch (err) {
            this._showError(err.message);
        }

    }

    /**
     * 
     * @param layers 
     * @private
     */
    async _connectToGeoServer() {

        const getCapabilities = async (): Promise<any> => {

            const params = new URLSearchParams({
                service: 'wfs',
                version: '1.3.0',
                request: 'GetCapabilities',
                exceptions: 'application/json'
            });

            const url_fetch = this.options.geoServerUrl + '?' + params.toString();

            try {

                const response = await fetch(url_fetch);

                if (!response.ok) {
                    throw new Error('');
                }

                const data = await response.text();
                let capabilities = (new window.DOMParser()).parseFromString(data, 'text/xml');
                return capabilities;

            } catch (err) {
                throw new Error('No se pudieron descargar las Capabilidades del GeoServer');
            }
        }

        this._geoServerCapabilities = await getCapabilities();

        // Available operations in the geoserver
        let operations: HTMLCollectionOf<Element> = this._geoServerCapabilities.getElementsByTagName("ows:Operation");

        for (let operation of operations as any) {

            if (operation.getAttribute('name') === 'Transaction')
                this._hasTransaction = true;
            else if (operation.getAttribute('name') === 'LockFeature')
                this._hasLockFeature = true;

        }

        if (!this._hasTransaction)
            throw new Error('El GeoServer no tiene soporte a Transacciones');

        return true;

    }

    /**
     * 
     * @param showControl 
     * @param active 
     * @private
     */
    async _initMapElements(showControl: boolean, active: boolean) {

        // VectorLayer to store features on editing and isnerting
        this._createEditLayer();

        this._addInteractions();
        this._addHandlers();
        this._addKeyboardEvents();

        if (showControl)
            this._addControlTools();

        this.activateEditMode(active);

    }



    /**
     * Layer to store temporary all the elements to edit
     * @private
     */
    _createEditLayer(): void {

        this._editLayer = new VectorLayer({
            source: new VectorSource(),
            zIndex: 5
        });

        this.map.addLayer(this._editLayer);

    }


    /**
     * Add already created layers to the map
     * @param layers 
     * @public
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
            const layerName = layer.get('name');
            this._mapLayers[layerName] = layer;
            layersStr.push(layerName);
        })

        this._getLayersData(layersStr, this.options.geoServerUrl);
    }

    /**
     * Lock a feature in the geoserver before edit
     * @param featureId 
     * @param layerName 
     * @todo fix cql filter
     */
    async _lockFeature(featureId: string | number, layerName: string, retry = 0): Promise<void> {

        const params = new URLSearchParams({
            service: 'wfs',
            version: '1.1.0',
            request: 'LockFeature',
            expiry: String(5), // minutes
            LockId: 'a', // Not working, use GeoServer
            typeName: layerName,
            releaseAction: 'SOME',
            exceptions: 'application/json',
            featureid: `${featureId}`
        });

        const url_fetch = this.options.geoServerUrl + '?' + params.toString();

        try {

            const response = await fetch(url_fetch);

            if (!response.ok) {
                throw new Error('No se pudieron bloquear elementos en el GeoServer. HTTP status: ' + response.status);
            }

            let data: any = await response.text();

            try {

                // First, check if is a JSON (with errors)
                data = JSON.parse(data)

                if ('exceptions' in data) {

                    if (data.exceptions[0].code === "CannotLockAllFeatures") {

                        // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                        if (!retry)
                            this._lockFeature(featureId, layerName, 1)
                        else
                            this._showError('El elemento no se puede bloquear');

                    } else {
                        this._showError(data.exceptions[0].text);
                    }

                }

            } catch (err) {

                /*
            
                let dataDoc = (new window.DOMParser()).parseFromString(data, 'text/xml');
            
                let lockId = dataDoc.getElementsByTagName('wfs:LockId');
            
                let featuresLocked: HTMLCollectionOf<Element> = dataDoc.getElementsByTagName('ogc:FeatureId');
            
                for (let featureLocked of featuresLocked as any) {
            
                    console.log(featureLocked.getAttribute('fid'));
            
                }
            
                */

            }

            return data;

        } catch (err) {
            this._showError(err.message);
        }

    }


    /**
     * 
     * @param layers
     * @private
     */
    async _getLayersData(layers: Array<string>, geoServerUrl: string): Promise<void> {

        const getLayerData = async (layerName: string): Promise<DescribeFeatureType> => {

            const params = new URLSearchParams({
                service: 'wfs',
                version: '2.0.0',
                request: 'DescribeFeatureType',
                typeNames: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });

            const url_fetch = geoServerUrl + '?' + params.toString();

            const response = await fetch(url_fetch);

            if (!response.ok) {
                throw new Error('');
            }

            return await response.json();
        }

        for (const layerName of layers) {

            try {

                const data = await getLayerData(layerName);

                if (data) {
                    const targetNamespace = data.targetNamespace;
                    const properties = data.featureTypes[0].properties;

                    // Find the geometry field
                    const geom = properties.find(el => el.type.indexOf('gml:') >= 0);

                    this._geoServerData[layerName] = {
                        namespace: targetNamespace,
                        properties: properties,
                        geomType: geom.localType,
                        geomField: geom.name
                    };
                }

            } catch (err) {
                this._showError(`No se pudieron obtener datos de la capa "${layerName}".`);
            }

        }


    }

    /**
     * 
     * @param layers 
     * @private
     */
    _createLayers(layers: Array<string>): void {

        const newWmsLayer = (layerName: string) => {
            const layer = new TileLayer({
                source: new TileWMS({
                    url: this.options.geoServerUrl,
                    params: {
                        'SERVICE': 'WMS',
                        'LAYERS': layerName,
                        'TILED': true
                    },
                    serverType: 'geoserver'
                }),
                zIndex: 4,
                minZoom: this.options.minZoom
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
                strategy: (this.options.wfsStrategy === 'bbox') ? bbox : all,
                loader: async (extent) => {

                    if (!this._isVisible) return;

                    const params = new URLSearchParams({
                        service: 'wfs',
                        version: '1.0.0',
                        request: 'GetFeature',
                        typename: layerName,
                        outputFormat: 'application/json',
                        exceptions: 'application/json',
                        srsName: 'urn:ogc:def:crs:EPSG::4326'
                    });

                    // If bbox, add extent to the request
                    if (this.options.wfsStrategy === 'bbox') params.append('bbox', extent.join(','));

                    const url_fetch = this.options.geoServerUrl + '?' + params.toString();

                    try {

                        const response = await fetch(url_fetch);

                        if (!response.ok) {
                            throw new Error('No se pudieron obtener datos desde el GeoServer. HTTP status: ' + response.status);
                        }

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
                visible: this._isVisible,
                minZoom: this.options.minZoom,
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

            // Only create the layer if we can get the GeoserverData
            if (this._geoServerData[layerName]) {

                let layer: VectorLayer | TileLayer;

                if (this.options.layerMode === 'wms') {
                    layer = newWmsLayer(layerName);
                } else {
                    layer = newWfsLayer(layerName);
                }

                this.map.addLayer(layer)
                this._mapLayers[layerName] = layer;
            }
        })

    }

    /**
     * 
     * @param msg 
     * @private
     */
    _showError(msg: string): void {
        Modal.alert('Error: ' + msg, {
            animateInClass: 'in'
        }).show();
    }

    /**
     * 
     * @param mode 
     * @param features
     * @private
     */
    async _transactWFS(mode: string, features: Array<Feature> | Feature, layerName: string): Promise<void> {

        const cloneFeature = (feature: Feature) => {

            this._removeFeatureFromEditList(feature);

            const featureProperties = feature.getProperties();

            delete featureProperties.boundedBy;
            delete featureProperties._layerName_;

            const clone = new Feature(featureProperties);
            clone.setId(feature.getId());

            return clone;
        }

        const refreshWmsLayer = (layer: TileLayer) => {

            const source = (layer.getSource() as TileWMS);

            // Refrescamos el wms
            source.refresh();

            // Force refresh the tiles
            const params = source.getParams();
            params.t = new Date().getMilliseconds();
            source.updateParams(params);
        }

        const refreshWfsLayer = (layer: VectorLayer) => {

            const source = layer.getSource();
            // Refrescamos el wms
            source.refresh();
        }

        features = Array.isArray(features) ? features : [features];

        features.forEach((feature) => {

            let clone = cloneFeature(feature);

            // Filters
            if (mode === 'insert') {
                clone = this.options.beforeInsertFeature(clone);
            }

            // Peevent fire multiples times
            this._countRequests++;
            const numberRequest = this._countRequests;

            setTimeout(async () => {

                if (numberRequest !== this._countRequests) return;

                const options = {
                    featureNS: this._geoServerData[layerName].namespace,
                    featureType: layerName,
                    srsName: 'urn:ogc:def:crs:EPSG::4326',
                    featurePrefix: null,
                    nativeElements: null
                }

                switch (mode) {
                    case 'insert':
                        this._insertFeatures = [...this._insertFeatures, clone];
                        break;
                    case 'update':
                        this._updateFeatures = [...this._updateFeatures, clone];
                        break;
                    case 'delete':
                        this._deleteFeatures = [...this._deleteFeatures, clone];
                        break;
                }

                const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);

                let payload = this._xs.serializeToString(transaction);

                // Fixes geometry name, weird bug
                payload = payload.replaceAll(`geometry`, this._geoServerData[layerName].geomField);

                // Add default LockId value
                if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
                    payload = payload.replace(`</Transaction>`, `<LockId>GeoServer</LockId></Transaction>`);
                }

                try {

                    const response = await fetch(this.options.geoServerUrl, {
                        method: 'POST',
                        body: payload,
                        headers: {
                            'Content-Type': 'text/xml',
                            'Access-Control-Allow-Origin': '*'
                        }
                    })

                    if (!response.ok) {
                        throw new Error('Error al hacer transacción con el GeoServer. HTTP status: ' + response.status);
                    }

                    const parseResponse = this._formatWFS.readTransactionResponse(response);

                    if (!Object.keys(parseResponse).length) {

                        let responseStr = await response.text();
                        const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);

                        if (findError)
                            this._showError(findError[1]);

                    }

                    if (mode !== 'delete') this._editLayer.getSource().removeFeature(feature);

                    if (this.options.layerMode === 'wfs')
                        refreshWfsLayer(this._mapLayers[layerName]);
                    else if (this.options.layerMode === 'wms')
                        refreshWmsLayer(this._mapLayers[layerName]);

                } catch (err) {
                    console.error(err);
                }

                this._insertFeatures = [];
                this._updateFeatures = [];
                this._deleteFeatures = [];

                this._countRequests = 0;

            }, 300)

        })

    }

    /**
     * 
     * @param feature 
     * @private
     */
    _removeFeatureFromEditList(feature: Feature): void {
        this._editedFeatures.delete(String(feature.getId()));
    }

    /**
     * 
     * @param feature 
     * @private
     */
    _addFeatureToEditedList(feature: Feature): void {
        this._editedFeatures.add(String(feature.getId()));
    }

    /**
     * 
     * @param feature 
     * @private
     */
    _isFeatureEdited(feature: Feature): boolean {
        return this._editedFeatures.has(String(feature.getId()));
    }

    /**
     * @private
     */
    _addInteractions(): void {

        // Select the wfs feature already downloaded
        const prepareWfsInteraction = () => {
            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature: Feature) => this._styleFunction(feature),
                filter: (feature, layer) => {
                    return !this._isEditModeOn && layer && layer.get('type') === '_wfs_';
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
                            this._addFeatureToEdit(feature, coordinate);
                        }
                    })
                }

            });

        }

        // Call the geoserver to get the clicked feature
        const prepareWmsInteraction = (): void => {

            const getFeatures = async (evt) => {

                for (const layerName in this._mapLayers) {

                    const layer = this._mapLayers[layerName];
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

                        if (!response.ok) {
                            throw new Error('Error al obtener elemento desde el GeoServer. HTTP status: ' + response.status);
                        }

                        const data = await response.json();
                        const features = this._formatGeoJSON.readFeatures(data);

                        if (!features.length) continue;

                        features.forEach(feature => this._addFeatureToEdit(feature, coordinate, layerName))

                    } catch (err) {
                        this._showError(err.message);
                    }

                }
            }

            this._keyClickWms = this.map.on(this.options.evtType, async (evt) => {
                if (this.map.hasFeatureAtPixel(evt.pixel)) return;
                if (!this._isVisible) return;
                // Only get other features if editmode is disabled
                if (!this._isEditModeOn) await getFeatures(evt)
            });
        }

        if (this.options.layerMode === 'wfs') prepareWfsInteraction();
        else if (this.options.layerMode === 'wms') prepareWmsInteraction();

        // Interaction to allow select features in the edit layer
        this.interactionSelectModify = new Select({
            style: (feature: Feature) => this._styleFunction(feature),
            layers: [this._editLayer],
            toggleCondition: never, // Prevent add features to the current selection using shift
            removeCondition: (evt) => (this._isEditModeOn) ? true : false // Prevent deselect on clicking outside the feature
        });

        this.map.addInteraction(this.interactionSelectModify);

        this.interactionModify = new Modify({
            style: () => {
                if (this._isEditModeOn) {
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
                return primaryAction(evt) && this._isEditModeOn
            }
        });

        this.map.addInteraction(this.interactionModify);

        this.interactionSnap = new Snap({
            source: this._editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);

    }


    /**
     * 
     * @param feature 
     * @private
     */
    _cancelEditFeature(feature: Feature): void {
        this._removeOverlayHelper(feature);
        this._editModeOff();
    }

    /**
     * 
     * @param feature 
     * @private
     */
    _finishEditFeature(feature: Feature): void {

        unByKey(this._keyRemove);
        let layerName = feature.get('_layerName_');

        if (this._isFeatureEdited(feature)) {
            this._transactWFS('update', feature, layerName);

        } else {

            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (this.options.layerMode === 'wfs') {
                const layer = this._mapLayers[layerName];
                (layer.getSource() as VectorSource).addFeature(feature);
                this.interactionWfsSelect.getFeatures().remove(feature);
            }

            this.interactionSelectModify.getFeatures().remove(feature);
            this._editLayer.getSource().removeFeature(feature);
        }

        setTimeout(() => {
            this._removeFeatureHandler();
        }, 150)

    }

    /**
     * @private
     */
    _selectFeatureHandler(): void {

        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', (evt) => {
            const feature = evt.element;
            this._cancelEditFeature(feature);
            this._finishEditFeature(feature);
        });

    }

    /**
     * @private
     */
    _removeFeatureHandler(): void {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', (evt) => {

            if (this._keySelect) unByKey(this._keySelect);

            const feature = evt.feature;
            let layerName = feature.get('_layerName_');

            this._transactWFS('delete', feature, layerName);

            this._cancelEditFeature(feature);

            if (this._keySelect) {
                setTimeout(() => {
                    this._selectFeatureHandler();
                }, 150)
            }

        })
    }

    /**
     * @private
     */
    _addHandlers(): void {

        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', (evt) => {
            this._addFeatureToEditedList(evt.features.item(0));
        });

        this._selectFeatureHandler();
        this._removeFeatureHandler();


        const handleZoomEnd = (): void => {

            if (this._currentZoom < this.options.minZoom) {
                // Hide the layer
                if (this._isVisible) {
                    this._isVisible = false;
                }
            } else {
                // Show the layers
                if (!this._isVisible) {
                    this._isVisible = true;
                } else {
                    // If the view is closer, don't do anything, we already had the features
                    if (this._currentZoom > this._lastZoom) return;
                }

            }
        };

        this.map.on('moveend', (): void => {
            this._currentZoom = this.view.getZoom();

            if (this._currentZoom !== this._lastZoom) handleZoomEnd();

            this._lastZoom = this._currentZoom;
        });

    }

    /**
     * 
     * @param feature 
     * @private
     */
    _styleFunction(feature: Feature): Array<Style> {

        const type = feature.getGeometry().getType();

        switch (type) {
            case 'Point':
            case 'MultiPoint':
                if (this._isEditModeOn) {
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
                if (this._isEditModeOn || this._isDrawModeOn) {
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

    /**
     * 
     * @param feature 
     * @private
     */
    _editModeOn(feature: Feature) {

        this._editFeatureOriginal = feature.clone();

        this._isEditModeOn = true;

        // To refresh the style
        this._editLayer.getSource().changed();

        this._removeOverlayHelper(feature);

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
        acceptButton.className = 'btn btn-primary';
        acceptButton.onclick = () => {
            this.interactionSelectModify.getFeatures().remove(feature);
        };

        let cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.onclick = () => {
            feature.setGeometry(this._editFeatureOriginal.getGeometry());
            this._removeFeatureFromEditList(feature);
            this.interactionSelectModify.getFeatures().remove(feature);
        };

        elements.append(elementId);
        elements.append(cancelButton);
        elements.append(acceptButton);

        controlDiv.append(elements);

        this._controlApplyDiscardChanges = new Control({
            element: controlDiv
        });

        this.map.addControl(this._controlApplyDiscardChanges);



    }

    /**
     * @private
     */
    _editModeOff() {
        this._isEditModeOn = false;
        this.map.removeControl(this._controlApplyDiscardChanges);
    }

    /**
     * Remove a feature from the edit Layer and from the Geoserver
     * @param feature 
     * @private
     */
    _deleteElement(feature: Feature, confirm: boolean): void {

        const deleteEl = () => {
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach(feature => this._editLayer.getSource().removeFeature(feature));
            this.interactionSelectModify.getFeatures().clear();
        }

        if (confirm) {

            let confirmModal = Modal.confirm('¿Está seguro de borrar el elemento?', {
                animateInClass: 'in'
            });

            confirmModal.show().once('dismiss', function (modal, ev, button) {
                if (button && button.value) {
                    deleteEl();
                }
            });

        } else {
            deleteEl();
        }

    }

    /**
     * Add Keyboards events to allow shortcuts on editing features
     * @private
     */
    _addKeyboardEvents(): void {
        document.addEventListener('keydown', ({ key }) => {
            let inputFocus = document.querySelector('input:focus');
            if (inputFocus) return;
            if (key === "Delete") {
                const selectedFeatures = this.interactionSelectModify.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(feature => {
                        this._deleteElement(feature, true)
                    })
                }
            }
        })

    }

    /**
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     * 
     * @param feature 
     * @param coordinate 
     * @param layerName 
     * @private
     */
    _addFeatureToEdit(feature: Feature, coordinate = null, layerName = null): void {

        const prepareOverlay = () => {
            const svgFields = `<img src="${editFieldsSvg}"/>`
            const editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt'
            editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="Editar campos">${svgFields}</button>`;
            editFieldsEl.onclick = () => {
                this._initEditFieldsModal(feature);
            }

            const buttons = document.createElement('div');
            buttons.append(editFieldsEl);

            const svgGeom = `<img src="${editGeomSvg}"/>`;

            const editGeomEl = document.createElement('div');
            editGeomEl.className = 'ol-wfst--edit-button-cnt'
            editGeomEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="Editar geometría">${svgGeom}</button>`;
            editGeomEl.onclick = () => {
                this._editModeOn(feature);
            }
            buttons.append(editGeomEl);

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

                if (this._useLockFeature && this._hasLockFeature) this._lockFeature(feature.getId(), feature.get('_layerName_'))

            }

        }

    }

    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    _resetStateButtons(): void {
        const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
        if (activeBtn) activeBtn.classList.remove('wfst--active');
    }

    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addControlTools() {

        const createUpload = (): Element => {

            let container = document.createElement('div');

            // Upload Tool
            let uploadButton = document.createElement('label');
            uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
            uploadButton.htmlFor = 'ol-wfst--upload';
            uploadButton.innerHTML = `<img src="${uploadSvg}"/>`;
            uploadButton.title = 'Subir archivo a la capa seleccionada';
            uploadButton.onclick = () => {

            }

            // Upload form file
            let uploadInput = document.createElement('input');
            uploadInput.id = 'ol-wfst--upload';
            uploadInput.type = 'file';
            uploadInput.accept = '.geojson';
            uploadInput.onchange = (evt) => {
                console.log(evt)
            }

            container.append(uploadInput);
            container.append(uploadButton);

            return container;
        }

        const createLayerElement = (layerName: string): string => {
            return `
                <div>       
                    <label for="wfst--${layerName}">
                        <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${(layerName === this._layerToInsertElements) ? 'checked="checked"' : ''}>
                        ${layerName}
                    </label>
                </div>
            `

        }

        let controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--tools-control';

        // Select Tool
        let selectionButton = document.createElement('button');
        selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
        selectionButton.type = 'button';
        selectionButton.innerHTML = `<img src="${selectSvg}"/>`;
        selectionButton.title = 'Seleccionar';
        selectionButton.onclick = () => {
            this._resetStateButtons();
            this.activateEditMode();
        }

        // Draw Tool
        let drawButton = document.createElement('button');
        drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
        drawButton.type = 'button';
        drawButton.innerHTML = `<img src="${drawSvg}"/>`;
        drawButton.title = 'Añadir elemento';
        drawButton.onclick = () => {
            this._resetStateButtons();
            this.activateDrawMode(this._layerToInsertElements);
        }


        // Buttons container
        let buttons = document.createElement('div');
        buttons.className = 'wfst--tools-control--buttons';
        buttons.append(selectionButton);
        buttons.append(drawButton);

        this._controlWidgetTools = new Control({
            element: controlDiv
        })

        controlDiv.append(buttons);

        let html = Object.keys(this._mapLayers).map(key => createLayerElement(key))
        let selectLayers = document.createElement('div');
        selectLayers.className = 'wfst--tools-control--layers';
        selectLayers.innerHTML = html.join('');

        let radioInputs = selectLayers.querySelectorAll('input');
        radioInputs.forEach(radioInput => {
            radioInput.onchange = () => {
                this._layerToInsertElements = radioInput.value;
                this._resetStateButtons();
                this.activateDrawMode(this._layerToInsertElements);
            }
        })
        controlDiv.append(selectLayers);

        // Upload
        let uploadSection = createUpload();
        selectLayers.append(uploadSection);

        this.map.addControl(this._controlWidgetTools);
    }

    /**
     * Add features to the geoserver, in a custom layer
     * This is useful to use on uploading files
     * 
     * @param layerName 
     * @param features 
     * @public
     */
    insertFeaturesTo(layerName: string, features: Array<Feature>) {
        this._transactWFS('insert', features, layerName);
    }

    /**
     * Activate/deactivate the draw mode
     * @param bool 
     * @public
     */
    activateDrawMode(bool: string | boolean): void {

        const addDrawInteraction = (layerName: string): void => {

            this.activateEditMode(false);

            // If already exists, remove
            if (this.interactionDraw)
                this.map.removeInteraction(this.interactionDraw);

            this.interactionDraw = new Draw({
                source: this._editLayer.getSource(),
                type: this._geoServerData[layerName].geomType,
                style: (feature: Feature) => this._styleFunction(feature)
            })

            this.map.addInteraction(this.interactionDraw);

            const drawHandler = () => {

                this.interactionDraw.on('drawend', (evt) => {
                    unByKey(this._keyRemove);

                    const feature: Feature = evt.feature;
                    this._transactWFS('insert', feature, layerName);

                    setTimeout(() => {
                        this._removeFeatureHandler();
                    }, 150)
                })
            }

            drawHandler();
        }

        if (!this.interactionDraw && !bool) return;

        this._isDrawModeOn = (bool) ? true : false;

        if (bool) {

            let btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
            if (btn) btn.classList.add('wfst--active');

            this.viewport.classList.add('draw-mode');

            addDrawInteraction(String(bool));

        } else {
            this.map.removeInteraction(this.interactionDraw);
            this.viewport.classList.remove('draw-mode');
        }

    }

    /**
     * Activate/desactivate the edit mode
     * @param bool 
     * @public
     */
    activateEditMode(bool = true): void {

        if (bool) {

            let btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
            if (btn) btn.classList.add('wfst--active');

            this.activateDrawMode(false);

        } else {
            // Deselct features
            this.interactionSelectModify.getFeatures().clear();
        }


        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);

        if (this.options.layerMode === 'wms') {
            // if (!bool) unByKey(this.clickWmsKey);
        } else {
            this.interactionWfsSelect.setActive(bool);
        }
    }


    /**
     * Shows a fields form in a modal window to allow changes in the properties of the feature.
     * 
     * @param feature 
     * @private
     */
    _initEditFieldsModal(feature: Feature): void {

        this._editFeature = feature;

        const properties = feature.getProperties();
        const layer = feature.get('_layerName_');

        // Data schema from the geoserver
        const dataSchema = this._geoServerData[layer].properties;

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
            <button type="button" class="btn btn-link btn-third" data-action="delete" data-dismiss="modal">Eliminar</button>
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
                this._addFeatureToEditedList(this._editFeature);
                let layerName = this._editFeature.get('_layerName_');
                this._transactWFS('update', this._editFeature, layerName);

            } else if (event.target.dataset.action === 'delete') {

                this._deleteElement(this._editFeature, true);

            }

        })

    }

    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature 
     * @private
     */
    _removeOverlayHelper(feature: Feature) {

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
            type: string,
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
     * Url for WFS, WFST and WMS requests
     */
    geoServerUrl: string;
    /**
    * Layers names to load
    */
    layers?: Array<string>;
    /**
     * Service to use as base layer. You can choose to use vectors or raster images
     */
    layerMode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features if layerMode is on "wfs" requests
     */
    wfsStrategy?: string;
    /**
     * Click event to select the features
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Initialize activated
     */
    active?: boolean;
    /**
     * Use or not LockFeatue on GeoServer on edit features
     */
    useLockFeature?: boolean;
    /**
     * Display the control map
     */
    showControl?: boolean;
    /**
     * Show the upload button
     */
    upload?: boolean;
    /**
     * Zoom level to hide values to prevent 
     */
    minZoom?: number;
    /**
     * Callback before insert new features to the Geoserver
     */
    beforeInsertFeature?: Function
}

export { Options };