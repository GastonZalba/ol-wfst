/*!
 * ol-wfst - v4.4.0
 * https://github.com/GastonZalba/ol-wfst#readme
 * Built: Thu Sep 10 2026 23:06:22 GMT-0300 (Argentina Standard Time)
*/
import Fill$1 from 'ol/style/Fill.js';
import Stroke$1 from 'ol/style/Stroke.js';
import Style$1 from 'ol/style/Style.js';
import Control from 'ol/control/Control.js';
import FullScreen from 'ol/control/FullScreen.js';
import Draw from 'ol/interaction/Draw.js';
import DragBox from 'ol/interaction/DragBox.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import LineString from 'ol/geom/LineString.js';
import MultiLineString$1 from 'ol/geom/MultiLineString.js';
import GeometryCollection$1 from 'ol/geom/GeometryCollection.js';
import Collection from 'ol/Collection.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js';
import BaseEvent from 'ol/events/Event.js';
import { primaryAction, shiftKeyOnly } from 'ol/events/condition.js';
import Observable, { unByKey } from 'ol/Observable.js';
import { squaredDistance, squaredDistanceToSegment } from 'ol/coordinate.js';
import { getCenter, createEmpty, extend } from 'ol/extent.js';
import Modal from 'modal-vanilla';
import { Mixin } from 'ts-mixer';
import Layer from 'ol/layer/Base.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { transformExtent } from 'ol/proj.js';
import { bbox } from 'ol/loadingstrategy.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import TileState from 'ol/TileState.js';
import { MultiPolygon, MultiLineString, MultiPoint, GeometryCollection, Polygon } from 'ol/geom.js';
import KML from 'ol/format/KML.js';
import WFS from 'ol/format/WFS.js';
import { Style, Stroke, Fill, Circle } from 'ol/style.js';
import BaseObject from 'ol/Object.js';
import Circle$1 from 'ol/geom/Circle.js';
import Feature from 'ol/Feature.js';
import { fromCircle } from 'ol/geom/Polygon.js';
import WFSCapabilities from 'ol-wfs-capabilities';
import Overlay from 'ol/Overlay.js';

// External
let options = {};
// Store layerNames that has errors
const isError = new Set();
const initModal = (opts) => {
    options = opts;
};
const parseError = (geoserverResponse) => {
    if ('exceptions' in geoserverResponse) {
        return geoserverResponse.exceptions
            .map((e) => e.text)
            .join(',');
    }
    else {
        return '';
    }
};
/**
 * Show modal with errors
 *
 * @param msg
 * @private
 */
const showError = (msg, originalError = null, layerName = '') => {
    // Prevent multiples modals error in the same layer
    if (isError.has(layerName)) {
        return;
    }
    isError.add(layerName);
    let err_msg = `<b>Error: ${msg}</b>`;
    if (originalError && originalError.message !== msg) {
        err_msg += `. ${originalError.message}`;
    }
    const al = Modal.alert(err_msg, options);
    al.show();
    al.on('hidden', () => {
        isError.delete(layerName);
    });
};

const es = {
    labels: {
        select: 'Seleccionar',
        selectBox: 'Seleccionar elementos dibujando una caja',
        selectFreehand: 'Seleccionar elementos dibujando a mano alzada',
        query: 'Consultar información del elemento',
        featureInfo: 'Información del elemento',
        addElement: 'Modo dibujo',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        upload: 'Subir',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        confirmDeleteElements: '¿Borrar los {} elementos?',
        geomTypeNotSupported: 'Geometría no compatible con la capa',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        continueLine: 'Continuar dibujando desde aquí',
        selectDrawType: 'Tipo de geometría para dibujar',
        uploadToLayer: 'Subir archivo a la capa seleccionada',
        uploadFeatures: 'Subida de elementos a la capa',
        validFeatures: 'Válidas',
        invalidFeatures: 'Invalidas',
        loading: 'Cargando...',
        toggleVisibility: 'Cambiar visibilidad de la capa',
        fullscreen: 'Pantalla completa',
        close: 'Cerrar',
        multipleValues: 'Valores múltiples',
        editElements: 'Editar elementos ({})',
        multipleEditNotice: 'Edición múltiple activada. Los cambios se aplicarán a los {} elementos seleccionados.',
        geoserverLayers: 'Capas de GeoServer'
    },
    errors: {
        capabilities: 'No se pudieron obtener las Capabilidades del GeoServer',
        wfst: 'El GeoServer no tiene soporte a Transacciones',
        layer: 'No se pudieron obtener datos de la capa',
        layerNotFound: 'Capa no encontrada',
        layerNotVisible: 'La capa no está visible',
        noValidGeometry: 'No se encontraron geometrías válidas para agregar a esta capa',
        geoserver: 'No se pudieron obtener datos desde el GeoServer',
        badFormat: 'Formato no soportado',
        badFile: 'Error al leer elementos del archivo',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer',
        transaction: 'Error al hacer transacción con el GeoServer',
        getFeatures: 'Error al obtener elemento desde el GeoServer'
    }
};

const en = {
    labels: {
        select: 'Select',
        selectBox: 'Select features by drawing a box',
        selectFreehand: 'Select features by freehand drawing',
        query: 'Query feature info',
        featureInfo: 'Feature info',
        addElement: 'Toggle Draw mode',
        editElement: 'Edit feature',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        apply: 'Apply changes',
        upload: 'Upload',
        editMode: 'Edit Mode',
        confirmDelete: 'Are you sure to delete the feature?',
        confirmDeleteElements: 'Delete the {} selected features?',
        geomTypeNotSupported: 'Geometry not supported by layer',
        editFields: 'Edit fields',
        editGeom: 'Edit geometry',
        continueLine: 'Continue drawing from here',
        selectDrawType: 'Geometry type to draw',
        uploadToLayer: 'Upload file to selected layer',
        uploadFeatures: 'Uploaded features to layer',
        validFeatures: 'Valid geometries',
        invalidFeatures: 'Invalid',
        loading: 'Loading...',
        toggleVisibility: 'Toggle layer visibility',
        fullscreen: 'Fullscreen',
        close: 'Close',
        multipleValues: 'Multiple values',
        editElements: 'Edit features ({})',
        multipleEditNotice: 'Multi-edit active. Changes will be applied to the {} selected features.',
        geoserverLayers: 'Geoserver Layers'
    },
    errors: {
        capabilities: 'GeoServer Capabilities could not be downloaded.',
        wfst: 'The GeoServer does not support Transactions',
        layer: 'Could not get data from layer',
        layerNotFound: 'Layer not found',
        layerNotVisible: 'Layer is not visible',
        noValidGeometry: 'No valid geometries found to add to this layer',
        geoserver: 'Failed to get data from GeoServer',
        badFormat: 'Unsupported format',
        badFile: 'Error reading items from file',
        lockFeature: 'Could not lock items on the GeoServer',
        transaction: 'Error when doing Transaction with GeoServer',
        getFeatures: 'Error getting elements from GeoServer'
    }
};

const zh = {
    labels: {
        select: '选择',
        selectBox: '框选元素',
        selectFreehand: '手绘选择元素',
        query: '查询元素信息',
        featureInfo: '元素信息',
        addElement: '切换绘图类型',
        editElement: '编辑元素',
        save: '保存',
        delete: '删除',
        cancel: '取消',
        apply: '确认并应用改变',
        upload: '上传',
        editMode: '编辑模式',
        confirmDelete: '确认删除元素?',
        confirmDeleteElements: '确认删除选中的 {} 个元素?',
        geomTypeNotSupported: '图层不支持该几何',
        editFields: '编辑区域',
        editGeom: '编辑几何',
        continueLine: '从此处继续绘制',
        selectDrawType: '几何类型',
        uploadToLayer: '通过文件上传图层',
        uploadFeatures: '上传元素到图层',
        validFeatures: '合法的几何类型',
        invalidFeatures: '不合法',
        loading: '加载中...',
        toggleVisibility: '切换图层透明度',
        fullscreen: '全屏',
        close: '关闭',
        multipleValues: '多个值',
        editElements: '编辑元素（{}）',
        multipleEditNotice: '多选编辑已激活。更改将应用于所有 {} 个选定元素。',
        geoserverLayers: 'GeoServer 图层'
    },
    errors: {
        capabilities: '无法加载GeoServer服务所支持的能力.',
        wfst: 'GeoServer不支持事务',
        layer: '无法从图层获得数据',
        layerNotFound: 'Layer not found',
        layerNotVisible: 'Layer is not visible',
        noValidGeometry: '不支持的几何类型无法加载到图层',
        geoserver: '无法从GeoServer获取数据',
        badFormat: '不支持的格式',
        badFile: '读取文件数据出错',
        lockFeature: '无法锁定GeoServer上的元素.',
        transaction: 'GeoServer处理事务出错.',
        getFeatures: '从GeoServer获取元素出错.'
    }
};

const langs = {
    es,
    en,
    zh
};
// Set default Language
let I18N = en;
const setLang = (lang = 'en', customI18n = null) => {
    // Check if language exists
    if (lang in langs) {
        I18N = langs[lang];
    }
    // Check if customs translations are provided
    if (customI18n) {
        I18N = Object.assign(Object.assign({}, I18N), customI18n);
    }
};
/**
 * /**
 * For translations thas has a variable "{}"" to be replaced inside
 * @param string
 * @param args
 * @returns
 */
const I18N_ = (string, ...args) => {
    var _a;
    let text = (_a = I18N.labels) === null || _a === void 0 ? void 0 : _a[string];
    if (!text) {
        text = I18N[string];
    }
    if (!text) {
        console.error('Translation not found', string);
        text = string;
    }
    if (args.length) {
        args.forEach((arg) => {
            text = text.replace(/{}/, arg);
        });
    }
    return text;
};

let loadingDiv;
const initLoading = () => {
    loadingDiv = document.createElement('div');
    loadingDiv.className = 'ol-wfst--tools-control--loading';
    loadingDiv.setAttribute('role', 'progressbar');
    loadingDiv.setAttribute('aria-label', I18N.labels.loading);
    return loadingDiv;
};
const showLoading = (bool = true) => {
    if (bool) {
        loadingDiv.classList.add('ol-wfst--tools-control--loading-show');
    }
    else {
        loadingDiv.classList.remove('ol-wfst--tools-control--loading-show');
    }
};

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
var TransactionType;
(function (TransactionType) {
    TransactionType["Insert"] = "insert";
    TransactionType["Delete"] = "delete";
    TransactionType["Update"] = "update";
})(TransactionType || (TransactionType = {}));

let map;
let layerToInsertElements = null;
let mode = null;
var Modes;
(function (Modes) {
    Modes["Edit"] = "EDIT";
    Modes["Draw"] = "DRAW";
    Modes["Query"] = "QUERY";
})(Modes || (Modes = {}));
var SelectionMode;
(function (SelectionMode) {
    SelectionMode["Single"] = "SINGLE";
    SelectionMode["Box"] = "BOX";
    SelectionMode["Freehand"] = "FREEHAND";
})(SelectionMode || (SelectionMode = {}));
let selectionMode = SelectionMode.Single;
function activateMode(m = null) {
    mode = m;
}
function getMode() {
    return mode;
}
function setSelectionMode(m) {
    selectionMode = m;
}
function getSelectionMode() {
    return selectionMode;
}
const editedFeatures = new Set();
const mapLayers = {};
function setMap(m) {
    map = m;
}
function getMap() {
    return map;
}
function setActiveLayerToInsertEls(layer) {
    layerToInsertElements = layer;
}
function getActiveLayerToInsertEls() {
    return layerToInsertElements;
}
function setMapLayers(data) {
    Object.assign(mapLayers, data);
}
function getStoredMapLayers() {
    return mapLayers;
}
function getStoredLayer(layerName) {
    return getStoredMapLayers()[layerName];
}
function addFeatureToEditedList(feature) {
    editedFeatures.add(String(feature.getId()));
}
function removeFeatureFromEditList(feature) {
    editedFeatures.delete(String(feature.getId()));
}
function isFeatureEdited(feature) {
    return editedFeatures.has(String(feature.getId()));
}

/**
 * Base class from which all layer types are derived.
 */
class BaseLayer extends Layer {
    /**
     * Initialize the layer: request DescribeFeatureType and resolve when it
     * finishes (whether successful or not).
     *
     * @private
     * @returns Promise that resolves when the layer is initialized
     */
    async _init() {
        const geoserver = this.getGeoserver();
        if (geoserver.isLoaded()) {
            await this.getAndUpdateDescribeFeatureType();
        }
        else {
            await new Promise((resolve) => {
                geoserver.once('change:capabilities', async () => {
                    await this.getAndUpdateDescribeFeatureType();
                    resolve();
                });
            });
        }
    }
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     */
    async getAndUpdateDescribeFeatureType() {
        const layerName = this.get(BaseLayerProperty.NAME);
        const layerLabel = this.get(BaseLayerProperty.LABEL);
        try {
            const geoserver = this.getGeoserver();
            const params = new URLSearchParams({
                service: 'wfs',
                version: geoserver.getAdvanced().describeFeatureTypeVersion,
                request: 'DescribeFeatureType',
                typeName: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });
            const url_fetch = geoserver.getUrl() + '?' + params.toString();
            const response = await fetch(url_fetch, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });
            if (!response.ok) {
                throw new Error('');
            }
            const data = await response.json();
            if (!data) {
                throw new Error('');
            }
            if (data.exceptions) {
                throw new Error(parseError(data));
            }
            const targetNamespace = data.targetNamespace;
            const properties = data.featureTypes[0].properties;
            // Find the geometry field
            const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);
            data._parsed = {
                namespace: targetNamespace,
                properties: properties,
                geomType: geom.localType,
                geomField: geom.name
            };
            this.set(BaseLayerProperty.DESCRIBEFEATURETYPE, data);
        }
        catch (err) {
            console.error(err);
            showError(`${I18N.errors.layer} "${layerLabel}"`, err, layerName);
        }
    }
    /**
     * @public
     * @returns
     */
    isVisibleByZoom() {
        return getMap().getView().getZoom() > this.getMinZoom();
    }
    /**
     *
     * @param mode
     * @param features
     * @public
     */
    async transactFeatures(mode, features) {
        const geoserver = this.getGeoserver();
        return geoserver.transact(mode, features, this.get(BaseLayerProperty.NAME));
    }
    async insertFeatures(features) {
        return this.transactFeatures(TransactionType.Insert, features);
    }
    /**
     * @public
     * @param featureIds
     * @returns
     */
    async maybeLockFeature(featureIds) {
        const geoserver = this.getGeoserver();
        if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
            return await geoserver.lockFeature(featureIds, this.get(BaseLayerProperty.NAME));
        }
        return null;
    }
    /**
     *
     * @returns
     * @public
     */
    getGeoserver() {
        return this.get(BaseLayerProperty.GEOSERVER);
    }
    /**
     *
     * @returns
     * @public
     */
    getDescribeFeatureType() {
        return this.get(BaseLayerProperty.DESCRIBEFEATURETYPE);
    }
}
var BaseLayerProperty;
(function (BaseLayerProperty) {
    BaseLayerProperty["NAME"] = "name";
    BaseLayerProperty["LABEL"] = "label";
    BaseLayerProperty["DESCRIBEFEATURETYPE"] = "describeFeatureType";
    BaseLayerProperty["ISVISIBLE"] = "isVisible";
    BaseLayerProperty["GEOSERVER"] = "geoserver";
})(BaseLayerProperty || (BaseLayerProperty = {}));

/**
 * Layer source to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @extends {ol/source/Vector~VectorSource}
 * @param options
 */
