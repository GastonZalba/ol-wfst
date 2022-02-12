import TileState from 'ol/TileState';
import { GeometryCollection, Circle as Circle$1, Polygon, MultiLineString, MultiPolygon, MultiPoint } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { Control } from 'ol/control';
import { Modify, Snap, Select, Draw } from 'ol/interaction';
import { Collection, Feature, Overlay } from 'ol';
import { WFS, GeoJSON, KML } from 'ol/format';
import { Vector, Tile } from 'ol/layer';
import { Vector as Vector$1, TileWMS } from 'ol/source';
import { bbox, all } from 'ol/loadingstrategy';
import { fromCircle } from 'ol/geom/Polygon';
import { getCenter } from 'ol/extent';
import { primaryAction, never } from 'ol/events/condition';
import { transformExtent } from 'ol/proj';
import { unByKey } from 'ol/Observable';
import Modal from 'modal-vanilla';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

var img$5 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

var GeometryType;
(function (GeometryType) {
    GeometryType["Point"] = "Point";
    GeometryType["LineString"] = "LineString";
    GeometryType["LinearRing"] = "LinearRing";
    GeometryType["Polygon"] = "Polygon";
    GeometryType["MultiPoint"] = "MultiPoint";
    GeometryType["MultiLineString"] = "MultiLineString";
    GeometryType["MultiPolygon"] = "MultiPolygon";
    GeometryType["GeometryCollection"] = "GeometryCollection";
    GeometryType["Circle"] = "Circle";
})(GeometryType || (GeometryType = {}));

const es = {
    labels: {
        select: 'Seleccionar',
        addElement: 'Modo dibujo',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        upload: 'Subir',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        geomTypeNotSupported: 'Geometría no compatible con la capa',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        selectDrawType: 'Tipo de geometría para dibujar',
        uploadToLayer: 'Subir archivo a la capa seleccionada',
        uploadFeatures: 'Subida de elementos a la capa',
        validFeatures: 'Válidas',
        invalidFeatures: 'Invalidas',
        loading: 'Cargando...',
        toggleVisibility: 'Cambiar visibilidad de la capa',
        close: 'Cerrar'
    },
    errors: {
        capabilities: 'No se pudieron obtener las Capabilidades del GeoServer',
        wfst: 'El GeoServer no tiene soporte a Transacciones',
        layer: 'No se pudieron obtener datos de la capa',
        noValidGeometry: 'No se encontraron geometrías válidas para agregar a esta capa',
        geoserver: 'No se pudieron obtener datos desde el GeoServer',
        badFormat: 'Formato no soportado',
        badFile: 'Error al leer elementos del archivo',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer.',
        transaction: 'Error al hacer transacción con el GeoServer. HTTP status:',
        getFeatures: 'Error al obtener elemento desde el GeoServer. HTTP status:'
    }
};

const en = {
    labels: {
        select: 'Select',
        addElement: 'Toggle Draw mode',
        editElement: 'Edit feature',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        apply: 'Apply changes',
        upload: 'Upload',
        editMode: 'Edit Mode',
        confirmDelete: 'Are you sure to delete the feature?',
        geomTypeNotSupported: 'Geometry not supported by layer',
        editFields: 'Edit fields',
        editGeom: 'Edit geometry',
        selectDrawType: 'Geometry type to draw',
        uploadToLayer: 'Upload file to selected layer',
        uploadFeatures: 'Uploaded features to layer',
        validFeatures: 'Valid geometries',
        invalidFeatures: 'Invalid',
        loading: 'Loading...',
        toggleVisibility: 'Toggle layer visibility',
        close: 'Close'
    },
    errors: {
        capabilities: 'GeoServer Capabilities could not be downloaded.',
        wfst: 'The GeoServer does not support Transactions',
        layer: 'Could not get data from layer',
        noValidGeometry: 'No valid geometries found to add to this layer',
        geoserver: 'Could not get data from the GeoServer',
        badFormat: 'Unsupported format',
        badFile: 'Error reading items from file',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer. HTTP status:',
        transaction: 'Error when doing Transaction with GeoServer. HTTP status:',
        getFeatures: 'Error getting elements from GeoServer. HTTP status:'
    }
};

var i18n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    es: es,
    en: en
});

// https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
// Axis ordering: latitude/longitude
const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';
const DEFAULT_LANGUAGE = 'en';
const controlElement = document.createElement('div');
/**
 * Tiny WFST-T client to insert (drawing/uploading), modify and delete
 * features on GeoServers using OpenLayers. Layers with these types
 * of geometries are supported: "GeometryCollection" (in this case, you can
 * choose the geometry type of each element to draw), "Point", "MultiPoint",
 * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
 *
 * @constructor
 * @fires getCapabilities
 * @fires describeFeatureType
 * @fires allDescribeFeatureTypeLoaded
 * @fires getFeature
 * @fires modifystart
 * @fires modifyend
 * @fires drawstart
 * @fires drawend
 * @extends {ol/control/Control~Control}
 * @param opt_options Wfst options, see [Wfst Options](#options) for more details.
 */
