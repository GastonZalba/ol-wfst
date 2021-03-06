// Ol
import GeometryType from 'ol/geom/GeometryType';
import OverlayPositioning from 'ol/OverlayPositioning';
import TileState from 'ol/TileState';
import {
    Circle,
    Geometry,
    GeometryCollection,
    LineString,
    MultiLineString,
    MultiPoint,
    MultiPolygon,
    Point,
    Polygon
} from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Control } from 'ol/control';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import {
    Collection,
    Feature,
    ImageTile,
    Overlay,
    PluggableMap,
    View
} from 'ol';
import { FeatureLike } from 'ol/Feature';
import { GeoJSON, KML, WFS } from 'ol/format';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector';
import { TileWMS, Vector as VectorSource } from 'ol/source';
import { all, bbox } from 'ol/loadingstrategy';
import { fromCircle } from 'ol/geom/Polygon';
import { getCenter } from 'ol/extent';
import { never, primaryAction } from 'ol/events/condition';
import { transformExtent } from 'ol/proj';
import { unByKey } from 'ol/Observable';
import { Coordinate } from 'ol/coordinate';

// External
import Modal from 'modal-vanilla';

// Images
import drawSvg from './assets/images/draw.svg';
import editFieldsSvg from './assets/images/editFields.svg';
import editGeomSvg from './assets/images/editGeom.svg';
import uploadSvg from './assets/images/upload.svg';
import visibilityOn from './assets/images/visibilityOn.svg';
import visibilityOff from './assets/images/visibilityOff.svg';

import * as i18n from './assets/i18n/index';

// Css
import './assets/css/ol-wfst.css';

// https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
// Axis ordering: latitude/longitude
const DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
const DEFAULT_LANGUAGE = 'en';
/**
 * Tiny WFST-T client to insert (drawing/uploading), modify and delete
 * features on GeoServers using OpenLayers. Layers with these types
 * of geometries are supported: "GeometryCollection" (in this case, you can
 * choose the geometry type of each element to draw), "Point", "MultiPoint",
 * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
 *
 * @constructor
 * @param map Instance of the created map
 * @param opt_options Wfst options, see [Wfst Options](#options) for more details.
 */
export default class Wfst {
    protected options: Options;
    protected _i18n: I18n;

    // Ol
    public map: PluggableMap;
    public view: View;
    public overlay: Overlay;
    public viewport: HTMLElement;
    protected _mapLayers: Array<VectorLayer | TileLayer>;

    // Geoserver
    protected _geoServerData: LayerData;
    protected _useLockFeature: boolean;
    protected _hasLockFeature: boolean;
    protected _hasTransaction: boolean;
    protected _geoServerCapabilities: XMLDocument;

    // Interactions
    protected interactionWfsSelect: Select;
    protected interactionSelectModify: Select;
    protected collectionModify: Collection<any>;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;

    // Obserbable keys
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;

    // Controls
    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetTools: Control;
    protected _controlWidgetToolsDiv: HTMLElement;

    // Formats
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;

    // State
    protected _countRequests: number;
    protected _isVisible: boolean;
    protected _currentZoom: number;
    protected _lastZoom: number;

    // Editing
    protected _editedFeatures: Set<string>;
    protected _editLayer: VectorLayer;
    protected _isEditModeOn: boolean;
    protected _isDrawModeOn: boolean;
    protected _editFeature: Feature;
    protected _editFeatureOriginal: Feature;
    protected _layerToInsertElements: string;
    protected _insertFeatures: Array<Feature>;
    protected _updateFeatures: Array<Feature>;
    protected _deleteFeatures: Array<Feature>;
    protected _modalLoading: HTMLDivElement;

    protected _selectDraw: HTMLSelectElement;

    constructor(map: PluggableMap, opt_options?: Options) {
        // Check if the selected language exists
        this._i18n =
            opt_options.language && opt_options.language in i18n
                ? i18n[opt_options.language]
                : i18n[DEFAULT_LANGUAGE];

        if (opt_options.i18n) {
            // Merge custom translations
            this._i18n = {
                ...this._i18n,
                ...opt_options.i18n
            };
        }

        // Default options
        this.options = {
            geoServerUrl: null,
            headers: {},
            layers: null,
            evtType: 'singleclick',
            active: true,
            showControl: true,
            useLockFeature: true,
            minZoom: 9,
            language: DEFAULT_LANGUAGE,
            uploadFormats: '.geojson,.json,.kml',
            processUpload: null,
            beforeInsertFeature: null,
            modal: {
                animateClass: 'fade',
                animateInClass: 'show',
                transition: 300,
                backdropTransition: 150,
                templates: {
                    dialog:
                        '<div class="modal-dialog modal-dialog-centered"></div>',
                    headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.labels.close}"><span aria-hidden="true">×</span></button>`
                }
            },
            ...opt_options // Assign user options
        };

        // GeoServer
        this._hasLockFeature = false;
        this._hasTransaction = false;
        this._geoServerCapabilities = null;
        this._geoServerData = {};

        // Ol
        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._mapLayers = [];