class WfsSource extends VectorSource {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { format: new GeoJSON(), loader: (extent, resolution, projection, success, failure) => {
                void (async () => {
                    try {
                        // If bbox, add extent to the request
                        if (options.strategy == bbox) {
                            const extentGeoServer = transformExtent(extent, projection.getCode(), options.geoServerAdvanced.projection);
                            // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                            // request features using a bounding box with CRS maybe different from featureTypes native CRS
                            this.urlParams.set('bbox', extentGeoServer.toString() +
                                `,${options.geoServerAdvanced.projection}`);
                        }
                        const url_fetch = options.geoserverUrl +
                            '?' +
                            this.urlParams.toString();
                        const response = await fetch(url_fetch, {
                            headers: options.headers,
                            credentials: options.credentials
                        });
                        if (!response.ok) {
                            throw new Error('');
                        }
                        const data = await response.json();
                        if (data.exceptions) {
                            throw new Error(parseError(data));
                        }
                        const features = this.getFormat().readFeatures(data, {
                            featureProjection: projection.getCode(),
                            dataProjection: options.geoServerAdvanced.projection
                        });
                        features.forEach((feature) => {
                            feature.set('_layerName_', options.name, 
                            /* silent = */ true);
                        });
                        this.addFeatures(features);
                        success(features);
                    }
                    catch (err) {
                        this.removeLoadedExtent(extent);
                        showError(I18N.errors.geoserver, err, options.name);
                        failure();
                    }
                })();
            } }));
        this.urlParams = new URLSearchParams({
            SERVICE: 'wfs',
            REQUEST: 'GetFeature',
            OUTPUTFORMAT: 'application/json',
            EXCEPTIONS: 'application/json'
        });
        this.urlParams.set('version', options.geoServerAdvanced.getFeatureVersion);
        this.urlParams.set('typename', options.name);
        this.urlParams.set('srsName', options.geoServerAdvanced.projection.toString());
    }
}

/**
 * Layer to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Vector~VectorLayer}
 * @param options
 */
class WfsLayer extends Mixin(BaseLayer, (VectorLayer)) {
    constructor(options) {
        super(Object.assign({ name: options.name, label: options.label || options.name, minZoom: options.minZoom }, options));
        this._loadingCount = 0;
        this._loadedCount = 0;
        if (options.beforeTransactFeature) {
            this.beforeTransactFeature = options.beforeTransactFeature;
        }
        const geoserver = options.geoserver;
        const source = new WfsSource(Object.assign(Object.assign({ name: options.name, headers: geoserver.getHeaders(), credentials: geoserver.getCredentials(), geoserverUrl: geoserver.getUrl(), geoServerAdvanced: geoserver.getAdvanced() }, (options.strategy && { strategy: options.strategy })), { geoserverVendor: options.geoserverVendor }));
        this._loadingCount = 0;
        this._loadedCount = 0;
        source.on('featuresloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                showLoading();
            }
        });
        source.on(['featuresloadend', 'featuresloaderror'], () => {
            this._loadedCount++;
            if (this._loadingCount === this._loadedCount) {
                this._loadingCount = 0;
                this._loadedCount = 0;
                setTimeout(() => {
                    this.dispatchEvent('layerRendered');
                }, 300);
            }
        });
        this.setSource(source);
        const geoserverOptions = options.geoserverVendor;
        Object.keys(geoserverOptions).forEach((param) => {
            source.urlParams.set(param, geoserverOptions[param]);
        });
    }
    /**
     * @public
     */
    refresh() {
        const source = this.getSource();
        // Refrescamos el wms
        source.refresh();
    }
    /**
     * Use this to update Geoserver Wms Vendors (https://docs.geoserver.org/latest/en/user/services/wms/vendor.html)
     * and other arguements (https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getmap)
     * in all the getMap requests.
     *
     * Example: you can use this to change the style of the WMS, add a custom sld, set a cql_filter, etc.
     *
     * @public
     * @param paramName
     * @param value Use `undefined` or `null` to remove the param
     * @param refresh
     */
    setCustomParam(paramName, value = null, refresh = true) {
        const source = this.getSource();
        if (value === undefined || value === null) {
            source.urlParams.delete(paramName);
        }
        else {
            source.urlParams.set(paramName, value);
        }
        if (refresh) {
            this.refresh();
        }
        return source.urlParams;
    }
}

/**
 * Layer source to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @extends {ol/source/TieWMS~TileWMS}
 * @param options
 */
class WmsSource extends TileWMS {
    constructor(options) {
        super(Object.assign({ url: options.geoserverUrl, serverType: 'geoserver', params: Object.assign({ SERVICE: 'wms', TILED: true, LAYERS: options.name, EXCEPTIONS: 'application/json' }, (options.geoserverVendor && options.geoserverVendor)), tileLoadFunction: async (tile, src) => {
                const blobToJson = (blob) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(JSON.parse(reader.result));
                        reader.readAsText(blob);
                    });
                };
                try {
                    const response = await fetch(src, {
                        headers: options.headers,
                        credentials: options.credentials
                    });
                    if (!response.ok) {
                        throw new Error('');
                    }
                    let data = await response.blob();
                    // Check if the response has an error
                    if (data.type == 'application/json') {
                        const parsedError = await blobToJson(data);
                        throw new Error(parseError(parsedError));
                    }
                    tile.getImage().src =
                        URL.createObjectURL(data);
                    tile.setState(TileState.LOADED);
                }
                catch (err) {
                    showError(I18N.errors.geoserver, err, options.name);
                    tile.setState(TileState.ERROR);
                }
            } }, options));
    }
}

/**
 * Layer to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Tile~TileLayer}
 * @param options
 */
class WmsLayer extends Mixin(BaseLayer, (TileLayer)) {
    constructor(options) {
        super(Object.assign({ name: options.name, label: options.label || options.name, minZoom: options.minZoom }, options));
        this._loadingCount = 0;
        this._loadedCount = 0;
        /**
         * Return the full accuracy geometries to replace the features from GetFeatureInfo
         * @param featuresId
         * @returns
         */
        this._getFullResGeometryById = async (featuresId) => {
            const queryParams = new URLSearchParams({
                SERVICE: 'wfs',
                VERSION: '2.0.0',
                INFO_FORMAT: 'application/json',
                REQUEST: 'GetFeature',
                TYPENAME: this.get('name'),
                MAXFEATURES: String(featuresId.length),
                OUTPUTFORMAT: 'application/json',
                SRSNAME: getMap().getView().getProjection().getCode(),
                FEATUREID: featuresId.join(',')
            });
            const url = this.getSource().getUrls()[0] + '?' + queryParams.toString();
            try {
                const geoserver = this.getGeoserver();
                const response = await fetch(url, {
                    headers: geoserver.getHeaders(),
                    credentials: geoserver.getCredentials()
                });
                if (!response.ok) {
                    throw new Error(`${I18N.errors.getFeatures} ${response.status}`);
                }
                const data = await response.json();
                const fullById = {};
                this._parseFeaturesFromResponse(data).forEach((feature) => {
                    fullById[String(feature.getId())] = feature;
                });
                return featuresId.map((id) => fullById[String(id)]).filter(Boolean);
            }
            catch (err) {
                console.error(err);
                return false;
            }
        };
        if (options.beforeTransactFeature) {
            this.beforeTransactFeature = options.beforeTransactFeature;
        }
        if (options.beforeShowFieldsModal) {
            this.beforeShowFieldsModal = options.beforeShowFieldsModal;
        }
        this._formatGeoJSON = new GeoJSON();
        const geoserver = options.geoserver;
        const source = new WmsSource({
            name: options.name,
            headers: geoserver.getHeaders(),
            credentials: geoserver.getCredentials(),
            geoserverUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            geoserverVendor: options.geoserverVendor
        });
        this._loadingCount = 0;
        this._loadedCount = 0;
        source.on('tileloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                showLoading();
            }
        });
        source.on(['tileloadend', 'tileloaderror'], () => {
            this._loadedCount++;
            if (this._loadingCount === this._loadedCount) {
                this._loadingCount = 0;
                this._loadedCount = 0;
                setTimeout(() => {
                    this.dispatchEvent('layerRendered');
                }, 300);
            }
        });
        this.setSource(source);
    }
    /**
     * Get the features on the click area
     * @param evt
     * @returns
     * @private
     */
    async _getFeaturesByClickEvent(evt) {
        const coordinate = evt.coordinate;
        const view = getMap().getView();
        // Si la vista es lejana, disminumos el buffer
        // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
        // y mejorar la sensibilidad en IOS
        const buffer = view.getZoom() > 10 ? 10 : 5;
        const source = this.getSource();
        // Fallback to support a bad name
        // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
        const fallbackOl5 = 'getFeatureInfoUrl' in source
            ? 'getFeatureInfoUrl'
            : 'getGetFeatureInfoUrl';
        const url = source[fallbackOl5](coordinate, view.getResolution(), view.getProjection().getCode(), {
            INFO_FORMAT: 'application/json',
            BUFFER: buffer,
            FEATURE_COUNT: 1,
            EXCEPTIONS: 'application/json'
        });
        return this._requestFeatures(url);
    }
    /**
     * Request the WFS features that intersect the given geometry, selecting
     * them with a WFS GetFeature + CQL INTERSECTS filter. Used to select
     * features from a WMS layer with a box or a freehand lasso.
     *
     * @param geometry Geometry in the map view projection
     * @returns
     * @private
     */
    async _getFeaturesInGeometry(geometry) {
        var _a, _b, _c;
        // Make sure the DescribeFeatureType is loaded to get the geometry
        // field, waiting for it if the layer is still initializing
        if (!this.getDescribeFeatureType()) {
            await this.getAndUpdateDescribeFeatureType();
        }
        const geomField = (_b = (_a = this.getDescribeFeatureType()) === null || _a === void 0 ? void 0 : _a._parsed) === null || _b === void 0 ? void 0 : _b.geomField;
        if (!geomField) {
            showError(`${I18N.errors.layer} "${this.get('name')}"`);
            return [];
        }
        const viewProj = getMap().getView().getProjection().getCode();
        const nativeSrs = this._getNativeSrs();
        // Work on a copy transformed to the layer native projection so the
        // server evaluates the INTERSECTS filter against the proper SRID
        const polygon = geometry.clone();
        if (nativeSrs !== viewProj) {
            try {
                polygon.transform(viewProj, nativeSrs);
            }
            catch (err) {
                console.error(err);
            }
        }
        const ring = polygon.getCoordinates()[0] || [];
        const ringWkt = ring.map(([x, y]) => `${x} ${y}`).join(', ');
        // Force the filter geometry CRS with the EWKT SRID prefix so the
        // server evaluates the INTERSECTS against the layer projection
        // instead of its native storage SRS
        const sridMatch = (_c = nativeSrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i)) !== null && _c !== void 0 ? _c : nativeSrs.match(/(\d+)$/);
        const cql = sridMatch
            ? `INTERSECTS(${geomField}, SRID=${sridMatch[1]};POLYGON((${ringWkt})))`
            : `INTERSECTS(${geomField}, POLYGON((${ringWkt})))`;
        const queryParams = new URLSearchParams({
            SERVICE: 'wfs',
            VERSION: '2.0.0',
            REQUEST: 'GetFeature',
            TYPENAME: this.get('name'),
            OUTPUTFORMAT: 'application/json',
            SRSNAME: viewProj,
            CQL_FILTER: cql
        });
        const url = this.getSource().getUrls()[0] + '?' + queryParams.toString();
        // The server returns the features in the map view projection (same as
        // the full resolution request), so no further transformation is needed
        return this._requestFeatures(url);
    }
    /**
     * Resolve the layer native SRS so spatial filters are evaluated in the
     * correct projection. It reads the DefaultCRS from the WFS capabilities,
     * falling back to the geoserver advanced projection option and finally to
     * the map view projection.
     *
     * @returns
     * @private
     */
    _getNativeSrs() {
        var _a;
        const geoserver = this.getGeoserver();
        const viewProj = getMap().getView().getProjection().getCode();
        const layerName = String(this.get('name') || '');
        const layerLocalName = layerName.split(':').pop();
        const featureTypeList = (_a = geoserver.getParsedCapabilities()) === null || _a === void 0 ? void 0 : _a.FeatureTypeList;
        const featureType = Array.isArray(featureTypeList)
            ? featureTypeList.find((ft) => {
                const featureTypeName = String((ft === null || ft === void 0 ? void 0 : ft.Name) || '');
                return (featureTypeName === layerName ||
                    featureTypeName === layerLocalName ||
                    featureTypeName.split(':').pop() === layerLocalName);
            })
            : undefined;
        const defaultCrs = (featureType === null || featureType === void 0 ? void 0 : featureType.DefaultCRS)
            ? String(featureType.DefaultCRS)
            : '';
        const epsgMatch = defaultCrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i);
        if (epsgMatch) {
            return `EPSG:${epsgMatch[1]}`;
        }
        const advanced = geoserver.getAdvanced().projection;
        if (advanced) {
            return String(advanced);
        }
        return viewProj;
    }
    /**
     * Fetch and parse the features from a request url, replacing the
     * low resolution geometries (GetFeatureInfo) with the full resolution
     * ones requested by FEATUREID when possible.
     *
     * @param url
     * @returns
     * @private
     */
    async _requestFeatures(url) {
        const geoserver = this.getGeoserver();
        try {
            const response = await fetch(url, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });
            if (!response.ok) {
                throw new Error(`${I18N.errors.getFeatures} ${response.status}`);
            }
            const data = await response.json();
            let features = this._parseFeaturesFromResponse(data);
            const featuresId = features.map((f) => f.getId());
            if (!featuresId.length) {
                return [];
            }
            const fullResList = await this._getFullResGeometryById(featuresId);
            if (fullResList) {
                features = fullResList;
            }
            return features;
        }
        catch (err) {
            showError(err.message, err);
        }
    }
    _parseFeaturesFromResponse(data) {
        return this._formatGeoJSON.readFeatures(data);
    }
    /**
     * @public
     */
    refresh() {
        const source = this.getSource();
        // Refrescamos el wms
        source.refresh();
        // Force refresh the tiles
        const params = source.getParams();
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }
    /**
     * Use this to update Geoserver Wfs Vendors (https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html)
     * and other arguements (https://docs.geoserver.org/stable/en/user/services/wfs/reference.html)
     * in all the getFeature requests.
     *
     * Example: you can use this to set a cql_filter, limit the numbers of features, etc.
     *
     * @public
     * @param paramName
     * @param value
     * @param refresh
     */
    setCustomParam(paramName, value = null, refresh = true) {
        const source = this.getSource();
        source.updateParams({
            [paramName]: value
        });
        if (refresh) {
            this.refresh();
        }
        return source.getParams();
    }
}

function createElement(tagName, props) {
    props = props || {};
    let children = props.children || [];
    children = Array.isArray(children) ? children : [children];
    delete props.children;
    if (typeof tagName === 'function') {
        return tagName(props, children);
    }
    const elem = tagName === 'fragment'
        ? document.createDocumentFragment()
        : document.createElement(tagName);
    if (elem instanceof HTMLElement) {
        Object.entries(props).forEach(([name, value]) => {
            if (value != null) {
                // listener
                if (name.startsWith('on') && typeof value === 'function') {
                    elem.addEventListener(name
                        .slice(2)
                        .toLowerCase(), value);
                }
                else if (name === 'className') {
                    elem.setAttribute('class', value.toString());
                }
                else if (name === 'htmlFor') {
                    elem.setAttribute('for', value.toString());
                }
                else {
                    elem.setAttribute(name, value.toString());
                }
            }
        });
    }
    for (const child of children) {
        if (!child) {
            continue;
        }
        if (Array.isArray(child)) {
            elem.append(...child);
        }
        else if (child instanceof Node) {
            elem.appendChild(child);
        }
        else {
            elem.innerHTML += child;
        }
    }
    return elem;
}
function jsx(type, props) {
    return createElement(type, props);
}
function jsxs(type, props) {
    return createElement(type, props);
}
function Fragment(type, children) {
    return createElement('fragment', { children });
}