class Wfst extends Control {
    constructor(opt_options) {
        super({
            target: null,
            element: controlElement
        });
        // Check if the selected language exists
        this._i18n =
            opt_options.language && opt_options.language in i18n
                ? i18n[opt_options.language]
                : i18n[DEFAULT_LANGUAGE];
        if (opt_options.i18n) {
            // Merge custom translations
            this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
        }
        // Default options
        const defaultOptions = {
            geoServerUrl: null,
            geoServerAdvanced: {
                getCapabilitiesVersion: '1.3.0',
                getFeatureVersion: '1.0.0',
                describeFeatureTypeVersion: '1.1.0',
                lockFeatureVersion: '1.1.0',
                wfsTransactionVersion: '1.1.0',
                projection: DEFAULT_GEOSERVER_SRS
            },
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
                    dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                    headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${this._i18n.labels.close}"><span aria-hidden="true">×</span></button>`
                }
            }
        };
        this._options = deepObjectAssign(defaultOptions, opt_options);
        this._mapLayers = [];
        this._countRequests = 0;
        this._isEditModeOn = false;
        // GeoServer
        this._hasLockFeature = false;
        this._hasTransaction = false;
        this._geoServerCapabilities = null;
        this._geoServerData = {};
        // Editing
        this._editedFeatures = new Set();
        this._layerToInsertElements = this._options.layers[0].name; // By default, the first layer is ready to accept new draws
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
        this._controlWidgetToolsDiv = controlElement;
        this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
        this._initAsyncOperations();
    }
    /**
     * @private
     */
    _onLoad() {
        this._map = super.getMap();
        this._view = this._map.getView();
        this._viewport = this._map.getViewport();
        // State
        this._isVisible = this._view.getZoom() > this._options.minZoom;
        this._createLayers(this._options.layers);
        this._initMapElements(this._options.showControl, this._options.active);
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
    _initAsyncOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-expect-error
                this.on('allDescribeFeatureTypeLoaded', this._onLoad);
                this._showLoading();
                yield this._connectToGeoServerAndGetCapabilities();
                if (this._options.layers) {
                    yield this._getGeoserverLayersData(this._options.layers, this._options.geoServerUrl);
                }
            }
            catch (err) {
                this._hideLoading();
                this._showError(err.message, err);
            }
        });
    }
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @fires capabilitiesLoaded
     * @private
     */
    _connectToGeoServerAndGetCapabilities() {
        const _super = Object.create(null, {
            dispatchEvent: { get: () => super.dispatchEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * @private
             */
            const getCapabilities = () => __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    service: 'wfs',
                    version: this._options.geoServerAdvanced.getCapabilitiesVersion,
                    request: 'GetCapabilities',
                    exceptions: 'application/json'
                });
                const url_fetch = this._options.geoServerUrl + '?' + params.toString();
                try {
                    const response = yield fetch(url_fetch, {
                        headers: this._options.headers
                    });
                    if (!response.ok) {
                        throw new Error('');
                    }
                    const data = yield response.text();
                    const capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
                    return capabilities;
                }
                catch (err) {
                    throw new Error(this._i18n.errors.capabilities);
                }
            });
            this._geoServerCapabilities = yield getCapabilities();
            // Available operations in the geoserver
            const operations = this._geoServerCapabilities.getElementsByTagName('ows:Operation');
            Array.from(operations).forEach((operation) => {
                if (operation.getAttribute('name') === 'Transaction') {
                    this._hasTransaction = true;
                }
                else if (operation.getAttribute('name') === 'LockFeature') {
                    this._hasLockFeature = true;
                }
            });
            if (!this._hasTransaction) {
                throw new Error(this._i18n.errors.wfst);
            }
            _super.dispatchEvent.call(this, {
                type: 'getCapabilities',
                // @ts-expect-error
                data: this._geoServerCapabilities
            });
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
        const _super = Object.create(null, {
            dispatchEvent: { get: () => super.dispatchEvent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            /**
             *
             * @param layerName
             * @fires describeFeatureType
             * @fires allDescribeFeatureTypeLoaded
             * @returns
             * @private
             */
            const getLayerData = (layerName) => __awaiter(this, void 0, void 0, function* () {
                const params = new URLSearchParams({
                    service: 'wfs',
                    version: this._options.geoServerAdvanced
                        .describeFeatureTypeVersion,
                    request: 'DescribeFeatureType',
                    typeName: layerName,
                    outputFormat: 'application/json',
                    exceptions: 'application/json'
                });
                const url_fetch = geoServerUrl + '?' + params.toString();
                const response = yield fetch(url_fetch, {
                    headers: this._options.headers
                });
                if (!response.ok) {
                    throw new Error('');
                }
                return yield response.json();
            });
            for (const layer of layers) {
                const layerName = layer.name;
                const layerLabel = layer.label || layerName;
                try {
                    const data = yield getLayerData(layerName);
                    if (!data) {
                        throw new Error('');
                    }
                    _super.dispatchEvent.call(this, {
                        type: 'describeFeatureType',
                        // @ts-expect-error
                        layer: layerName,
                        data: data
                    });
                    const targetNamespace = data.targetNamespace;
                    const properties = data.featureTypes[0].properties;
                    // Find the geometry field
                    const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);
                    this._geoServerData[layerName] = {
                        namespace: targetNamespace,
                        properties: properties,
                        geomType: geom.localType,
                        geomField: geom.name
                    };
                }
                catch (err) {
                    throw new Error(`${this._i18n.errors.layer} "${layerLabel}"`);
                }
            }
            _super.dispatchEvent.call(this, {
                type: 'allDescribeFeatureTypeLoaded',
                // @ts-expect-error
                data: this._geoServerData
            });
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
        let layersNumber = 0; // Only count visibles
        /**
         * When all the data is loaded, hide the loading
         * @private
         */
        const addLayerLoaded = () => {
            layerLoaded++;
            if (layerLoaded >= layersNumber) {
                this._hideLoading();
            }
        };
        /**
         *
         * @param layerParams
         * @private
         */
        const newWmsLayer = (layerParams) => {
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
                url: this._options.geoServerUrl,
                params: params,
                serverType: 'geoserver',
                tileLoadFunction: (tile, src) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const response = yield fetch(src, {
                            headers: this._options.headers
                        });
                        if (!response.ok) {
                            throw new Error('');
                        }
                        const data = yield response.blob();
                        if (data !== undefined) {
                            tile.getImage().src = URL.createObjectURL(data);
                        }
                        else {
                            throw new Error('');
                        }
                        tile.setState(TileState.LOADED);
                    }
                    catch (err) {
                        tile.setState(TileState.ERROR);
                    }
                })
            });
            let loading = 0;
            let loaded = 0;
            source.on('tileloadstart', () => {
                loading++;
                this._showLoading();
            });
            source.on(['tileloadend', 'tileloaderror'], () => {
                loaded++;
                setTimeout(() => {
                    if (loading === loaded)
                        addLayerLoaded();
                }, 300);
            });
            const layer_options = Object.assign({ name: layerName, type: '_wms_', minZoom: this._options.minZoom, source: source, visible: true, zIndex: 1 }, layerParams);
            const layer = new Tile(layer_options);
            return layer;
        };
        /**
         *
         * @param layerParams
         * @private
         */
        const newWfsLayer = (layerParams) => {
            const layerName = layerParams.name;
            const cqlFilter = layerParams.cqlFilter;
            const strategy = layerParams.wfsStrategy || 'bbox';
            const source = new Vector$1({
                format: new GeoJSON(),
                strategy: strategy === 'bbox' ? bbox : all,
                loader: (extent) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const params = new URLSearchParams({
                            service: 'wfs',
                            version: this._options.geoServerAdvanced
                                .getFeatureVersion,
                            request: 'GetFeature',
                            typename: layerName,
                            outputFormat: 'application/json',
                            exceptions: 'application/json',
                            srsName: this._options.geoServerAdvanced.projection.toString()
                        });
                        if (cqlFilter) {
                            params.append('cql_filter', cqlFilter);
                        }
                        // If bbox, add extent to the request
                        if (strategy === 'bbox') {
                            const extentGeoServer = transformExtent(extent, this._view.getProjection().getCode(), this._options.geoServerAdvanced.projection);
                            // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                            // request features using a bounding box with CRS maybe different from featureTypes native CRS
                            params.append('bbox', extentGeoServer.toString() +
                                `,${this._options.geoServerAdvanced.projection}`);
                        }
                        const url_fetch = this._options.geoServerUrl +
                            '?' +
                            params.toString();
                        const response = yield fetch(url_fetch, {
                            headers: this._options.headers
                        });
                        if (!response.ok) {
                            throw new Error('');
                        }
                        const data = yield response.json();
                        this.dispatchEvent({
                            type: 'getFeature',
                            // @ts-expect-error
                            layer: layerName,
                            data: data
                        });
                        const features = source.getFormat().readFeatures(data, {
                            featureProjection: this._view
                                .getProjection()
                                .getCode(),
                            dataProjection: this._options.geoServerAdvanced
                                .projection
                        });
                        features.forEach((feature) => {
                            feature.set('_layerName_', layerName, 
                            /* silent = */ true);
                        });
                        source.addFeatures(features);
                        source.dispatchEvent('featuresloadend');
                    }
                    catch (err) {
                        source.dispatchEvent('featuresloaderror');
                        this._showError(this._i18n.errors.geoserver, err);
                        source.removeLoadedExtent(extent);
                    }
                })
            });
            let loading = 0;
            let loaded = 0;
            source.on('featuresloadstart', () => {
                loading++;
                this._showLoading();
            });
            source.on(['featuresloadend', 'featuresloaderror'], () => {
                loaded++;
                setTimeout(() => {
                    if (loading === loaded)
                        addLayerLoaded();
                }, 300);
            });
            const layer_options = Object.assign({ name: layerName, type: '_wfs_', minZoom: this._options.minZoom, source: source, visible: true, zIndex: 2 }, layerParams);
            const layer = new Vector(layer_options);
            return layer;
        };
        for (const layerParams of layers) {
            const layerName = layerParams.name;
            // Only create the layer if we can get the GeoserverData
            if (this._geoServerData[layerName]) {
                let layer;
                const layerParams = this._options.layers.find((e) => e.name === layerName);
                const mode = layerParams.mode;
                // If mode is undefined, by default use wfs
                if (!mode) {
                    layerParams.mode = 'wfs';
                }
                if (layerParams.mode === 'wfs') {
                    layer = newWfsLayer(layerParams);
                }
                else {
                    layer = newWmsLayer(layerParams);
                }
                if (layer.getVisible())
                    layersNumber++;
                this._map.addLayer(layer);
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
    _initMapElements(showControl, active) {
        return __awaiter(this, void 0, void 0, function* () {
            // VectorLayer to store features on editing and inserting
            this._createEditLayer();
            this._addInteractions();
            this._addHandlers();
            if (showControl) {
                this._addMapControl();
            }
            // By default, init in edit mode
            this.activateEditMode(active);
        });
    }
    /**
     * @private
     */
    _addInteractions() {
        /**
         * Select the wfs feature already downloaded
         * @private
         */
        const prepareWfsInteraction = () => {
            this._collectionModify = new Collection();
            // Interaction to select wfs layer elements
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature) => this._styleFunction(feature),
                toggleCondition: never,
                filter: (feature, layer) => {
                    return (!this._isEditModeOn &&
                        layer &&
                        layer.get('type') === '_wfs_');
                }
            });
            this._map.addInteraction(this.interactionWfsSelect);
            this.interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                const coordinate = mapBrowserEvent.coordinate;
                if (selected.length) {
                    selected.forEach((feature) => {
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
                        deselected.forEach((feature) => {
                            // Trigger deselect
                            // This is necessary for those times where two features overlap.
                            this._collectionModify.remove(feature);
                        });
                    }
                }
            });
        };
        /**
         * Call the geoserver to get the clicked feature
         * @private
         */
        const prepareWmsInteraction = () => {
            // Interaction to allow select features in the edit layer
            this.interactionSelectModify = new Select({
                style: (feature) => this._styleFunction(feature),
                layers: [this._editLayer],
                toggleCondition: never,
                removeCondition: () => (this._isEditModeOn ? true : false) // Prevent deselect on clicking outside the feature
            });
            this._map.addInteraction(this.interactionSelectModify);
            this._collectionModify = this.interactionSelectModify.getFeatures();
            const getFeatures = (evt) => __awaiter(this, void 0, void 0, function* () {
                for (const layerName in this._mapLayers) {
                    const layer = this._mapLayers[layerName];
                    // If layer is hidden or is not a wms, skip
                    if (!layer.getVisible() ||
                        !(layer.get('type') === '_wms_')) {
                        continue;
                    }
                    const coordinate = evt.coordinate;
                    // Si la vista es lejana, disminumos el buffer
                    // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
                    // y mejorar la sensibilidad en IOS
                    const buffer = this._view.getZoom() > 10 ? 10 : 5;
                    const source = layer.getSource();
                    // Fallback to support a bad name
                    // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
                    const fallbackOl5 = 'getFeatureInfoUrl' in source
                        ? 'getFeatureInfoUrl'
                        : 'getGetFeatureInfoUrl';
                    const url = source[fallbackOl5](coordinate, this._view.getResolution(), this._view.getProjection().getCode(), {
                        INFO_FORMAT: 'application/json',
                        BUFFER: buffer,
                        FEATURE_COUNT: 1,
                        EXCEPTIONS: 'application/json'
                    });
                    try {
                        const response = yield fetch(url, {
                            headers: this._options.headers
                        });
                        if (!response.ok) {
                            throw new Error(this._i18n.errors.getFeatures +
                                ' ' +
                                response.status);
                        }
                        const data = yield response.json();
                        const features = this._formatGeoJSON.readFeatures(data);
                        if (!features.length) {
                            continue;
                        }
                        features.forEach((feature) => this._addFeatureToEdit(feature, coordinate, layerName));
                    }
                    catch (err) {
                        this._showError(err.message, err);
                    }
                }
            });
            this._keyClickWms = this._map.on(this._options.evtType, (evt) => __awaiter(this, void 0, void 0, function* () {
                if (this._map.hasFeatureAtPixel(evt.pixel)) {
                    return;
                }
                if (!this._isVisible) {
                    return;
                }
                // Only get other features if editmode is disabled
                if (!this._isEditModeOn) {
                    yield getFeatures(evt);
                }
            }));
        };
        if (this._options.layers.find((layer) => layer.mode === 'wfs')) {
            prepareWfsInteraction();
        }
        if (this._options.layers.find((layer) => layer.mode === 'wms')) {
            prepareWmsInteraction();
        }
        this.interactionModify = new Modify({
            style: () => {
                if (this._isEditModeOn) {
                    return new Style({
                        image: new Circle({
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
            features: this._collectionModify,
            condition: (evt) => {
                return primaryAction(evt) && this._isEditModeOn;
            }
        });
        this._map.addInteraction(this.interactionModify);
        this.interactionSnap = new Snap({
            source: this._editLayer.getSource()
        });
        this._map.addInteraction(this.interactionSnap);
    }
    /**
     * Layer to store temporary the elements to be edited
     * @private
     */
    _createEditLayer() {
        this._editLayer = new Vector({
            source: new Vector$1(),
            zIndex: 100
        });
        this._map.addLayer(this._editLayer);
    }
    /**
     * Add map handlers
     * @private
     */
    _addHandlers() {
        /**
         * @private
         */
        const keyboardEvents = () => {
            document.addEventListener('keydown', ({ key }) => {
                const inputFocus = document.querySelector('input:focus');
                if (inputFocus) {
                    return;
                }
                if (key === 'Delete') {
                    const selectedFeatures = this._collectionModify;
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
        this.interactionModify.on('modifyend', (evt) => {
            const feature = evt.features.item(0);
            this._addFeatureToEditedList(feature);
            super.dispatchEvent(evt);
        });
        this.interactionModify.on('modifystart', (evt) => {
            super.dispatchEvent(evt);
        });
        this._onDeselectFeatureEvent();
        this._onRemoveFeatureEvent();
        /**
         * @private
         */
        const handleZoomEnd = () => {
            if (this._currentZoom > this._options.minZoom) {
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
        this._map.on('moveend', () => {
            this._currentZoom = this._view.getZoom();
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
    _addMapControl() {
        /**
         * @private
         * @returns
         */
        const createLayersControl = () => {
            /**
             *
             * @param layerParams
             * @private
             * @returns
             */
            const createLayerElements = (layerParams) => {
                const layerName = layerParams.name;
                const layerLabel = `<span title="${this._geoServerData[layerName].geomType}">${layerParams.label || layerName}</span>`;
                const visible = 'visible' in layerParams ? layerParams.visible : true;
                return `
                <div class="wfst--layer-control 
                    ${visible ? 'ol-wfst--visible-on' : ''}
                    ${layerName === this._layerToInsertElements
                    ? 'ol-wfst--selected-on'
                    : ''}
                    " data-layer="${layerName}">
                    <div class="ol-wfst--tools-control-visible">
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on" title="${this._i18n.labels.toggleVisibility}">
                      <img src="${img$4}"/>
                    </span>
                    <span class="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off" title="${this._i18n.labels.toggleVisibility}">
                      <img src="${img$5}"/>
                    </span>
                  </div>
                    <label for="wfst--${layerName}">
                        <input value="${layerName}" id="wfst--${layerName}" type="radio" class="ol-wfst--tools-control-input" name="wfst--select-layer" ${layerName === this._layerToInsertElements
                    ? 'checked="checked"'
                    : ''}>
                        ${layerLabel}
                    </label>
                </div>`;
            };
            let htmlLayers = '';
            Object.keys(this._mapLayers).map((key) => (htmlLayers += createLayerElements(this._options.layers.find((el) => el.name === key))));
            const selectLayers = document.createElement('div');
            selectLayers.className = 'wfst--tools-control--select-layers';
            selectLayers.innerHTML = htmlLayers;
            // Layer Selector
            const radioInputs = selectLayers.querySelectorAll('input');
            radioInputs.forEach((radioInput) => {
                const parentDiv = radioInput.closest('.wfst--layer-control');
                radioInput.onchange = () => {
                    // Deselect DOM previous layer
                    const selected = selectLayers.querySelector('.ol-wfst--selected-on');
                    if (selected)
                        selected.classList.remove('ol-wfst--selected-on');
                    // Select this layer
                    parentDiv.classList.add('ol-wfst--selected-on');
                    this._layerToInsertElements = radioInput.value;
                    this._changeStateSelect(this._layerToInsertElements);
                };
            });
            // Visibility toggler
            const visibilityBtn = selectLayers.querySelectorAll('.ol-wfst--tools-control-visible-btn');
            visibilityBtn.forEach((btn) => {
                const parentDiv = btn.closest('.wfst--layer-control');
                const layerName = parentDiv.dataset['layer'];
                btn.onclick = () => {
                    parentDiv.classList.toggle('ol-wfst--visible-on');
                    const layer = this._mapLayers[layerName];
                    if (parentDiv.classList.contains('ol-wfst--visible-on')) {
                        layer.setVisible(true);
                    }
                    else {
                        layer.setVisible(false);
                    }
                };
            });
            return selectLayers;
        };
        /**
         * @private
         * @returns
         */
        const createHeadControl = () => {
            /**
             * @private
             */
            const createUploadElements = () => {
                const container = document.createElement('div');
                // Upload button Tool
                const uploadButton = document.createElement('label');
                uploadButton.className =
                    'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
                uploadButton.htmlFor = 'ol-wfst--upload';
                uploadButton.innerHTML = `<img src="${img$3}"/> `;
                uploadButton.title = this._i18n.labels.uploadToLayer;
                // Hidden Input form
                const uploadInput = document.createElement('input');
                uploadInput.id = 'ol-wfst--upload';
                uploadInput.type = 'file';
                uploadInput.accept = this._options.uploadFormats;
                uploadInput.onchange = (evt) => this._processUploadFile(evt);
                container.append(uploadInput);
                container.append(uploadButton);
                return container;
            };
            /**
             * @private
             * @returns
             */
            const createDrawContainer = () => {
                const drawContainer = document.createElement('div');
                drawContainer.className = 'ol-wfst--tools-control-draw-cnt';
                // Draw Tool
                const drawButton = document.createElement('button');
                drawButton.className =
                    'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
                drawButton.type = 'button';
                drawButton.innerHTML = `<img src="${img}"/>`;
                drawButton.title = this._i18n.labels.addElement;
                drawButton.onclick = () => {
                    if (this._isDrawModeOn) {
                        this._resetStateButtons();
                        this.activateEditMode();
                    }
                    else {
                        this.activateDrawMode(this._layerToInsertElements);
                    }
                };
                // Select geom type
                const select = document.createElement('select');
                select.title = this._i18n.labels.selectDrawType;
                select.className = 'wfst--tools-control--select-draw';
                select.onchange = () => {
                    const selectedValue = select.value;
                    this._changeStateSelect(this._layerToInsertElements, selectedValue);
                    if (this._isDrawModeOn) {
                        this.activateDrawMode(this._layerToInsertElements);
                    }
                };
                const types = [
                    GeometryType.Point,
                    GeometryType.MultiPoint,
                    GeometryType.LineString,
                    GeometryType.MultiLineString,
                    GeometryType.Polygon,
                    GeometryType.MultiPolygon,
                    GeometryType.Circle
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
            if (this._options.showUpload) {
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
     * Show Loading
     * @private
     */
    _showLoading() {
        if (!this._modalLoading) {
            this._modalLoading = document.createElement('div');
            this._modalLoading.className = 'ol-wfst--tools-control--loading';
            this._modalLoading.innerHTML = this._i18n.labels.loading;
            this._controlWidgetToolsDiv.append(this._modalLoading);
        }
        this._modalLoading.classList.add('ol-wfst--tools-control--loading-show');
    }
    /**
     * Hide loading
     * @private
     */
    _hideLoading() {
        this._modalLoading.classList.remove('ol-wfst--tools-control--loading-show');
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
                version: this._options.geoServerAdvanced.lockFeatureVersion,
                request: 'LockFeature',
                expiry: String(5),
                LockId: 'GeoServer',
                typeName: layerName,
                releaseAction: 'SOME',
                exceptions: 'application/json',
                featureid: `${featureId}`
            });
            const url_fetch = this._options.geoServerUrl + '?' + params.toString();
            try {
                const response = yield fetch(url_fetch, {
                    headers: this._options.headers
                });
                if (!response.ok) {
                    throw new Error(this._i18n.errors.lockFeature);
                }
                const data = yield response.text();
                try {
                    // First, check if is a JSON (with errors)
                    const dataParsed = JSON.parse(data);
                    if ('exceptions' in dataParsed) {
                        const exceptions = dataParsed.exceptions;
                        if (exceptions[0].code === 'CannotLockAllFeatures') {
                            // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                            if (!retry) {
                                this._lockFeature(featureId, layerName, 1);
                            }
                            else {
                                this._showError(this._i18n.errors.lockFeature, exceptions);
                            }
                        }
                        else {
                            this._showError(exceptions[0].text, exceptions);
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
                this._showError(err.message, err);
            }
        });
    }
    /**
     * Show modal with errors
     *
     * @param msg
     * @private
     */
    _showError(msg, originalError = null) {
        Modal.alert('Error: ' + msg, Object.assign({}, this._options.modal)).show();
        if (originalError)
            console.error(originalError);
    }
    /**
     * Make the WFS Transactions
     *
     * @param action
     * @param features
     * @param layerName
     * @private
     */
    _transactWFS(action, features, layerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformCircleToPolygon = (feature, geom) => {
                const geomConverted = fromCircle(geom);
                feature.setGeometry(geomConverted);
            };
            const transformGeoemtryCollectionToGeometries = (feature, geom) => {
                let geomConverted = geom.getGeometries()[0];
                if (geomConverted instanceof Circle$1) {
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
            const clonedFeatures = [];
            for (const feature of features) {
                let clone = cloneFeature(feature);
                const cloneGeom = clone.getGeometry();
                // Ugly fix to support GeometryCollection on GML
                // See https://github.com/openlayers/openlayers/issues/4220
                if (cloneGeom instanceof GeometryCollection) {
                    transformGeoemtryCollectionToGeometries(clone, cloneGeom);
                }
                else if (cloneGeom instanceof Circle$1) {
                    // Geoserver has no Support to Circles
                    transformCircleToPolygon(clone, cloneGeom);
                }
                if (action === 'insert') {
                    // Filters
                    if (this._options.beforeInsertFeature) {
                        clone = this._options.beforeInsertFeature(clone);
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
            }
            this._countRequests++;
            const numberRequest = this._countRequests;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Prevent fire multiples times
                    if (numberRequest !== this._countRequests) {
                        return;
                    }
                    let srs = this._view.getProjection().getCode();
                    // Force latitude/longitude order on transactions
                    // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                    srs = srs === 'EPSG:4326' ? 'urn:x-ogc:def:crs:EPSG:4326' : srs;
                    const options = {
                        featureNS: this._geoServerData[layerName].namespace,
                        featureType: layerName,
                        srsName: srs,
                        featurePrefix: null,
                        nativeElements: null,
                        version: this._options.geoServerAdvanced
                            .wfsTransactionVersion
                    };
                    const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                    let payload = this._xs.serializeToString(transaction);
                    const geomType = this._geoServerData[layerName].geomType;
                    const geomField = this._geoServerData[layerName].geomField;
                    // Ugly fix to support GeometryCollection on GML
                    // See https://github.com/openlayers/openlayers/issues/4220
                    if (geomType === GeometryType.GeometryCollection) {
                        if (action === 'insert') {
                            payload = payload.replace(/<geometry>/g, `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`);
                            payload = payload.replace(/<\/geometry>/g, `</geometryMember></MultiGeometry></geometry>`);
                        }
                        else if (action === 'update') {
                            const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                            const gmemberOut = `</geometryMember></MultiGeometry>`;
                            payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, `$1$2${gmemberIn}$3${gmemberOut}$4$5`);
                        }
                    }
                    // Fixes geometry name, weird bug with GML:
                    // The property for the geometry column is always named "geometry"
                    if (action === 'insert') {
                        payload = payload.replace(/<(\/?)\bgeometry\b>/g, `<$1${geomField}>`);
                    }
                    else {
                        payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                    }
                    // Add default LockId value
                    if (this._hasLockFeature &&
                        this._useLockFeature &&
                        action !== 'insert') {
                        payload = payload.replace(`</Transaction>`, `<LockId>GeoServer</LockId></Transaction>`);
                    }
                    const headers = Object.assign({ 'Content-Type': 'text/xml' }, this._options.headers);
                    const response = yield fetch(this._options.geoServerUrl, {
                        method: 'POST',
                        body: payload,
                        headers: headers
                    });
                    if (!response.ok) {
                        throw new Error(this._i18n.errors.transaction + ' ' + response.status);
                    }
                    const parseResponse = this._formatWFS.readTransactionResponse(response);
                    if (!Object.keys(parseResponse).length) {
                        const responseStr = yield response.text();
                        const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                        if (findError) {
                            this._showError(findError[1]);
                        }
                    }
                    if (action !== 'delete') {
                        for (const feature of features) {
                            this._editLayer.getSource().removeFeature(feature);
                        }
                    }
                    const { mode } = this._options.layers.find((layer) => layer.name === layerName);
                    if (mode === 'wfs') {
                        refreshWfsLayer(this._mapLayers[layerName]);
                    }
                    else if (mode === 'wms') {
                        refreshWmsLayer(this._mapLayers[layerName]);
                    }
                    this._hideLoading();
                }
                catch (err) {
                    this._showError(err.message, err);
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
    /**
     * @private
     * @param feature
     */
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
            const layerName = feature.get('_layerName_');
            const { mode } = this._options.layers.find((layer) => layer.name === layerName);
            if (mode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
            if (this._isFeatureEdited(feature)) {
                this._transactWFS('update', feature, layerName);
            }
            else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (mode === 'wfs') {
                    this._restoreFeatureToLayer(feature, layerName);
                }
                this._removeFeatureFromTmpLayer(feature);
            }
        };
        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this._collectionModify.on('remove', (evt) => {
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
    _styleFunction(feature) {
        const getVertexs = (feature) => {
            let geometry = feature.getGeometry();
            if (geometry instanceof GeometryCollection) {
                geometry = geometry.getGeometries()[0];
            }
            const coordinates = geometry.getCoordinates();
            let flatCoordinates = null;
            if (geometry instanceof Polygon ||
                geometry instanceof MultiLineString) {
                flatCoordinates = coordinates.flat(1);
            }
            else if (geometry instanceof MultiPolygon) {
                flatCoordinates = coordinates.flat(2);
            }
            else {
                flatCoordinates = coordinates;
            }
            if (!flatCoordinates || !flatCoordinates.length) {
                return;
            }
            return new MultiPoint(flatCoordinates);
        };
        let geometry = feature.getGeometry();
        let type = geometry.getType();
        if (geometry instanceof GeometryCollection) {
            geometry = geometry.getGeometries()[0];
            type = geometry.getType();
        }
        switch (type) {
            case GeometryType.Point:
            case GeometryType.MultiPoint:
                if (this._isEditModeOn) {
                    return [
                        new Style({
                            image: new Circle({
                                radius: 6,
                                fill: new Fill({
                                    color: '#000000'
                                })
                            })
                        }),
                        new Style({
                            image: new Circle({
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
                            image: new Circle({
                                radius: 5,
                                fill: new Fill({
                                    color: '#ff0000'
                                })
                            })
                        }),
                        new Style({
                            image: new Circle({
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
                            image: new Circle({
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
                }
                else {
                    return [
                        new Style({
                            image: new Circle({
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
    _editModeOn(feature) {
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
        elementId.innerHTML = `<b>${this._i18n.labels.editMode}</b> - <i>${String(feature.getId())}</i>`;
        const acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = this._i18n.labels.apply;
        acceptButton.className = 'btn btn-sm btn-primary';
        acceptButton.onclick = () => {
            this._showLoading();
            this._collectionModify.remove(feature);
        };
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
        cancelButton.className = 'btn btn-sm btn-secondary';
        cancelButton.onclick = () => {
            feature.setGeometry(this._editFeatureOriginal.getGeometry());
            this._removeFeatureFromEditList(feature);
            this._collectionModify.remove(feature);
        };
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = this._i18n.labels.delete;
        deleteButton.className = 'btn btn-sm btn-danger-outline';
        deleteButton.onclick = () => {
            this._deleteFeature(feature, true);
        };
        elements.append(elementId);
        elements.append(cancelButton);
        elements.append(acceptButton);
        elements.append(deleteButton);
        controlDiv.append(elements);
        this._controlApplyDiscardChanges = new Control({
            element: controlDiv
        });
        this._map.addControl(this._controlApplyDiscardChanges);
    }
    /**
     * @private
     */
    _editModeOff() {
        this._isEditModeOn = false;
        this._map.removeControl(this._controlApplyDiscardChanges);
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
            features.forEach((feature) => {
                feature.set('_delete_', true, true);
                this._editLayer.getSource().removeFeature(feature);
            });
            this._collectionModify.clear();
            const layerName = feature.get('_layerName_');
            const { mode } = this._options.layers.find((layer) => layer.name === layerName);
            if (mode === 'wfs') {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
        };
        if (confirm) {
            const confirmModal = Modal.confirm(this._i18n.labels.confirmDelete, Object.assign({}, this._options.modal));
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
            const svgFields = `<img src="${img$1}"/>`;
            const editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt';
            editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editFields}">${svgFields}</button>`;
            editFieldsEl.onclick = () => {
                this._initEditFieldsModal(feature);
            };
            const buttons = document.createElement('div');
            buttons.append(editFieldsEl);
            const svgGeom = `<img src="${img$2}"/>`;
            const editGeomEl = document.createElement('div');
            editGeomEl.className = 'ol-wfst--edit-button-cnt';
            editGeomEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editGeom}">${svgGeom}</button>`;
            editGeomEl.onclick = () => {
                this._editModeOn(feature);
            };
            buttons.append(editGeomEl);
            const position = coordinate || getCenter(feature.getGeometry().getExtent());
            const buttonsOverlay = new Overlay({
                id: feature.getId(),
                position: position,
                positioning: 'center-center',
                element: buttons,
                offset: [0, -40],
                stopEvent: true
            });
            this._map.addOverlay(buttonsOverlay);
        };
        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }
        const props = feature ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                this._editLayer.getSource().addFeature(feature);
                this._collectionModify.push(feature);
                prepareOverlay();
                if (this._useLockFeature && this._hasLockFeature) {
                    this._lockFeature(feature.getId(), feature.get('_layerName_'));
                }
            }
        }
    }
    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    _resetStateButtons() {
        const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
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
    _initUploadFileModal(content, featuresToInsert) {
        const footer = `
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${this._i18n.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${this._i18n.labels.upload}
            </button>
        `;
        const modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: false, title: this._i18n.labels.uploadFeatures +
                ' ' +
                this._layerToInsertElements, content: content, backdrop: 'static', footer: footer })).show();
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
             * @private
             */
            const fileReader = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (e) => __awaiter(this, void 0, void 0, function* () {
                        const fileData = e.target.result;
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
             * @private
             */
            const fixGeometry = (feature) => {
                // Geometry of the layer
                const geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                const geomTypeFeature = feature.getGeometry().getType();
                let geom;
                switch (geomTypeFeature) {
                    case 'Point': {
                        if (geomTypeLayer === 'MultiPoint') {
                            const coords = feature.getGeometry().getCoordinates();
                            geom = new MultiPoint([coords]);
                        }
                        break;
                    }
                    case 'LineString':
                        if (geomTypeLayer === 'MultiLineString') {
                            const coords = feature.getGeometry().getCoordinates();
                            geom = new MultiLineString([coords]);
                        }
                        break;
                    case 'Polygon':
                        if (geomTypeLayer === 'MultiPolygon') {
                            const coords = feature.getGeometry().getCoordinates();
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
            const checkGeometry = (feature) => {
                // Geometry of the layer
                const geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
                const geomTypeFeature = feature.getGeometry().getType();
                // This geom accepts every type of geometry
                if (geomTypeLayer === GeometryType.GeometryCollection) {
                    return true;
                }
                return geomTypeFeature === geomTypeLayer;
            };
            const file = evt.target.files[0];
            let features;
            if (!file) {
                return;
            }
            const extension = file.name.split('.').pop().toLowerCase();
            try {
                // If the user uses a custom fucntion...
                if (this._options.processUpload) {
                    features = this._options.processUpload(file);
                }
                // If the user functions return features, we dont process anything more
                if (!features) {
                    const string = yield fileReader(file);
                    if (extension === 'geojson' || extension === 'json') {
                        features = this._formatGeoJSON.readFeatures(string, {
                            featureProjection: this._view.getProjection().getCode()
                        });
                    }
                    else if (extension === 'kml') {
                        features = this._formatKml.readFeatures(string, {
                            featureProjection: this._view.getProjection().getCode()
                        });
                    }
                    else {
                        this._showError(this._i18n.errors.badFormat);
                    }
                }
            }
            catch (err) {
                this._showError(this._i18n.errors.badFile, err);
            }
            let invalidFeaturesCount = 0;
            let validFeaturesCount = 0;
            const featuresToInsert = [];
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
                const content = `
                ${this._i18n.labels.validFeatures}: ${validFeaturesCount}<br>
                ${invalidFeaturesCount
                    ? `${this._i18n.labels.invalidFeatures}: ${invalidFeaturesCount}`
                    : ''}
            `;
                this._editLayer.getSource().addFeatures(featuresToInsert);
                this._initUploadFileModal(content, featuresToInsert);
                this._view.fit(this._editLayer.getSource().getExtent(), {
                    size: this._map.getSize(),
                    maxZoom: 21,
                    padding: [100, 100, 100, 100]
                });
            }
            // Reset the input to allow another onChange trigger
            evt.target.value = null;
        });
    }
    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     * @private
     */
    _changeStateSelect(layerName, geomDrawTypeSelected = null) {
        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         * @private
         */
        const setSelectState = (value, options) => {
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
        let drawType;
        if (this._selectDraw) {
            const geomLayer = this._geoServerData[layerName].geomType;
            if (geomDrawTypeSelected) {
                drawType = this._selectDraw.value;
            }
            else {
                if (geomLayer === GeometryType.GeometryCollection) {
                    drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                    setSelectState(drawType, 'all');
                }
                else if (geomLayer === GeometryType.LinearRing) {
                    drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                    setSelectState(drawType, [
                        GeometryType.Circle,
                        GeometryType.LinearRing,
                        GeometryType.Polygon
                    ]);
                    this._selectDraw.value = drawType;
                }
                else {
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
    activateDrawMode(layerName) {
        /**
         *
         * @param layerName
         * @private
         */
        const addDrawInteraction = (layerName) => {
            this.activateEditMode(false);
            // If already exists, remove
            if (this.interactionDraw) {
                this._map.removeInteraction(this.interactionDraw);
            }
            const geomDrawType = this._selectDraw.value;
            this.interactionDraw = new Draw({
                source: this._editLayer.getSource(),
                type: geomDrawType,
                style: (feature) => this._styleFunction(feature)
            });
            this._map.addInteraction(this.interactionDraw);
            this.interactionDraw.on('drawstart', (evt) => {
                super.dispatchEvent(evt);
            });
            this.interactionDraw.on('drawend', (evt) => {
                const feature = evt.feature;
                this._transactWFS('insert', feature, layerName);
                super.dispatchEvent(evt);
            });
        };
        if (!this.interactionDraw && !layerName) {
            return;
        }
        if (layerName) {
            // If layer is set to invisible, show warning
            if (!this._mapLayers[layerName].getVisible()) {
                return;
            }
            const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
            if (btn) {
                btn.classList.add('wfst--active');
            }
            this._viewport.classList.add('draw-mode');
            addDrawInteraction(String(layerName));
        }
        else {
            this._map.removeInteraction(this.interactionDraw);
            this._viewport.classList.remove('draw-mode');
        }
        this._isDrawModeOn = layerName ? true : false;
    }
    /**
     * Activate/desactivate the edit mode
     *
     * @param bool
     * @public
     */
    activateEditMode(bool = true) {
        if (bool) {
            const btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
            if (btn) {
                btn.classList.add('wfst--active');
            }
            this.activateDrawMode(false);
        }
        else {
            // Deselct features
            this._collectionModify.clear();
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
    insertFeaturesTo(layerName, features) {
        this._transactWFS('insert', features, layerName);
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
                    <input placeholder="NULL" class="ol-wfst--input-field-input" type="${type}" name="${key}" value="${properties[key] || ''}">
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
        const modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: true, title: `${this._i18n.labels.editElement} ${this._editFeature.getId()} `, content: content, footer: footer })).show();
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
                this._collectionModify.remove(this._editFeature);
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
        const featureId = feature.getId();
        if (!featureId) {
            return;
        }
        const overlay = this._map.getOverlayById(featureId);
        if (!overlay) {
            return;
        }
        this._map.removeOverlay(overlay);
    }
}
/**
 *
 * @param target
 * @param sources
 * @returns
 * @private
 */
const deepObjectAssign = (target, ...sources) => {
    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const s_val = source[key];
            const t_val = target[key];
            target[key] =
                t_val &&
                    s_val &&
                    typeof t_val === 'object' &&
                    typeof s_val === 'object' &&
                    !Array.isArray(t_val) // Don't merge arrays
                    ? deepObjectAssign(t_val, s_val)
                    : s_val;
        });
    });
    return target;
};

export default Wfst;
//# sourceMappingURL=ol-wfst.js.map