        // Editing
        this._editedFeatures = new Set();
        this._layerToInsertElements = this.options.layers[0].name; // By default, the first layer is ready to accept new draws
        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];

        // Formats
        this._formatWFS = new WFS();

        this._formatGeoJSON = new GeoJSON();
        this._formatKml = new KML({
            extractStyles: false,
            showPointNames: false
        });
        this._xs = new XMLSerializer();

        // State
        this._isVisible = this.view.getZoom() > this.options.minZoom;
        this._countRequests = 0;
        this._isEditModeOn = false;

        this._initAsyncOperations();
    }

    /**
     * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
     * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
     *
     * @param layers
     * @param showControl
     * @param active
     * @private
     */
    async _initAsyncOperations(): Promise<void> {
        try {
            this._createBaseControl();

            this._showLoading();

            await this._connectToGeoServerAndGetCapabilities();

            if (this.options.layers) {
                await this._getGeoserverLayersData(
                    this.options.layers,
                    this.options.geoServerUrl
                );
                this._createLayers(this.options.layers);
            }

            this._initMapElements(
                this.options.showControl,
                this.options.active
            );
        } catch (err) {
            this._hideLoading();
            this._showError(err.message);
        }
    }

    /**
     * Creates a base control
     *
     * @private
     */
    _createBaseControl(): void {
        this._controlWidgetToolsDiv = document.createElement('div');
        this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';

        this._controlWidgetTools = new Control({
            element: this._controlWidgetToolsDiv
        });
        this.map.addControl(this._controlWidgetTools);
    }

    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @private
     */
    async _connectToGeoServerAndGetCapabilities(): Promise<boolean> {
        /**
         * @private
         */
        const getCapabilities = async (): Promise<XMLDocument> => {
            const params = new URLSearchParams({
                service: 'wfs',
                version: '1.3.0',
                request: 'GetCapabilities',
                exceptions: 'application/json'
            });

            const url_fetch =
                this.options.geoServerUrl + '?' + params.toString();

            try {
                const response = await fetch(url_fetch, {
                    headers: this.options.headers
                });

                if (!response.ok) {
                    throw new Error('');
                }

                const data = await response.text();
                const capabilities = new window.DOMParser().parseFromString(
                    data,
                    'text/xml'
                );
                return capabilities;
            } catch (err) {
                throw new Error(this._i18n.errors.capabilities);
            }
        };

        this._geoServerCapabilities = await getCapabilities();

        // Available operations in the geoserver
        const operations: HTMLCollectionOf<Element> = this._geoServerCapabilities.getElementsByTagName(
            'ows:Operation'
        );

        Array.from(operations).forEach((operation) => {
            if (operation.getAttribute('name') === 'Transaction') {
                this._hasTransaction = true;
            } else if (operation.getAttribute('name') === 'LockFeature') {
                this._hasLockFeature = true;
            }
        });

        if (!this._hasTransaction) {
            throw new Error(this._i18n.errors.wfst);
        }

        return true;
    }

    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @param layers
     * @param geoServerUrl
     * @private
     */
    async _getGeoserverLayersData(
        layers: Array<LayerParams>,
        geoServerUrl: string
    ): Promise<void> {
        const getLayerData = async (
            layerName: string
        ): Promise<DescribeFeatureType> => {
            const params = new URLSearchParams({
                service: 'wfs',
                version: '1.1.0',
                request: 'DescribeFeatureType',
                typeName: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });

            const url_fetch = geoServerUrl + '?' + params.toString();

            const response = await fetch(url_fetch, {
                headers: this.options.headers
            });

            if (!response.ok) {
                throw new Error('');
            }

            return await response.json();
        };

        for (const layer of layers) {
            const layerName = layer.name;
            const layerLabel = layer.label || layerName;

            try {
                const data = await getLayerData(layerName);

                if (data) {
                    const targetNamespace = data.targetNamespace;
                    const properties = data.featureTypes[0].properties;

                    // Find the geometry field
                    const geom = properties.find(
                        (el) => el.type.indexOf('gml:') >= 0
                    );

                    this._geoServerData[layerName] = {
                        namespace: targetNamespace,
                        properties: properties,
                        geomType: geom.localType,
                        geomField: geom.name
                    };
                }
            } catch (err) {
                throw new Error(`${this._i18n.errors.layer} "${layerLabel}"`);
            }
        }
    }

    /**
     * Create map layers in wfs o wms modes.
     *
     * @param layers
     * @private
     */
    _createLayers(layers: Array<LayerParams>): void {
        let layerLoaded = 0;
        let layersNumber = 0; // Only count visibles

        /**
         * When all the data is loaded, hide the loading
         * @private
         */
        const addLayerLoaded = () => {
            layerLoaded++;
            if (layerLoaded === layersNumber) {
                this._hideLoading();
            }
        };

        /**
         *
         * @param layerParams
         * @private
         */
        const newWmsLayer = (layerParams: LayerParams): TileLayer => {
            const layerName = layerParams.name;
            const cqlFilter = layerParams.cqlFilter;
            const buffer = layerParams.tilesBuffer;

            const params = {
                SERVICE: 'WMS',
                LAYERS: layerName,
                TILED: true
            };

            if (cqlFilter) {
                params['CQL_FILTER'] = cqlFilter;
            }

            if (buffer) {
                params['BUFFER'] = buffer;
            }

            const source = new TileWMS({
                url: this.options.geoServerUrl,
                params: params,
                serverType: 'geoserver',
                tileLoadFunction: async (tile, src) => {
                    try {
                        const response = await fetch(src, {
                            headers: this.options.headers
                        });

                        if (!response.ok) {
                            throw new Error('');
                        }

                        const data = await response.blob();

                        if (data !== undefined) {
                            ((tile as ImageTile).getImage() as HTMLImageElement).src = URL.createObjectURL(
                                data
                            );
                        } else {
                            throw new Error('');
                        }
                    } catch (err) {
                        tile.setState(TileState.ERROR);
                    } finally {
                        addLayerLoaded();
                    }
                }
            });

            const layer_options = {
                name: layerName,
                type: '_wms_',
                minZoom: this.options.minZoom,
                source: source,
                visible: true,
                zIndex: 4,
                ...layerParams
            };

            const layer = new TileLayer(layer_options);

            return layer;
        };

        /**
         *
         * @param layerParams
         * @private
         */
        const newWfsLayer = (layerParams: LayerParams): VectorLayer => {
            const layerName = layerParams.name;
            const cqlFilter = layerParams.cqlFilter;
            const strategy = layerParams.wfsStrategy || 'bbox';

            const source = new VectorSource({
                format: new GeoJSON(),
                strategy: strategy === 'bbox' ? bbox : all,
                loader: async (extent) => {
                    const params = new URLSearchParams({
                        service: 'wfs',
                        version: '1.0.0',
                        request: 'GetFeature',
                        typename: layerName,
                        outputFormat: 'application/json',
                        exceptions: 'application/json',
                        srsName: DEFAULT_GEOSERVER_SRS
                    });

                    if (cqlFilter) {
                        params.append('cql_filter', cqlFilter);
                    }

                    // If bbox, add extent to the request
                    if (strategy === 'bbox') {
                        const extentGeoServer = transformExtent(
                            extent,
                            this.view.getProjection().getCode(),
                            DEFAULT_GEOSERVER_SRS
                        );
                        // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                        // request features using a bounding box with CRS maybe different from featureTypes native CRS
                        params.append(
                            'bbox',
                            extentGeoServer.join(',') + ',EPSG:4326'
                        );
                    }

                    const url_fetch =
                        this.options.geoServerUrl + '?' + params.toString();

                    try {
                        const response = await fetch(url_fetch, {
                            headers: this.options.headers
                        });

                        if (!response.ok) {
                            throw new Error('');
                        }

                        const data = await response.json();
                        const features = source.getFormat().readFeatures(data, {
                            featureProjection: this.view
                                .getProjection()
                                .getCode(),
                            dataProjection: DEFAULT_GEOSERVER_SRS
                        });

                        features.forEach((feature: Feature) => {
                            feature.set(
                                '_layerName_',
                                layerName,
                                /* silent = */ true
                            );
                        });

                        source.addFeatures(features as Feature<Geometry>[]);
                    } catch (err) {
                        this._showError(this._i18n.errors.geoserver);
                        console.error(err);
                        source.removeLoadedExtent(extent);
                    } finally {
                        addLayerLoaded();
                    }
                }
            });

            const layer_options = {
                name: layerName,
                type: '_wfs_',
                minZoom: this.options.minZoom,
                source: source,
                visible: true,
                zIndex: 2,
                ...layerParams
            };

            const layer = new VectorLayer(layer_options);

            return layer;
        };

        for (const layerParams of layers) {
            const layerName = layerParams.name;

            // Only create the layer if we can get the GeoserverData
            if (this._geoServerData[layerName]) {
                let layer: VectorLayer | TileLayer;

                const layerParams = this.options.layers.find(
                    (e) => e.name === layerName
                );
                const mode = layerParams.mode;

                // If mode is undefined, by default use wfs
                if (!mode) {
                    layerParams.mode = 'wfs';
                }

                if (layerParams.mode === 'wfs') {
                    layer = newWfsLayer(layerParams);
                } else {
                    layer = newWmsLayer(layerParams);
                }

                if (layer.getVisible()) layersNumber++;

                this.map.addLayer(layer);
                this._mapLayers[layerName] = layer;
            }
        }
    }

    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controls and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    async _initMapElements(
        showControl: boolean,
        active: boolean
    ): Promise<void> {
        // VectorLayer to store features on editing and isnerting
        this._createEditLayer();

        this._addInteractions();
        this._addHandlers();

        if (showControl) {
            this._addMapControl();
        }

        // By default, init in edit mode
        this.activateEditMode(active);
    }

    /**
     * @private
     */
    _addInteractions(): void {
        // Select the wfs feature already downloaded
        const prepareWfsInteraction = () => {
            this.collectionModify = new Collection();

            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature: Feature) => this._styleFunction(feature),
                toggleCondition: never, // Prevent add features to the current selection using shift
                filter: (feature, layer) => {
                    return (
                        !this._isEditModeOn &&
                        layer &&
                        layer.get('type') === '_wfs_'
                    );
                }
            });

            this.map.addInteraction(this.interactionWfsSelect);

            this.interactionWfsSelect.on(
                'select',
                ({ selected, deselected, mapBrowserEvent }) => {
                    const coordinate = mapBrowserEvent.coordinate;

                    if (selected.length) {
                        selected.forEach((feature) => {
                            if (
                                !this._editedFeatures.has(
                                    String(feature.getId())
                                )
                            ) {
                                // Remove the feature from the original layer
                                const layer = this.interactionWfsSelect.getLayer(
                                    feature
                                );
                                layer.getSource().removeFeature(feature);
                                this._addFeatureToEdit(feature, coordinate);
                            }
                        });
                    }

                    if (deselected.length) {
                        if (!this._isEditModeOn) {
                            deselected.forEach((feature) => {
                                // Trigger deselect
                                // This is necessary for those times where two features overlap.
                                this.collectionModify.remove(feature);
                            });
                        }
                    }
                }
            );
        };

        /**
         * Call the geoserver to get the clicked feature
         * @private
         */
        const prepareWmsInteraction = (): void => {
            // Interaction to allow select features in the edit layer
            this.interactionSelectModify = new Select({
                style: (feature: Feature) => this._styleFunction(feature),
                layers: [this._editLayer],
                toggleCondition: never, // Prevent add features to the current selection using shift
                removeCondition: () => (this._isEditModeOn ? true : false) // Prevent deselect on clicking outside the feature
            });

            this.map.addInteraction(this.interactionSelectModify);

            this.collectionModify = this.interactionSelectModify.getFeatures();

            const getFeatures = async (evt) => {
                for (const layerName in this._mapLayers) {
                    const layer = this._mapLayers[layerName];

                    // If layer is hidden or is not a wms, skip
                    if (
                        !layer.getVisible() ||
                        !(layer.get('type') === '_wms_')
                    ) {
                        continue;
                    }

                    const coordinate = evt.coordinate;

                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    const buffer = this.view.getZoom() > 10 ? 10 : 5;

                    const source = layer.getSource() as TileWMS;

                    // Fallback to support a bad name
                    // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
                    const fallbackOl5 =
                        'getFeatureInfoUrl' in source
                            ? 'getFeatureInfoUrl'
                            : 'getGetFeatureInfoUrl';

                    const url = source[fallbackOl5](
                        coordinate,
                        this.view.getResolution(),
                        this.view.getProjection().getCode(),
                        {
                            INFO_FORMAT: 'application/json',
                            BUFFER: buffer, // Buffer es el "hit tolerance" para capas ráster
                            FEATURE_COUNT: 1,
                            EXCEPTIONS: 'application/json'
                        }
                    );

                    try {
                        const response = await fetch(url, {
                            headers: this.options.headers
                        });

                        if (!response.ok) {
                            throw new Error(
                                this._i18n.errors.getFeatures +
                                    ' ' +
                                    response.status
                            );
                        }

                        const data = await response.json();
                        const features = this._formatGeoJSON.readFeatures(data);

                        if (!features.length) {
                            continue;
                        }

                        features.forEach((feature) =>
                            this._addFeatureToEdit(
                                feature,
                                coordinate,
                                layerName
                            )
                        );
                    } catch (err) {
                        this._showError(err.message);
                    }
                }
            };

            this._keyClickWms = this.map.on(
                this.options.evtType,
                async (evt) => {
                    if (this.map.hasFeatureAtPixel(evt.pixel)) {
                        return;
                    }
                    if (!this._isVisible) {
                        return;
                    }
                    // Only get other features if editmode is disabled
                    if (!this._isEditModeOn) {
                        await getFeatures(evt);
                    }
                }
            );
        };

        if (this.options.layers.find((layer) => layer.mode === 'wfs')) {
            prepareWfsInteraction();
        }

        if (this.options.layers.find((layer) => layer.mode === 'wms')) {
            prepareWmsInteraction();
        }

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
                    });
                } else {
                    return;
                }
            },
            features: this.collectionModify,
            condition: (evt) => {
                return primaryAction(evt) && this._isEditModeOn;
            }
        });

        this.map.addInteraction(this.interactionModify);

        this.interactionSnap = new Snap({
            source: this._editLayer.getSource()
        });
        this.map.addInteraction(this.interactionSnap);
    }

    /**
     * Layer to store temporary the elements to be edited
     *
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
     * Add map handlers
     *
     * @private
     */
    _addHandlers(): void {
        /**
         * @private
         */
        const keyboardEvents = (): void => {
            document.addEventListener('keydown', ({ key }) => {
                const inputFocus = document.querySelector('input:focus');
                if (inputFocus) {
                    return;
                }
                if (key === 'Delete') {
                    const selectedFeatures = this.collectionModify;
                    if (selectedFeatures) {
                        selectedFeatures.forEach((feature) => {
                            this._deleteFeature(feature, true);
                        });
                    }
                }
            });
        };

        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', (evt) => {
            this._addFeatureToEditedList(evt.features.item(0));
        });

        this._onDeselectFeatureEvent();
        this._onRemoveFeatureEvent();

        /**
         * @private
         */
        const handleZoomEnd = (): void => {
            if (this._currentZoom > this.options.minZoom) {
                // Show the layers
                if (!this._isVisible) {
                    this._isVisible = true;
                }
            } else {
                // Hide the layer
                if (this._isVisible) {
                    this._isVisible = false;
                }
            }
        };

        this.map.on('moveend', (): void => {
            this._currentZoom = this.view.getZoom();

            if (this._currentZoom !== this._lastZoom) {
                handleZoomEnd();
            }

            this._lastZoom = this._currentZoom;
        });

        keyboardEvents();
    }

    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addMapControl(): void {
        const createLayersControl = (): Element => {
            const createLayerElements = (layerParams: LayerParams): string => {
                const layerName = layerParams.name;

                const layerLabel = `<span title="${
                    this._geoServerData[layerName].geomType
                }">${layerParams.label || layerName}</span>`;

                const visible =
                    'visible' in layerParams ? layerParams.visible : true;

                return `
                <div class="wfst--layer-control 
                    ${visible ? 'ol-wfst--visible-on' : ''}
                    ${
                        layerName === this._layerToInsertElements
                            ? 'ol-wfst--selected-on'
                            : ''
                    }
                    " data-layer="${layerName}">
                    <div class="ol-wfst--tools-control-visible">
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on" title="${
                        this._i18n.labels.toggleVisibility
                    }">
                      <img src="${visibilityOn}"/>
                    </span>
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off" title="${
                        this._i18n.labels.toggleVisibility
                    }">
                      <img src="${visibilityOff}"/>
                    </span>
                  </div>
                    <label for="wfst--${layerName}">
                        <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${
                    layerName === this._layerToInsertElements
                        ? 'checked="checked"'
                        : ''
                }>
                        ${layerLabel}
                    </label>
                </div>`;
            };

            let htmlLayers = '';

            Object.keys(this._mapLayers).map(
                (key) =>
                    (htmlLayers += createLayerElements(
                        this.options.layers.find((el) => el.name === key)
                    ))
            );
            const selectLayers = document.createElement('div');
            selectLayers.className = 'wfst--tools-control--select-layers';
            selectLayers.innerHTML = htmlLayers;

            // Layer Selector
            const radioInputs = selectLayers.querySelectorAll('input');
            radioInputs.forEach((radioInput) => {
                const parentDiv = radioInput.closest(
                    '.wfst--layer-control'
                ) as HTMLElement;
                radioInput.onchange = () => {
                    // Deselect DOM previous layer
                    const selected = selectLayers.querySelector(
                        '.ol-wfst--selected-on'
                    );
                    if (selected)
                        selected.classList.remove('ol-wfst--selected-on');

                    // Select this layer
                    parentDiv.classList.add('ol-wfst--selected-on');
                    this._layerToInsertElements = radioInput.value;
                    this._changeStateSelect(this._layerToInsertElements);
                };
            });

            // Visibility toggler
            const visibilityBtn = selectLayers.querySelectorAll(
                '.ol-wfst--tools-control-visible-btn'
            );
            visibilityBtn.forEach((btn: HTMLElement) => {
                const parentDiv = btn.closest(
                    '.wfst--layer-control'
                ) as HTMLElement;
                const layerName = parentDiv.dataset['layer'];
                btn.onclick = () => {
                    parentDiv.classList.toggle('ol-wfst--visible-on');
                    const layer = this._mapLayers[layerName];
                    if (parentDiv.classList.contains('ol-wfst--visible-on')) {
                        layer.setVisible(true);
                    } else {
                        layer.setVisible(false);
                    }
                };
            });

            return selectLayers;
        };

        const createHeadControl = (): Element => {
            /**
             * @private
             */
            const createUploadElements = (): Element => {
                const container = document.createElement('div');

                // Upload button Tool
                const uploadButton = document.createElement('label');
                uploadButton.className =
                    'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
                uploadButton.htmlFor = 'ol-wfst--upload';
                uploadButton.innerHTML = `<img src="${uploadSvg}"/> `;
                uploadButton.title = this._i18n.labels.uploadToLayer;

                // Hidden Input form
                const uploadInput = document.createElement('input');
                uploadInput.id = 'ol-wfst--upload';
                uploadInput.type = 'file';
                uploadInput.accept = this.options.uploadFormats;
                uploadInput.onchange = (evt) => this._processUploadFile(evt);
                container.append(uploadInput);
                container.append(uploadButton);

                return container;
            };

            const createDrawContainer = () => {
                const drawContainer = document.createElement('div');
                drawContainer.className = 'ol-wfst--tools-control-draw-cnt';

                // Draw Tool
                const drawButton = document.createElement('button');
                drawButton.className =
                    'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
                drawButton.type = 'button';
                drawButton.innerHTML = `<img src="${drawSvg}"/>`;
                drawButton.title = this._i18n.labels.addElement;
                drawButton.onclick = () => {
                    if (this._isDrawModeOn) {
                        this._resetStateButtons();
                        this.activateEditMode();
                    } else {
                        this.activateDrawMode(this._layerToInsertElements);
                    }
                };

                // Select geom type
                const select = document.createElement('select');
                select.title = this._i18n.labels.selectDrawType;
                select.className = 'wfst--tools-control--select-draw';
                select.onchange = () => {
                    const selectedValue = select.value as GeometryType;
                    this._changeStateSelect(
                        this._layerToInsertElements,
                        selectedValue
                    );

                    if (this._isDrawModeOn) {
                        this.activateDrawMode(this._layerToInsertElements);
                    }
                };

                const types = [
                    GeometryType.POINT,
                    GeometryType.MULTI_POINT,
                    GeometryType.LINE_STRING,
                    GeometryType.MULTI_LINE_STRING,
                    GeometryType.POLYGON,
                    GeometryType.MULTI_POLYGON,
                    GeometryType.CIRCLE
                ];

                for (const type of types) {
                    const option = document.createElement('option');
                    option.value = type;
                    option.text = type;
                    option.selected =
                        this._geoServerData[this._layerToInsertElements]
                            .geomType === type || false;
                    select.appendChild(option);
                }

                drawContainer.append(drawButton);
                drawContainer.append(select);

                this._selectDraw = select;
                return drawContainer;
            };

            const subControl = document.createElement('div');
            subControl.className = 'wfst--tools-control--head';

            // Upload section
            if (this.options.showUpload) {
                const uploadSection = createUploadElements();
                subControl.append(uploadSection);
            }

            const drawContainer = createDrawContainer();
            subControl.append(drawContainer);

            return subControl;
        };

        const headControl = createHeadControl();
        this._controlWidgetToolsDiv.append(headControl);

        const htmlLayers = createLayersControl();
        this._controlWidgetToolsDiv.append(htmlLayers);
    }

    /**
     * Show Loading modal
     *
     * @private
     */
    _showLoading(): void {
        if (!this._modalLoading) {
            this._modalLoading = document.createElement('div');
            this._modalLoading.className = 'ol-wfst--tools-control--loading';
            this._modalLoading.innerHTML = this._i18n.labels.loading;

            this._controlWidgetToolsDiv.append(this._modalLoading);
        }

        this._modalLoading.classList.add(
            'ol-wfst--tools-control--loading-show'
        );
    }

    _hideLoading(): void {
        this._modalLoading.classList.remove(
            'ol-wfst--tools-control--loading-show'
        );
    }

    /**
     * Lock a feature in the geoserver before edit
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @private
     */
    async _lockFeature(
        featureId: string | number,
        layerName: string,
        retry = 0
    ): Promise<string> {
        const params = new URLSearchParams({
            service: 'wfs',
            version: '1.1.0',
            request: 'LockFeature',
            expiry: String(5), // minutes
            LockId: 'GeoServer', // Not working?, bug? use GeoServer as it's the default value
            typeName: layerName,
            releaseAction: 'SOME',
            exceptions: 'application/json',
            featureid: `${featureId}`
        });

        const url_fetch = this.options.geoServerUrl + '?' + params.toString();

        try {
            const response = await fetch(url_fetch, {
                headers: this.options.headers
            });

            if (!response.ok) {
                throw new Error(this._i18n.errors.lockFeature);
            }

            const data = await response.text();

            try {
                // First, check if is a JSON (with errors)
                const dataParsed = JSON.parse(data);

                if ('exceptions' in dataParsed) {
                    const exceptions = dataParsed.exceptions;
                    if (exceptions[0].code === 'CannotLockAllFeatures') {
                        // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                        if (!retry) {
                            this._lockFeature(featureId, layerName, 1);
                        } else {
                            this._showError(this._i18n.errors.lockFeature);
                        }
                    } else {
                        this._showError(exceptions[0].text);
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
     * Show modal with errors
     *
     * @param msg
     * @private
     */
    _showError(msg: string): void {
        Modal.alert('Error: ' + msg, {
            ...this.options.modal
        }).show();
    }

    /**
     * Make the WFS Transactions
     *
     * @param action
     * @param features
     * @param layerName
     * @private
     */
    async _transactWFS(
        action: string,
        features: Array<Feature> | Feature,
        layerName: string
    ): Promise<void> {
        const transformCircleToPolygon = (feature: Feature, geom: Circle) => {
            const geomConverted = fromCircle(geom);
            feature.setGeometry(geomConverted);
        };

        const transformGeoemtryCollectionToGeometries = (
            feature: Feature,
            geom: GeometryCollection
        ) => {
            let geomConverted = geom.getGeometries()[0];

            if (geomConverted.getType() === GeometryType.CIRCLE) {
                geomConverted = fromCircle(geomConverted as Circle);
            }

            feature.setGeometry(geomConverted);
        };

        features = Array.isArray(features) ? features : [features];

        const cloneFeature = (feature: Feature): Feature => {
            this._removeFeatureFromEditList(feature);

            const featureProperties = feature.getProperties();

            delete featureProperties.boundedBy;
            delete featureProperties._layerName_;

            const clone = new Feature(featureProperties);
            clone.setId(feature.getId());

            return clone;
        };

        const refreshWmsLayer = (layer: TileLayer): void => {
            const source = layer.getSource() as TileWMS;

            // Refrescamos el wms
            source.refresh();

            // Force refresh the tiles
            const params = source.getParams();
            params.t = new Date().getMilliseconds();
            source.updateParams(params);
        };

        const refreshWfsLayer = (layer: VectorLayer): void => {
            const source = layer.getSource();
            // Refrescamos el wms
            source.refresh();
        };

        const clonedFeatures = [];

        for (const feature of features) {
            let clone = cloneFeature(feature);
            const cloneGeom = clone.getGeometry();
            const cloneGeomType = cloneGeom.getType();

            // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220
            if (cloneGeomType === GeometryType.GEOMETRY_COLLECTION) {
                transformGeoemtryCollectionToGeometries(
                    clone,
                    cloneGeom as GeometryCollection
                );
            } else if (cloneGeomType === GeometryType.CIRCLE) {
                // Geoserver has no Support to Circles
                transformCircleToPolygon(clone, cloneGeom as Circle);
            }

            if (action === 'insert') {
                // Filters
                if (this.options.beforeInsertFeature) {
                    clone = this.options.beforeInsertFeature(clone);
                }
            }

            if (clone) {
                clonedFeatures.push(clone);
            }
        }

        if (!clonedFeatures.length) {
            return this._showError(this._i18n.errors.noValidGeometry);
        }

        switch (action) {
            case 'insert':
                this._insertFeatures = [
                    ...this._insertFeatures,
                    ...clonedFeatures
                ];
                break;
            case 'update':
                this._updateFeatures = [
                    ...this._updateFeatures,
                    ...clonedFeatures
                ];
                break;
            case 'delete':
                this._deleteFeatures = [
                    ...this._deleteFeatures,
                    ...clonedFeatures
                ];
                break;
            default:
                break;
        }

        this._countRequests++;
        const numberRequest = this._countRequests;

        setTimeout(async () => {
            // Prevent fire multiples times
            if (numberRequest !== this._countRequests) {
                return;
            }

            let srs = this.view.getProjection().getCode();

            // Force latitude/longitude order on transactions
            // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
            srs = srs === 'EPSG:4326' ? DEFAULT_GEOSERVER_SRS : srs;

            const options = {
                featureNS: this._geoServerData[layerName].namespace,
                featureType: layerName,
                srsName: srs,
                featurePrefix: null,
                nativeElements: null
            };

            const transaction = this._formatWFS.writeTransaction(
                this._insertFeatures,
                this._updateFeatures,
                this._deleteFeatures,
                options
            );

            let payload = this._xs.serializeToString(transaction);
            const geomType = this._geoServerData[layerName].geomType;
            const geomField = this._geoServerData[layerName].geomField;

            // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220
            if (geomType === GeometryType.GEOMETRY_COLLECTION) {
                if (action === 'insert') {
                    payload = payload.replace(
                        /<geometry>/g,
                        `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`
                    );
                    payload = payload.replace(
                        /<\/geometry>/g,
                        `</geometryMember></MultiGeometry></geometry>`
                    );
                } else if (action === 'update') {
                    const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                    const gmemberOut = `</geometryMember></MultiGeometry>`;

                    payload = payload.replace(
                        /(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g,
                        `$1$2${gmemberIn}$3${gmemberOut}$4$5`
                    );
                }
            }

            // Fixes geometry name, weird bug with GML:
            // The property for the geometry column is always named "geometry"
            if (action === 'insert') {
                payload = payload.replace(
                    /<(\/?)\bgeometry\b>/g,
                    `<$1${geomField}>`
                );
            } else {
                payload = payload.replace(
                    /<Name>geometry<\/Name>/g,
                    `<Name>${geomField}</Name>`
                );
            }

            // Add default LockId value
            if (
                this._hasLockFeature &&
                this._useLockFeature &&
                action !== 'insert'
            ) {
                payload = payload.replace(
                    `</Transaction>`,
                    `<LockId>GeoServer</LockId></Transaction>`
                );
            }

            try {
                const headers = {
                    'Content-Type': 'text/xml',
                    ...this.options.headers
                };

                const response = await fetch(this.options.geoServerUrl, {
                    method: 'POST',
                    body: payload,
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error(
                        this._i18n.errors.transaction + ' ' + response.status
                    );
                }

                const parseResponse = this._formatWFS.readTransactionResponse(
                    response
                );

                if (!Object.keys(parseResponse).length) {
                    const responseStr = await response.text();
                    const findError = String(responseStr).match(
                        /<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/
                    );

                    if (findError) {
                        this._showError(findError[1]);
                    }
                }

                if (action !== 'delete') {
                    for (const feature of features as Array<Feature>) {
                        this._editLayer.getSource().removeFeature(feature);
                    }
                }

                const { mode } = this.options.layers.find(
                    (layer) => layer.name === layerName
                );

                if (mode === 'wfs') {
                    refreshWfsLayer(this._mapLayers[layerName]);
                } else if (mode === 'wms') {
                    refreshWmsLayer(this._mapLayers[layerName]);
                }

                this._hideLoading();
            } catch (err) {
                console.error(err);
            }

            this._insertFeatures = [];
            this._updateFeatures = [];
            this._deleteFeatures = [];

            this._countRequests = 0;
        }, 0);
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
    _removeFeatureFromEditList(feature: Feature): void {
        this._editedFeatures.delete(String(feature.getId()));
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
     *
     * @param feature
     * @private
     */
    _deselectEditFeature(feature: Feature): void {
        this._removeOverlayHelper(feature);
    }

    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    _restoreFeatureToLayer(feature: Feature, layerName?: string): void {
        layerName = layerName || feature.get('_layerName_');
        const layer = this._mapLayers[layerName];
        (layer.getSource() as VectorSource).addFeature(feature);
    }

    _removeFeatureFromTmpLayer(feature: Feature): void {
        // Remove element from the Layer
        this._editLayer.getSource().removeFeature(feature);
    }

    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    _onDeselectFeatureEvent(): void {
        const checkIfFeatureIsChanged = (feature: Feature): void => {
            const layerName = feature.get('_layerName_');

            const { mode } = this.options.layers.find(
                (layer) => layer.name === layerName
            );

            if (mode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }

            if (this._isFeatureEdited(feature)) {
                this._transactWFS('update', feature, layerName);
            } else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (mode === 'wfs') {
                    this._restoreFeatureToLayer(feature, layerName);
                }
                this._removeFeatureFromTmpLayer(feature);
            }
        };

        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.collectionModify.on('remove', (evt) => {
            const feature = evt.element;

            this._deselectEditFeature(feature);

            checkIfFeatureIsChanged(feature);

            this._editModeOff();
        });
    }

    /**
     * Trigger on removing a feature from the Edit layer
     *
     * @private
     */
    _onRemoveFeatureEvent(): void {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer
            .getSource()
            .on('removefeature', (evt) => {
                const feature = evt.feature;

                if (!feature.get('_delete_')) {
                    return;
                }

                if (this._keySelect) {
                    unByKey(this._keySelect);
                }

                const layerName = feature.get('_layerName_');

                this._transactWFS('delete', feature, layerName);

                this._deselectEditFeature(feature);
                this._editModeOff();

                if (this._keySelect) {
                    setTimeout(() => {
                        this._onDeselectFeatureEvent();
                    }, 150);
                }
            });
    }

    /**
     * Master style that handles two modes on the Edit Layer:
     * - one is the basic, showing only the vertices
     * - and the other when modify is active, showing bigger vertices
     *
     * @param feature
     * @private
     */
    _styleFunction(feature: Feature): Array<Style> {
        const getVertexs = (feature: FeatureLike) => {
            let geometry = feature.getGeometry();
            let type = geometry.getType();

            if (type === GeometryType.GEOMETRY_COLLECTION) {
                geometry = (geometry as GeometryCollection).getGeometries()[0];
                type = geometry.getType();
            }

            const coordinates = (geometry as LineString).getCoordinates();
            let flatCoordinates: Coordinate[] | number[] = null;

            if (
                type === GeometryType.POLYGON ||
                type === GeometryType.MULTI_LINE_STRING
            ) {
                flatCoordinates = coordinates.flat(1);
            } else if (type === GeometryType.MULTI_POLYGON) {
                flatCoordinates = coordinates.flat(2);
            } else {
                flatCoordinates = coordinates;
            }

            if (!flatCoordinates || !flatCoordinates.length) {
                return;
            }

            return new MultiPoint(flatCoordinates as Coordinate[]);
        };

        let geometry = feature.getGeometry();
        let type = geometry.getType();

        if (type === GeometryType.GEOMETRY_COLLECTION) {
            geometry = (geometry as GeometryCollection).getGeometries()[0];
            type = geometry.getType();
        }

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
                // If editing mode is active, show bigger vertex
                if (this._isEditModeOn || this._isDrawModeOn) {
                    return [
                        new Style({
                            stroke: new Stroke({
                                color: 'rgba( 255, 0, 0, 1)',
                                width: 4
                            }),
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.7)'
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
                                })
                            }),
                            geometry: (feature) => getVertexs(feature)
                        }),
                        new Style({
                            stroke: new Stroke({
                                color: 'rgba(255, 255, 255, 0.7)',
                                width: 2
                            })
                        })
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
                            geometry: (feature) => getVertexs(feature)
                        }),
                        new Style({
                            stroke: new Stroke({
                                color: '#ff0000',
                                width: 4
                            }),
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.7)'
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
    _editModeOn(feature: Feature): void {
        this._editFeatureOriginal = feature.clone();

        this._isEditModeOn = true;

        // To refresh the style
        this._editLayer.getSource().changed();

        this._removeOverlayHelper(feature);

        const controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--changes-control';

        const elements = document.createElement('div');
        elements.className = 'ol-wfst--changes-control-el';

        const elementId = document.createElement('div');
        elementId.className = 'ol-wfst--changes-control-id';
        elementId.innerHTML = `<b>${
            this._i18n.labels.editMode
        }</b> - <i>${String(feature.getId())}</i>`;

        const acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = this._i18n.labels.apply;
        acceptButton.className = 'btn btn-primary';
        acceptButton.onclick = () => {
            this._showLoading();
            this.collectionModify.remove(feature);
        };

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
        cancelButton.className = 'btn btn-secondary';
        cancelButton.onclick = () => {
            feature.setGeometry(this._editFeatureOriginal.getGeometry());
            this._removeFeatureFromEditList(feature);
            this.collectionModify.remove(feature);
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
    _editModeOff(): void {
        this._isEditModeOn = false;
        this.map.removeControl(this._controlApplyDiscardChanges);
    }

    /**
     * Remove a feature from the edit Layer and from the Geoserver
     *
     * @param feature
     * @private
     */
    _deleteFeature(feature: Feature, confirm: boolean): void {
        const deleteEl = () => {
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach((feature) => {
                feature.set('_delete_', true, true);
                this._editLayer.getSource().removeFeature(feature);
            });
            this.collectionModify.clear();

            const layerName = feature.get('_layerName_');
            const { mode } = this.options.layers.find(
                (layer) => layer.name === layerName
            );

            if (mode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
        };

        if (confirm) {
            const confirmModal = Modal.confirm(
                this._i18n.labels.confirmDelete,
                {
                    ...this.options.modal
                }
            );

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
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     *
     * @param feature
     * @param coordinate
     * @param layerName
     * @private
     */
    _addFeatureToEdit(
        feature: Feature,
        coordinate = null,
        layerName = null
    ): void {
        const prepareOverlay = () => {
            const svgFields = `<img src="${editFieldsSvg}"/>`;
            const editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt';
            editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editFields}">${svgFields}</button>`;
            editFieldsEl.onclick = () => {
                this._initEditFieldsModal(feature);
            };

            const buttons = document.createElement('div');
            buttons.append(editFieldsEl);

            const svgGeom = `<img src="${editGeomSvg}"/>`;

            const editGeomEl = document.createElement('div');
            editGeomEl.className = 'ol-wfst--edit-button-cnt';
            editGeomEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editGeom}">${svgGeom}</button>`;
            editGeomEl.onclick = () => {
                this._editModeOn(feature);
            };
            buttons.append(editGeomEl);

            const position =
                coordinate || getCenter(feature.getGeometry().getExtent());

            const buttonsOverlay = new Overlay({
                id: feature.getId(),
                position: position,
                positioning: OverlayPositioning.CENTER_CENTER,
                element: buttons,
                offset: [0, -40],
                stopEvent: true
            });

            this.map.addOverlay(buttonsOverlay);
        };

        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }

        const props = feature ? feature.getProperties() : '';

        if (props) {
            if (feature.getGeometry()) {
                this._editLayer.getSource().addFeature(feature);
                this.collectionModify.push(feature);
                prepareOverlay();

                if (this._useLockFeature && this._hasLockFeature) {
                    this._lockFeature(
                        feature.getId(),
                        feature.get('_layerName_')
                    );
                }
            }
        }
    }

    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    _resetStateButtons(): void {
        const activeBtn = document.querySelector(
            '.ol-wfst--tools-control-btn.wfst--active'
        );
        if (activeBtn) {
            activeBtn.classList.remove('wfst--active');
        }
    }

    /**
     * Confirm modal before transact to the GeoServer the features in the file
     *
     * @param content
     * @param featureToInsert
     * @private
     */
    _initUploadFileModal(
        content: string,
        featuresToInsert: Array<Feature>
    ): void {
        const footer = `
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.upload}
            </button>
        `;

        const modal = new Modal({
            ...this.options.modal,
            header: true,
            headerClose: false,
            title:
                this._i18n.labels.uploadFeatures +
                ' ' +
                this._layerToInsertElements,
            content: content,
            backdrop: 'static', // Prevent close on click outside the modal
            footer: footer
        }).show();

        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                this._transactWFS(
                    'insert',
                    featuresToInsert,
                    this._layerToInsertElements
                );
            } else {
                // On cancel button
                this._editLayer.getSource().clear();
            }
        });
    }

    /**
     * Parse and check geometry of uploaded files
     *
     * @param evt
     * @private
     */
    async _processUploadFile(evt: Event): Promise<void> {
        /**
         * Read data file
         * @param file
         * @private
         */
        const fileReader = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.addEventListener('load', async (e) => {
                    const fileData = e.target.result;
                    resolve(fileData as string);
                });

                reader.addEventListener('error', (err) => {
                    console.error('Error' + err);
                    reject();
                });
                reader.readAsText(file);
            });
        };

        /**
         * Attemp to change the geometry feature to the layer
         * @param feature
         * @private
         */
        const fixGeometry = (feature: Feature): Feature => {
            // Geometry of the layer
            const geomTypeLayer = this._geoServerData[
                this._layerToInsertElements
            ].geomType;
            const geomTypeFeature = feature.getGeometry().getType();
            let geom: Geometry;

            switch (geomTypeFeature) {
                case 'Point': {
                    if (geomTypeLayer === 'MultiPoint') {
                        const coords = (feature.getGeometry() as Point).getCoordinates();
                        geom = new MultiPoint([coords]);
                    }
                    break;
                }

                case 'LineString':
                    if (geomTypeLayer === 'MultiLineString') {
                        const coords = (feature.getGeometry() as LineString).getCoordinates();
                        geom = new MultiLineString([coords]);
                    }
                    break;

                case 'Polygon':
                    if (geomTypeLayer === 'MultiPolygon') {
                        const coords = (feature.getGeometry() as Polygon).getCoordinates();
                        geom = new MultiPolygon([coords]);
                    }
                    break;
                default:
                    geom = null;
            }

            if (!geom) {
                return null;
            }

            feature.setGeometry(geom);
            return feature;
        };

        /**
         * Check if the feature has the same geometry as the target layer
         * @param feature
         * @private
         */
        const checkGeometry = (feature: Feature): boolean => {
            // Geometry of the layer
            const geomTypeLayer = this._geoServerData[
                this._layerToInsertElements
            ].geomType;
            const geomTypeFeature = feature.getGeometry().getType();

            // This geom accepts every type of geometry
            if (geomTypeLayer === GeometryType.GEOMETRY_COLLECTION) {
                return true;
            }

            return geomTypeFeature === geomTypeLayer;
        };

        const file = (evt.target as HTMLInputElement).files[0];

        let features: Array<Feature>;

        if (!file) {
            return;
        }

        const extension = file.name.split('.').pop().toLowerCase();

        try {
            // If the user uses a custom fucntion...
            if (this.options.processUpload) {
                features = this.options.processUpload(file);
            }

            // If the user functions return features, we dont process anything more
            if (!features) {
                const string = await fileReader(file);

                if (extension === 'geojson' || extension === 'json') {
                    features = this._formatGeoJSON.readFeatures(string, {
                        featureProjection: this.view.getProjection().getCode()
                    });
                } else if (extension === 'kml') {
                    features = this._formatKml.readFeatures(string, {
                        featureProjection: this.view.getProjection().getCode()
                    });
                } else {
                    this._showError(this._i18n.errors.badFormat);
                }
            }
        } catch (err) {
            this._showError(this._i18n.errors.badFile);
        }

        let invalidFeaturesCount = 0;
        let validFeaturesCount = 0;

        const featuresToInsert: Array<Feature> = [];

        for (let feature of features) {
            // If the geometry doesn't correspond to the layer, try to fixit.
            // If we can't, don't use it
            if (!checkGeometry(feature)) {
                feature = fixGeometry(feature);
            }

            if (feature) {
                featuresToInsert.push(feature);
                validFeaturesCount++;
            } else {
                invalidFeaturesCount++;
                continue;
            }
        }

        if (!validFeaturesCount) {
            this._showError(this._i18n.errors.noValidGeometry);
        } else {
            this._resetStateButtons();
            this.activateEditMode();

            const content = `
                ${this._i18n.labels.validFeatures}: ${validFeaturesCount}<br>
                ${
                    invalidFeaturesCount
                        ? `${this._i18n.labels.invalidFeatures}: ${invalidFeaturesCount}`
                        : ''
                }
            `;

            this._initUploadFileModal(content, featuresToInsert);

            this._editLayer.getSource().addFeatures(featuresToInsert);
            this.view.fit(this._editLayer.getSource().getExtent(), {
                size: this.map.getSize(),
                maxZoom: 21,
                padding: [100, 100, 100, 100]
            });
        }

        // Reset the input to allow another onChange trigger
        (evt.target as HTMLInputElement).value = null;
    }

    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     */
    _changeStateSelect(
        layerName: string,
        geomDrawTypeSelected: GeometryType = null
    ): GeometryType {
        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         * @private
         */
        const setSelectState = (
            value: GeometryType,
            options: Array<string> | 'all'
        ): void => {
            Array.from(this._selectDraw.options).forEach((option) => {
                option.selected = option.value === value ? true : false;
                option.disabled =
                    options === 'all'
                        ? false
                        : options.includes(option.value)
                        ? false
                        : true;
                option.title = option.disabled
                    ? this._i18n.labels.geomTypeNotSupported
                    : '';
            });
        };

        let drawType: GeometryType;

        if (this._selectDraw) {
            const geomLayer = this._geoServerData[layerName].geomType;

            if (geomDrawTypeSelected) {
                drawType = this._selectDraw.value as GeometryType;
            } else {
                if (geomLayer === GeometryType.GEOMETRY_COLLECTION) {
                    drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection
                    setSelectState(drawType, 'all');
                } else if (geomLayer === GeometryType.LINEAR_RING) {
                    drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection
                    setSelectState(drawType, [
                        GeometryType.CIRCLE,
                        GeometryType.LINEAR_RING,
                        GeometryType.POLYGON
                    ]);
                    this._selectDraw.value = drawType;
                } else {
                    drawType = geomLayer;
                    setSelectState(drawType, [geomLayer]);
                }
            }
        }

        return drawType;
    }

    /**
     * Activate/deactivate the draw mode
     *
     * @param layerName
     * @public
     */
    activateDrawMode(layerName: string | boolean): void {
        /**
         *
         * @param layerName
         * @private
         */
        const addDrawInteraction = (layerName: string): void => {
            this.activateEditMode(false);

            // If already exists, remove
            if (this.interactionDraw) {
                this.map.removeInteraction(this.interactionDraw);
            }

            const geomDrawType = this._selectDraw.value;

            this.interactionDraw = new Draw({
                source: this._editLayer.getSource(),
                type: geomDrawType as GeometryType,
                style: (feature: Feature) => this._styleFunction(feature)
            });

            this.map.addInteraction(this.interactionDraw);

            const drawHandler = () => {
                this.interactionDraw.on('drawend', (evt) => {
                    const feature: Feature = evt.feature;
                    this._transactWFS('insert', feature, layerName);
                });
            };

            drawHandler();
        };

        if (!this.interactionDraw && !layerName) {
            return;
        }

        if (layerName) {
            // If layer is set to invisible, show warning
            if (!this._mapLayers[layerName as string].getVisible()) {
                return;
            }

            const btn = document.querySelector(
                '.ol-wfst--tools-control-btn-draw'
            );
            if (btn) {
                btn.classList.add('wfst--active');
            }

            this.viewport.classList.add('draw-mode');

            addDrawInteraction(String(layerName));
        } else {
            this.map.removeInteraction(this.interactionDraw);
            this.viewport.classList.remove('draw-mode');
        }

        this._isDrawModeOn = layerName ? true : false;
    }

    /**
     * Activate/desactivate the edit mode
     *
     * @param bool
     * @public
     */
    activateEditMode(bool = true): void {
        if (bool) {
            const btn = document.querySelector(
                '.ol-wfst--tools-control-btn-edit'
            );
            if (btn) {
                btn.classList.add('wfst--active');
            }

            this.activateDrawMode(false);
        } else {
            // Deselct features
            this.collectionModify.clear();
        }

        if (this.interactionSelectModify) {
            this.interactionSelectModify.setActive(bool);
        }

        this.interactionModify.setActive(bool);

        if (this.interactionWfsSelect)
            this.interactionWfsSelect.setActive(bool);
    }

    /**
     * Add features directly to the geoserver, in a custom layer
     * without checking geometry or showing modal to confirm.
     *
     * @param layerName
     * @param features
     * @public
     */
    insertFeaturesTo(layerName: string, features: Array<Feature>): void {
        this._transactWFS('insert', features, layerName);
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
        Object.keys(properties).forEach((key) => {
            // If the feature field exists in the geoserver and is not added by openlayers
            const field = dataSchema.find((data) => data.name === key);

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
                    <input placeholder="NULL" class="ol-wfst--input-field-input" type="${type}" name="${key}" value="${
                        properties[key] || ''
                    }">
                </div>`;
                }
            }
        });

        content += '</form>';

        const footer = `
            <button type="button" class="btn btn-sm btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${this._i18n.labels.delete}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.save}
            </button>
        `;

        const modal = new Modal({
            ...this.options.modal,
            header: true,
            headerClose: true,
            title: `${
                this._i18n.labels.editElement
            } ${this._editFeature.getId()} `,
            content: content,
            footer: footer
        }).show();

        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                const inputs = modal.el.querySelectorAll('input');

                inputs.forEach((el: HTMLInputElement) => {
                    const value = el.value;
                    const field = el.name;
                    this._editFeature.set(field, value, /*isSilent = */ true);
                });

                this._editFeature.changed();
                this._addFeatureToEditedList(this._editFeature);

                // Force deselect to trigger handler
                this.collectionModify.remove(this._editFeature);
            } else if (event.target.dataset.action === 'delete') {
                this._deleteFeature(this._editFeature, true);
            }
        });
    }

    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    _removeOverlayHelper(feature: Feature): void {
        const featureId = feature.getId();

        if (!featureId) {
            return;
        }

        const overlay = this.map.getOverlayById(featureId);

        if (!overlay) {
            return;
        }

        this.map.removeOverlay(overlay);
    }
}

/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 * Default values:
 * ```javascript
 * {
 *  geoServerUrl: null,
 *  headers: {},
 *  layers: null,
 *  evtType: 'singleclick',
 *  active: true,
 *  showControl: true,
 *  useLockFeature: true,
 *  minZoom: 9,
 *  language: 'en',
 *  i18n: {...}, // according to language selection
 *  uploadFormats: '.geojson,.json,.kml',
 *  processUpload: null,
 *  beforeInsertFeature: null,
 * }
 * ```
 */
interface Options {
    /**
     * Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests
     */
    geoServerUrl: string;
    /**
     * Url headers for GeoServer requests. You can use it to add Authorization credentials
     */
    headers?: HeadersInit;
    /**
     * Layers to be loaded from the geoserver
     */
    layers?: Array<LayerParams>;
    /**
     * Init active
     */
    active?: boolean;
    /**
     * The click event to allow selection of Features to be edited
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Use LockFeatue request on GeoServer when selecting features.
     * This is not always supportedd by the GeoServer.
     * See https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
     */
    useLockFeature?: boolean;
    /**
     * Show/hide the control map
     */
    showControl?: boolean;
    /**
     * Zoom level to hide features to prevent too much features being loaded
     */
    minZoom?: number;
    /**
     * Modal configuration
     */
    modal?: {
        animateClass?: string;
        animateInClass?: string;
        transition?: number;
        backdropTransition?: number;
        templates?: {
            dialog?: string | HTMLElement;
            headerClose?: string | HTMLElement;
        };
    };
    /**
     * Language to be used
     */
    language?: 'es' | 'en';
    /**
     * Custom translations
     */
    i18n?: I18n;
    /**
     * Show/hide the upload button
     */
    showUpload?: boolean;
    /**
     * Accepted extension formats on upload
     * Example: ".json,.geojson"
     */
    uploadFormats?: string;
    /**
     * Triggered to allow implement custom functions or to parse other formats than default
     * by filtering the extension. If this doesn't return features, the default function
     * will be used to extract them.
     */
    processUpload?(file: File): Array<Feature>;
    /**
     * Triggered before inserting new features to the Geoserver.
     * Use this to insert custom properties, modify the feature, etc.
     */
    beforeInsertFeature?(feature: Feature): Feature;
}

/**
 * **_[interface]_** - Parameters to create the layers and connect to the GeoServer
 *
 * You can use all the parameters supported by OpenLayers
 *
 *  Default values:
 * ```javascript
 * {
 *  name: null,
 *  label: (same as name),
 *  mode: 'wfs',
 *  wfsStrategy: 'bbox',
 *  cqlFilter: null,
 *  tilesBuffer: 0,
 * }
 * ```
 *
 */
interface LayerParams extends Omit<VectorLayerOptions, 'source'> {
    /**
     * Layer name in the GeoServer
     */
    name: string;
    /**
     * Label to be displayed in the widget control
     */
    label?: string;
    /**
     * Mode to use in the layer
     */
    mode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features. Only works if mode is "wfs"
     */
    wfsStrategy?: string;
    /**
     * The cql_filter GeoServer parameter is similar to the standard filter parameter,
     * but the filter is expressed using ECQL (Extended Common Query Language).
     * ECQL provides a more compact and readable syntax compared to OGC XML filters.
     * For full details see the [ECQL Reference](https://docs.geoserver.org/stable/en/user/filter/ecql_reference.html#filter-ecql-reference) and CQL and ECQL tutorial.
     */
    cqlFilter?: string;
    /**
     * The buffer parameter specifies the number of additional
     * border pixels that are used on requesting rasted tiles
     * Only works if mode is 'wms'
     */
    tilesBuffer?: number;
}

/**
 * **_[interface]_** - Data obtained from geoserver
 * @protected
 */
interface LayerData {
    namespace?: string;
    properties?: Record<string, unknown>;
    geomType?: string;
    geomField?: string;
}

/**
 * **_[interface]_** - Geoserver response on DescribeFeature request
 * @protected
 */
interface DescribeFeatureType {
    elementFormDefault: string;
    targetNamespace: string;
    targetPrefix: string;
    featureTypes: Array<{
        typeName: string;
        properties: Array<{
            name: string;
            nillable: boolean;
            maxOccurs: number;
            minOccurs: number;
            type: string;
            localType: string;
        }>;
    }>;
}

/**
 * **_[interface]_** - Custom Language specified when creating a WFST instance
 */
interface I18n {
    /** Labels section */
    labels: {
        select: string;
        addElement: string;
        editElement: string;
        save: string;
        delete: string;
        cancel: string;
        apply: string;
        upload: string;
        editMode: string;
        confirmDelete: string;
        geomTypeNotSupported: string;
        editFields: string;
        editGeom: string;
        selectDrawType: string;
        uploadToLayer: string;
        uploadFeatures: string;
        validFeatures: string;
        invalidFeatures: string;
        loading: string;
        toggleVisibility: string;
        close: string;
    };
    /** Errors section */
    errors: {
        capabilities: string;
        wfst: string;
        layer: string;
        noValidGeometry: string;
        geoserver: string;
        badFormat: string;
        badFile: string;
        lockFeature: string;
        transaction: string;
        getFeatures: string;
    };
}

export { Options, I18n, LayerParams };