function uploadSvg() {
	return (new DOMParser().parseFromString("\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\">\r\n<path d=\"M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

function drawSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\r\n    <path d=\"M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function selectSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"289\" height=\"448\" viewBox=\"0 0 289 448\">\r\n    <path d=\"M283.25 260.75c4.75 4.5 6 11.5 3.5 17.25-2.5 6-8.25 10-14.75 10h-95.5l50.25 119c3.5 8.25-0.5 17.5-8.5 21l-44.25 18.75c-8.25 3.5-17.5-0.5-21-8.5l-47.75-113-78 78c-3 3-7 4.75-11.25 4.75-2 0-4.25-0.5-6-1.25-6-2.5-10-8.25-10-14.75v-376c0-6.5 4-12.25 10-14.75 1.75-0.75 4-1.25 6-1.25 4.25 0 8.25 1.5 11.25 4.75z\"></path>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
}

function selectBoxSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"1.5\" fill=\"none\" stroke=\"#000\" stroke-width=\"2\" stroke-dasharray=\"4 2\"></rect>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function selectFreehandSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M4.59 6.89c.7-.71 1.4-1.35 1.71-1.22.5.2 0 1.03-.3 1.52-.25.42-2.86 3.89-2.86 6.31 0 1.28.48 2.34 1.34 2.98.75.56 1.74.73 2.64.46 1.07-.31 1.95-1.4 3.06-2.77 1.21-1.49 2.83-3.44 4.08-3.44 1.63 0 1.65 1.01 1.76 1.79-3.78.64-5.38 3.67-5.38 5.37 0 1.7 1.44 3.09 3.21 3.09 1.63 0 4.29-1.33 4.69-6.1H21v-2.5h-2.47c-.15-1.65-1.09-4.2-4.03-4.2-2.25 0-4.18 1.91-4.94 2.84-.58.73-2.06 2.48-2.29 2.72-.25.3-.68.84-1.11.84-.45 0-.72-.83-.36-1.92.35-1.09 1.4-2.86 1.85-3.52.78-1.14 1.3-1.92 1.3-3.28C8.95 3.69 7.31 3 6.44 3 5.12 3 3.97 4 3.72 4.25c-.36.36-.66.66-.88.93l1.75 1.71zm9.29 11.66c-.31 0-.74-.26-.74-.72 0-.6.73-2.2 2.87-2.76-.3 2.69-1.43 3.48-2.13 3.48z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function infoSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function visibilityOnSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\n<path d=\"M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z\"></path>\n</svg>\n", 'image/svg+xml')).firstChild;
}

function visibilityOffSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"768\" height=\"768\" viewBox=\"0 0 768 768\">\n<path d=\"M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z\"></path>\n</svg>\n", 'image/svg+xml')).firstChild;
}

/**
 * Removes in the DOM the class of the tools
 * @private
 */
const resetStateButtons = () => {
    const activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }
};
const activateModeButtons = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
    if (btn) {
        btn.classList.add('wfst--active');
    }
    deactivateQueryButton();
};
const activateQueryButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};
const deactivateQueryButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
    if (btn) {
        btn.classList.remove('wfst--active');
    }
};
const activateDrawButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};
const activateSelectModeButton = (mode) => {
    const activeBtn = document.querySelector('.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active');
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }
    deactivateQueryButton();
    const btnMap = {
        [SelectionMode.Single]: '.ol-wfst--tools-control-btn-select',
        [SelectionMode.Box]: '.ol-wfst--tools-control-btn-select-box',
        [SelectionMode.Freehand]: '.ol-wfst--tools-control-btn-select-freehand'
    };
    const btn = document.querySelector(btnMap[mode]);
    if (btn) {
        btn.classList.add('wfst--active');
    }
};
const deactivateSelectModeButton = () => {
    const activeBtn = document.querySelector('.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active');
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }
    deactivateQueryButton();
};
class LayersControl extends Observable {
    constructor(uploads, uploadFormats) {
        super();
        this._uploads = uploads;
        this._uploadFormats = uploadFormats;
    }
    /**
     *
     * @param layer
     * @public
     */
    addLayerEl(layer) {
        const container = document.querySelector('.wfst--tools-control--select-layers-list');
        const layerName = layer.get(BaseLayerProperty.NAME);
        const checked = layer === getActiveLayerToInsertEls() ? { checked: true } : {};
        const input = (jsx("input", Object.assign({ value: layerName, id: `wfst--${layerName}`, type: "radio", className: "ol-wfst--tools-control-input", name: "wfst--select-layer" }, checked, { onChange: (evt) => this._layerChangeHandler(evt, layer) })));
        const layerDom = (jsx("div", { className: `wfst--layer-control 
                            ${layer.getVisible() ? 'ol-wfst--visible-on' : ''}
                            ${layer === getActiveLayerToInsertEls()
                ? 'ol-wfst--selected-on'
                : ''}`, "data-layer": layerName, children: jsxs("label", { htmlFor: `wfst--${layerName}`, children: [jsxs("div", { className: "ol-wfst--tools-control-visible", children: [jsx("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt), children: visibilityOnSvg() }), jsx("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt), children: visibilityOffSvg() })] }), input, jsx("span", { title: `${layer instanceof WfsLayer ? 'WFS' : 'WMS'} - ${layer.getDescribeFeatureType()._parsed.geomType}`, children: layer.get(BaseLayerProperty.LABEL) })] }) }));
        container.appendChild(layerDom);
        if (layer === getActiveLayerToInsertEls()) {
            input.dispatchEvent(new Event('change'));
        }
        return layerDom;
    }
    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     * @private
     */
    _changeStateSelect(layer, geomDrawTypeSelected = null) {
        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         * @private
         */
        const setSelectState = (value, options) => {
            Array.from(selectDraw.options).forEach((option) => {
                option.selected = option.value === value ? true : false;
                option.disabled =
                    options === 'all'
                        ? false
                        : options.includes(option.value)
                            ? false
                            : true;
                option.title = option.disabled
                    ? I18N.labels.geomTypeNotSupported
                    : '';
            });
        };
        const selectDraw = document.querySelector('.wfst--tools-control--select-draw');
        let drawType;
        if (selectDraw) {
            const geomLayer = layer.getDescribeFeatureType()._parsed.geomType;
            if (geomDrawTypeSelected) {
                drawType = selectDraw.value;
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
                    selectDraw.value = drawType;
                }
                else {
                    drawType = geomLayer;
                    setSelectState(drawType, [geomLayer]);
                }
            }
        }
        return drawType;
    }
    _visibilityClickHandler(evt) {
        const btn = evt.currentTarget;
        const parentDiv = btn.closest('.wfst--layer-control');
        const layerName = parentDiv.dataset['layer'];
        parentDiv.classList.toggle('ol-wfst--visible-on');
        const layer = getStoredMapLayers()[layerName];
        if (parentDiv.classList.contains('ol-wfst--visible-on')) {
            layer.setVisible(true);
        }
        else {
            layer.setVisible(false);
        }
    }
    /**
     * Called when a layer is selected in the widget
     * @param evt
     * @param layer
     */
    _layerChangeHandler(evt, layer) {
        const selected = document.querySelector('.ol-wfst--selected-on');
        const parentDiv = evt.currentTarget.closest('.wfst--layer-control');
        // Deselect DOM previous layer
        selected.classList.remove('ol-wfst--selected-on');
        // Select this layer
        parentDiv.classList.add('ol-wfst--selected-on');
        setActiveLayerToInsertEls(layer);
        this._changeStateSelect(layer);
        this.dispatchEvent('changeLayer');
    }
    render() {
        return (jsxs(Fragment, { children: [jsxs("div", { className: "wfst--tools-control--head", children: [jsxs("div", { className: "ol-wfst--tools-control-select-cnt", children: [jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select wfst--active", type: "button", title: I18N.labels.select, onClick: () => {
                                        this.dispatchEvent('selectModeSingle');
                                    }, children: selectSvg() }), jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-box", type: "button", title: I18N.labels.selectBox, onClick: () => {
                                        this.dispatchEvent('selectModeBox');
                                    }, children: selectBoxSvg() }), jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-freehand", type: "button", title: I18N.labels.selectFreehand, onClick: () => {
                                        this.dispatchEvent('selectModeFreehand');
                                    }, children: selectFreehandSvg() })] }), jsx("div", { className: "ol-wfst--tools-control-query-cnt", children: jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-query", type: "button", title: I18N.labels.query, onClick: () => {
                                    this.dispatchEvent('queryMode');
                                }, children: infoSvg() }) }), jsxs("div", { className: "ol-wfst--tools-control-draw-cnt", children: [jsx("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw", type: "button", title: I18N.labels.addElement, onClick: () => {
                                        this.dispatchEvent('drawMode');
                                    }, children: drawSvg() }), jsx("select", { title: I18N.labels.selectDrawType, className: "wfst--tools-control--select-draw", onChange: (evt) => {
                                        const selectedValue = evt.target.value;
                                        this._changeStateSelect(getActiveLayerToInsertEls(), selectedValue);
                                        this.dispatchEvent('changeGeom');
                                    }, children: [
                                        GeometryType.Point,
                                        GeometryType.MultiPoint,
                                        GeometryType.LineString,
                                        GeometryType.MultiLineString,
                                        GeometryType.Polygon,
                                        GeometryType.MultiPolygon,
                                        GeometryType.Circle
                                    ].map((type) => {
                                        // Show all options, but enable only the accepted ones
                                        return jsx("option", { value: type, children: type });
                                    }) })] }), this._uploads && (jsxs("div", { children: [jsx("input", { id: "ol-wfst--upload", type: "file", accept: this._uploadFormats, onChange: (evt) => this._uploads.process(evt) }), jsx("label", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload", htmlFor: "ol-wfst--upload", title: I18N.labels.uploadToLayer, children: uploadSvg() })] }))] }), jsxs("div", { className: "wfst--tools-control--select-layers", children: [jsx("div", { className: "wfst--tools-control--select-layers-title", children: I18N.labels.geoserverLayers }), jsx("div", { className: "wfst--tools-control--select-layers-list" })] })] }));
    }
}

let editLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 100
});
const getEditLayer = () => {
    return editLayer;
};

// Ol
class Uploads extends Observable {
    constructor(options) {
        super();
        this._options = options;
        this._processUpload = options.processUpload;
        // Formats
        this._formatWFS = new WFS();
        this._formatGeoJSON = new GeoJSON();
        this._formatKml = new KML({
            extractStyles: false,
            showPointNames: false
        });
        this._xs = new XMLSerializer();
    }
    /**
     * Parse and check geometry of uploaded files
     *
     * @param evt
     * @public
     */
    async process(evt) {
        const map = getMap();
        const view = map.getView();
        const file = evt.target.files[0];
        let features;
        if (!file) {
            return;
        }
        const extension = file.name.split('.').pop().toLowerCase();
        try {
            // If the user uses a custom fucntion...
            if (this._processUpload) {
                features = this._processUpload(file);
            }
            // If the user functions return features, we dont process anything more
            if (!features) {
                const string = await this._fileReader(file);
                if (extension === 'geojson' || extension === 'json') {
                    features = this._formatGeoJSON.readFeatures(string, {
                        featureProjection: view.getProjection().getCode()
                    });
                }
                else if (extension === 'kml') {
                    features = this._formatKml.readFeatures(string, {
                        featureProjection: view.getProjection().getCode()
                    });
                }
                else {
                    showError(I18N.errors.badFormat);
                }
            }
            let invalidFeaturesCount = 0;
            let validFeaturesCount = 0;
            const featuresToInsert = [];
            for (let feature of features) {
                // If the geometry doesn't correspond to the layer, try to fixit.
                // If we can't, don't use it
                if (!this._checkGeometry(feature)) {
                    feature = this._fixGeometry(feature);
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
                showError(I18N.errors.noValidGeometry);
            }
            else {
                resetStateButtons();
                this.dispatchEvent(new VectorSourceEvent('loadedFeatures', null, featuresToInsert));
                const content = `
            ${I18N.labels.validFeatures}: ${validFeaturesCount}<br>
            ${invalidFeaturesCount
                    ? `${I18N.labels.invalidFeatures}: ${invalidFeaturesCount}`
                    : ''}`;
                this._initModal(content, featuresToInsert);
            }
            // Reset the input to allow another onChange trigger
            evt.target.value = null;
        }
        catch (err) {
            showError(I18N.errors.badFile, err);
        }
    }
    /**
     * Read data file
     * @param file
     * @public
     */
    async _fileReader(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', async (e) => {
                const fileData = e.target.result;
                resolve(fileData);
            });
            reader.addEventListener('error', (err) => {
                console.error('Error' + err);
                reject();
            });
            reader.readAsText(file);
        });
    }
    /**
     * Attemp to change the geometry feature to the layer
     * @param feature
     * @private
     */
    _fixGeometry(feature) {
        // Geometry of the layer
        const geomTypeLayer = getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
            .geomType;
        const geomTypeFeature = feature.getGeometry().getType();
        let geom;
        switch (geomTypeFeature) {
            case GeometryType.Point: {
                if (geomTypeLayer === GeometryType.MultiPoint) {
                    const coords = feature.getGeometry().getCoordinates();
                    geom = new MultiPoint([coords]);
                }
                break;
            }
            case GeometryType.LineString:
                if (geomTypeLayer === GeometryType.MultiLineString) {
                    const coords = feature.getGeometry().getCoordinates();
                    geom = new MultiLineString([coords]);
                }
                break;
            case GeometryType.Polygon:
                if (geomTypeLayer === GeometryType.MultiPolygon) {
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
    }
    /**
     * Check if the feature has the same geometry as the target layer
     * @param feature
     * @private
     */
    _checkGeometry(feature) {
        // Geometry of the layer
        const geomTypeLayer = getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
            .geomType;
        const geomTypeFeature = feature.getGeometry().getType();
        // This geom accepts every type of geometry
        if (geomTypeLayer === GeometryType.GeometryCollection) {
            return true;
        }
        return geomTypeFeature === geomTypeLayer;
    }
    /**
     * Confirm modal before transact to the GeoServer the features in the file
     *
     * @param content
     * @param featuresToInsert
     * @private
     */
    _initModal(content, featuresToInsert) {
        const footer = `
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
            ${I18N.labels.cancel}
        </button>
        <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
            ${I18N.labels.upload}
        </button>
    `;
        const modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: false, title: I18N.labels.uploadFeatures +
                ' ' +
                getActiveLayerToInsertEls().get(BaseLayerProperty.NAME), content: content, backdrop: 'static', footer: footer })).show();
        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                this.dispatchEvent(new VectorSourceEvent('addedFeatures', null, featuresToInsert));
            }
            else {
                // On cancel button
                getEditLayer().getSource().clear();
            }
        });
    }
}

/**
 * @param target
 * @param sources
 * @returns
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

const DEFAULT_LANGUAGE = 'en';
const getDefaultOptions = () => {
    return {
        layers: null,
        evtType: 'singleclick',
        active: true,
        showControl: true,
        fullscreen: true,
        language: DEFAULT_LANGUAGE,
        uploadFormats: '.geojson,.json,.kml',
        processUpload: null,
        modal: {
            animateClass: 'fade',
            animateInClass: 'show',
            transition: 300,
            backdropTransition: 150,
            templates: {
                dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${I18N.labels.close}"><span aria-hidden="true">×</span></button>`
            }
        }
    };
};

class EditControlChangesEl extends Control {
    constructor(features) {
        super({
            element: (jsx("div", { className: "ol-wfst--changes-control", children: jsxs("div", { className: "ol-wfst--changes-control-el", children: [jsxs("div", { className: "ol-wfst--changes-control-id", children: [jsx("b", { children: I18N.labels.editMode }), " -", ' ', jsx("i", { children: features.length > 1
                                        ? I18N_('editElements', features.length)
                                        : String(features[0].getId()) })] }), jsx("button", { type: "button", className: "btn btn-sm btn-secondary", onClick: () => {
                                this._dispatch('cancel', features);
                            }, children: I18N.labels.cancel }), jsx("button", { type: "button", className: "btn btn-sm btn-primary", onClick: () => {
                                this._dispatch('apply', features);
                            }, children: I18N.labels.apply }), jsx("button", { type: "button", className: "btn btn-sm btn-danger-outline", onClick: () => {
                                this._dispatch('delete', features);
                            }, children: I18N.labels.delete })] }) }))
        });
    }
    _dispatch(type, features) {
        const evt = new VectorSourceEvent(type, features[0]);
        evt.features = features;
        this.dispatchEvent(evt);
    }
}

// Ol
/**
 * Modern vertex handle mimicking the round "extend line" buttons shown at
 * line endpoints: a soft halo for depth and a white disc with a subtle
 * border. When `highlighted` is `true` (e.g. hovering a vertex with the
 * Modify interaction) the handle gets bigger with a stronger halo and a
 * darker border.
 *
 * @param highlighted Whether to render the bigger/highlighted state
 * @param geometry Style geometry function to position the handles
 * @private
 */
