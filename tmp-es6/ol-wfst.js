var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Ol
import { Feature, Overlay } from 'ol';
import { KML, WFS, GeoJSON } from 'ol/format';
import { Vector as VectorSource, TileWMS } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import { MultiLineString, MultiPoint, MultiPolygon } from 'ol/geom';
import { bbox, all } from 'ol/loadingstrategy';
import { getCenter } from 'ol/extent';
import { Fill, Circle as CircleStyle, Stroke, Style } from 'ol/style';
import { primaryAction } from 'ol/events/condition';
import { Control } from 'ol/control';
import OverlayPositioning from 'ol/OverlayPositioning';
import TileState from 'ol/TileState';
import { transformExtent } from 'ol/proj';
// External
import Modal from 'modal-vanilla';
// Images
import drawSvg from './assets/images/draw.svg';
import selectSvg from './assets/images/select.svg';
import editGeomSvg from './assets/images/editGeom.svg';
import editFieldsSvg from './assets/images/editFields.svg';
import uploadSvg from './assets/images/upload.svg';
import * as languages from './assets/i18n/index';
import GeometryType from 'ol/geom/GeometryType';
import { fromCircle } from 'ol/geom/Polygon';
const DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
/**
 * @constructor
 * @param {class} map
 * @param {object} opt_options
 */
