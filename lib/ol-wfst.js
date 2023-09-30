/*!
 * ol-wfst - v4.2.0
 * https://github.com/GastonZalba/ol-wfst#readme
 * Built: Sat Sep 30 2023 12:32:25 GMT-0300 (Argentina Standard Time)
*/
import CircleStyle from 'ol/style/Circle.js';
import Fill$1 from 'ol/style/Fill.js';
import Stroke$1 from 'ol/style/Stroke.js';
import Style$1 from 'ol/style/Style.js';
import Control from 'ol/control/Control.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import Collection from 'ol/Collection.js';
import BaseEvent from 'ol/events/Event.js';
import { primaryAction, never } from 'ol/events/condition.js';
import Observable, { unByKey } from 'ol/Observable.js';
import Modal from 'modal-vanilla';
import VectorLayer from 'ol/layer/Vector.js';
import { Mixin } from 'ts-mixer';
import Layer from 'ol/layer/Base.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js';
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
import GeometryCollection$1 from 'ol/geom/GeometryCollection.js';
import Feature from 'ol/Feature.js';
import { fromCircle } from 'ol/geom/Polygon.js';
import WFSCapabilities from 'ol-wfs-capabilities';
import { getCenter } from 'ol/extent.js';
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
        addElement: '切换绘图类型',
        editElement: '编辑元素',
        save: '保存',
        delete: '删除',
        cancel: '取消',
        apply: '确认并应用改变',
        upload: '上传',
        editMode: '编辑模式',
        confirmDelete: '确认删除元素?',
        geomTypeNotSupported: '图层不支持该几何',
        editFields: '编辑区域',
        editGeom: '编辑几何',
        selectDrawType: '几何类型',
        uploadToLayer: '通过文件上传图层',
        uploadFeatures: '上传元素到图层',
        validFeatures: '合法的几何类型',
        invalidFeatures: '不合法',
        loading: '加载中...',
        toggleVisibility: '切换图层透明度',
        close: '关闭'
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