const editVertexStyles = (highlighted = false, geometry) => {
    const halo = highlighted ? 10 : 8;
    const haloColor = highlighted
        ? 'rgba(0, 0, 0, 0.40)'
        : 'rgba(0, 0, 0, 0.28)';
    const radius = highlighted ? 7 : 6;
    const border = highlighted ? '#4b5563' : '#b3b3b3';
    const borderWidth = highlighted ? 2 : 1.5;
    return [
        new Style(Object.assign({ image: new Circle({
                radius: halo,
                fill: new Fill({
                    color: haloColor
                })
            }) }, (geometry ? { geometry } : {}))),
        new Style(Object.assign({ image: new Circle({
                radius: radius,
                fill: new Fill({
                    color: '#ffffff'
                }),
                stroke: new Stroke({
                    width: borderWidth,
                    color: border
                })
            }) }, (geometry ? { geometry } : {})))
    ];
};
/**
 * Extract a `MultiPoint` with every vertex of the given feature geometry
 * (polygons and multi-line strings are flattened). Returns `undefined` when
 * the geometry has no coordinates.
 *
 * @param feature
 * @private
 */
const getFeatureVertices = (feature) => {
    let geometry = feature.getGeometry();
    if (geometry instanceof GeometryCollection) {
        geometry = geometry.getGeometries()[0];
    }
    const coordinates = geometry.getCoordinates();
    let flatCoordinates = null;
    if (geometry instanceof Polygon || geometry instanceof MultiLineString) {
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
/**
 * Master style that handles two modes on the Edit Layer:
 * - one is the basic, showing only the vertices
 * - and the other when modify is active, showing bigger vertices
 *
 * When `hovered` is `true`, a white/red halo is prepended to highlight the
 * feature, indicating it can be selected on click.
 *
 * @param feature
 * @param hovered
 * @private
 */
function styleFunction(feature, hovered = false) {
    let geometry = feature.getGeometry();
    let type = geometry.getType();
    if (geometry instanceof GeometryCollection) {
        geometry = geometry.getGeometries()[0];
        type = geometry.getType();
    }
    const haloStyle = () => {
        return [
            new Style({
                image: new Circle({
                    radius: 9,
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.9)'
                    }),
                    stroke: new Stroke({
                        color: '#ff0000',
                        width: 3
                    })
                }),
                stroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.9)',
                    width: 8
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.9)'
                })
            })
        ];
    };
    switch (type) {
        case GeometryType.Point:
        case GeometryType.MultiPoint:
            if (getMode() === Modes.Edit) {
                return editVertexStyles();
            }
            else {
                return [
                    ...(hovered ? haloStyle() : []),
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
            if (getMode() == Modes.Draw || getMode() == Modes.Edit) {
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
                    ...editVertexStyles(false, getFeatureVertices),
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
                    ...(hovered ? haloStyle() : []),
                    new Style({
                        image: new Circle({
                            radius: 2,
                            fill: new Fill({
                                color: '#000000'
                            })
                        }),
                        geometry: (feature) => getFeatureVertices(feature)
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
 * Style used to highlight a feature after a query, drawn on a dedicated
 * highlight layer so the source layers keep their own rendering.
 *
 * @param feature
 * @private
 */
function queryStyleFunction(_feature) {
    return [
        new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({
                    color: 'rgba(0, 170, 255, 0.4)'
                }),
                stroke: new Stroke({
                    color: '#0066cc',
                    width: 2
                })
            }),
            stroke: new Stroke({
                color: '#00aaff',
                width: 4
            }),
            fill: new Fill({
                color: 'rgba(0, 170, 255, 0.3)'
            })
        })
    ];
}

/**
 * Shows a fields form in a modal window to allow changes in the properties of
 * one or several features. When editing multiple features, fields whose value
 * differs across the selection show the "multiple values" placeholder and only
 * the fields actually changed are applied to the whole selection.
 *
 * @param features
 * @private
 */
class EditFieldsModal extends Observable {
    constructor(options) {
        super();
        this._options = options;
        this._modal = new Modal(Object.assign(Object.assign({}, this._options.modal), { header: true, headerClose: true, title: '', content: '<div></div>', footer: `
                <button
                    type="button"
                    class="btn btn-sm btn-third"
                    data-action="delete"
                    data-dismiss="modal"
                >
                    ${I18N.labels.delete}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    data-dismiss="modal"
                >
                    ${I18N.labels.cancel}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    data-action="save"
                    data-dismiss="modal"
                >
                    ${I18N.labels.save}
                </button>
            ` }));
        this._modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                const formElements = modal.el.querySelector('form')
                    .elements;
                const multipleFields = new Set(Array.from(formElements)
                    .filter((el) => el.dataset.multiple === 'true')
                    .map((el) => el.name));
                Array.from(formElements).forEach((el) => {
                    const value = el.value;
                    const field = el.name;
                    // Do not overwrite untouched fields that had
                    // multiple values in the selection
                    if (multipleFields.has(field) && value === '') {
                        return;
                    }
                    this._features.forEach((feature) => {
                        if (feature.get(field) !== value) {
                            feature.set(field, value, /* isSilent = */ true);
                        }
                    });
                });
                this._features.forEach((feature) => {
                    feature.changed();
                    addFeatureToEditedList(feature);
                });
                this._dispatch('save', this._features);
            }
            else if (event.target.dataset.action === 'delete') {
                this._dispatch('delete', this._features);
            }
        });
    }
    show(features) {
        this._features = Array.isArray(features) ? features : [features];
        const multiple = this._features.length > 1;
        const modalTitle = multiple
            ? I18N_('editElements', this._features.length)
            : `${I18N.labels.editElement} ${this._features[0].getId()} `;
        const layerName = this._features[0].get('_layerName_');
        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const describeFeatureType = layer.getDescribeFeatureType()._parsed;
        const fieldList = describeFeatureType.properties.filter((field) => field.name !== describeFeatureType.geomField);
        this._modal._html.body.innerHTML = '';
        this._modal._html.body.append(jsxs("div", { children: [multiple && (jsx("div", { className: "ol-wfst--edit-modal-notice", children: I18N_('multipleEditNotice', this._features.length) })), jsx("form", { autocomplete: "false", children: fieldList.flatMap((field) => {
                        const key = field.name;
                        const values = this._features.map((feature) => feature.get(key));
                        const uniqueValues = Array.from(new Set(values.map((value) => String(value !== null && value !== void 0 ? value : ''))));
                        const hasMultipleValues = multiple && uniqueValues.length > 1;
                        const value = hasMultipleValues
                            ? null
                            : uniqueValues[0] || null;
                        const typeXsd = field.type;
                        let type;
                        switch (typeXsd) {
                            case 'xsd:double':
                            case 'xsd:number':
                            case 'xsd:int':
                                type = 'number';
                                break;
                            case 'xsd:date':
                                type = 'date';
                                break;
                            case 'xsd:date-time':
                                type = 'datetime';
                                break;
                            case 'xsd:string':
                            default:
                                type = 'text';
                        }
                        let input = (jsx("input", { placeholder: hasMultipleValues
                                ? I18N.labels.multipleValues
                                : 'NULL', className: 'ol-wfst--input-field-input' +
                                (hasMultipleValues
                                    ? ' ol-wfst--input-multiple'
                                    : ''), type: type, name: key, value: value, "data-multiple": hasMultipleValues ? 'true' : null }));
                        if (layer.beforeShowFieldsModal) {
                            const hookInput = layer.beforeShowFieldsModal(field, value, input);
                            if (!hookInput) {
                                return [];
                            }
                            if (typeof hookInput === 'string') {
                                input = new DOMParser().parseFromString(hookInput, 'text/html').body.childNodes[0];
                            }
                            else {
                                input = hookInput;
                            }
                        }
                        if (hasMultipleValues) {
                            input.dataset.multiple = 'true';
                            input.classList.add('ol-wfst--input-multiple');
                        }
                        return (jsxs("div", { className: "ol-wfst--input-field-container", children: [jsx("label", { className: "ol-wfst--input-field-label", htmlFor: key, children: key }), input] }));
                    }) })] }));
        this._modal._html.header.innerHTML = modalTitle;
        this._modal.show();
    }
    _dispatch(type, features) {
        const evt = new VectorSourceEvent(type, features[0]);
        evt.features = features;
        this.dispatchEvent(evt);
    }
}

// Ol
// https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
// Axis ordering: latitude/longitude
const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';
const parser = new WFSCapabilities();
/**
 * @fires change:capabilities
 * @extends {ol/Object~BaseObject}
 * @param options
 */