export default class Wfst {
    constructor(map, opt_options) {
        // Default options
        this.options = {
            geoServerUrl: null,
            headers: {},
            layers: null,
            layerMode: 'wms',
            evtType: 'singleclick',
            active: true,
            showControl: true,
            useLockFeature: true,
            minZoom: 9,
            language: 'en',
            uploadFormats: '.geojson,.json,.kml',
            processUpload: null,
            beforeInsertFeature: null
        };
        // Assign user options
        this.options = Object.assign(Object.assign({}, this.options), opt_options);
        // Language support
        this._i18n = languages[this.options.language];
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
     * Connect to the GeoServer, get Capabilities,
     * get each layer specs and create the layers and map controllers.
     *
     * @param layers
     * @param showControl
     * @param active
     * @private
     */
    _initAsyncOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connectToGeoServer();
                if (this.options.layers) {
                    this._showLoading();
                    yield this._getGeoserverLayersData(this.options.layers, this.options.geoServerUrl);
                    this._createLayers(this.options.layers);
                }
                this._initMapElements(this.options.showControl, this.options.active);
            }
            catch (err) {
                this._hideLoading();
                this._showError(err.message);
            }
        });
    }
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @private
     */
    _connectToGeoServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const getCapabilities = () => __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    service: 'wfs',
                    version: '1.3.0',
                    request: 'GetCapabilities',
                    exceptions: 'application/json'
                });
                const url_fetch = this.options.geoServerUrl + '?' + params.toString();
                try {
                    const response = yield fetch(url_fetch, {
                        headers: this.options.headers
                    });
                    if (!response.ok) {
                        throw new Error('');
                    }
                    const data = yield response.text();
                    let capabilities = (new window.DOMParser()).parseFromString(data, 'text/xml');
                    return capabilities;
                }
                catch (err) {
                    throw new Error(this._i18n.errors.capabilities);
                }
            });
            this._geoServerCapabilities = yield getCapabilities();
            // Available operations in the geoserver
            let operations = this._geoServerCapabilities.getElementsByTagName("ows:Operation");
            for (let operation of operations) {
                if (operation.getAttribute('name') === 'Transaction')
                    this._hasTransaction = true;
                else if (operation.getAttribute('name') === 'LockFeature')
                    this._hasLockFeature = true;
            }
            if (!this._hasTransaction)
                throw new Error(this._i18n.errors.wfst);
            return true;
        });
    }
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @param layers
     * @param geoServerUrl
     * @private
     */
    _getGeoserverLayersData(layers, geoServerUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const getLayerData = (layerName) => __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    service: 'wfs',
                    version: '2.0.0',
                    request: 'DescribeFeatureType',
                    typeNames: layerName,
                    outputFormat: 'application/json',
                    exceptions: 'application/json'
                });
                const url_fetch = geoServerUrl + '?' + params.toString();
                const response = yield fetch(url_fetch, {
                    headers: this.options.headers
                });
                if (!response.ok) {
                    throw new Error('');
                }
                return yield response.json();
            });
            for (const layer of layers) {
                let layerName = layer.name;
                let layerLabel = layer.label || layerName;
                try {
                    const data = yield getLayerData(layerName);
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
                        console.log(layerName);
                    }
                }
                catch (err) {
                    this._showError(`${this._i18n.errors.layer} "${layerLabel}"`);
                }
            }
        });
    }
    /**
     * Create map layers in wfs o wms modes.
     *
     * @param layers
     * @private
     */
    _createLayers(layers) {
        let layerLoaded = 0;
        let layersNumber = layers.length;
        /**
         * When all the data is loaded, hide the loading
         */
        const addLayerLoaded = () => {
            layerLoaded++;
            if (layerLoaded === layersNumber) {
                this._hideLoading();
            }
        };
        const newWmsLayer = (layerParams) => {
            let layerName = layerParams.name;
            let cqlFilter = layerParams.cql_filter;
            let params = {
                'SERVICE': 'WMS',
                'LAYERS': layerName,
                'TILED': true
            };
            if (cqlFilter) {
                params['CQL_FILTER'] = cqlFilter;
            }
            const layer = new TileLayer({
                source: new TileWMS({
                    url: this.options.geoServerUrl,
                    params: params,
                    serverType: 'geoserver',
                    tileLoadFunction: (tile, src) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const response = yield fetch(src, {
                                headers: this.options.headers
                            });
                            if (!response.ok) {
                                throw new Error('');
                            }
                            var data = yield response.blob();
                            if (data !== undefined) {
                                tile.getImage().src = URL.createObjectURL(data);
                            }
                            else {
                                throw new Error('');
                            }
                        }
                        catch (err) {
                            tile.setState(TileState.ERROR);
                        }
                        finally {
                            addLayerLoaded();
                        }
                    })
                }),
                zIndex: 4,
                minZoom: this.options.minZoom
            });
            layer.setProperties({
                name: layerName,
                type: "_wms_"
            });
            return layer;
        };
        const newWfsLayer = (layerParams) => {
            let layerName = layerParams.name;
            let cqlFilter = layerParams.cql_filter;
            const source = new VectorSource({
                format: new GeoJSON(),
                strategy: (this.options.wfsStrategy === 'bbox') ? bbox : all,
                loader: (extent) => __awaiter(this, void 0, void 0, function* () {
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
                    if (this.options.wfsStrategy === 'bbox') {
                        let extentGeoServer = transformExtent(extent, this.view.getProjection().getCode(), DEFAULT_GEOSERVER_SRS);
                        params.append('bbox', extentGeoServer.join(','));
                    }
                    const url_fetch = this.options.geoServerUrl + '?' + params.toString();
                    try {
                        const response = yield fetch(url_fetch, {
                            headers: this.options.headers
                        });
                        if (!response.ok) {
                            throw new Error('');
                        }
                        const data = yield response.json();
                        const features = source.getFormat().readFeatures(data, {
                            featureProjection: this.view.getProjection().getCode(),
                            dataProjection: DEFAULT_GEOSERVER_SRS
                        });
                        features.forEach((feature) => {
                            feature.set('_layerName_', layerName, /* silent = */ true);
                        });
                        source.addFeatures(features);
                    }
                    catch (err) {
                        this._showError(this._i18n.errors.geoserver);
                        console.error(err);
                        source.removeLoadedExtent(extent);
                    }
                    finally {
                        addLayerLoaded();
                    }
                })
            });
            const layer = new VectorLayer({
                visible: this._isVisible,
                minZoom: this.options.minZoom,
                source: source,
                zIndex: 2
            });
            layer.setProperties({
                name: layerName,
                type: "_wfs_"
            });
            return layer;
        };
        for (let layerParams of layers) {
            let layerName = layerParams.name;
            // Only create the layer if we can get the GeoserverData
            if (this._geoServerData[layerName]) {
                let layer;
                if (this.options.layerMode === 'wms') {
                    layer = newWmsLayer(layerParams);
                }
                else {
                    layer = newWfsLayer(layerParams);
                }
                this.map.addLayer(layer);
                this._mapLayers[layerName] = layer;
            }
        }
    }
    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controllers and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    _initMapElements(showControl, active) {
        return __awaiter(this, void 0, void 0, function* () {
            // VectorLayer to store features on editing and isnerting
            this._createEditLayer();
            this._addInteractions();
            this._addHandlers();
            if (showControl)
                this._addControlTools();
            // By default, init in edit mode
            this.activateEditMode(active);
        });
    }
    /**
     * @private
     */
    _addInteractions() {
        // Select the wfs feature already downloaded
        const prepareWfsInteraction = () => {
            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature) => this._styleFunction(feature),
                //toggleCondition: never, // Prevent add features to the current selection using shift
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
                    });
                }
                if (deselected.length) {
                    if (!this._isEditModeOn) {
                        deselected.forEach(feature => {
                            // Trigger deselect
                            // This is necessary for those times where two features overlap.
                            this.interactionSelectModify.getFeatures().remove(feature);
                        });
                    }
                }
            });
        };
        // Call the geoserver to get the clicked feature
        const prepareWmsInteraction = () => {
            const getFeatures = (evt) => __awaiter(this, void 0, void 0, function* () {
                for (const layerName in this._mapLayers) {
                    const layer = this._mapLayers[layerName];
                    let coordinate = evt.coordinate;
                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    const buffer = (this.view.getZoom() > 10) ? 10 : 5;
                    const url = layer.getSource().getFeatureInfoUrl(coordinate, this.view.getResolution(), this.view.getProjection().getCode(), {
                        'INFO_FORMAT': 'application/json',
                        'BUFFER': buffer,
                        'FEATURE_COUNT': 1,
                        'EXCEPTIONS': 'application/json',
                    });
                    try {
                        const response = yield fetch(url, {
                            headers: this.options.headers
                        });
                        if (!response.ok) {
                            throw new Error(this._i18n.errors.getFeatures + " " + response.status);
                        }
                        const data = yield response.json();
                        const features = this._formatGeoJSON.readFeatures(data);
                        if (!features.length)
                            continue;
                        features.forEach(feature => this._addFeatureToEdit(feature, coordinate, layerName));
                    }
                    catch (err) {
                        this._showError(err.message);
                    }
                }
            });
            this._keyClickWms = this.map.on(this.options.evtType, (evt) => __awaiter(this, void 0, void 0, function* () {
                if (this.map.hasFeatureAtPixel(evt.pixel))
                    return;
                if (!this._isVisible)
                    return;
                // Only get other features if editmode is disabled
                if (!this._isEditModeOn)
                    yield getFeatures(evt);
            }));
        };
        if (this.options.layerMode === 'wfs')
            prepareWfsInteraction();
        else if (this.options.layerMode === 'wms')
            prepareWmsInteraction();
        // Interaction to allow select features in the edit layer
        this.interactionSelectModify = new Select({
            style: (feature) => this._styleFunction(feature),
            layers: [this._editLayer],
            //toggleCondition: never, // Prevent add features to the current selection using shift
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
                    });
                }
                else {
                    return;
                }
            },
            features: this.interactionSelectModify.getFeatures(),
            condition: (evt) => {
                return primaryAction(evt) && this._isEditModeOn;
            }
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new Snap({
            source: this._editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);
    }
    /**
     * Layer to store temporary the elements to be edited
     *
     * @private
     */
    _createEditLayer() {
        this._editLayer = new VectorLayer({
            source: new VectorSource(),
            zIndex: 5,
            style: (feature) => this._styleFunction(feature)
        });
        this.map.addLayer(this._editLayer);
    }
    /**
     * Add map handlers
     *
     * @private
     */
    _addHandlers() {
        const keyboardEvents = () => {
            document.addEventListener('keydown', ({ key }) => {
                let inputFocus = document.querySelector('input:focus');
                if (inputFocus)
                    return;
                if (key === "Delete") {
                    const selectedFeatures = this.interactionSelectModify.getFeatures();
                    if (selectedFeatures) {
                        selectedFeatures.forEach(feature => {
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
        const handleZoomEnd = () => {
            if (this._currentZoom > this.options.minZoom) {
                // Show the layers
                if (!this._isVisible) {
                    this._isVisible = true;
                }
            }
            else {
                // Hide the layer
                if (this._isVisible) {
                    this._isVisible = false;
                }
            }
        };
        this.map.on('moveend', () => {
            this._currentZoom = this.view.getZoom();
            if (this._currentZoom !== this._lastZoom)
                handleZoomEnd();
            this._lastZoom = this._currentZoom;
        });
        keyboardEvents();
    }
    /**
    * Add the widget on the map to allow change the tools and select active layers
    * @private
    */
    _addControlTools() {
        const createUploadElements = () => {
            let container = document.createElement('div');
            // Upload button Tool
            let uploadButton = document.createElement('label');
            uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
            uploadButton.htmlFor = 'ol-wfst--upload';
            uploadButton.innerHTML = `<img src="${uploadSvg}"/> `;
            uploadButton.title = this._i18n.labels.uploadToLayer;
            // Hidden Input form
            let uploadInput = document.createElement('input');
            uploadInput.id = 'ol-wfst--upload';
            uploadInput.type = 'file';
            uploadInput.accept = this.options.uploadFormats;
            uploadInput.onchange = (evt) => this._processUploadFile(evt);
            container.append(uploadInput);
            container.append(uploadButton);
            return container;
        };
        const createToolSelector = () => {
            let controlDiv = document.createElement('div');
            controlDiv.className = 'ol-wfst--tools-control';
            // Select Tool
            let selectionButton = document.createElement('button');
            selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
            selectionButton.type = 'button';
            selectionButton.innerHTML = `<img src="${selectSvg}"/>`;
            selectionButton.title = this._i18n.labels.select;
            selectionButton.onclick = () => {
                this._resetStateButtons();
                this.activateEditMode();
            };
            // Draw Tool
            let drawButton = document.createElement('button');
            drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
            drawButton.type = 'button';
            drawButton.innerHTML = `<img src = "${drawSvg}"/>`;
            drawButton.title = this._i18n.labels.addElement;
            drawButton.onclick = () => {
                this._resetStateButtons();
                this.activateDrawMode(this._layerToInsertElements);
            };
            // Buttons container
            let buttons = document.createElement('div');
            buttons.className = 'wfst--tools-control--buttons';
            buttons.append(selectionButton);
            buttons.append(drawButton);
            this._controlWidgetTools = new Control({
                element: controlDiv
            });
            controlDiv.append(buttons);
            return controlDiv;
        };
        const createSubControl = () => {
            const createSelectDrawElement = () => {
                let select = document.createElement('select');
                select.className = 'wfst--tools-control--select-draw';
                select.onchange = () => {
                    this.activateDrawMode(this._layerToInsertElements, select.value);
                };
                let types = [
                    GeometryType.POINT,
                    GeometryType.MULTI_POINT,
                    GeometryType.LINE_STRING,
                    GeometryType.MULTI_LINE_STRING,
                    GeometryType.POLYGON,
                    GeometryType.MULTI_POLYGON,
                    GeometryType.CIRCLE
                ];
                for (let type of types) {
                    let option = document.createElement('option');
                    option.value = type;
                    option.text = type;
                    option.selected = this._geoServerData[this._layerToInsertElements].geomType === type || false;
                    select.appendChild(option);
                }
                return select;
            };
            const createLayerElements = (layerParams) => {
                let layerName = layerParams.name;
                let layerLabel = `<span title="${this._geoServerData[layerName].geomType}">${(layerParams.label || layerName)}</span>`;
                return `
                <div>
                    <label for="wfst--${layerName}">
                        <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${(layerName === this._layerToInsertElements) ? 'checked="checked"' : ''}>
                        ${layerLabel}
                    </label>
                </div>`;
            };
            let subControl = document.createElement('div');
            subControl.className = 'wfst--tools-control--sub-control';
            this._selectDraw = createSelectDrawElement();
            subControl.append(this._selectDraw);
            let htmlLayers = Object.keys(this._mapLayers).map(key => createLayerElements(this.options.layers.find((el) => el.name === key)));
            let selectLayers = document.createElement('div');
            selectLayers.className = 'wfst--tools-control--select-layers';
            selectLayers.innerHTML = htmlLayers.join('');
            subControl.append(selectLayers);
            let radioInputs = subControl.querySelectorAll('input');
            radioInputs.forEach(radioInput => {
                radioInput.onchange = () => {
                    this._layerToInsertElements = radioInput.value;
                    this._resetStateButtons();
                    this.activateDrawMode(this._layerToInsertElements);
                };
            });
            return subControl;
        };
        let controlDiv = createToolSelector();
        let subControl = createSubControl();
        controlDiv.append(subControl);
        // Upload section
        if (this.options.upload) {
            let uploadSection = createUploadElements();
            subControl.append(uploadSection);
        }
        this.map.addControl(this._controlWidgetTools);
    }
    /**
     * Show Loading modal
     *
     * @private
     */
    _showLoading() {
        if (!this._modalLoading) {
            this._modalLoading = document.createElement('div');
            this._modalLoading.className = 'wfst--tools-control--loading';
            this._modalLoading.textContent = this._i18n.labels.loading;
            this.map.addControl(new Control({
                element: this._modalLoading
            }));
        }
        this._modalLoading.classList.add('wfst--tools-control--loading-show');
    }
    _hideLoading() {
        this._modalLoading.classList.remove('wfst--tools-control--loading-show');
    }
    /**
     * Lock a feature in the geoserver before edit
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @private
     */
    _lockFeature(featureId, layerName, retry = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                service: 'wfs',
                version: '1.1.0',
                request: 'LockFeature',
                expiry: String(5),
                LockId: 'GeoServer',
                typeName: layerName,
                releaseAction: 'SOME',
                exceptions: 'application/json',
                featureid: `${featureId}`
            });
            const url_fetch = this.options.geoServerUrl + '?' + params.toString();
            try {
                const response = yield fetch(url_fetch, {
                    headers: this.options.headers
                });
                if (!response.ok) {
                    throw new Error(this._i18n.errors.lockFeature);
                }
                let data = yield response.text();
                try {
                    // First, check if is a JSON (with errors)
                    data = JSON.parse(data);
                    if ('exceptions' in data) {
                        if (data.exceptions[0].code === "CannotLockAllFeatures") {
                            // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                            if (!retry)
                                this._lockFeature(featureId, layerName, 1);
                            else
                                this._showError(this._i18n.errors.lockFeature);
                        }
                        else {
                            this._showError(data.exceptions[0].text);
                        }
                    }
                }
                catch (err) {
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
            }
            catch (err) {
                this._showError(err.message);
            }
        });
    }
    /**
     * Show modal with errors
     *
     * @param msg
     * @private
     */
    _showError(msg) {
        Modal.alert('Error: ' + msg, {
            animateInClass: 'in'
        }).show();
    }
    /**
     * Make the WFS Transactions
     *
     * @param mode
     * @param features
     * @param layerName
     * @private
     */
    _transactWFS(mode, features, layerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformCircleToPolygon = (feature, geom) => {
                let geomConverted = fromCircle(geom);
                feature.setGeometry(geomConverted);
            };
            const transformGeoemtryCollectionToGeometries = (feature, geom) => {
                let geomConverted = geom.getGeometries()[0];
                if (geomConverted.getType() === GeometryType.CIRCLE) {
                    geomConverted = fromCircle(geomConverted);
                }
                feature.setGeometry(geomConverted);
            };
            features = Array.isArray(features) ? features : [features];
            const cloneFeature = (feature) => {
                this._removeFeatureFromEditList(feature);
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
            let clonedFeatures = [];
            for (let feature of features) {
                let clone = cloneFeature(feature);
                let cloneGeom = clone.getGeometry();
                let cloneGeomType = cloneGeom.getType();
                // Ugly fix to support GeometryCollection on GML
                // See https://github.com/openlayers/openlayers/issues/4220
                if (cloneGeomType === GeometryType.GEOMETRY_COLLECTION) {
                    transformGeoemtryCollectionToGeometries(clone, cloneGeom);
                }
                else if (cloneGeomType === GeometryType.CIRCLE) {
                    // Geoserver has no Support to Circles
                    transformCircleToPolygon(clone, cloneGeom);
                }
                if (mode === 'insert') {
                    // Filters
                    if (this.options.beforeInsertFeature) {
                        clone = this.options.beforeInsertFeature(clone);
                    }
                }
                if (clone)
                    clonedFeatures.push(clone);
            }
            if (!clonedFeatures.length) {
                return this._showError(this._i18n.errors.noValidGeometry);
            }
            switch (mode) {
                case 'insert':
                    this._insertFeatures = [...this._insertFeatures, ...clonedFeatures];
                    break;
                case 'update':
                    this._updateFeatures = [...this._updateFeatures, ...clonedFeatures];
                    break;
                case 'delete':
                    this._deleteFeatures = [...this._deleteFeatures, ...clonedFeatures];
                    break;
            }
            this._countRequests++;
            const numberRequest = this._countRequests;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // Prevent fire multiples times   
                if (numberRequest !== this._countRequests)
                    return;
                let srs = this.view.getProjection().getCode();
                // Force latitude/longitude order on transactions
                // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                srs = (srs === 'EPSG:4326') ? DEFAULT_GEOSERVER_SRS : srs;
                const options = {
                    featureNS: this._geoServerData[layerName].namespace,
                    featureType: layerName,
                    srsName: srs,
                    featurePrefix: null,
                    nativeElements: null
                };
                const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                let payload = this._xs.serializeToString(transaction);
                let geomType = this._geoServerData[layerName].geomType;
                let geomField = this._geoServerData[layerName].geomField;
                // Ugly fix to support GeometryCollection on GML
                // See https://github.com/openlayers/openlayers/issues/4220
                if (geomType === GeometryType.GEOMETRY_COLLECTION) {
                    if (mode === 'insert') {
                        payload = payload.replace(/<geometry>/g, `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`);
                        payload = payload.replace(/<\/geometry>/g, `</geometryMember></MultiGeometry></geometry>`);
                    }
                    else if (mode === 'update') {
                        let gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                        let gmemberOut = `</geometryMember></MultiGeometry>`;
                        payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, `$1$2${gmemberIn}$3${gmemberOut}$4$5`);
                    }
                }
                if (mode === 'insert') {
                    // Fixes geometry name, weird bug with GML:
                    // The property for the geometry column is always named "geometry"
                    payload = payload.replace(/(.*?)(<geometry>)(.*)(<\/geometry>)(.*)/g, `$1<${geomField}>$3</${geomField}>$5`);
                }
                else {
                    payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                }
                // Add default LockId value
                if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
                    payload = payload.replace(`</Transaction>`, `<LockId>GeoServer</LockId></Transaction>`);
                }
                try {
                    let headers = Object.assign({ 'Content-Type': 'text/xml', 'Access-Control-Allow-Origin': '*' }, this.options.headers);
                    const response = yield fetch(this.options.geoServerUrl, {
                        method: 'POST',
                        body: payload,
                        headers: headers
                    });
                    if (!response.ok) {
                        throw new Error(this._i18n.errors.transaction + " " + response.status);
                    }
                    const parseResponse = this._formatWFS.readTransactionResponse(response);
                    if (!Object.keys(parseResponse).length) {
                        let responseStr = yield response.text();
                        const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                        if (findError)
                            this._showError(findError[1]);
                    }
                    if (mode !== 'delete') {
                        for (let feature of features) {
                            this._editLayer.getSource().removeFeature(feature);
                        }
                    }
                    if (this.options.layerMode === 'wfs')
                        refreshWfsLayer(this._mapLayers[layerName]);
                    else if (this.options.layerMode === 'wms')
                        refreshWmsLayer(this._mapLayers[layerName]);
                    this._hideLoading();
                }
                catch (err) {
                    console.error(err);
                }
                this._insertFeatures = [];
                this._updateFeatures = [];
                this._deleteFeatures = [];
                this._countRequests = 0;
            }), 0);
        });
    }
    /**
     *
     * @param feature
     * @private
     */
    _addFeatureToEditedList(feature) {
        this._editedFeatures.add(String(feature.getId()));
    }
    /**
     *
     * @param feature
     * @private
     */
    _removeFeatureFromEditList(feature) {
        this._editedFeatures.delete(String(feature.getId()));
    }
    /**
     *
     * @param feature
     * @private
     */
    _isFeatureEdited(feature) {
        return this._editedFeatures.has(String(feature.getId()));
    }
    /**
     *
     * @param feature
     * @private
     */
    _deselectEditFeature(feature) {
        this._removeOverlayHelper(feature);
    }
    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    _restoreFeatureToLayer(feature, layerName) {
        layerName = layerName || feature.get('_layerName_');
        const layer = this._mapLayers[layerName];
        layer.getSource().addFeature(feature);
    }
    _removeFeatureFromTmpLayer(feature) {
        // Remove element from the Layer
        this._editLayer.getSource().removeFeature(feature);
    }
    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    _onDeselectFeatureEvent() {
        const checkIfFeatureIsChanged = (feature) => {
            let layerName = feature.get('_layerName_');
            if (this.options.layerMode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
            if (this._isFeatureEdited(feature)) {
                this._transactWFS('update', feature, layerName);
            }
            else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (this.options.layerMode === 'wfs') {
                    this._restoreFeatureToLayer(feature, layerName);
                }
                this._removeFeatureFromTmpLayer(feature);
            }
        };
        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', (evt) => {
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
    _onRemoveFeatureEvent() {
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', (evt) => {
            const feature = evt.feature;
            if (!feature.get('_delete_'))
                return;
            if (this._keySelect)
                unByKey(this._keySelect);
            let layerName = feature.get('_layerName_');
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
    _styleFunction(feature) {
        const getVertices = (feature) => {
            let geometry = feature.getGeometry();
            let type = geometry.getType();
            if (type === GeometryType.GEOMETRY_COLLECTION) {
                geometry = geometry.getGeometries()[0];
                type = geometry.getType();
            }
            ;
            let coordinates = geometry.getCoordinates();
            if (type === GeometryType.POLYGON ||
                type === GeometryType.MULTI_LINE_STRING) {
                coordinates = coordinates.flat(1);
            }
            else if (type === GeometryType.MULTI_POLYGON) {
                coordinates = coordinates.flat(2);
            }
            if (!coordinates || !coordinates.length)
                return;
            return new MultiPoint(coordinates);
        };
        let geometry = feature.getGeometry();
        let type = geometry.getType();
        if (type === GeometryType.GEOMETRY_COLLECTION) {
            geometry = geometry.getGeometries()[0];
            type = geometry.getType();
        }
        ;
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
                }
                else {
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
                            geometry: (feature) => getVertices(feature)
                        }),
                        new Style({
                            stroke: new Stroke({
                                color: 'rgba(255, 255, 255, 0.7)',
                                width: 2
                            })
                        }),
                    ];
                }
                else {
                    return [
                        new Style({
                            image: new CircleStyle({
                                radius: 2,
                                fill: new Fill({
                                    color: '#000000'
                                })
                            }),
                            geometry: (feature) => getVertices(feature)
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
    _editModeOn(feature) {
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
        elementId.innerHTML = `<b>${this._i18n.labels.editMode}</b> - <i>${String(feature.getId())}</i>`;
        let acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = this._i18n.labels.apply;
        acceptButton.className = 'btn btn-primary';
        acceptButton.onclick = () => {
            this._showLoading();
            this.interactionSelectModify.getFeatures().remove(feature);
        };
        let cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
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
     *
     * @param feature
     * @private
     */
    _deleteFeature(feature, confirm) {
        const deleteEl = () => {
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach(feature => {
                feature.set('_delete_', true, true);
                this._editLayer.getSource().removeFeature(feature);
            });
            this.interactionSelectModify.getFeatures().clear();
            if (this.options.layerMode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
        };
        if (confirm) {
            let confirmModal = Modal.confirm(this._i18n.labels.confirmDelete, {
                animateInClass: 'in'
            });
            confirmModal.show().once('dismiss', function (modal, ev, button) {
                if (button && button.value) {
                    deleteEl();
                }
            });
        }
        else {
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
    _addFeatureToEdit(feature, coordinate = null, layerName = null) {
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
        };
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
                if (this._useLockFeature && this._hasLockFeature)
                    this._lockFeature(feature.getId(), feature.get('_layerName_'));
            }
        }
    }
    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    _resetStateButtons() {
        const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
        if (activeBtn)
            activeBtn.classList.remove('wfst--active');
    }
    /**
    * Confirm modal before transact to the GeoServer the features in the file
    *
    * @param feature
    * @private
    */
    _initUploadFileModal(content, featuresToInsert) {
        const footer = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.upload}
            </button>
        `;
        let modal = new Modal({
            header: true,
            headerClose: false,
            title: this._i18n.labels.uploadFeatures + ' ' + this._layerToInsertElements,
            content: content,
            backdrop: 'static',
            footer: footer,
            animateInClass: 'in'
        }).show();
        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                this._transactWFS('insert', featuresToInsert, this._layerToInsertElements);
            }
            else {
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
    _processUploadFile(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Read data file
             * @param file
             */
            const fileReader = (file) => {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.addEventListener('load', (e) => __awaiter(this, void 0, void 0, function* () {
                        let fileData = e.target.result;
                        resolve(fileData);
                    }));
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
             */
            const fixGeometry = (feature) => {
                // Geometry of the layer
                let geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                let geomTypeFeature = feature.getGeometry().getType();
                let geom;
                switch (geomTypeFeature) {
                    case 'Point': {
                        if (geomTypeLayer === 'MultiPoint') {
                            let coords = feature.getGeometry().getCoordinates();
                            geom = new MultiPoint([coords]);
                        }
                        break;
                    }
                    case 'LineString':
                        if (geomTypeLayer === 'MultiLineString') {
                            let coords = feature.getGeometry().getCoordinates();
                            geom = new MultiLineString([coords]);
                        }
                        break;
                    case 'Polygon':
                        if (geomTypeLayer === 'MultiPolygon') {
                            let coords = feature.getGeometry().getCoordinates();
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
             */
            const checkGeometry = (feature) => {
                // Geometry of the layer
                let geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                let geomTypeFeature = feature.getGeometry().getType();
                // This geom accepts every type of geometry
                if (geomTypeLayer === GeometryType.GEOMETRY_COLLECTION)
                    return true;
                return geomTypeFeature === geomTypeLayer;
            };
            const file = evt.target.files[0];
            let features;
            if (!file)
                return;
            let extension = file.name.split('.').pop().toLowerCase();
            try {
                // If the user uses a custom fucntion...
                if (this.options.processUpload) {
                    features = this.options.processUpload(file);
                }
                // If the user functions return features, we dont process anything more
                if (!features) {
                    let string = yield fileReader(file);
                    if (extension === 'geojson' || extension === 'json') {
                        features = this._formatGeoJSON.readFeatures(string, {
                            featureProjection: this.view.getProjection().getCode()
                        });
                    }
                    else if (extension === 'kml') {
                        features = this._formatKml.readFeatures(string, {
                            featureProjection: this.view.getProjection().getCode()
                        });
                    }
                    else {
                        this._showError(this._i18n.errors.badFormat);
                    }
                }
            }
            catch (err) {
                this._showError(this._i18n.errors.badFile);
            }
            let invalidFeaturesCount = 0;
            let validFeaturesCount = 0;
            let featuresToInsert = [];
            for (let feature of features) {
                // If the geometry doesn't correspond to the layer, try to fixit.
                // If we can't, don't use it
                if (!checkGeometry(feature)) {
                    feature = fixGeometry(feature);
                }
                if (feature) {
                    featuresToInsert.push(feature);
                    validFeaturesCount++;
                }
                else {
                    invalidFeaturesCount++;
                    continue;
                }
            }
            if (!validFeaturesCount) {
                this._showError(this._i18n.errors.noValidGeometry);
            }
            else {
                this._resetStateButtons();
                this.activateEditMode();
                let content = `
                ${this._i18n.labels.validFeatures}: ${validFeaturesCount}<br>
                ${(invalidFeaturesCount) ? `${this._i18n.labels.invalidFeatures}: ${invalidFeaturesCount}` : ''}
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
            evt.target.value = null;
        });
    }
    /**
     * Add features to the geoserver, in a custom layer
     * witout verifiyn geometry and showing modal to confirm.
     *
     * @param layerName
     * @param features
     * @public
     */
    insertFeaturesTo(layerName, features) {
        this._transactWFS('insert', features, layerName);
    }
    /**
     * Activate/deactivate the draw mode
     * @param layerName
     * @public
     */
    activateDrawMode(layerName, geomDrawTypeSelected = null) {
        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         */
        const setSelectState = (value, options) => {
            for (let option of this._selectDraw.options) {
                option.selected = (option.value === value) ? true : false;
                option.disabled = (options === 'all') ? false : options.includes(option.value) ? false : true;
            }
        };
        const getDrawTypeSelected = (layerName) => {
            let drawType;
            if (this._selectDraw) {
                let geomLayer = this._geoServerData[layerName].geomType;
                // If a draw Type value is provided, the function was triggerd
                // on changing the Select geoemtry type (is a GeometryCollection)
                if (geomDrawTypeSelected) {
                    drawType = this._selectDraw.value;
                }
                else {
                    if (geomLayer === GeometryType.GEOMETRY_COLLECTION) {
                        drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection
                        setSelectState(drawType, 'all');
                    }
                    else if (geomLayer === GeometryType.LINEAR_RING) {
                        drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection
                        setSelectState(drawType, [GeometryType.CIRCLE, GeometryType.LINEAR_RING, GeometryType.POLYGON]);
                        this._selectDraw.value = drawType;
                    }
                    else {
                        drawType = geomLayer;
                        setSelectState(drawType, [geomLayer]);
                    }
                }
            }
            return drawType;
        };
        const addDrawInteraction = (layerName) => {
            this.activateEditMode(false);
            // If already exists, remove
            if (this.interactionDraw)
                this.map.removeInteraction(this.interactionDraw);
            let geomDrawType = getDrawTypeSelected(layerName);
            this.interactionDraw = new Draw({
                source: this._editLayer.getSource(),
                type: geomDrawType,
                style: (feature) => this._styleFunction(feature)
            });
            this.map.addInteraction(this.interactionDraw);
            const drawHandler = () => {
                this.interactionDraw.on('drawend', (evt) => {
                    const feature = evt.feature;
                    this._transactWFS('insert', feature, layerName);
                });
            };
            drawHandler();
        };
        if (!this.interactionDraw && !layerName)
            return;
        this._isDrawModeOn = (layerName) ? true : false;
        if (layerName) {
            let btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
            if (btn)
                btn.classList.add('wfst--active');
            this.viewport.classList.add('draw-mode');
            addDrawInteraction(String(layerName));
        }
        else {
            this.map.removeInteraction(this.interactionDraw);
            this.viewport.classList.remove('draw-mode');
        }
    }
    /**
     * Activate/desactivate the edit mode
     * @param bool
     * @public
     */
    activateEditMode(bool = true) {
        if (bool) {
            let btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
            if (btn)
                btn.classList.add('wfst--active');
            this.activateDrawMode(false);
        }
        else {
            // Deselct features
            this.interactionSelectModify.getFeatures().clear();
        }
        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);
        if (this.options.layerMode === 'wms') {
            // if (!bool) unByKey(this.clickWmsKey);
        }
        else {
            this.interactionWfsSelect.setActive(bool);
        }
    }
    /**
     * Shows a fields form in a modal window to allow changes in the properties of the feature.
     *
     * @param feature
     * @private
     */
    _initEditFieldsModal(feature) {
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
                </div>`;
                }
            }
        });
        content += '</form>';
        const footer = `
            <button type="button" class="btn btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${this._i18n.labels.delete}
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.save}
            </button>
        `;
        let modal = new Modal({
            header: true,
            headerClose: true,
            title: `${this._i18n.labels.editElement} ${this._editFeature.getId()} `,
            content: content,
            footer: footer,
            animateInClass: 'in'
        }).show();
        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                const inputs = modal.el.querySelectorAll('input');
                inputs.forEach((el) => {
                    const value = el.value;
                    const field = el.name;
                    this._editFeature.set(field, value, /*isSilent = */ true);
                });
                this._editFeature.changed();
                this._addFeatureToEditedList(this._editFeature);
                // Force deselect to trigger handler
                this.interactionSelectModify.getFeatures().remove(this._editFeature);
            }
            else if (event.target.dataset.action === 'delete') {
                this._deleteFeature(this._editFeature, true);
            }
        });
    }
    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    _removeOverlayHelper(feature) {
        let featureId = feature.getId();
        if (!featureId)
            return;
        let overlay = this.map.getOverlayById(featureId);
        if (!overlay)
            return;
        this.map.removeOverlay(overlay);
    }
}