let loadingDiv;
const initLoading = () => {
    loadingDiv = document.createElement('div');
    loadingDiv.className = 'ol-wfst--tools-control--loading';
    loadingDiv.innerHTML = I18N.labels.loading;
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
})(Modes || (Modes = {}));
function activateMode(m = null) {
    mode = m;
}
function getMode() {
    return mode;
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
     * @private
     */
    _init() {
        const geoserver = this.getGeoserver();
        if (geoserver.isLoaded()) {
            this.getAndUpdateDescribeFeatureType();
        }
        else {
            geoserver.on('change:capabilities', async () => {
                this.getAndUpdateDescribeFeatureType();
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
     * @param featureId
     * @returns
     */
    async maybeLockFeature(featureId) {
        const geoserver = this.getGeoserver();
        if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
            return await geoserver.lockFeature(featureId, this.get(BaseLayerProperty.NAME));
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
        super(Object.assign(Object.assign({}, options), { format: new GeoJSON(), loader: async (extent, resolution, projection, success, failure) => {
                try {
                    // If bbox, add extent to the request
                    if (options.strategy == bbox) {
                        const extentGeoServer = transformExtent(extent, projection.getCode(), options.geoServerAdvanced.projection);
                        // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                        // request features using a bounding box with CRS maybe different from featureTypes native CRS
                        this.urlParams.set('bbox', extentGeoServer.toString() +
                            `,${options.geoServerAdvanced.projection}`);
                    }
                    const url_fetch = options.geoserverUrl + '?' + this.urlParams.toString();
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
         * Return the full accuracy geometry to replace the feature from GetFEatureInfo
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
                MAXFEATURES: '1',
                OUTPUTFORMAT: 'application/json',
                SRSNAME: getMap().getView().getProjection().getCode(),
                FEATUREID: String(featuresId)
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
                return this._parseFeaturesFromResponse(data);
            }
            catch (err) {
                console.error(err);
                return false;
            }
        };
        if (options.beforeTransactFeature) {
            this.beforeTransactFeature = options.beforeTransactFeature;
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

var img$5 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

function createElement(tagName, attrs = {}, ...children) {
    if (typeof tagName === 'function')
        return tagName(attrs, children);
    const elem = tagName === null
        ? new DocumentFragment()
        : document.createElement(tagName);
    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (typeof value !== 'undefined' &&
            value !== null &&
            value !== undefined) {
            if (name.startsWith('on') && name.toLowerCase() in window)
                elem.addEventListener(name.toLowerCase().substr(2), value);
            else {
                if (name === 'className')
                    elem.setAttribute('class', value.toString());
                else if (name === 'htmlFor')
                    elem.setAttribute('for', value.toString());
                else
                    elem.setAttribute(name, value.toString());
            }
        }
    });
    for (const child of children) {
        if (!child)
            continue;
        if (Array.isArray(child))
            elem.append(...child);
        else {
            if (child.nodeType === undefined)
                elem.innerHTML += child;
            else
                elem.appendChild(child);
        }
    }
    return elem;
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
};
const activateDrawButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
    if (btn) {
        btn.classList.add('wfst--active');
    }
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
        const container = document.querySelector('.wfst--tools-control--select-layers');
        const layerName = layer.get(BaseLayerProperty.NAME);
        const checked = layer === getActiveLayerToInsertEls() ? { checked: true } : {};
        const input = (createElement("input", Object.assign({ value: layerName, id: `wfst--${layerName}`, type: "radio", className: "ol-wfst--tools-control-input", name: "wfst--select-layer" }, checked, { onChange: (evt) => this._layerChangeHandler(evt, layer) })));
        const layerDom = (createElement("div", { className: `wfst--layer-control 
                            ${layer.getVisible() ? 'ol-wfst--visible-on' : ''}
                            ${layer === getActiveLayerToInsertEls()
                ? 'ol-wfst--selected-on'
                : ''}`, "data-layer": layerName },
            createElement("div", { className: "ol-wfst--tools-control-visible" },
                createElement("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt) },
                    createElement("img", { src: img$3 })),
                createElement("span", { className: "ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off", title: I18N.labels.toggleVisibility, onClick: (evt) => this._visibilityClickHandler(evt) },
                    createElement("img", { src: img$2 }))),
            createElement("label", { htmlFor: `wfst--${layerName}` },
                input,
                createElement("span", { title: layer.getDescribeFeatureType()._parsed.geomType }, layer.get(BaseLayerProperty.LABEL)))));
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
    _layerChangeHandler(evt, layer) {
        const radioInput = evt.currentTarget;
        const parentDiv = radioInput.closest('.wfst--layer-control');
        // Deselect DOM previous layer
        const selected = document.querySelector('.ol-wfst--selected-on');
        if (selected)
            selected.classList.remove('ol-wfst--selected-on');
        // Select this layer
        parentDiv.classList.add('ol-wfst--selected-on');
        setActiveLayerToInsertEls(layer);
        this._changeStateSelect(layer);
    }
    render() {
        return (createElement(null, null,
            createElement("div", { className: "wfst--tools-control--head" },
                this._uploads && (createElement("div", null,
                    createElement("input", { id: "ol-wfst--upload", type: "file", accept: this._uploadFormats, onChange: (evt) => this._uploads.process(evt) }),
                    createElement("label", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload", htmlFor: "ol-wfst--upload", title: I18N.labels.uploadToLayer },
                        createElement("img", { src: img$5 })))),
                createElement("div", { className: "ol-wfst--tools-control-draw-cnt" },
                    createElement("button", { className: "ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw", type: "button", title: I18N.labels.addElement, onClick: () => {
                            this.dispatchEvent('drawMode');
                        } },
                        createElement("img", { src: img$4 })),
                    createElement("select", { title: I18N.labels.selectDrawType, className: "wfst--tools-control--select-draw", onChange: (evt) => {
                            const selectedValue = evt.target.value;
                            this._changeStateSelect(getActiveLayerToInsertEls(), selectedValue);
                            this.dispatchEvent('changeGeom');
                        } }, [
                        GeometryType.Point,
                        GeometryType.MultiPoint,
                        GeometryType.LineString,
                        GeometryType.MultiLineString,
                        GeometryType.Polygon,
                        GeometryType.MultiPolygon,
                        GeometryType.Circle
                    ].map((type) => {
                        // Show all options, but enable only the accepted ones
                        return createElement("option", { value: type }, type);
                    })))),
            createElement("div", { className: "wfst--tools-control--select-layers" })));
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
    constructor(feature) {
        super({
            element: (createElement("div", { className: "ol-wfst--changes-control" },
                createElement("div", { className: "ol-wfst--changes-control-el" },
                    createElement("div", { className: "ol-wfst--changes-control-id" },
                        createElement("b", null, I18N.labels.editMode),
                        " -",
                        ' ',
                        createElement("i", null, String(feature.getId()))),
                    createElement("button", { type: "button", className: "btn btn-sm btn-secondary", onClick: () => {
                            this.dispatchEvent(new VectorSourceEvent('cancel', feature));
                        } }, I18N.labels.cancel),
                    createElement("button", { type: "button", className: "btn btn-sm btn-primary", onClick: () => {
                            this.dispatchEvent(new VectorSourceEvent('apply', feature));
                        } }, I18N.labels.apply),
                    createElement("button", { type: "button", className: "btn btn-sm btn-danger-outline", onClick: () => {
                            this.dispatchEvent(new VectorSourceEvent('delete', feature));
                        } }, I18N.labels.delete))))
        });
    }
}

// Ol
/**
 * Master style that handles two modes on the Edit Layer:
 * - one is the basic, showing only the vertices
 * - and the other when modify is active, showing bigger vertices
 *
 * @param feature
 * @private
 */
function styleFunction(feature) {
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
            if (getMode() === Modes.Edit) {
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

// Ol
/**
 * Shows a fields form in a modal window to allow changes in the properties of the feature.
 *
 * @param feature
 * @private
 */
class EditFieldsModal extends Observable {
    constructor(options) {
        super();
        this._options = options;
        const footer = `
            <button type="button" class="btn btn-sm btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${I18N.labels.delete}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${I18N.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${I18N.labels.save}
            </button>
        `;
        this._modal = new Modal(Object.assign(Object.assign({}, this._options), { header: true, headerClose: true, title: '', content: '<div></div>', footer: footer }));
        this._modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                const inputs = modal.el.querySelectorAll('input');
                inputs.forEach((el) => {
                    const value = el.value;
                    const field = el.name;
                    this._feature.set(field, value, /*isSilent = */ true);
                });
                this._feature.changed();
                addFeatureToEditedList(this._feature);
                this.dispatchEvent(new VectorSourceEvent('save', this._feature));
            }
            else if (event.target.dataset.action === 'delete') {
                this.dispatchEvent(new VectorSourceEvent('delete', this._feature));
            }
        });
    }
    show(feature) {
        this._feature = feature;
        const title = `${I18N.labels.editElement} ${feature.getId()} `;
        const properties = feature.getProperties();
        const layerName = feature.get('_layerName_');
        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const dataSchema = layer.getDescribeFeatureType()._parsed.properties;
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
        this._modal._html.body.innerHTML = content;
        this._modal._html.header.innerHTML = title;
        this._modal.show();
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
                    expiry: 5,
                    lockId: 'GeoServer',
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
                    const options = {
                        featureNS: describeFeatureType.namespace,
                        featureType: layerName,
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
                    else {
                        payload = payload.replace(/<Name>geometry<\/Name>/g, `<Name>${geomField}</Name>`);
                    }
                    // This has to be te same used before
                    if (this.hasLockFeature &&
                        this.getUseLockFeature() &&
                        transactionType !== TransactionType.Insert) {
                        payload = payload.replace(`</Transaction>`, `<LockId>${this._options.advanced.lockFeatureParams.lockId}</LockId></Transaction>`);
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
        const clone = new Feature(featureProperties);
        clone.setId(feature.getId());
        return clone;
    }
    /**
     * Lock a feature in the geoserver. Useful before editing a geometry,
     * to avoid changes from multiples suers
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @public
     */
    async lockFeature(featureId, layerName, retry = 0) {
        const params = new URLSearchParams({
            service: 'wfs',
            version: this.getAdvanced().lockFeatureVersion,
            request: 'LockFeature',
            typeName: layerName,
            expiry: String(this._options.advanced.lockFeatureParams.expiry),
            LockId: this._options.advanced.lockFeatureParams.lockId,
            releaseAction: this._options.advanced.lockFeatureParams.releaseAction,
            exceptions: 'application/json',
            featureid: `${featureId}`
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
                            this.lockFeature(featureId, layerName, 1);
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

var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

class EditOverlay extends Overlay {
    constructor(feature, coordinate = null) {
        super({
            id: feature.getId(),
            position: coordinate || getCenter(feature.getGeometry().getExtent()),
            positioning: 'center-center',
            offset: [0, -40],
            stopEvent: true,
            element: (createElement("div", null,
                createElement("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                        this.dispatchEvent('editFields');
                    } },
                    createElement("button", { className: "ol-wfst--edit-button", type: "button", title: I18N.labels.editFields },
                        createElement("img", { src: img$1, alt: I18N.labels.editFields }))),
                createElement("div", { className: "ol-wfst--edit-button-cnt", onClick: () => {
                        this.dispatchEvent('editGeom');
                    } },
                    createElement("button", { class: "ol-wfst--edit-button", type: "button", title: I18N.labels.editGeom },
                        createElement("img", { src: img, alt: I18N.labels.editGeom })))))
        });
    }
}

const controlElement = document.createElement('div');
/**
 * Tiny WFST-T client to insert (drawing/uploading), modify and delete
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
        setLang(options.language, options.i18n);
        const defaultOptions = getDefaultOptions();
        this._options = deepObjectAssign(defaultOptions, options);
        // By default, the first layer is ready to accept new draws
        setActiveLayerToInsertEls(this._options.layers[0]);
        this._controlWidgetToolsDiv = controlElement;
        this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';
        this._uploads = new Uploads(this._options);
        this._editFields = new EditFieldsModal(this._options.modal);
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
                layers.forEach((layer) => {
                    if (layer.getVisible())
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
                        const domEl = this._layersControl.addLayerEl(layer);
                        layer.on('change:isVisible', () => {
                            const layerNotVisible = 'ol-wfst--layer-not-visible';
                            const visible = layer.isVisibleByZoom();
                            if (visible)
                                domEl.classList.remove(layerNotVisible);
                            else
                                domEl.classList.add(layerNotVisible);
                        });
                        layer.set(BaseLayerProperty.ISVISIBLE, this._currentZoom > layer.getMinZoom());
                        this.dispatchEvent(new WfstEvent({
                            type: 'describeFeatureType',
                            layer: layer,
                            data: layer.getDescribeFeatureType()
                        }));
                    });
                    layer._init();
                    this._map.addLayer(layer);
                    setMapLayers({
                        [layer.get(BaseLayerProperty.NAME)]: layer
                    });
                });
                this._createMapElements(this._options.showControl, this._options.active);
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
        this._editFields.on('save', ({ feature }) => {
            // Force deselect to trigger handler
            this._collectionModify.remove(feature);
        });
        // @ts-expect-error
        this._editFields.dispose('delete', ({ feature }) => {
            this._deleteFeature(feature, true);
        });
        this._addMapEvents();
        initModal(this._options['modal']);
        this._controlWidgetToolsDiv.append(initLoading());
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
        if (showControl) {
            this._addMapControl();
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
                toggleCondition: never,
                filter: (feature, layer) => {
                    return (getMode() !== Modes.Edit &&
                        layer &&
                        layer instanceof WfsLayer &&
                        layer === getActiveLayerToInsertEls());
                }
            });
            this._map.addInteraction(this._interactionWfsSelect);
            this._interactionWfsSelect.on('select', ({ selected, deselected, mapBrowserEvent }) => {
                const coordinate = mapBrowserEvent.coordinate;
                if (selected.length) {
                    selected.forEach((feature) => {
                        if (!isFeatureEdited(feature)) {
                            // Remove the feature from the original layer
                            const layer = this._interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            this._addFeatureToEditMode(feature, coordinate, layer.get(BaseLayerProperty.NAME));
                        }
                    });
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
                toggleCondition: never,
                removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
            });
            this._map.addInteraction(this._interactionSelectModify);
            this._collectionModify =
                this._interactionSelectModify.getFeatures();
            this._keyClickWms = this._map.on(this._options.evtType, async (evt) => {
                if (this._map.hasFeatureAtPixel(evt.pixel)) {
                    return;
                }
                // Only get other features if editmode is disabled
                if (getMode() !== Modes.Edit) {
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
                    // For now, support is only for one feature at time
                    this._addFeatureToEditMode(features[0], evt.coordinate, layer.get(BaseLayerProperty.NAME));
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
            style: () => {
                if (getMode() === Modes.Edit) {
                    return new Style$1({
                        image: new CircleStyle({
                            radius: 6,
                            fill: new Fill$1({
                                color: '#ff0000'
                            }),
                            stroke: new Stroke$1({
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
                return primaryAction(evt) && getMode() === Modes.Edit;
            }
        });
        this._map.addInteraction(this._interactionModify);
        this._interactionSnap = new Snap({
            source: getEditLayer().getSource()
        });
        this._map.addInteraction(this._interactionSnap);
    }
    /**
     * Layer to store temporary the elements to be edited
     * @private
     */
    _prepareEditLayer() {
        this._map.addLayer(getEditLayer());
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
                    const selectedFeatures = this._collectionModify;
                    if (selectedFeatures) {
                        selectedFeatures.forEach((feature) => {
                            this._deleteFeature(feature, true);
                        });
                    }
                }
            });
        };
        keyboardEvents();
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
     * Add map handlers
     * @private
     */
    _addInteractionHandlers() {
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this._interactionModify.on('modifyend', (evt) => {
            const feature = evt.features.item(0);
            addFeatureToEditedList(feature);
            super.dispatchEvent(evt);
        });
        this._interactionModify.on('modifystart', (evt) => {
            super.dispatchEvent(evt);
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
        const controlEl = this._layersControl.render();
        this._selectDraw = controlEl.querySelector('.wfst--tools-control--select-draw');
        this._controlWidgetToolsDiv.append(controlEl);
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
        this._keyRemove = getEditLayer()
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
     * @param feature
     * @private
     */
    _editModeOn(feature) {
        this._editFeatureOriginal = feature.clone();
        activateMode(Modes.Edit);
        // To refresh the style
        getEditLayer().getSource().changed();
        this._removeOverlayHelper(feature);
        this._controlApplyDiscardChanges = new EditControlChangesEl(feature);
        this._controlApplyDiscardChanges.on('cancel', ({ feature }) => {
            feature.setGeometry(this._editFeatureOriginal.getGeometry());
            removeFeatureFromEditList(feature);
            this._collectionModify.remove(feature);
        });
        this._controlApplyDiscardChanges.on('apply', ({ feature }) => {
            showLoading();
            this._collectionModify.remove(feature);
        });
        this._controlApplyDiscardChanges.on('delete', ({ feature }) => {
            this._deleteFeature(feature, true);
        });
        this._map.addControl(this._controlApplyDiscardChanges);
    }
    /**
     * @private
     */
    _editModeOff() {
        activateMode(null);
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
                getEditLayer().getSource().removeFeature(feature);
            });
            this._collectionModify.clear();
            const layerName = feature.get('_layerName_');
            const layer = this._options.layers.find((layer) => layer.get(BaseLayerProperty.NAME) === layerName);
            if (layer instanceof WfsLayer) {
                this._interactionWfsSelect.getFeatures().remove(feature);
            }
        };
        if (confirm) {
            const confirmModal = Modal.confirm(I18N.labels.confirmDelete, Object.assign({}, this._options.modal));
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
        // For now, only allow one element at time
        // @TODO: allow edit multiples elements
        if (this._collectionModify.getLength())
            return;
        if (layerName) {
            // Store the layer information inside the feature
            feature.set('_layerName_', layerName);
        }
        const props = feature ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                getEditLayer().getSource().addFeature(feature);
                this._collectionModify.push(feature);
                const overlay = new EditOverlay(feature, coordinate);
                // @ts-expect-error
                overlay.on('editFields', () => {
                    this._editFields.show(feature);
                });
                // @ts-expect-error
                overlay.on('editGeom', () => {
                    this._editModeOn(feature);
                });
                this._map.addOverlay(overlay);
                const layer = getStoredLayer(layerName);
                if (layer) {
                    layer.maybeLockFeature(feature.getId());
                }
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
            activateDrawButton();
            this._viewport.classList.add('draw-mode');
            addDrawInteraction(layer);
        }
        else {
            this._map.removeInteraction(this._interactionDraw);
            this._viewport.classList.remove('draw-mode');
        }
        activateMode(layer ? Modes.Draw : null);
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
        }
        if (this._interactionSelectModify) {
            this._interactionSelectModify.setActive(bool);
        }
        this._interactionModify.setActive(bool);
        if (this._interactionWfsSelect)
            this._interactionWfsSelect.setActive(bool);
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