class Geoserver extends BaseObject {
    constructor(options) {
        super();
        const defaults = {
            url: null,
            advanced: {
                getCapabilitiesVersion: '2.0.0',
                getFeatureVersion: '1.0.0',
                describeFeatureTypeVersion: '1.1.0',
                lockFeatureVersion: '1.1.0',
                wfsTransactionVersion: '1.1.0',
                projection: DEFAULT_GEOSERVER_SRS,
                lockFeatureParams: {
                    expiry: 5, // minutes
                    lockId: 'WFST-editor',
                    releaseAction: 'SOME'
                }
            },
            headers: {},
            credentials: 'same-origin',
            useLockFeature: true
        };
        this._options = deepObjectAssign(defaults, options);
        this.setAdvanced(this._options.advanced);
        this.setHeaders(this._options.headers);
        this.setCredentials(this._options.credentials);
        this.setUrl(this._options.url);
        this.setUseLockFeature(this._options.useLockFeature);
        this._countRequests = 0;
        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];
        this._lockedId = this._options.advanced.lockFeatureParams.lockId;
        // Formats
        this._formatWFS = new WFS();
        this._formatGeoJSON = new GeoJSON();
        this._formatKml = new KML({
            extractStyles: false,
            showPointNames: false
        });
        this._xs = new XMLSerializer();
        this.getAndUpdateCapabilities();
        this.on('change:parsedCapabilities', () => {
            this._checkGeoserverCapabilities();
        });
    }
    /**
     *
     * @returns
     * @public
     */
    getCapabilities() {
        return this.get(GeoserverProperty.CAPABILITIES);
    }
    /**
     * Only work for `2.0.0` getCapabilities version
     * @returns
     * @public
     */
    getParsedCapabilities() {
        return this.get(GeoserverProperty.PARSED_CAPABILITIES);
    }
    /**
     *
     * @param url
     * @param opt_silent
     * @public
     */
    setUrl(url, opt_silent = false) {
        this.set(GeoserverProperty.URL, url, opt_silent);
    }
    /**
     *
     * @returns
     */
    getUrl() {
        return this.get(GeoserverProperty.URL);
    }
    /**
     *
     * @param headers
     * @param opt_silent
     * @returns
     * @public
     */
    setHeaders(headers = {}, opt_silent = false) {
        return this.set(GeoserverProperty.HEADERS, headers, opt_silent);
    }
    /**
     *
     * @returns
     * @public
     */
    getHeaders() {
        return this.get(GeoserverProperty.HEADERS);
    }
    /**
     *
     * @param credentials
     * @param opt_silent
     * @public
     */
    setCredentials(credentials = null, opt_silent = false) {
        this.set(GeoserverProperty.CREDENTIALS, credentials, opt_silent);
    }
    /**
     *
     * @returns
     * @public
     */
    getCredentials() {
        return this.get(GeoserverProperty.CREDENTIALS);
    }
    /**
     *
     * @returns
     * @public
     */
    setAdvanced(advanced = {}, opt_silent = false) {
        this.set(GeoserverProperty.ADVANCED, advanced, opt_silent);
    }
    /**
     *
     * @returns
     * @public
     */
    getAdvanced() {
        return this.get(GeoserverProperty.ADVANCED);
    }
    /**
     *
     * @returns
     * @public
     */
    hasTransaction() {
        return this.get(GeoserverProperty.HASTRASNACTION);
    }
    /**
     *
     * @returns
     * @public
     */
    hasLockFeature() {
        return this.get(GeoserverProperty.HASLOCKFEATURE);
    }
    /**
     *
     * @returns
     * @public
     */
    getUseLockFeature() {
        return this.get(GeoserverProperty.USELOCKFEATURE);
    }
    /**
     *
     * @returns
     * @public
     */
    setUseLockFeature(useLockFeature, opt_silent = false) {
        this.set(GeoserverProperty.USELOCKFEATURE, useLockFeature, opt_silent);
    }
    /**
     *
     * @returns
     * @public
     */
    isLoaded() {
        return this.get(GeoserverProperty.ISLOADED);
    }
    /**
     *
     * @returns
     */
    getState() {
        return this.state_;
    }
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @fires getcapabilities
     * @public
     */
    async getAndUpdateCapabilities() {
        try {
            const params = new URLSearchParams({
                service: 'wfs',
                version: this.getAdvanced().getCapabilitiesVersion,
                request: 'GetCapabilities',
                exceptions: 'application/json'
            });
            const url_fetch = this.getUrl() + '?' + params.toString();
            const response = await fetch(url_fetch, {
                headers: this.getHeaders(),
                credentials: this.getCredentials()
            });
            if (!response.ok) {
                throw new Error('');
            }
            const data = await response.text();
            const capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
            this.set(GeoserverProperty.CAPABILITIES, capabilities);
            const parsedCapabilities = parser.read(data);
            this.set(GeoserverProperty.PARSED_CAPABILITIES, parsedCapabilities);
            this.state_ = capabilities ? 'ready' : 'error';
            return capabilities;
        }
        catch (err) {
            console.error(err);
            const msg = typeof err === 'string' ? err : I18N.errors.capabilities;
            showError(msg, err);
        }
    }
    /**
     *
     * @private
     */
    _checkGeoserverCapabilities() {
        var _a, _b;
        if (this.getAdvanced().getCapabilitiesVersion === '2.0.0') {
            // Available operations in the geoserver
            const operations = (_b = (_a = this.getParsedCapabilities()) === null || _a === void 0 ? void 0 : _a.OperationsMetadata) === null || _b === void 0 ? void 0 : _b.Operation;
            if (operations) {
                operations.forEach((operation) => {
                    if (operation.name === 'Transaction') {
                        this.set(GeoserverProperty.HASTRASNACTION, true);
                    }
                    else if (operation.name === 'LockFeature') {
                        this.set(GeoserverProperty.HASLOCKFEATURE, true);
                    }
                    else if (operation.name === 'DescribeFeatureType') {
                        this.set(GeoserverProperty.HASDESCRIBEFEATURETYPE, true);
                    }
                });
            }
        }
        else {
            const operations = this.getCapabilities().getElementsByTagName('ows:Operation');
            Array.from(operations).forEach((operation) => {
                if (operation.getAttribute('name') === 'Transaction') {
                    this.set(GeoserverProperty.HASTRASNACTION, true);
                }
                else if (operation.getAttribute('name') === 'LockFeature') {
                    this.set(GeoserverProperty.HASLOCKFEATURE, true);
                }
                else if (operation.getAttribute('name') === 'DescribeFeatureType') {
                    this.set(GeoserverProperty.HASDESCRIBEFEATURETYPE, true);
                }
            });
        }
        if (!this.hasTransaction()) {
            throw I18N.errors.wfst;
        }
    }
    /**
     * Make the WFS Transactions
     *
     * @param transactionType
     * @param features
     * @param layerName
     * @private
     */
    async transact(transactionType, features, layerName) {
        features = (Array.isArray(features) ? features : [features]);
        const clonedFeatures = [];
        const geoLayer = getStoredLayer(layerName);
        for (const feature of features) {
            let clone = this._cloneFeature(feature);
            const cloneGeom = clone.getGeometry();
            // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220
            if (cloneGeom instanceof GeometryCollection$1) {
                this._transformGeoemtryCollectionToGeometries(clone, cloneGeom);
            }
            else if (cloneGeom instanceof Circle$1) {
                // Geoserver has no Support to Circles
                this._transformCircleToPolygon(clone, cloneGeom);
            }
            // Filters
            if ('beforeTransactFeature' in geoLayer &&
                typeof geoLayer.beforeTransactFeature === 'function') {
                clone = geoLayer.beforeTransactFeature(clone, transactionType);
            }
            if (clone) {
                clonedFeatures.push(clone);
            }
        }
        if (!clonedFeatures.length) {
            showError(I18N.errors.noValidGeometry);
            return false;
        }
        switch (transactionType) {
            case TransactionType.Insert:
                this._insertFeatures = [
                    ...this._insertFeatures,
                    ...clonedFeatures
                ];
                break;
            case TransactionType.Update:
                this._updateFeatures = [
                    ...this._updateFeatures,
                    ...clonedFeatures
                ];
                break;
            case TransactionType.Delete:
                this._deleteFeatures = [
                    ...this._deleteFeatures,
                    ...clonedFeatures
                ];
                break;
        }
        this._countRequests++;
        const numberRequest = this._countRequests;
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    // Prevent fire multiples times
                    if (numberRequest !== this._countRequests) {
                        return;
                    }
                    let srs = getMap().getView().getProjection().getCode();
                    // Force latitude/longitude order on transactions
                    // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                    srs =
                        srs === 'EPSG:4326'
                            ? 'urn:x-ogc:def:crs:EPSG:4326'
                            : srs;
                    if (!geoLayer || !geoLayer.getDescribeFeatureType()) {
                        throw new Error(`${I18N.errors.layerNotFound}: "${layerName}"`);
                    }
                    const describeFeatureType = geoLayer.getDescribeFeatureType()._parsed;
                    const layerNameClean = layerName.split(':').length > 1
                        ? layerName.split(':').pop()
                        : layerName;
                    const options = {
                        featureNS: describeFeatureType.namespace,
                        featureType: layerNameClean,
                        srsName: srs,
                        featurePrefix: null,
                        nativeElements: null,
                        version: this.getAdvanced().wfsTransactionVersion
                    };
                    const transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                    let payload = this._xs.serializeToString(transaction);
                    const geomType = describeFeatureType.geomType;
                    const geomField = describeFeatureType.geomField;
                    // Ugly fix to support GeometryCollection on GML
                    // See https://github.com/openlayers/openlayers/issues/4220
                    if (geomType === GeometryType.GeometryCollection) {
                        if (transactionType === TransactionType.Insert) {
                            payload = payload.replace(/<geometry>/g, `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`);
                            payload = payload.replace(/<\/geometry>/g, `</geometryMember></MultiGeometry></geometry>`);
                        }
                        else if (transactionType === TransactionType.Update) {
                            const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                            const gmemberOut = `</geometryMember></MultiGeometry>`;
                            payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, `$1$2${gmemberIn}$3${gmemberOut}$4$5`);
                        }
                    }
                    // Fixes geometry name, weird bug with GML:
                    // The property for the geometry column is always named "geometry"
                    if (transactionType === TransactionType.Insert) {
                        payload = payload.replace(/<(\/?)\bgeometry\b>/g, `<$1${geomField}>`);
                    }
                    else if (transactionType === TransactionType.Update) {
                        payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                    }
                    // This has to be te same used before
                    if (this.hasLockFeature &&
                        this.getUseLockFeature() &&
                        transactionType !== TransactionType.Insert) {
                        payload = payload.replace(`</Transaction>`, `<LockId>${this._lockedId}</LockId></Transaction>`);
                    }
                    const headers = Object.assign({ 'Content-Type': 'text/xml' }, this.getHeaders());
                    const response = await fetch(this.getUrl(), {
                        method: 'POST',
                        body: payload,
                        headers: headers,
                        credentials: this._options.credentials
                    });
                    if (!response.ok) {
                        throw new Error(I18N.errors.transaction + ' ' + response.status);
                    }
                    const responseStr = await response.text();
                    const parseResponse = this._formatWFS.readTransactionResponse(responseStr);
                    const wlayer = getStoredLayer(layerName);
                    if (!Object.keys(parseResponse).length) {
                        const findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                        if (findError) {
                            if (wlayer instanceof WmsLayer) {
                                this._removeFeatures(features);
                            }
                            // maybe remove tmp wms features here
                            throw new Error(findError[1]);
                        }
                    }
                    if (transactionType !== TransactionType.Delete) {
                        this._removeFeatures(features);
                    }
                    features.forEach((feature) => {
                        removeFeatureFromEditList(feature);
                    });
                    wlayer.refresh();
                    showLoading(false);
                    this._insertFeatures = [];
                    this._updateFeatures = [];
                    this._deleteFeatures = [];
                    this._countRequests = 0;
                    resolve(parseResponse);
                }
                catch (err) {
                    showError(err.message, err);
                    showLoading(false);
                    this._countRequests = 0;
                    reject();
                }
            }, 0);
        });
    }
    /**
     * @privatwe
     */
    _removeFeatures(features) {
        for (const feature of features) {
            getEditLayer().getSource().removeFeature(feature);
        }
    }
    /**
     *
     * @param feature
     * @param geom
     * @private
     */
    _transformCircleToPolygon(feature, geom) {
        const geomConverted = fromCircle(geom);
        feature.setGeometry(geomConverted);
    }
    /**
     *
     * @param feature
     * @private
     * @param geom
     */
    _transformGeoemtryCollectionToGeometries(feature, geom) {
        let geomConverted = geom.getGeometries()[0];
        if (geomConverted instanceof Circle$1) {
            geomConverted = fromCircle(geomConverted);
        }
        feature.setGeometry(geomConverted);
    }
    /**
     *
     * @param feature
     * @returns
     * @private
     */
    _cloneFeature(feature) {
        removeFeatureFromEditList(feature);
        const featureProperties = feature.getProperties();
        delete featureProperties.boundedBy;
        delete featureProperties._layerName_;
        delete featureProperties._editOverlayCoord_;
        const clone = new Feature(featureProperties);
        clone.setId(feature.getId());
        return clone;
    }
    /**
     * Lock one or several features in the geoserver. Useful before editing,
     * to avoid changes from multiples users. Locking several features at once
     * with a single request keeps the lock covered by one LockId
     *
     * @param featureIds
     * @param layerName
     * @param retry
     * @public
     */
    async lockFeature(featureIds, layerName, retry = 0) {
        const params = new URLSearchParams({
            service: 'wfs',
            version: this.getAdvanced().lockFeatureVersion,
            request: 'LockFeature',
            typeName: layerName,
            expiry: String(this._options.advanced.lockFeatureParams.expiry),
            handle: this._options.advanced.lockFeatureParams.lockId,
            releaseAction: this._options.advanced.lockFeatureParams.releaseAction,
            exceptions: 'application/json',
            featureid: Array.isArray(featureIds)
                ? featureIds.join(',')
                : String(featureIds)
        });
        const url_fetch = this.getUrl() + '?' + params.toString();
        try {
            const response = await fetch(url_fetch, {
                headers: this._options.headers,
                credentials: this._options.credentials
            });
            if (!response.ok) {
                throw new Error(I18N.errors.lockFeature);
            }
            const data = await response.text();
            try {
                // First, check if is a JSON (with errors)
                const dataParsed = JSON.parse(data);
                if ('exceptions' in dataParsed) {
                    const error = new Error(parseError(dataParsed));
                    const exceptions = dataParsed.exceptions;
                    if (exceptions[0].code === 'CannotLockAllFeatures') {
                        // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                        if (!retry) {
                            this.lockFeature(featureIds, layerName, 1);
                        }
                        else {
                            throw error;
                        }
                    }
                    else {
                        throw error;
                    }
                }
            }
            catch (err) {
                // XML response (not JSON): parse the real lock id returned by
                // the server so the transaction references the lock that was
                // actually created instead of the configured one
                try {
                    const dataDoc = new window.DOMParser().parseFromString(data, 'text/xml');
                    const lockIdNode = dataDoc.getElementsByTagName('wfs:LockId')[0] ||
                        dataDoc.getElementsByTagNameNS('http://www.opengis.net/wfs', 'LockId')[0];
                    if (lockIdNode && lockIdNode.textContent) {
                        this._lockedId = lockIdNode.textContent;
                    }
                }
                catch (parseErr) {
                    // Keep the configured lockId
                }
            }
            return data;
        }
        catch (err) {
            showError(err.message, err);
        }
    }
}
var GeoserverProperty;
(function (GeoserverProperty) {
    GeoserverProperty["CAPABILITIES"] = "capabilities";
    GeoserverProperty["PARSED_CAPABILITIES"] = "parsedCapabilities";
    GeoserverProperty["URL"] = "url";
    GeoserverProperty["HEADERS"] = "headers";
    GeoserverProperty["CREDENTIALS"] = "credentials";
    GeoserverProperty["ADVANCED"] = "advanced";
    GeoserverProperty["HASTRASNACTION"] = "hasTransaction";
    GeoserverProperty["HASLOCKFEATURE"] = "hasLockFeature";
    GeoserverProperty["HASDESCRIBEFEATURETYPE"] = "hasDescribeFeatureType";
    GeoserverProperty["USELOCKFEATURE"] = "useLockFeature";
    GeoserverProperty["ISLOADED"] = "isLoaded";
})(GeoserverProperty || (GeoserverProperty = {}));

function editFieldsSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\">\r\n    <path d=\"M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function editGeomSvg() {
	return (new DOMParser().parseFromString(" <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"541\" height=\"512\" viewBox=\"0 0 541 512\">\r\n    <path fill=\"#000\" d=\"M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z\"></path>\r\n    <path fill=\"#000\" d=\"M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z\"></path>\r\n    <path fill=\"#000\" d=\"M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z\"></path>\r\n    <path fill=\"#000\" d=\"M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z\"></path>\r\n    <path fill=\"#000\" d=\"M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z\"></path>\r\n    <path fill=\"#000\" d=\"M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n    <path fill=\"#000\" d=\"M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

class EditOverlay extends Overlay {
    constructor(feature = null, coordinate = null, id) {
        super({
            id: id !== null && id !== void 0 ? id : (feature ? feature.getId() : undefined),
            position: coordinate ||
                (feature
                    ? getCenter(feature.getGeometry().getExtent())
                    : undefined),
            positioning: 'center-center',
            offset: [0, -40],
            stopEvent: true,
            element: (jsxs("div", { children: [jsx("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                            this.dispatchEvent('editFields');
                        }, children: jsx("button", { className: "ol-wfst--edit-button", type: "button", title: I18N.labels.editFields, children: editFieldsSvg() }) }), jsx("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                            this.dispatchEvent('editGeom');
                        }, children: jsx("button", { class: "ol-wfst--edit-button", type: "button", title: I18N.labels.editGeom, children: editGeomSvg() }) })] }))
        });
    }
}

function addLineSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

class ExtendLineOverlay extends Overlay {
    constructor(feature, coordinate, side, component = 0, onClick) {
        super({
            position: coordinate,
            positioning: 'center-center',
            stopEvent: true,
            element: (jsx("div", { className: "ol-wfst--extend-button-cnt", children: jsx("button", { className: "ol-wfst--extend-button", type: "button", title: I18N.labels.continueLine, onClick: () => {
                        onClick(side);
                    }, children: addLineSvg() }) }))
        });
        this.feature = feature;
        this.side = side;
        this.component = component;
    }
}

const QUERY_OVERLAY_ID = 'ol-wfst--query-overlay';
/**
 * Popup overlay that shows the attributes of a queried feature and its
 * layer label. The geometry is highlighted separately on a dedicated layer.
 *
 * @extends {ol/Overlay~Overlay}
 * @param feature
 * @param coordinate
 * @param layer
 * @private
 */
class QueryOverlay extends Overlay {
    constructor(feature, coordinate, layer) {
        const describeFeatureType = layer.getDescribeFeatureType();
        const parsed = describeFeatureType === null || describeFeatureType === void 0 ? void 0 : describeFeatureType._parsed;
        const fields = (parsed === null || parsed === void 0 ? void 0 : parsed.properties) || [];
        const geomField = parsed === null || parsed === void 0 ? void 0 : parsed.geomField;
        const rows = fields
            .filter((field) => field.name !== geomField)
            .map((field) => {
            let value = feature.get(field.name);
            if (value === undefined || value === null) {
                value = '';
            }
            else if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return (jsxs("div", { className: "ol-wfst--query-popup-row", children: [jsx("span", { className: "ol-wfst--query-popup-key", children: field.name }), jsx("span", { className: "ol-wfst--query-popup-value", children: String(value) })] }));
        });
        super({
            id: QUERY_OVERLAY_ID,
            position: coordinate || getCenter(feature.getGeometry().getExtent()),
            positioning: 'bottom-center',
            offset: [0, -14],
            stopEvent: true,
            autoPan: true,
            element: (jsxs("div", { className: "ol-wfst--query-popup", children: [jsxs("div", { className: "ol-wfst--query-popup-head", children: [jsx("div", { className: "ol-wfst--query-popup-title", children: I18N.labels.featureInfo }), jsx("button", { className: "ol-wfst--query-popup-close", type: "button", title: I18N.labels.close, onClick: () => {
                                    this.dispatchEvent('close');
                                }, children: "\u00D7" })] }), jsxs("div", { className: "ol-wfst--query-popup-subtitle", children: [jsx("b", { children: layer.get(BaseLayerProperty.LABEL) }), jsx("i", { children: String(feature.getId()) })] }), jsx("div", { className: "ol-wfst--query-popup-body", children: rows })] }))
        });
    }
}

function fullscreenSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

function fullscreenExitSvg() {
	return (new DOMParser().parseFromString("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n    <path d=\"M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z\"></path>\r\n</svg>", 'image/svg+xml')).firstChild;
}

const controlElement = document.createElement('div');
const INIT_LOADING_TIMEOUT = 20000;
/**
 * Tiny WFS-T client to insert (drawing/uploading), modify and delete
 * features on GeoServers using OpenLayers. Layers with these types
 * of geometries are supported: "GeometryCollection" (in this case, you can
 * choose the geometry type of each element to draw), "Point", "MultiPoint",
 * "LineString", "MultiLineString", "Polygon" and "MultiPolygon".
 *
 * @constructor
 * @fires modifystart
 * @fires modifyend
 * @fires drawstart
 * @fires drawend
 * @fires load
 * @fires describeFeatureType
 * @extends {ol/control/Control~Control}
 * @param options Wfst options, see [Wfst Options](#options) for more details.
 */
class Wfst extends Control {
    constructor(options) {
        super({
            target: null,
            element: controlElement,
            render: () => {
                if (!this._map)
                    this._init();
            }
        });
        this._initialized = false;
        this._queryOverlayId = 'ol-wfst--query-overlay';
        this._shiftPressed = false;
        this._hoveredFeature = null;
        this._keySelectBound = false;
        // Editing
        this._editFeaturesOriginal = {};
        this._multiOverlayId = 'ol-wfst--multi-edit-overlay';
        this._extendOverlays = [];
        setLang(options.language, options.i18n);
        const defaultOptions = getDefaultOptions();
        this._options = deepObjectAssign(defaultOptions, options);
        // By default, the first layer is ready to accept new draws
        setActiveLayerToInsertEls(this._options.layers[0]);
        this._controlWidgetToolsDiv = controlElement;
        this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
        this._uploads = new Uploads(this._options);
        this._editFields = new EditFieldsModal(this._options);
    }
    /**
     * Get all the layers in the ol-wfst instance
     * @public
     */
    getLayers() {
        return Object.values(getStoredMapLayers());
    }
    /**
     * Get a layer
     * @public
     */
    getLayerByName(layerName = '') {
        const layers = getStoredMapLayers();
        if (layerName && layerName in layers) {
            return layers[layerName];
        }
        return null;
    }
    /**
     * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
     * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
     * @fires describeFeatureType
     * @private
     */
    async _initMapAndLayers() {
        try {
            const layers = this._options.layers;
            if (layers.length) {
                let layerRendered = 0;
                let layersNumber = 0; // Only count visibles
                showLoading();
                const layerInitPromises = [];
                layers.forEach((layer) => {
                    if (layer.isVisible(this._view))
                        layersNumber++;
                    layer.on('layerRendered', () => {
                        layerRendered++;
                        if (layerRendered >= layersNumber) {
                            // run only once
                            if (!this._initialized) {
                                this.dispatchEvent('load');
                                this._initialized = true;
                            }
                            showLoading(false);
                        }
                    });
                    layer.on('change:describeFeatureType', () => {
                        if (this._options.showControl && layers.length > 1) {
                            const domEl = this._layersControl.addLayerEl(layer);
                            layer.on('change:isVisible', () => {
                                const layerNotVisible = 'ol-wfst--layer-not-visible';
                                const visible = layer.isVisibleByZoom();
                                if (visible)
                                    domEl.classList.remove(layerNotVisible);
                                else
                                    domEl.classList.add(layerNotVisible);
                            });
                        }
                        layer.set(BaseLayerProperty.ISVISIBLE, this._currentZoom > layer.getMinZoom());
                        this.dispatchEvent(new WfstEvent({
                            type: 'describeFeatureType',
                            layer: layer,
                            data: layer.getDescribeFeatureType()
                        }));
                    });
                    layerInitPromises.push(layer._init());
                    this._map.addLayer(layer);
                    setMapLayers({
                        [layer.get(BaseLayerProperty.NAME)]: layer
                    });
                });
                this._createMapElements(this._options.showControl, this._options.active);
                // Show the loading bar until every layer has resolved its
                // DescribeFeatureType (success or error), with a fail-safe
                // timeout so it never stays visible on a dead connection.
                await Promise.race([
                    Promise.all(layerInitPromises),
                    new Promise((resolve) => setTimeout(resolve, INIT_LOADING_TIMEOUT))
                ]);
                showLoading(false);
            }
        }
        catch (err) {
            showLoading(false);
            showError(err.message, err);
        }
    }
    /**
     * @private
     */
    _init() {
        this._map = super.getMap();
        this._view = this._map.getView();
        this._viewport = this._map.getViewport();
        setMap(this._map);
        //@ts-expect-error
        this._uploads.on('addedFeatures', ({ features }) => {
            const layer = getActiveLayerToInsertEls();
            layer.insertFeatures(features);
        });
        //@ts-expect-error
        this._uploads.on('loadedFeatures', ({ features }) => {
            this.activateEditMode();
            const editLayerSource = getEditLayer().getSource();
            editLayerSource.addFeatures(features);
            this._view.fit(editLayerSource.getExtent(), {
                size: this._map.getSize(),
                maxZoom: 21,
                padding: [100, 100, 100, 100]
            });
        });
        // @ts-expect-error
        this._editFields.on('save', async ({ feature, features }) => {
            const list = features || [feature];
            const ok = await this._transactEditList(list);
            if (ok) {
                Array.from(list).forEach((f) => this._collectionModify.remove(f));
            }
        });
        // @ts-expect-error
        this._editFields.on('delete', ({ features }) => {
            this._deleteFeature(features, true);
        });
        this._addMapEvents();
        this._addMiddleButtonPan();
        initModal(this._options['modal']);
        this._layersWidgetDiv = document.createElement('div');
        this._layersWidgetDiv.className = 'ol-wfst--layers-control';
        this._layersWidgetDiv.append(initLoading());
        this._map.addControl(new Control({
            element: this._layersWidgetDiv
        }));
        this._initMapAndLayers();
    }
    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controls and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    async _createMapElements(showControl, active) {
        // VectorLayer to store features on editing and inserting
        this._prepareEditLayer();
        this._addInteractions();
        this._addInteractionHandlers();
        this._prepareHighlightLayer();
        this._addQueryInteraction();
        if (showControl) {
            this._addMapControl();
            if (this._options.fullscreen) {
                this._map.addControl(new FullScreen({
                    className: 'ol-wfst--fullscreen',
                    tipLabel: I18N.labels.fullscreen,
                    label: fullscreenSvg(),
                    labelActive: fullscreenExitSvg()
                }));
            }
        }
        // By default, init in edit mode
        this.activateEditMode(active);
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
            this._interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature) => styleFunction(feature),
                toggleCondition: shiftKeyOnly, // Allow adding features to the selection with shift
                filter: (feature, layer) => {
                    return (getMode() !== Modes.Edit &&
                        getMode() !== Modes.Query &&
                        layer &&
                        layer instanceof WfsLayer &&
                        layer === getActiveLayerToInsertEls());
                }
            });
            this._map.addInteraction(this._interactionWfsSelect);
            this._interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                const coordinate = mapBrowserEvent.coordinate;
                // Clear hover to avoid keeping the style on the selected feature
                this._clearHoverState();
                if (getMode() === Modes.Query) {
                    return;
                }
                if (selected.length) {
                    selected.forEach((feature) => {
                        if (!isFeatureEdited(feature)) {
                            // Remove the feature from the original layer
                            const layer = this._interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            this._addFeatureToEditMode(feature, coordinate, layer.get(BaseLayerProperty.NAME));
                        }
                    });
                    this._lockSelectedFeatures();
                }
                if (deselected.length) {
                    if (getMode() !== Modes.Edit) {
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
            this._interactionSelectModify = new Select({
                style: (feature) => styleFunction(feature),
                layers: [getEditLayer()],
                toggleCondition: shiftKeyOnly, // Allow adding features with shift
                removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
            });
            this._map.addInteraction(this._interactionSelectModify);
            // When clicking without shift, replace the current selection: remove
            // any previously selected and not re-selected feature from the edit list
            this._interactionSelectModify.on('select', ({ selected, mapBrowserEvent }) => {
                if (!selected.length ||
                    !mapBrowserEvent ||
                    shiftKeyOnly(mapBrowserEvent)) {
                    return;
                }
                const selectedSet = new Set(selected);
                Array.from(this._collectionModify.getArray()).forEach((feature) => {
                    if (!selectedSet.has(feature)) {
                        this._collectionModify.remove(feature);
                    }
                });
            });
            this._collectionModify =
                this._interactionSelectModify.getFeatures();
            this._keyClickWms = this._map.on(this._options.evtType || 'singleclick', async (evt) => {
                if (this._map.hasFeatureAtPixel(evt.pixel)) {
                    return;
                }
                // Only get other features if editmode is disabled
                if (getMode() !== Modes.Edit && getMode() !== Modes.Query) {
                    const layer = getActiveLayerToInsertEls();
                    // If layer is hidden or is a wfs, skip
                    if (!layer.getVisible() ||
                        !layer.isVisibleByZoom() ||
                        layer instanceof WfsLayer) {
                        return;
                    }
                    const features = await layer._getFeaturesByClickEvent(evt);
                    if (!(features === null || features === void 0 ? void 0 : features.length)) {
                        return;
                    }
                    // Without shift, replace the current selection
                    if (!shiftKeyOnly(evt)) {
                        Array.from(this._collectionModify.getArray()).forEach((feature) => {
                            this._collectionModify.remove(feature);
                        });
                    }
                    this._addFeatureToEditMode(features[0], evt.coordinate, layer.get(BaseLayerProperty.NAME));
                    this._lockSelectedFeatures();
                }
            });
        };
        if (this._options.layers.find((layer) => layer instanceof WfsLayer)) {
            prepareWfsInteraction();
        }
        if (this._options.layers.find((layer) => layer instanceof WmsLayer)) {
            prepareWmsInteraction();
        }
        this._interactionModify = new Modify({
            style: (feature) => {
                if (getMode() === Modes.Edit) {
                    return editVertexStyles(feature.get('existing') === true);
                }
                else {
                    return;
                }
            },
            features: this._collectionModify,
            condition: (evt) => {
                return primaryAction(evt) && getMode() === Modes.Edit;
            }
        });
        this._map.addInteraction(this._interactionModify);
        this._interactionSnap = new Snap({
            source: getEditLayer().getSource()
        });
        this._map.addInteraction(this._interactionSnap);
        this._addSelectionInteractions();
    }
    /**
     * Interactions to select features by drawing a box (DragBox) or a freehand
     * polygon (freehand Draw lasso). The selected features are added to the
     * edit list, keeping the same behaviour as the single click selection.
     *
     * @private
     */
    _addSelectionInteractions() {
        const selectionStyle = new Style$1({
            fill: new Fill$1({
                color: 'rgba(255, 200, 0, 0.1)'
            }),
            stroke: new Stroke$1({
                color: '#ffc800',
                width: 2,
                lineDash: [6, 4]
            })
        });
        // Box selection (dragging a rectangle)
        this._interactionDragBox = new DragBox({
            condition: (evt) => primaryAction(evt) && this._isSelectMode(SelectionMode.Box),
            className: 'ol-wfst--dragbox'
        });
        this._interactionDragBox.on('boxend', (evt) => {
            if (!this._isSelectMode(SelectionMode.Box)) {
                return;
            }
            // Without shift, replace the current selection
            if (!evt.mapBrowserEvent.originalEvent.shiftKey) {
                this._collectionModify.clear();
            }
            this._selectByGeometry(this._interactionDragBox.getGeometry());
        });
        this._map.addInteraction(this._interactionDragBox);
        // Freehand selection (holding the mouse to draw a closed lasso)
        this._interactionFreehandSelect = new Draw({
            type: GeometryType.Polygon,
            freehand: true,
            stopClick: true,
            style: selectionStyle,
            condition: (evt) => primaryAction(evt) && this._isSelectMode(SelectionMode.Freehand)
        });
        this._interactionFreehandSelect.on('drawend', (evt) => {
            if (!this._isSelectMode(SelectionMode.Freehand)) {
                return;
            }
            const geometry = evt.feature.getGeometry();
            const ring = geometry ? geometry.getCoordinates()[0] : [];
            // Ignore degenerate lassos (a simple click without dragging)
            if (!ring.length || ring.length < 4 || geometry.getArea() <= 0) {
                return;
            }
            // Without shift, replace the current selection
            if (!this._shiftPressed) {
                this._collectionModify.clear();
            }
            this._selectByGeometry(geometry);
        });
        this._map.addInteraction(this._interactionFreehandSelect);
        this._refreshSelectionInteractions();
    }
    /**
     * Whether a selection tool mode is currently usable: only outside the
     * edit/draw modes.
     *
     * @param mode
     * @private
     */
    _isSelectMode(mode) {
        return getMode() === null && getSelectionMode() === mode;
    }
    /**
     * Enable/disable the box and freehand selection interactions according to
     * the current selection tool and map mode.
     *
     * @private
     */
    _refreshSelectionInteractions() {
        const active = getMode() === null;
        if (this._interactionDragBox) {
            this._interactionDragBox.setActive(active && getSelectionMode() === SelectionMode.Box);
        }
        if (this._interactionFreehandSelect) {
            this._interactionFreehandSelect.setActive(active && getSelectionMode() === SelectionMode.Freehand);
        }
    }
    /**
     * Select the features that intersect the given polygon on the active layer
     * and add them to the edit list. WFS features are picked from the already
     * loaded source, while WMS features are requested to the GeoServer with a
     * WFS GetFeature INTERSECTS filter.
     *
     * @param geometry
     * @private
     */
    async _selectByGeometry(geometry) {
        const layer = getActiveLayerToInsertEls();
        if (!layer || !layer.getVisible() || !layer.isVisibleByZoom()) {
            showError(I18N.errors.layerNotVisible);
            return;
        }
        let features;
        if (layer instanceof WfsLayer) {
            const candidates = layer
                .getSource()
                .getFeaturesInExtent(geometry.getExtent());
            // The extent is only a bounding box; for the freehand lasso be
            // more precise and keep the features whose vertices fall inside it
            if (getSelectionMode() === SelectionMode.Freehand) {
                features = candidates.filter((feature) => {
                    const featureGeom = feature.getGeometry();
                    if (!featureGeom) {
                        return false;
                    }
                    const flatCoords = featureGeom.getFlatCoordinates();
                    const stride = featureGeom.getStride();
                    for (let i = 0; i < flatCoords.length; i += stride) {
                        if (geometry.intersectsCoordinate([
                            flatCoords[i],
                            flatCoords[i + 1]
                        ])) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            else {
                features = candidates;
            }
        }
        else if (layer instanceof WmsLayer) {
            features = await layer._getFeaturesInGeometry(geometry);
        }
        if (features) {
            this._selectFeatures(features);
        }
    }
    /**
     * Add the given features to the edit mode:
     * remove them from their original layer and push them into the edit
     * collection so they can be modified/deleted like the ones selected
     * with a single click.
     *
     * @param features
     * @private
     */
    _selectFeatures(features) {
        if (!features || !features.length) {
            return;
        }
        const layer = getActiveLayerToInsertEls();
        const layerName = layer.get(BaseLayerProperty.NAME);
        const selectedIds = new Set(this._collectionModify.getArray().map((feature) => feature.getId()));
        features.forEach((feature) => {
            if (isFeatureEdited(feature) || selectedIds.has(feature.getId())) {
                return;
            }
            // WFS features are stored in their layer source: remove them from
            // there while they are being edited
            if (layer instanceof WfsLayer &&
                layer.getSource().hasFeature(feature)) {
                layer.getSource().removeFeature(feature);
            }
            this._addFeatureToEditMode(feature, null, layerName);
        });
        this._lockSelectedFeatures();
    }
    /**
     * Layer to store temporary the elements to be edited
     * @private
     */
    _prepareEditLayer() {
        this._map.addLayer(getEditLayer());
    }
    /**
     * Create the dedicated layer used to highlight the queried feature, so
     * the source layers keep their own rendering untouched.
     * @private
     */
    _prepareHighlightLayer() {
        this._highlightSource = new VectorSource();
        this._highlightLayer = new VectorLayer({
            source: this._highlightSource,
            style: (feature) => queryStyleFunction(),
            zIndex: 100
        });
        this._map.addLayer(this._highlightLayer);
    }
    /**
     * Listen for clicks while the query mode is active: get the clicked
     * feature of the active layer (from the already loaded source for WFS,
     * or through a GetFeatureInfo request for WMS), highlight it and show
     * its attributes in a popup.
     * @private
     */
    _addQueryInteraction() {
        this._keyClickQuery = this._map.on(this._options.evtType || 'singleclick', async (evt) => {
            if (getMode() !== Modes.Query) {
                return;
            }
            const layer = getActiveLayerToInsertEls();
            // Skip hidden layers
            if (!layer.getVisible() || !layer.isVisibleByZoom()) {
                return;
            }
            let feature = null;
            if (layer instanceof WfsLayer) {
                const featuresAtPixel = this._map.getFeaturesAtPixel(evt.pixel, {
                    hitTolerance: 10,
                    layerFilter: (candidate) => candidate === layer
                });
                if (featuresAtPixel && featuresAtPixel.length) {
                    feature = featuresAtPixel[0];
                }
            }
            else if (layer instanceof WmsLayer) {
                const features = await layer._getFeaturesByClickEvent(evt);
                if (features === null || features === void 0 ? void 0 : features.length) {
                    feature = features[0];
                }
            }
            // Click on empty space: clear the previous result
            if (!feature) {
                this._clearQueryResult();
                return;
            }
            this._showQueryResult(feature, layer, evt.coordinate);
        });
    }
    /**
     * Highlight the given feature and attach a popup with its attributes.
     * @param feature
     * @param layer
     * @param coordinate
     * @private
     */
    _showQueryResult(feature, layer, coordinate) {
        this._clearQueryResult();
        this._highlightSource.addFeature(feature);
        this._queryOverlay = new QueryOverlay(feature, coordinate, layer);
        // @ts-expect-error
        this._queryOverlay.on('close', () => {
            this._clearQueryResult();
        });
        this._map.addOverlay(this._queryOverlay);
    }
    /**
     * Remove the query popup overlay if any.
     * @private
     */
    _removeQueryOverlay() {
        if (this._queryOverlay) {
            this._map.removeOverlay(this._queryOverlay);
            this._queryOverlay = null;
            return;
        }
        const overlay = this._map.getOverlayById(this._queryOverlayId);
        if (overlay) {
            this._map.removeOverlay(overlay);
        }
    }
    /**
     * Clear the highlight and remove the query popup.
     * @private
     */
    _clearQueryResult() {
        var _a;
        (_a = this._highlightSource) === null || _a === void 0 ? void 0 : _a.clear();
        this._removeQueryOverlay();
    }
    /**
     * Activate/deactivate the query mode: while it is active, clicking a
     * feature of the active layer shows its info in a popup instead of
     * selecting it for editing.
     *
     * @param bool
     * @public
     */
    activateQueryMode(bool = true) {
        var _a, _b;
        if (bool) {
            // Leave any draw interaction active
            if (this._interactionDraw) {
                this._map.removeInteraction(this._interactionDraw);
                this._viewport.classList.remove('draw-mode');
            }
            resetStateButtons();
            deactivateSelectModeButton();
            activateQueryButton();
            this._clearHoverState();
            activateMode(Modes.Query);
            // Disable the edit selection interactions while querying
            if (this._interactionSelectModify) {
                this._interactionSelectModify.setActive(false);
            }
            if (this._interactionWfsSelect) {
                this._interactionWfsSelect.setActive(false);
            }
            (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(false);
            this._syncExtendLineOverlays();
            this._refreshSelectionInteractions();
        }
        else {
            activateMode(null);
            deactivateQueryButton();
            activateSelectModeButton(getSelectionMode());
            if (this._interactionSelectModify) {
                this._interactionSelectModify.setActive(true);
            }
            if (this._interactionWfsSelect) {
                this._interactionWfsSelect.setActive(true);
            }
            (_b = this._interactionModify) === null || _b === void 0 ? void 0 : _b.setActive(true);
            this._refreshSelectionInteractions();
        }
        this._clearQueryResult();
    }
    /**
     * @private
     */
    _addMapEvents() {
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
                    const selectedFeatures = this._collectionModify.getArray();
                    if (selectedFeatures.length) {
                        this._deleteFeature(selectedFeatures, true);
                    }
                }
            });
        };
        keyboardEvents();
        /**
         * Change the cursor to a pointing hand and highlight the feature
         * when hovering over a WFS feature of the active layer.
         * @private
         */
        const pointerMoveHandler = (evt) => {
            if (evt.dragging) {
                return;
            }
            // In edit mode, give pointer feedback on the editable
            // vertices/segments
            if (getMode() === Modes.Edit) {
                this._clearHoverState();
                this._updateEditCursor(evt);
                return;
            }
            // Only show the hover outside edit and draw modes
            if (getMode() !== null) {
                this._clearHoverState();
                return;
            }
            const layer = getActiveLayerToInsertEls();
            // Hover only works on visible WFS layers
            if (!layer ||
                !layer.getVisible() ||
                !layer.isVisibleByZoom() ||
                !(layer instanceof WfsLayer)) {
                this._clearHoverState();
                return;
            }
            const features = this._map.getFeaturesAtPixel(evt.pixel, {
                hitTolerance: 10,
                layerFilter: (candidate) => candidate === layer
            });
            if (features && features.length) {
                const feature = features[0];
                if (feature !== this._hoveredFeature) {
                    this._clearHoverState();
                    this._hoveredFeature = feature;
                    this._hoveredFeature.setStyle((f) => styleFunction(f, true));
                }
                if (this._viewport.style.cursor !== 'pointer') {
                    this._viewport.style.cursor = 'pointer';
                }
            }
            else {
                this._clearHoverState();
            }
        };
        this._map.on('pointermove', pointerMoveHandler);
        // Store the shift state when a gesture starts, so the freehand
        // selection can decide between adding or replacing the selection
        this._viewport.addEventListener('pointerdown', (evt) => {
            this._shiftPressed = evt.shiftKey;
        });
        // Clear the hover before firing a click, otherwise the Select interaction
        // would capture the hover style as the original style of the feature and
        // restore it on deselect, leaving the highlight permanently enabled.
        this._viewport.addEventListener('pointerdown', () => this._clearHoverState());
        this._viewport.addEventListener('pointerleave', () => this._clearHoverState(), { once: false });
        this._map.on('moveend', () => {
            this._currentZoom = this._view.getZoom();
            if (this._currentZoom !== this._lastZoom) {
                const layers = getStoredMapLayers();
                Object.keys(layers).forEach((key) => {
                    const layer = layers[key];
                    if (this._currentZoom > layer.getMinZoom()) {
                        // Show the layers
                        if (!layer.get(BaseLayerProperty.ISVISIBLE)) {
                            layer.set(BaseLayerProperty.ISVISIBLE, true);
                        }
                    }
                    else {
                        // Hide the layer
                        if (layer.get(BaseLayerProperty.ISVISIBLE)) {
                            layer.set(BaseLayerProperty.ISVISIBLE, false);
                        }
                    }
                });
                this._lastZoom = this._currentZoom;
            }
        });
    }
    /**
     * Allow panning with the middle mouse button at all times, even when the
     * draw/freehand/box interactions are consuming the left button. The
     * middle pointerdown is intercepted in the capture phase so OpenLayers
     * never processes it and the active tool is not affected.
     *
     * @private
     */
    _addMiddleButtonPan() {
        const viewport = this._viewport;
        let panning = false;
        let lastX = 0;
        let lastY = 0;
        const isMiddleButton = (evt) => evt.pointerType === 'mouse' && evt.button === 1;
        const stopPanning = () => {
            panning = false;
        };
        viewport.addEventListener('pointerdown', (evt) => {
            if (!isMiddleButton(evt)) {
                return;
            }
            evt.preventDefault();
            evt.stopPropagation();
            viewport.setPointerCapture(evt.pointerId);
            panning = true;
            lastX = evt.clientX;
            lastY = evt.clientY;
            if (this._view.getAnimating()) {
                this._view.cancelAnimations();
            }
        }, true);
        viewport.addEventListener('pointermove', (evt) => {
            if (!panning) {
                return;
            }
            evt.preventDefault();
            const delta = [lastX - evt.clientX, evt.clientY - lastY];
            lastX = evt.clientX;
            lastY = evt.clientY;
            const resolution = this._view.getResolution();
            const rotation = this._view.getRotation();
            const cosAngle = Math.cos(rotation);
            const sinAngle = Math.sin(rotation);
            const x = (delta[0] * cosAngle - delta[1] * sinAngle) * resolution;
            const y = (delta[1] * cosAngle + delta[0] * sinAngle) * resolution;
            this._view.adjustCenterInternal([x, y]);
        });
        const endPan = () => {
            if (!panning) {
                return;
            }
            stopPanning();
        };
        viewport.addEventListener('pointerup', endPan);
        viewport.addEventListener('pointercancel', endPan);
    }
    /**
     * Add map handlers
     * @private
     */
    _addInteractionHandlers() {
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this._interactionModify.on('modifyend', (evt) => {
            evt.features.forEach((feature) => {
                addFeatureToEditedList(feature);
            });
            super.dispatchEvent(evt);
        });
        this._interactionModify.on('modifystart', (evt) => {
            super.dispatchEvent(evt);
        });
        // Keep the "continue drawing" buttons glued to the line endpoints
        // @ts-expect-error - 'modify' is a valid Modify event not typed in the `on` signature
        this._interactionModify.on('modify', () => {
            this._updateExtendOverlayPositions();
        });
        this._onDeselectFeatureEvent();
        this._onRemoveFeatureEvent();
    }
    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addMapControl() {
        this._layersControl = new LayersControl(this._options.showUpload ? this._uploads : null, this._options.uploadFormats);
        // @ts-expect-error
        this._layersControl.on('drawMode', () => {
            if (getMode() === Modes.Query) {
                this.activateQueryMode(false);
            }
            if (getMode() === Modes.Draw) {
                resetStateButtons();
                this.activateEditMode();
            }
            else {
                const activeLayer = getActiveLayerToInsertEls();
                if (!activeLayer.isVisibleByZoom()) {
                    showError(I18N.errors.layerNotVisible);
                }
                else {
                    this.activateDrawMode(getActiveLayerToInsertEls());
                }
            }
        });
        // @ts-expect-error
        this._layersControl.on('changeGeom', () => {
            if (getMode() === Modes.Draw) {
                this.activateDrawMode(getActiveLayerToInsertEls());
            }
        });
        // @ts-expect-error
        this._layersControl.on('changeLayer', () => {
            if (getMode() === Modes.Draw) {
                this.activateDrawMode(getActiveLayerToInsertEls());
            }
        });
        [
            ['selectModeSingle', SelectionMode.Single],
            ['selectModeBox', SelectionMode.Box],
            ['selectModeFreehand', SelectionMode.Freehand]
        ].forEach(([evtName, mode]) => {
            // @ts-expect-error
            this._layersControl.on(evtName, () => {
                // Leaving the draw mode when a select tool is chosen
                if (getMode() === Modes.Draw) {
                    resetStateButtons();
                    this.activateEditMode();
                }
                // Leaving the query mode when a select tool is chosen
                if (getMode() === Modes.Query) {
                    this.activateQueryMode(false);
                }
                setSelectionMode(mode);
                activateSelectModeButton(mode);
                this._refreshSelectionInteractions();
            });
        });
        // @ts-expect-error
        this._layersControl.on('queryMode', () => {
            this.activateQueryMode(getMode() !== Modes.Query);
        });
        const controlEl = this._layersControl.render();
        this._selectDraw = controlEl.querySelector('.wfst--tools-control--select-draw');
        this._controlWidgetToolsDiv.append(controlEl.querySelector('.wfst--tools-control--head'));
        if (this._options.layers.length > 1) {
            this._layersWidgetDiv.append(controlEl.querySelector('.wfst--tools-control--select-layers'));
        }
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
        const layer = getStoredMapLayers()[layerName];
        // Reset any per-feature style (e.g. hover) before returning the feature
        // to its layer, so it renders with the layer's default style.
        feature.setStyle(undefined);
        layer.getSource().addFeature(feature);
    }
    /**
     * @param feature
     * @private
     */
    _removeFeatureFromTmpLayer(feature) {
        // Remove element from the Layer
        getEditLayer().getSource().removeFeature(feature);
    }
    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    _onDeselectFeatureEvent() {
        const checkIfFeatureIsChanged = (feature) => {
            const layerName = feature.get('_layerName_');
            const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
            if (layer instanceof WfsLayer) {
                this._interactionWfsSelect.getFeatures().remove(feature);
            }
            if (isFeatureEdited(feature)) {
                layer.transactFeatures(TransactionType.Update, feature);
            }
            else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (layer instanceof WfsLayer) {
                    this._restoreFeatureToLayer(feature, layerName);
                }
                this._removeFeatureFromTmpLayer(feature);
            }
        };
        if (this._keySelectBound) {
            return;
        }
        this._keySelectBound = true;
        // This is fired when a feature is deselected and fires the transaction process
        if (this._keySelect) {
            unByKey(this._keySelect);
        }
        this._keySelect = this._collectionModify.on('remove', (evt) => {
            const feature = evt.element;
            this._deselectEditFeature(feature);
            this._syncEditOverlays();
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
        this._keyRemove = getEditLayer()
            .getSource()
            .on('removefeature', (evt) => {
            const feature = evt.feature;
            if (!feature.get('_delete_')) {
                return;
            }
            if (this._keySelect) {
                unByKey(this._keySelect);
                this._keySelectBound = false;
            }
            const layerName = feature.get('_layerName_');
            const ll = this.getLayerByName(layerName);
            ll.transactFeatures(TransactionType.Delete, feature);
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
     *
     * @param features
     * @private
     */
    _editModeOn(features) {
        features = Array.isArray(features) ? features : [features];
        features.forEach((feature) => {
            this._editFeaturesOriginal[String(feature.getId())] =
                feature.clone();
        });
        activateMode(Modes.Edit);
        // Show the "continue drawing" buttons on the line endpoints
        this._syncExtendLineOverlays();
        // To refresh the style
        getEditLayer().getSource().changed();
        this._refreshSelectionInteractions();
        const multiOverlay = this._map.getOverlayById(this._multiOverlayId);
        if (multiOverlay) {
            this._map.removeOverlay(multiOverlay);
        }
        features.forEach((feature) => {
            this._removeOverlayHelper(feature);
        });
        this._controlApplyDiscardChanges = new EditControlChangesEl(features);
        this._controlApplyDiscardChanges.on('cancel', (evt) => {
            const list = evt.features;
            Array.from(list).forEach((feature) => {
                const original = this._editFeaturesOriginal[String(feature.getId())];
                if (original) {
                    feature.setGeometry(original.getGeometry());
                }
                removeFeatureFromEditList(feature);
                this._collectionModify.remove(feature);
            });
        });
        this._controlApplyDiscardChanges.on('apply', async (evt) => {
            showLoading();
            const list = evt.features;
            const ok = await this._transactEditList(list);
            if (ok) {
                Array.from(list).forEach((feature) => {
                    this._collectionModify.remove(feature);
                });
            }
        });
        this._controlApplyDiscardChanges.on('delete', (evt) => {
            this._deleteFeature(evt.features, true);
        });
        this._map.addControl(this._controlApplyDiscardChanges);
    }
    /**
     * @private
     */
    _editModeOff() {
        activateMode(null);
        this._destroyExtendLineOverlays();
        this._map.removeControl(this._controlApplyDiscardChanges);
        this._refreshSelectionInteractions();
    }
    /**
     * Get the first and last coordinate of every line component of a
     * LineString/MultiLineString geometry, including the line components
     * nested inside a GeometryCollection. Anything else returns an empty
     * array.
     *
     * @param geometry
     * @private
     */
    _getLineEndPoints(geometry) {
        const endPoints = [];
        const appendLine = (line, collection) => {
            if (line instanceof LineString) {
                if (line.getCoordinates().length) {
                    endPoints.push({
                        first: line.getFirstCoordinate(),
                        last: line.getLastCoordinate(),
                        line,
                        lineIndex: 0,
                        collection
                    });
                }
                return;
            }
            line.getCoordinates().forEach((coordinates, lineIndex) => {
                if (coordinates.length) {
                    endPoints.push({
                        first: coordinates[0],
                        last: coordinates[coordinates.length - 1],
                        line,
                        lineIndex,
                        collection
                    });
                }
            });
        };
        // "getGeometries()" returns deep clones (see ol GeometryCollection),
        // but the extend/merge must work on the actual members.
        const collect = (geometry, collection) => {
            if (geometry instanceof LineString ||
                geometry instanceof MultiLineString$1) {
                appendLine(geometry, collection);
            }
            else if (geometry instanceof GeometryCollection$1) {
                geometry.getGeometriesArray().forEach((member) => {
                    collect(member, geometry);
                });
            }
        };
        collect(geometry);
        return endPoints;
    }
    /**
     * Remove every "continue drawing" overlay and abort any active line
     * extension draw.
     *
     * @private
     */
    _destroyExtendLineOverlays() {
        if (this._extendDraw) {
            this._finishExtendDraw();
        }
        this._extendOverlays.forEach((overlay) => {
            this._map.removeOverlay(overlay);
        });
        this._extendOverlays = [];
    }
    /**
     * Keep the "continue drawing" overlays in sync with the current edit
     * selection: they are only shown while editing LineString/MultiLineString
     * features, and they are repositioned on the endpoints of each line
     * component.
     *
     * @private
     */
    _syncExtendLineOverlays() {
        if (getMode() !== Modes.Edit || !this._collectionModify) {
            this._destroyExtendLineOverlays();
            return;
        }
        const items = this._collectionModify.getArray();
        // Remove overlays whose feature was deselected or lost its line geometry
        const removed = [];
        this._extendOverlays.forEach((overlay) => {
            const stale = !items.includes(overlay.feature) ||
                overlay.component >=
                    this._getLineEndPoints(overlay.feature.getGeometry())
                        .length;
            if (stale) {
                this._map.removeOverlay(overlay);
                removed.push(overlay);
            }
        });
        this._extendOverlays = this._extendOverlays.filter((overlay) => !removed.includes(overlay));
        // Add overlays for new LineString/MultiLineString features
        items.forEach((feature) => {
            this._getLineEndPoints(feature.getGeometry()).forEach(({ first, last }, component) => {
                ['start', 'end'].forEach((side) => {
                    const exists = this._extendOverlays.some((overlay) => overlay.feature === feature &&
                        overlay.component === component &&
                        overlay.side === side);
                    if (exists) {
                        return;
                    }
                    const overlay = new ExtendLineOverlay(feature, side === 'start' ? first : last, side, component, () => this._startExtendLineDraw(feature, side, component));
                    this._extendOverlays.push(overlay);
                    this._map.addOverlay(overlay);
                });
            });
        });
        this._updateExtendOverlayPositions();
    }
    /**
     * Move the "continue drawing" overlays to the current position of their
     * line endpoints, e.g. after a vertex is dragged with the Modify
     * interaction.
     *
     * @private
     */
    _updateExtendOverlayPositions() {
        this._extendOverlays.forEach((overlay) => {
            const point = this._getLineEndPoints(overlay.feature.getGeometry())[overlay.component];
            if (!point) {
                return;
            }
            overlay.setPosition(overlay.side === 'start' ? point.first : point.last);
        });
    }
    /**
     * Start drawing a continuation of a line from one of its endpoints. The
     * sketch is anchored on the clicked vertex, so the next clicks append the
     * new points. A double click (or clicking back on the last point) ends
     * the drawing and merges the segment into the feature.
     *
     * @param feature
     * @param side 'start' prepends the new segment, 'end' appends it
     * @param component index of the clicked line component
     * @private
     */
    _startExtendLineDraw(feature, side, component = 0) {
        var _a;
        if (this._extendDraw || getMode() !== Modes.Edit) {
            return;
        }
        const points = this._getLineEndPoints(feature.getGeometry());
        if (!points.length || component >= points.length) {
            return;
        }
        const anchor = side === 'start' ? points[component].first : points[component].last;
        // While extending, the Modify/Select interactions must not grab the clicks
        (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(false);
        if (this._interactionSelectModify) {
            this._interactionSelectModify.setActive(false);
        }
        if (this._interactionWfsSelect) {
            this._interactionWfsSelect.setActive(false);
        }
        this._extendDraw = new Draw({
            type: GeometryType.LineString,
            style: (f) => styleFunction(f),
            stopClick: true // To prevent firing a map/wms click
        });
        this._extendDraw.on('drawend', (evt) => {
            this._mergeExtendLine(feature, side, evt.feature, component);
        });
        this._extendDraw.on('drawabort', () => {
            this._finishExtendDraw();
        });
        this._map.addInteraction(this._extendDraw);
        // Anchor the sketch on the clicked vertex: the user only has to digitize
        // the continuation points (this also dispatches the "drawstart" event)
        this._extendDraw.appendCoordinates([anchor]);
    }
    /**
     * Merge the just-drawn segment into the edited feature's line geometry and
     * restore the editing interactions.
     *
     * @param feature
     * @param side
     * @param sketch
     * @param component index of the extended line component
     * @private
     */
    _mergeExtendLine(feature, side, sketch, component = 0) {
        const points = this._getLineEndPoints(feature.getGeometry());
        const point = points[component];
        if (!point) {
            this._finishExtendDraw();
            return;
        }
        const segment = sketch.getGeometry().getCoordinates();
        const { line, lineIndex } = point;
        if (line instanceof LineString) {
            const coords = line.getCoordinates();
            if (side === 'start') {
                line.setCoordinates([...segment.slice(1).reverse(), ...coords]);
            }
            else {
                line.setCoordinates([...coords, ...segment.slice(1)]);
            }
        }
        else if (line instanceof MultiLineString$1) {
            const coords = line.getCoordinates();
            if (side === 'start') {
                coords[lineIndex] = [
                    ...segment.slice(1).reverse(),
                    ...coords[lineIndex]
                ];
            }
            else {
                coords[lineIndex] = [...coords[lineIndex], ...segment.slice(1)];
            }
            line.setCoordinates(coords);
        }
        // Only mark the feature as edited when the segment added new vertices
        if (segment.length > 1) {
            addFeatureToEditedList(feature);
        }
        this._finishExtendDraw();
        this._syncExtendLineOverlays();
    }
    /**
     * Remove the active line extension draw and restore the interactions that
     * were disabled while drawing.
     *
     * @private
     */
    _finishExtendDraw() {
        var _a;
        if (this._extendDraw) {
            this._map.removeInteraction(this._extendDraw);
            this._extendDraw = null;
        }
        if (getMode() !== Modes.Edit) {
            return;
        }
        (_a = this._interactionModify) === null || _a === void 0 ? void 0 : _a.setActive(true);
        if (this._interactionSelectModify) {
            this._interactionSelectModify.setActive(true);
        }
        if (this._interactionWfsSelect) {
            this._interactionWfsSelect.setActive(true);
        }
    }
    /**
     * Send all the given features in a single WFS-T Update transaction per
     * layer, so a multi selection is saved with only one request. The "edited"
     * flag is cleared before transacting, so a deselect fired while the
     * request is in flight does not trigger a duplicate transaction.
     *
     * @param list
     * @returns false when there is nothing to transact or the transaction fails
     * @private
     */
    async _transactEditList(list) {
        if (!list.length) {
            return true;
        }
        const byLayer = {};
        list.forEach((feature) => {
            const layerName = feature.get('_layerName_');
            if (!byLayer[layerName]) {
                byLayer[layerName] = [];
            }
            byLayer[layerName].push(feature);
        });
        for (const layerName of Object.keys(byLayer)) {
            const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
            if (!layer) {
                continue;
            }
            byLayer[layerName].forEach((feature) => {
                removeFeatureFromEditList(feature);
            });
            let ok;
            try {
                ok = await layer.transactFeatures(TransactionType.Update, byLayer[layerName]);
            }
            catch (err) {
                return false;
            }
            if (ok === false) {
                return false;
            }
        }
        return true;
    }
    /**
     * Remove features from the edit Layer and from the Geoserver
     *
     * @param feature
     * @param confirm
     * @private
     */
    _deleteFeature(feature, confirm) {
        const deleteEl = () => {
            var _a;
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach((feature) => {
                feature.set('_delete_', true, true);
                getEditLayer().getSource().removeFeature(feature);
            });
            this._collectionModify.clear();
            this._editModeOff();
            this._syncEditOverlays();
            const layerName = (_a = features[0]) === null || _a === void 0 ? void 0 : _a.get('_layerName_');
            const layer = layerName
                ? this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName)
                : null;
            if (layer instanceof WfsLayer) {
                features.forEach((feature) => {
                    this._interactionWfsSelect.getFeatures().remove(feature);
                });
            }
        };
        if (confirm) {
            const features = Array.isArray(feature) ? feature : [feature];
            const message = features.length > 1
                ? I18N_('confirmDeleteElements', features.length)
                : I18N.labels.confirmDelete;
            const confirmModal = Modal.confirm(message, Object.assign({}, this._options.modal));
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
    _addFeatureToEditMode(feature, coordinate = null, layerName = null) {
        if (layerName) {
            // Store the layer information inside the feature
            feature.set('_layerName_', layerName);
        }
        if (coordinate) {
            // Keep the click coordinate to position the overlay helper
            feature.set('_editOverlayCoord_', coordinate);
        }
        const props = feature ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                getEditLayer().getSource().addFeature(feature);
                this._collectionModify.push(feature);
                this._syncEditOverlays();
            }
        }
    }
    /**
     * Lock the whole current selection with a single LockFeature request per
     * layer, so the transaction LockId covers all the selected features
     *
     * @private
     */
    async _lockSelectedFeatures() {
        const byLayer = {};
        this._collectionModify.getArray().forEach((selected) => {
            const layerName = selected.get('_layerName_');
            if (!layerName) {
                return;
            }
            (byLayer[layerName] || (byLayer[layerName] = [])).push(selected.getId());
        });
        const locks = [];
        Object.keys(byLayer).forEach((layerName) => {
            const layer = getStoredLayer(layerName);
            if (layer) {
                locks.push(layer.maybeLockFeature(byLayer[layerName]));
            }
        });
        if (locks.length) {
            await Promise.all(locks);
        }
    }
    /**
     * Create an EditOverlay helper and attach the edit listeners
     *
     * @param feature
     * @param coordinate
     * @param id
     * @private
     */
    _createEditOverlay(feature = null, coordinate = null, id = null) {
        coordinate =
            coordinate || (feature ? feature.get('_editOverlayCoord_') : null);
        const overlay = new EditOverlay(feature, coordinate, id);
        // @ts-expect-error
        overlay.on('editFields', () => {
            this._editFields.show(this._collectionModify.getArray());
        });
        // @ts-expect-error
        overlay.on('editGeom', () => {
            this._editModeOn(this._collectionModify.getArray());
        });
        this._map.addOverlay(overlay);
    }
    /**
     * Sync the edit overlay helpers with the current selection: a single
     * per-feature overlay while a feature is selected, or a unique overlay
     * centered between all the selected features when editing several at once
     *
     * @private
     */
    _syncEditOverlays() {
        if (getMode() === Modes.Edit) {
            return;
        }
        const multiOverlay = this._map.getOverlayById(this._multiOverlayId);
        if (multiOverlay) {
            this._map.removeOverlay(multiOverlay);
        }
        const items = this._collectionModify.getArray();
        if (items.length > 1) {
            items.forEach((feature) => {
                this._removeOverlayHelper(feature);
            });
            const extent = createEmpty();
            items.forEach((feature) => {
                extend(extent, feature.getGeometry().getExtent());
            });
            this._createEditOverlay(null, getCenter(extent), this._multiOverlayId);
        }
        else if (items.length === 1) {
            const feature = items[0];
            const featureId = feature.getId();
            if (featureId && !this._map.getOverlayById(featureId)) {
                this._createEditOverlay(feature);
            }
        }
    }
    /**
     * Activate/deactivate the draw mode
     *
     * @param layer
     * @public
     */
    activateDrawMode(layer) {
        /**
         *
         * @param layer
         * @private
         */
        const addDrawInteraction = (layer) => {
            this.activateEditMode(false);
            // If already exists, remove
            if (this._interactionDraw) {
                this._map.removeInteraction(this._interactionDraw);
            }
            const geomDrawType = this._selectDraw.value;
            this._interactionDraw = new Draw({
                source: getEditLayer().getSource(),
                type: geomDrawType,
                style: (feature) => styleFunction(feature),
                stopClick: true // To prevent firing a map/wms click
            });
            this._map.addInteraction(this._interactionDraw);
            this._interactionDraw.on('drawstart', (evt) => {
                super.dispatchEvent(evt);
            });
            this._interactionDraw.on('drawend', (evt) => {
                const feature = evt.feature;
                layer.transactFeatures(TransactionType.Insert, feature);
                super.dispatchEvent(evt);
            });
        };
        if (!this._interactionDraw && !layer) {
            return;
        }
        if (layer) {
            // If layer is set to invisible, show warning
            if (!layer.getVisible()) {
                return;
            }
            // Clear hover style while drawing
            this._clearHoverState();
            activateDrawButton();
            deactivateSelectModeButton();
            this._viewport.classList.add('draw-mode');
            addDrawInteraction(layer);
        }
        else {
            this._map.removeInteraction(this._interactionDraw);
            this._viewport.classList.remove('draw-mode');
            activateSelectModeButton(getSelectionMode());
        }
        activateMode(layer ? Modes.Draw : null);
        this._refreshSelectionInteractions();
    }
    /**
     * Activate/desactivate the edit mode
     *
     * @param bool
     * @public
     */
    activateEditMode(bool = true) {
        if (bool) {
            activateModeButtons();
            this.activateDrawMode(false);
        }
        else {
            // Deselct features
            this._collectionModify.clear();
            // Clear hover state when leaving the edit mode
            this._clearHoverState();
        }
        if (this._interactionSelectModify) {
            this._interactionSelectModify.setActive(bool);
        }
        this._interactionModify.setActive(bool);
        if (this._interactionWfsSelect)
            this._interactionWfsSelect.setActive(bool);
        this._refreshSelectionInteractions();
    }
    /**
     * Reset the cursor and remove the hover style of the last hovered feature
     * @private
     */
    _clearHoverState() {
        if (this._viewport) {
            this._viewport.style.cursor = '';
        }
        if (this._hoveredFeature) {
            this._hoveredFeature.setStyle(undefined);
            this._hoveredFeature = null;
        }
    }
    /**
     * Change the map cursor while in edit mode: `move` when the pointer is
     * over an editable vertex and `copy` when it is over a segment (where a
     * new vertex can be inserted), mirroring the Modify interaction hit
     * tolerance.
     *
     * @param evt
     * @private
     */
    _updateEditCursor(evt) {
        if (!this._collectionModify) {
            return;
        }
        const tolerance = 12;
        const toleranceSq = tolerance * tolerance;
        const pixel = evt.pixel;
        for (const feature of this._collectionModify.getArray()) {
            const vertices = getFeatureVertices(feature);
            const coordinates = vertices ? vertices.getCoordinates() : [];
            if (!coordinates.length) {
                continue;
            }
            // Hovering an existing vertex (draggable handle)
            for (const coordinate of coordinates) {
                const vertexPixel = this._map.getPixelFromCoordinate(coordinate);
                if (squaredDistance(vertexPixel, pixel) <= toleranceSq) {
                    this._viewport.style.cursor = 'move';
                    return;
                }
            }
            // Hovering a segment (allows inserting a new vertex)
            for (let i = 0; i < coordinates.length - 1; i++) {
                const start = this._map.getPixelFromCoordinate(coordinates[i]);
                const end = this._map.getPixelFromCoordinate(coordinates[i + 1]);
                if (squaredDistanceToSegment(pixel, [start, end]) <= toleranceSq) {
                    this._viewport.style.cursor = 'copy';
                    return;
                }
            }
        }
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
class WfstEvent extends BaseEvent {
    constructor(options) {
        super(options.type);
        this.layer = options.layer;
        this.data = options.data;
    }
}

export { Geoserver, WfsLayer, WfstEvent, WmsLayer, Wfst as default };
//# sourceMappingURL=ol-wfst.js.map
