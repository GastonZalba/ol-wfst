import GeometryType from 'ol/geom/GeometryType';
import OverlayPositioning from 'ol/OverlayPositioning';
import TileState from 'ol/TileState';
import { MultiPoint, MultiPolygon, MultiLineString } from 'ol/geom';
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

var img = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e %3cpath d='M663 225l-58.5 58.5-120-120 58.5-58.5q9-9 22.5-9t22.5 9l75 75q9 9 9 22.5t-9 22.5zM96 552l354-354 120 120-354 354h-120v-120z'%3e%3c/path%3e%3c/svg%3e";

var img$1 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='448' height='448' viewBox='0 0 448 448'%3e %3cpath d='M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z'%3e%3c/path%3e%3c/svg%3e";

var img$2 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='541' height='512' viewBox='0 0 541 512'%3e %3cpath fill='black' d='M103.306 228.483l129.493-125.249c-17.662-4.272-31.226-18.148-34.98-35.663l-0.055-0.307-129.852 125.248c17.812 4.15 31.53 18.061 35.339 35.662l0.056 0.308z'%3e%3c/path%3e %3cpath fill='black' d='M459.052 393.010c-13.486-8.329-22.346-23.018-22.373-39.779v-0.004c-0.053-0.817-0.082-1.772-0.082-2.733s0.030-1.916 0.089-2.863l-0.007 0.13-149.852 71.94c9.598 8.565 15.611 20.969 15.611 34.779 0 0.014 0 0.029 0 0.043v-0.002c-0.048 5.164-0.94 10.104-2.544 14.711l0.098-0.322z'%3e%3c/path%3e %3cpath fill='black' d='M290.207 57.553c-0.009 15.55-7.606 29.324-19.289 37.819l-0.135 0.093 118.054 46.69c-0.216-1.608-0.346-3.48-0.36-5.379v-0.017c0.033-16.948 9.077-31.778 22.596-39.953l0.209-0.118-122.298-48.056c0.659 2.633 1.098 5.693 1.221 8.834l0.002 0.087z'%3e%3c/path%3e %3cpath fill='black' d='M241.36 410.132l-138.629-160.067c-4.734 17.421-18.861 30.61-36.472 33.911l-0.29 0.045 143.881 166.255c1.668-18.735 14.197-34.162 31.183-40.044l0.327-0.099z'%3e%3c/path%3e %3cpath fill='black' d='M243.446 115.105c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM243.446 21.582c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.104-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M483.224 410.78c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.552 25.767 57.552 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM483.224 317.257c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M57.553 295.531c-31.785 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.785 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM57.553 202.008c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c-0.041-19.835-16.13-35.898-35.97-35.898 0 0 0 0 0 0v0z'%3e%3c/path%3e %3cpath fill='black' d='M256.036 512.072c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.786-25.767 57.553-57.553 57.553v0zM256.036 418.55c-19.866 0-35.97 16.104-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e %3cpath fill='black' d='M435.24 194.239c-31.786 0-57.553-25.767-57.553-57.553s25.767-57.553 57.553-57.553c31.786 0 57.553 25.767 57.553 57.553v0c0 31.785-25.767 57.553-57.553 57.553v0zM435.24 100.716c-19.866 0-35.97 16.105-35.97 35.97s16.105 35.97 35.97 35.97c19.866 0 35.97-16.105 35.97-35.97v0c0-19.866-16.105-35.97-35.97-35.97v0z'%3e%3c/path%3e%3c/svg%3e";

var img$3 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3e%3cpath d='M240 352h-240v128h480v-128h-240zM448 416h-64v-32h64v32zM112 160l128-128 128 128h-80v160h-96v-160z'%3e%3c/path%3e%3c/svg%3e";

var img$4 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M384 288q39 0 67.5 28.5t28.5 67.5-28.5 67.5-67.5 28.5-67.5-28.5-28.5-67.5 28.5-67.5 67.5-28.5zM384 544.5q66 0 113.25-47.25t47.25-113.25-47.25-113.25-113.25-47.25-113.25 47.25-47.25 113.25 47.25 113.25 113.25 47.25zM384 144q118.5 0 214.5 66t138 174q-42 108-138 174t-214.5 66-214.5-66-138-174q42-108 138-174t214.5-66z'%3e%3c/path%3e%3c/svg%3e";

var img$5 = "data:image/svg+xml,%3csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='768' height='768' viewBox='0 0 768 768'%3e%3cpath d='M379.5 288h4.5q39 0 67.5 28.5t28.5 67.5v6zM241.5 313.5q-18 36-18 70.5 0 66 47.25 113.25t113.25 47.25q34.5 0 70.5-18l-49.5-49.5q-12 3-21 3-39 0-67.5-28.5t-28.5-67.5q0-9 3-21zM64.5 136.5l40.5-40.5 567 567-40.5 40.5q-7.5-7.5-47.25-46.5t-60.75-60q-64.5 27-139.5 27-118.5 0-214.5-66t-138-174q16.5-39 51.75-86.25t68.25-72.75q-18-18-50.25-51t-36.75-37.5zM384 223.5q-30 0-58.5 12l-69-69q58.5-22.5 127.5-22.5 118.5 0 213.75 66t137.25 174q-36 88.5-109.5 151.5l-93-93q12-28.5 12-58.5 0-66-47.25-113.25t-113.25-47.25z'%3e%3c/path%3e%3c/svg%3e";

var es = {
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

var en = {
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

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}; // Ol
// Axis ordering: latitude/longitude

var DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
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

class Wfst {
  constructor(map, opt_options) {
    // Check if the selected language exists
    this._i18n = opt_options.language in i18n ? i18n[opt_options.language] : en;

    if (opt_options.i18n) {
      // Merge custom translations
      this._i18n = Object.assign(Object.assign({}, this._i18n), opt_options.i18n);
    } // Default options


    this.options = Object.assign({
      geoServerUrl: null,
      headers: {},
      layers: null,
      evtType: 'singleclick',
      active: true,
      showControl: true,
      useLockFeature: true,
      minZoom: 9,
      language: 'en',
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
          headerClose: "<button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"".concat(this._i18n.labels.close, "\"><span aria-hidden=\"true\">\xD7</span></button>")
        }
      }
    }, opt_options // Assign user options
    ); // GeoServer

    this._hasLockFeature = false;
    this._hasTransaction = false;
    this._geoServerCapabilities = null;
    this._geoServerData = {}; // Ol

    this.map = map;
    this.view = map.getView();
    this.viewport = map.getViewport();
    this._mapLayers = []; // Editing

    this._editedFeatures = new Set();
    this._layerToInsertElements = this.options.layers[0].name; // By default, the first layer is ready to accept new draws

    this._insertFeatures = [];
    this._updateFeatures = [];
    this._deleteFeatures = []; // Formats

    this._formatWFS = new WFS();
    this._formatGeoJSON = new GeoJSON();
    this._formatKml = new KML({
      extractStyles: false,
      showPointNames: false
    });
    this._xs = new XMLSerializer(); // State

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


  _initAsyncOperations() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this._createBaseControl();

        this._showLoading();

        yield this._connectToGeoServerAndGetCapabilities();

        if (this.options.layers) {
          yield this._getGeoserverLayersData(this.options.layers, this.options.geoServerUrl);

          this._createLayers(this.options.layers);
        }

        this._initMapElements(this.options.showControl, this.options.active);
      } catch (err) {
        this._hideLoading();

        this._showError(err.message);
      }
    });
  }
  /**
   * Creates a base control
   *
   * @private
   */


  _createBaseControl() {
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


  _connectToGeoServerAndGetCapabilities() {
    return __awaiter(this, void 0, void 0, function* () {
      /**
       * @private
       */
      var getCapabilities = () => __awaiter(this, void 0, void 0, function* () {
        var params = new URLSearchParams({
          service: 'wfs',
          version: '1.3.0',
          request: 'GetCapabilities',
          exceptions: 'application/json'
        });
        var url_fetch = this.options.geoServerUrl + '?' + params.toString();

        try {
          var response = yield fetch(url_fetch, {
            headers: this.options.headers
          });

          if (!response.ok) {
            throw new Error('');
          }

          var data = yield response.text();
          var capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
          return capabilities;
        } catch (err) {
          throw new Error(this._i18n.errors.capabilities);
        }
      });

      this._geoServerCapabilities = yield getCapabilities(); // Available operations in the geoserver

      var operations = this._geoServerCapabilities.getElementsByTagName('ows:Operation');

      Array.from(operations).forEach(operation => {
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
      var getLayerData = layerName => __awaiter(this, void 0, void 0, function* () {
        var params = new URLSearchParams({
          service: 'wfs',
          version: '1.1.0',
          request: 'DescribeFeatureType',
          typeName: layerName,
          outputFormat: 'application/json',
          exceptions: 'application/json'
        });
        var url_fetch = geoServerUrl + '?' + params.toString();
        var response = yield fetch(url_fetch, {
          headers: this.options.headers
        });

        if (!response.ok) {
          throw new Error('');
        }

        return yield response.json();
      });

      for (var layer of layers) {
        var layerName = layer.name;
        var layerLabel = layer.label || layerName;

        try {
          var data = yield getLayerData(layerName);

          if (data) {
            var targetNamespace = data.targetNamespace;
            var properties = data.featureTypes[0].properties; // Find the geometry field

            var geom = properties.find(el => el.type.indexOf('gml:') >= 0);
            this._geoServerData[layerName] = {
              namespace: targetNamespace,
              properties: properties,
              geomType: geom.localType,
              geomField: geom.name
            };
          }
        } catch (err) {
          throw new Error("".concat(this._i18n.errors.layer, " \"").concat(layerLabel, "\""));
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
    var _this = this;

    var layerLoaded = 0;
    var layersNumber = 0; // Only count visibles

    /**
     * When all the data is loaded, hide the loading
     * @private
     */

    var addLayerLoaded = () => {
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


    var newWmsLayer = layerParams => {
      var layerName = layerParams.name;
      var cqlFilter = layerParams.cqlFilter;
      var buffer = layerParams.tilesBuffer;
      var params = {
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

      var source = new TileWMS({
        url: this.options.geoServerUrl,
        params: params,
        serverType: 'geoserver',
        tileLoadFunction: (tile, src) => __awaiter(this, void 0, void 0, function* () {
          try {
            var response = yield fetch(src, {
              headers: this.options.headers
            });

            if (!response.ok) {
              throw new Error('');
            }

            var data = yield response.blob();

            if (data !== undefined) {
              tile.getImage().src = URL.createObjectURL(data);
            } else {
              throw new Error('');
            }
          } catch (err) {
            tile.setState(TileState.ERROR);
          } finally {
            addLayerLoaded();
          }
        })
      });
      var layer_options = Object.assign({
        name: layerName,
        type: '_wms_',
        minZoom: this.options.minZoom,
        source: source,
        visible: true,
        zIndex: 4
      }, layerParams);
      var layer = new Tile(layer_options);
      return layer;
    };
    /**
     *
     * @param layerParams
     * @private
     */


    var newWfsLayer = layerParams => {
      var layerName = layerParams.name;
      var cqlFilter = layerParams.cqlFilter;
      var strategy = layerParams.wfsStrategy || 'bbox';
      var source = new Vector$1({
        format: new GeoJSON(),
        strategy: strategy === 'bbox' ? bbox : all,
        loader: extent => __awaiter(this, void 0, void 0, function* () {
          var params = new URLSearchParams({
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
          } // If bbox, add extent to the request


          if (strategy === 'bbox') {
            var extentGeoServer = transformExtent(extent, this.view.getProjection().getCode(), DEFAULT_GEOSERVER_SRS); // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
            // request features using a bounding box with CRS maybe different from featureTypes native CRS

            params.append('bbox', extentGeoServer.join(',') + ',EPSG:4326');
          }

          var url_fetch = this.options.geoServerUrl + '?' + params.toString();

          try {
            var response = yield fetch(url_fetch, {
              headers: this.options.headers
            });

            if (!response.ok) {
              throw new Error('');
            }

            var data = yield response.json();
            var features = source.getFormat().readFeatures(data, {
              featureProjection: this.view.getProjection().getCode(),
              dataProjection: DEFAULT_GEOSERVER_SRS
            });
            features.forEach(feature => {
              feature.set('_layerName_', layerName,
              /* silent = */
              true);
            });
            source.addFeatures(features);
          } catch (err) {
            this._showError(this._i18n.errors.geoserver);

            console.error(err);
            source.removeLoadedExtent(extent);
          } finally {
            addLayerLoaded();
          }
        })
      });
      var layer_options = Object.assign({
        name: layerName,
        type: '_wfs_',
        minZoom: this.options.minZoom,
        source: source,
        visible: true,
        zIndex: 2
      }, layerParams);
      var layer = new Vector(layer_options);
      return layer;
    };

    var _loop = function _loop(layerParams) {
      var layerName = layerParams.name; // Only create the layer if we can get the GeoserverData

      if (_this._geoServerData[layerName]) {
        var layer;

        var _layerParams = _this.options.layers.find(e => e.name === layerName);

        var mode = _layerParams.mode; // If mode is undefined, by default use wfs

        if (!mode) {
          _layerParams.mode = 'wfs';
        }

        if (_layerParams.mode === 'wfs') {
          layer = newWfsLayer(_layerParams);
        } else {
          layer = newWmsLayer(_layerParams);
        }

        if (layer.getVisible()) layersNumber++;

        _this.map.addLayer(layer);

        _this._mapLayers[layerName] = layer;
      }
    };

    for (var layerParams of layers) {
      _loop(layerParams);
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
      // VectorLayer to store features on editing and isnerting
      this._createEditLayer();

      this._addInteractions();

      this._addHandlers();

      if (showControl) {
        this._addMapControl();
      } // By default, init in edit mode


      this.activateEditMode(active);
    });
  }
  /**
   * @private
   */


  _addInteractions() {
    // Select the wfs feature already downloaded
    var prepareWfsInteraction = () => {
      this.collectionModify = new Collection(); // Interaction to select wfs layer elements

      this.interactionWfsSelect = new Select({
        hitTolerance: 10,
        style: feature => this._styleFunction(feature),
        toggleCondition: never,
        filter: (feature, layer) => {
          return !this._isEditModeOn && layer && layer.get('type') === '_wfs_';
        }
      });
      this.map.addInteraction(this.interactionWfsSelect);
      this.interactionWfsSelect.on('select', (_ref) => {
        var {
          selected,
          deselected,
          mapBrowserEvent
        } = _ref;
        var coordinate = mapBrowserEvent.coordinate;

        if (selected.length) {
          selected.forEach(feature => {
            if (!this._editedFeatures.has(String(feature.getId()))) {
              // Remove the feature from the original layer
              var layer = this.interactionWfsSelect.getLayer(feature);
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
              this.collectionModify.remove(feature);
            });
          }
        }
      });
    };
    /**
     * Call the geoserver to get the clicked feature
     * @private
     */


    var prepareWmsInteraction = () => {
      // Interaction to allow select features in the edit layer
      this.interactionSelectModify = new Select({
        style: feature => this._styleFunction(feature),
        layers: [this._editLayer],
        toggleCondition: never,
        removeCondition: () => this._isEditModeOn ? true : false // Prevent deselect on clicking outside the feature

      });
      this.map.addInteraction(this.interactionSelectModify);
      this.collectionModify = this.interactionSelectModify.getFeatures();

      var getFeatures = evt => __awaiter(this, void 0, void 0, function* () {
        var _this2 = this;

        var _loop2 = function* _loop2(layerName) {
          var layer = _this2._mapLayers[layerName]; // If layer is hidden or is not a wms, skip

          if (!layer.getVisible() || !(layer.get('type') === '_wms_')) {
            return "continue";
          }

          var coordinate = evt.coordinate; // Si la vista es lejana, disminumos el buffer
          // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
          // y mejorar la sensibilidad en IOS

          var buffer = _this2.view.getZoom() > 10 ? 10 : 5;
          var source = layer.getSource(); // Fallback to support a bad name
          // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl

          var fallbackOl5 = 'getFeatureInfoUrl' in source ? 'getFeatureInfoUrl' : 'getGetFeatureInfoUrl';
          var url = source[fallbackOl5](coordinate, _this2.view.getResolution(), _this2.view.getProjection().getCode(), {
            INFO_FORMAT: 'application/json',
            BUFFER: buffer,
            FEATURE_COUNT: 1,
            EXCEPTIONS: 'application/json'
          });

          try {
            var response = yield fetch(url, {
              headers: _this2.options.headers
            });

            if (!response.ok) {
              throw new Error(_this2._i18n.errors.getFeatures + ' ' + response.status);
            }

            var data = yield response.json();

            var features = _this2._formatGeoJSON.readFeatures(data);

            if (!features.length) {
              return "continue";
            }

            features.forEach(feature => _this2._addFeatureToEdit(feature, coordinate, layerName));
          } catch (err) {
            _this2._showError(err.message);
          }
        };

        for (var layerName in this._mapLayers) {
          var _ret = yield* _loop2(layerName);

          if (_ret === "continue") continue;
        }
      });

      this._keyClickWms = this.map.on(this.options.evtType, evt => __awaiter(this, void 0, void 0, function* () {
        if (this.map.hasFeatureAtPixel(evt.pixel)) {
          return;
        }

        if (!this._isVisible) {
          return;
        } // Only get other features if editmode is disabled


        if (!this._isEditModeOn) {
          yield getFeatures(evt);
        }
      }));
    };

    if (this.options.layers.find(layer => layer.mode === 'wfs')) {
      prepareWfsInteraction();
    }

    if (this.options.layers.find(layer => layer.mode === 'wms')) {
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
        } else {
          return;
        }
      },
      features: this.collectionModify,
      condition: evt => {
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


  _createEditLayer() {
    this._editLayer = new Vector({
      source: new Vector$1(),
      zIndex: 5
    });
    this.map.addLayer(this._editLayer);
  }
  /**
   * Add map handlers
   *
   * @private
   */


  _addHandlers() {
    /**
     * @private
     */
    var keyboardEvents = () => {
      document.addEventListener('keydown', (_ref2) => {
        var {
          key
        } = _ref2;
        var inputFocus = document.querySelector('input:focus');

        if (inputFocus) {
          return;
        }

        if (key === 'Delete') {
          var selectedFeatures = this.collectionModify;

          if (selectedFeatures) {
            selectedFeatures.forEach(feature => {
              this._deleteFeature(feature, true);
            });
          }
        }
      });
    }; // When a feature is modified, add this to a list.
    // This prevent events fired on select and deselect features that has no changes and should
    // not be updated in the geoserver


    this.interactionModify.on('modifystart', evt => {
      this._addFeatureToEditedList(evt.features.item(0));
    });

    this._onDeselectFeatureEvent();

    this._onRemoveFeatureEvent();
    /**
     * @private
     */


    var handleZoomEnd = () => {
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

    this.map.on('moveend', () => {
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


  _addMapControl() {
    var createLayersControl = () => {
      var createLayerElements = layerParams => {
        var layerName = layerParams.name;
        var layerLabel = "<span title=\"".concat(this._geoServerData[layerName].geomType, "\">").concat(layerParams.label || layerName, "</span>");
        var visible = 'visible' in layerParams ? layerParams.visible : true;
        return "\n                <div class=\"wfst--layer-control \n                    ".concat(visible ? 'ol-wfst--visible-on' : '', "\n                    ").concat(layerName === this._layerToInsertElements ? 'ol-wfst--selected-on' : '', "\n                    \" data-layer=\"").concat(layerName, "\">\n                    <div class=\"ol-wfst--tools-control-visible\">\n                    <span class=\"ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on\" title=\"").concat(this._i18n.labels.toggleVisibility, "\">\n                      <img src=\"").concat(img$4, "\"/>\n                    </span>\n                    <span class=\"ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off\" title=\"").concat(this._i18n.labels.toggleVisibility, "\">\n                      <img src=\"").concat(img$5, "\"/>\n                    </span>\n                  </div>\n                    <label for=\"wfst--").concat(layerName, "\">\n                        <input value=\"").concat(layerName, "\" id=\"wfst--").concat(layerName, "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" ").concat(layerName === this._layerToInsertElements ? 'checked="checked"' : '', ">\n                        ").concat(layerLabel, "\n                    </label>\n                </div>");
      };

      var htmlLayers = '';
      Object.keys(this._mapLayers).map(key => htmlLayers += createLayerElements(this.options.layers.find(el => el.name === key)));
      var selectLayers = document.createElement('div');
      selectLayers.className = 'wfst--tools-control--select-layers';
      selectLayers.innerHTML = htmlLayers; // Layer Selector

      var radioInputs = selectLayers.querySelectorAll('input');
      radioInputs.forEach(radioInput => {
        var parentDiv = radioInput.closest('.wfst--layer-control');

        radioInput.onchange = () => {
          // Deselect DOM previous layer
          var selected = selectLayers.querySelector('.ol-wfst--selected-on');
          if (selected) selected.classList.remove('ol-wfst--selected-on'); // Select this layer

          parentDiv.classList.add('ol-wfst--selected-on');
          this._layerToInsertElements = radioInput.value;

          this._changeStateSelect(this._layerToInsertElements);
        };
      }); // Visibility toggler

      var visibilityBtn = selectLayers.querySelectorAll('.ol-wfst--tools-control-visible-btn');
      visibilityBtn.forEach(btn => {
        var parentDiv = btn.closest('.wfst--layer-control');
        var layerName = parentDiv.dataset['layer'];

        btn.onclick = () => {
          parentDiv.classList.toggle('ol-wfst--visible-on');
          var layer = this._mapLayers[layerName];

          if (parentDiv.classList.contains('ol-wfst--visible-on')) {
            layer.setVisible(true);
          } else {
            layer.setVisible(false);
          }
        };
      });
      return selectLayers;
    };

    var createHeadControl = () => {
      /**
       * @private
       */
      var createUploadElements = () => {
        var container = document.createElement('div'); // Upload button Tool

        var uploadButton = document.createElement('label');
        uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
        uploadButton.htmlFor = 'ol-wfst--upload';
        uploadButton.innerHTML = "<img src=\"".concat(img$3, "\"/> ");
        uploadButton.title = this._i18n.labels.uploadToLayer; // Hidden Input form

        var uploadInput = document.createElement('input');
        uploadInput.id = 'ol-wfst--upload';
        uploadInput.type = 'file';
        uploadInput.accept = this.options.uploadFormats;

        uploadInput.onchange = evt => this._processUploadFile(evt);

        container.append(uploadInput);
        container.append(uploadButton);
        return container;
      };

      var createDrawContainer = () => {
        var drawContainer = document.createElement('div');
        drawContainer.className = 'ol-wfst--tools-control-draw-cnt'; // Draw Tool

        var drawButton = document.createElement('button');
        drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
        drawButton.type = 'button';
        drawButton.innerHTML = "<img src=\"".concat(img, "\"/>");
        drawButton.title = this._i18n.labels.addElement;

        drawButton.onclick = () => {
          if (this._isDrawModeOn) {
            this._resetStateButtons();

            this.activateEditMode();
          } else {
            this.activateDrawMode(this._layerToInsertElements);
          }
        }; // Select geom type


        var select = document.createElement('select');
        select.title = this._i18n.labels.selectDrawType;
        select.className = 'wfst--tools-control--select-draw';

        select.onchange = () => {
          var selectedValue = select.value;

          this._changeStateSelect(this._layerToInsertElements, selectedValue);

          if (this._isDrawModeOn) {
            this.activateDrawMode(this._layerToInsertElements);
          }
        };

        var types = [GeometryType.POINT, GeometryType.MULTI_POINT, GeometryType.LINE_STRING, GeometryType.MULTI_LINE_STRING, GeometryType.POLYGON, GeometryType.MULTI_POLYGON, GeometryType.CIRCLE];

        for (var type of types) {
          var option = document.createElement('option');
          option.value = type;
          option.text = type;
          option.selected = this._geoServerData[this._layerToInsertElements].geomType === type || false;
          select.appendChild(option);
        }

        drawContainer.append(drawButton);
        drawContainer.append(select);
        this._selectDraw = select;
        return drawContainer;
      };

      var subControl = document.createElement('div');
      subControl.className = 'wfst--tools-control--head'; // Upload section

      if (this.options.showUpload) {
        var uploadSection = createUploadElements();
        subControl.append(uploadSection);
      }

      var drawContainer = createDrawContainer();
      subControl.append(drawContainer);
      return subControl;
    };

    var headControl = createHeadControl();

    this._controlWidgetToolsDiv.append(headControl);

    var htmlLayers = createLayersControl();

    this._controlWidgetToolsDiv.append(htmlLayers);
  }
  /**
   * Show Loading modal
   *
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


  _lockFeature(featureId, layerName) {
    var retry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return __awaiter(this, void 0, void 0, function* () {
      var params = new URLSearchParams({
        service: 'wfs',
        version: '1.1.0',
        request: 'LockFeature',
        expiry: String(5),
        LockId: 'GeoServer',
        typeName: layerName,
        releaseAction: 'SOME',
        exceptions: 'application/json',
        featureid: "".concat(featureId)
      });
      var url_fetch = this.options.geoServerUrl + '?' + params.toString();

      try {
        var response = yield fetch(url_fetch, {
          headers: this.options.headers
        });

        if (!response.ok) {
          throw new Error(this._i18n.errors.lockFeature);
        }

        var data = yield response.text();

        try {
          // First, check if is a JSON (with errors)
          var dataParsed = JSON.parse(data);

          if ('exceptions' in dataParsed) {
            var exceptions = dataParsed.exceptions;

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
    });
  }
  /**
   * Show modal with errors
   *
   * @param msg
   * @private
   */


  _showError(msg) {
    Modal.alert('Error: ' + msg, Object.assign({}, this.options.modal)).show();
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
      var transformCircleToPolygon = (feature, geom) => {
        var geomConverted = fromCircle(geom);
        feature.setGeometry(geomConverted);
      };

      var transformGeoemtryCollectionToGeometries = (feature, geom) => {
        var geomConverted = geom.getGeometries()[0];

        if (geomConverted.getType() === GeometryType.CIRCLE) {
          geomConverted = fromCircle(geomConverted);
        }

        feature.setGeometry(geomConverted);
      };

      features = Array.isArray(features) ? features : [features];

      var cloneFeature = feature => {
        this._removeFeatureFromEditList(feature);

        var featureProperties = feature.getProperties();
        delete featureProperties.boundedBy;
        delete featureProperties._layerName_;
        var clone = new Feature(featureProperties);
        clone.setId(feature.getId());
        return clone;
      };

      var refreshWmsLayer = layer => {
        var source = layer.getSource(); // Refrescamos el wms

        source.refresh(); // Force refresh the tiles

        var params = source.getParams();
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
      };

      var refreshWfsLayer = layer => {
        var source = layer.getSource(); // Refrescamos el wms

        source.refresh();
      };

      var clonedFeatures = [];

      for (var feature of features) {
        var clone = cloneFeature(feature);
        var cloneGeom = clone.getGeometry();
        var cloneGeomType = cloneGeom.getType(); // Ugly fix to support GeometryCollection on GML
        // See https://github.com/openlayers/openlayers/issues/4220

        if (cloneGeomType === GeometryType.GEOMETRY_COLLECTION) {
          transformGeoemtryCollectionToGeometries(clone, cloneGeom);
        } else if (cloneGeomType === GeometryType.CIRCLE) {
          // Geoserver has no Support to Circles
          transformCircleToPolygon(clone, cloneGeom);
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
      var numberRequest = this._countRequests;
      setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        // Prevent fire multiples times
        if (numberRequest !== this._countRequests) {
          return;
        }

        var srs = this.view.getProjection().getCode(); // Force latitude/longitude order on transactions
        // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3

        srs = srs === 'EPSG:4326' ? DEFAULT_GEOSERVER_SRS : srs;
        var options = {
          featureNS: this._geoServerData[layerName].namespace,
          featureType: layerName,
          srsName: srs,
          featurePrefix: null,
          nativeElements: null
        };

        var transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);

        var payload = this._xs.serializeToString(transaction);

        var geomType = this._geoServerData[layerName].geomType;
        var geomField = this._geoServerData[layerName].geomField; // Ugly fix to support GeometryCollection on GML
        // See https://github.com/openlayers/openlayers/issues/4220

        if (geomType === GeometryType.GEOMETRY_COLLECTION) {
          if (action === 'insert') {
            payload = payload.replace(/<geometry>/g, "<geometry><MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>"));
            payload = payload.replace(/<\/geometry>/g, "</geometryMember></MultiGeometry></geometry>");
          } else if (action === 'update') {
            var gmemberIn = "<MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"".concat(srs, "\"><geometryMember>");
            var gmemberOut = "</geometryMember></MultiGeometry>";
            payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, "$1$2".concat(gmemberIn, "$3").concat(gmemberOut, "$4$5"));
          }
        } // Fixes geometry name, weird bug with GML:
        // The property for the geometry column is always named "geometry"


        if (action === 'insert') {
          payload = payload.replace(/<(\/?)\bgeometry\b>/g, "<$1".concat(geomField, ">"));
        } else {
          payload = payload.replace(/<Name>geometry<\/Name>/g, "<Name>".concat(geomField, "</Name>"));
        } // Add default LockId value


        if (this._hasLockFeature && this._useLockFeature && action !== 'insert') {
          payload = payload.replace("</Transaction>", "<LockId>GeoServer</LockId></Transaction>");
        }

        try {
          var headers = Object.assign({
            'Content-Type': 'text/xml'
          }, this.options.headers);
          var response = yield fetch(this.options.geoServerUrl, {
            method: 'POST',
            body: payload,
            headers: headers
          });

          if (!response.ok) {
            throw new Error(this._i18n.errors.transaction + ' ' + response.status);
          }

          var parseResponse = this._formatWFS.readTransactionResponse(response);

          if (!Object.keys(parseResponse).length) {
            var responseStr = yield response.text();
            var findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);

            if (findError) {
              this._showError(findError[1]);
            }
          }

          if (action !== 'delete') {
            for (var _feature of features) {
              this._editLayer.getSource().removeFeature(_feature);
            }
          }

          var {
            mode
          } = this.options.layers.find(layer => layer.name === layerName);

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
    var layer = this._mapLayers[layerName];
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
    var checkIfFeatureIsChanged = feature => {
      var layerName = feature.get('_layerName_');
      var {
        mode
      } = this.options.layers.find(layer => layer.name === layerName);

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
    }; // This is fired when a feature is deselected and fires the transaction process


    this._keySelect = this.collectionModify.on('remove', evt => {
      var feature = evt.element;

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
    this._keyRemove = this._editLayer.getSource().on('removefeature', evt => {
      var feature = evt.feature;

      if (!feature.get('_delete_')) {
        return;
      }

      if (this._keySelect) {
        unByKey(this._keySelect);
      }

      var layerName = feature.get('_layerName_');

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
    var getVertexs = feature => {
      var geometry = feature.getGeometry();
      var type = geometry.getType();

      if (type === GeometryType.GEOMETRY_COLLECTION) {
        geometry = geometry.getGeometries()[0];
        type = geometry.getType();
      }

      var coordinates = geometry.getCoordinates();
      var flatCoordinates = null;

      if (type === GeometryType.POLYGON || type === GeometryType.MULTI_LINE_STRING) {
        flatCoordinates = coordinates.flat(1);
      } else if (type === GeometryType.MULTI_POLYGON) {
        flatCoordinates = coordinates.flat(2);
      } else {
        flatCoordinates = coordinates;
      }

      if (!flatCoordinates || !flatCoordinates.length) {
        return;
      }

      return new MultiPoint(flatCoordinates);
    };

    var geometry = feature.getGeometry();
    var type = geometry.getType();

    if (type === GeometryType.GEOMETRY_COLLECTION) {
      geometry = geometry.getGeometries()[0];
      type = geometry.getType();
    }

    switch (type) {
      case 'Point':
      case 'MultiPoint':
        if (this._isEditModeOn) {
          return [new Style({
            image: new Circle({
              radius: 6,
              fill: new Fill({
                color: '#000000'
              })
            })
          }), new Style({
            image: new Circle({
              radius: 4,
              fill: new Fill({
                color: '#ff0000'
              })
            })
          })];
        } else {
          return [new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: '#ff0000'
              })
            })
          }), new Style({
            image: new Circle({
              radius: 2,
              fill: new Fill({
                color: '#000000'
              })
            })
          })];
        }

      default:
        // If editing mode is active, show bigger vertex
        if (this._isEditModeOn || this._isDrawModeOn) {
          return [new Style({
            stroke: new Stroke({
              color: 'rgba( 255, 0, 0, 1)',
              width: 4
            }),
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.7)'
            })
          }), new Style({
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
            geometry: feature => getVertexs(feature)
          }), new Style({
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 0.7)',
              width: 2
            })
          })];
        } else {
          return [new Style({
            image: new Circle({
              radius: 2,
              fill: new Fill({
                color: '#000000'
              })
            }),
            geometry: feature => getVertexs(feature)
          }), new Style({
            stroke: new Stroke({
              color: '#ff0000',
              width: 4
            }),
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.7)'
            })
          })];
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
    this._isEditModeOn = true; // To refresh the style

    this._editLayer.getSource().changed();

    this._removeOverlayHelper(feature);

    var controlDiv = document.createElement('div');
    controlDiv.className = 'ol-wfst--changes-control';
    var elements = document.createElement('div');
    elements.className = 'ol-wfst--changes-control-el';
    var elementId = document.createElement('div');
    elementId.className = 'ol-wfst--changes-control-id';
    elementId.innerHTML = "<b>".concat(this._i18n.labels.editMode, "</b> - <i>").concat(String(feature.getId()), "</i>");
    var acceptButton = document.createElement('button');
    acceptButton.type = 'button';
    acceptButton.textContent = this._i18n.labels.apply;
    acceptButton.className = 'btn btn-primary';

    acceptButton.onclick = () => {
      this._showLoading();

      this.collectionModify.remove(feature);
    };

    var cancelButton = document.createElement('button');
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
    var deleteEl = () => {
      var features = Array.isArray(feature) ? feature : [feature];
      features.forEach(feature => {
        feature.set('_delete_', true, true);

        this._editLayer.getSource().removeFeature(feature);
      });
      this.collectionModify.clear();
      var layerName = feature.get('_layerName_');
      var {
        mode
      } = this.options.layers.find(layer => layer.name === layerName);

      if (mode === 'wfs') {
        this.interactionWfsSelect.getFeatures().remove(feature);
      }
    };

    if (confirm) {
      var confirmModal = Modal.confirm(this._i18n.labels.confirmDelete, Object.assign({}, this.options.modal));
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


  _addFeatureToEdit(feature) {
    var coordinate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var layerName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var prepareOverlay = () => {
      var svgFields = "<img src=\"".concat(img$1, "\"/>");
      var editFieldsEl = document.createElement('div');
      editFieldsEl.className = 'ol-wfst--edit-button-cnt';
      editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(this._i18n.labels.editFields, "\">").concat(svgFields, "</button>");

      editFieldsEl.onclick = () => {
        this._initEditFieldsModal(feature);
      };

      var buttons = document.createElement('div');
      buttons.append(editFieldsEl);
      var svgGeom = "<img src=\"".concat(img$2, "\"/>");
      var editGeomEl = document.createElement('div');
      editGeomEl.className = 'ol-wfst--edit-button-cnt';
      editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"".concat(this._i18n.labels.editGeom, "\">").concat(svgGeom, "</button>");

      editGeomEl.onclick = () => {
        this._editModeOn(feature);
      };

      buttons.append(editGeomEl);
      var position = coordinate || getCenter(feature.getGeometry().getExtent());
      var buttonsOverlay = new Overlay({
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

    var props = feature ? feature.getProperties() : '';

    if (props) {
      if (feature.getGeometry()) {
        this._editLayer.getSource().addFeature(feature);

        this.collectionModify.push(feature);
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
    var activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');

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
    var footer = "\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" data-dismiss=\"modal\">\n                ".concat(this._i18n.labels.cancel, "\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.upload, "\n            </button>\n        ");
    var modal = new Modal(Object.assign(Object.assign({}, this.options.modal), {
      header: true,
      headerClose: false,
      title: this._i18n.labels.uploadFeatures + ' ' + this._layerToInsertElements,
      content: content,
      backdrop: 'static',
      footer: footer
    })).show();
    modal.on('dismiss', (modal, event) => {
      // On saving changes
      if (event.target.dataset.action === 'save') {
        this._transactWFS('insert', featuresToInsert, this._layerToInsertElements);
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


  _processUploadFile(evt) {
    return __awaiter(this, void 0, void 0, function* () {
      /**
       * Read data file
       * @param file
       * @private
       */
      var fileReader = file => {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.addEventListener('load', e => __awaiter(this, void 0, void 0, function* () {
            var fileData = e.target.result;
            resolve(fileData);
          }));
          reader.addEventListener('error', err => {
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


      var fixGeometry = feature => {
        // Geometry of the layer
        var geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
        var geomTypeFeature = feature.getGeometry().getType();
        var geom;

        switch (geomTypeFeature) {
          case 'Point':
            {
              if (geomTypeLayer === 'MultiPoint') {
                var coords = feature.getGeometry().getCoordinates();
                geom = new MultiPoint([coords]);
              }

              break;
            }

          case 'LineString':
            if (geomTypeLayer === 'MultiLineString') {
              var _coords = feature.getGeometry().getCoordinates();

              geom = new MultiLineString([_coords]);
            }

            break;

          case 'Polygon':
            if (geomTypeLayer === 'MultiPolygon') {
              var _coords2 = feature.getGeometry().getCoordinates();

              geom = new MultiPolygon([_coords2]);
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


      var checkGeometry = feature => {
        // Geometry of the layer
        var geomTypeLayer = this._geoServerData[this._layerToInsertElements].geomType;
        var geomTypeFeature = feature.getGeometry().getType(); // This geom accepts every type of geometry

        if (geomTypeLayer === GeometryType.GEOMETRY_COLLECTION) {
          return true;
        }

        return geomTypeFeature === geomTypeLayer;
      };

      var file = evt.target.files[0];
      var features;

      if (!file) {
        return;
      }

      var extension = file.name.split('.').pop().toLowerCase();

      try {
        // If the user uses a custom fucntion...
        if (this.options.processUpload) {
          features = this.options.processUpload(file);
        } // If the user functions return features, we dont process anything more


        if (!features) {
          var string = yield fileReader(file);

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

      var invalidFeaturesCount = 0;
      var validFeaturesCount = 0;
      var featuresToInsert = [];

      for (var feature of features) {
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
        var content = "\n                ".concat(this._i18n.labels.validFeatures, ": ").concat(validFeaturesCount, "<br>\n                ").concat(invalidFeaturesCount ? "".concat(this._i18n.labels.invalidFeatures, ": ").concat(invalidFeaturesCount) : '', "\n            ");

        this._initUploadFileModal(content, featuresToInsert);

        this._editLayer.getSource().addFeatures(featuresToInsert);

        this.view.fit(this._editLayer.getSource().getExtent(), {
          size: this.map.getSize(),
          maxZoom: 21,
          padding: [100, 100, 100, 100]
        });
      } // Reset the input to allow another onChange trigger


      evt.target.value = null;
    });
  }
  /**
   * Update geom Types availibles to select for this layer
   *
   * @param layerName
   * @param geomDrawTypeSelected
   */


  _changeStateSelect(layerName) {
    var geomDrawTypeSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    /**
     * Set the geometry type in the select according to the geometry of
     * the layer in the geoserver and disable what does not correspond.
     *
     * @param value
     * @param options
     * @private
     */
    var setSelectState = (value, options) => {
      Array.from(this._selectDraw.options).forEach(option => {
        option.selected = option.value === value ? true : false;
        option.disabled = options === 'all' ? false : options.includes(option.value) ? false : true;
        option.title = option.disabled ? this._i18n.labels.geomTypeNotSupported : '';
      });
    };

    var drawType;

    if (this._selectDraw) {
      var geomLayer = this._geoServerData[layerName].geomType;

      if (geomDrawTypeSelected) {
        drawType = this._selectDraw.value;
      } else {
        if (geomLayer === GeometryType.GEOMETRY_COLLECTION) {
          drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection

          setSelectState(drawType, 'all');
        } else if (geomLayer === GeometryType.LINEAR_RING) {
          drawType = GeometryType.LINE_STRING; // Default drawing type for GeometryCollection

          setSelectState(drawType, [GeometryType.CIRCLE, GeometryType.LINEAR_RING, GeometryType.POLYGON]);
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


  activateDrawMode(layerName) {
    /**
     *
     * @param layerName
     * @private
     */
    var addDrawInteraction = layerName => {
      this.activateEditMode(false); // If already exists, remove

      if (this.interactionDraw) {
        this.map.removeInteraction(this.interactionDraw);
      }

      var geomDrawType = this._selectDraw.value;
      this.interactionDraw = new Draw({
        source: this._editLayer.getSource(),
        type: geomDrawType,
        style: feature => this._styleFunction(feature)
      });
      this.map.addInteraction(this.interactionDraw);

      var drawHandler = () => {
        this.interactionDraw.on('drawend', evt => {
          var feature = evt.feature;

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
      if (!this._mapLayers[layerName].getVisible()) {
        return;
      }

      var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');

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


  activateEditMode() {
    var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (bool) {
      var btn = document.querySelector('.ol-wfst--tools-control-btn-edit');

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
    if (this.interactionWfsSelect) this.interactionWfsSelect.setActive(bool);
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
    var properties = feature.getProperties();
    var layer = feature.get('_layerName_'); // Data schema from the geoserver

    var dataSchema = this._geoServerData[layer].properties;
    var content = '<form autocomplete="false">';
    Object.keys(properties).forEach(key => {
      // If the feature field exists in the geoserver and is not added by openlayers
      var field = dataSchema.find(data => data.name === key);

      if (field) {
        var typeXsd = field.type;
        var type;

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
          content += "\n                <div class=\"ol-wfst--input-field-container\">\n                    <label class=\"ol-wfst--input-field-label\" for=\"".concat(key, "\">").concat(key, "</label>\n                    <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"").concat(type, "\" name=\"").concat(key, "\" value=\"").concat(properties[key] || '', "\">\n                </div>");
        }
      }
    });
    content += '</form>';
    var footer = "\n            <button type=\"button\" class=\"btn btn-sm btn-link btn-third\" data-action=\"delete\" data-dismiss=\"modal\">\n                ".concat(this._i18n.labels.delete, "\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.cancel, "\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                ").concat(this._i18n.labels.save, "\n            </button>\n        ");
    var modal = new Modal(Object.assign(Object.assign({}, this.options.modal), {
      header: true,
      headerClose: true,
      title: "".concat(this._i18n.labels.editElement, " ").concat(this._editFeature.getId(), " "),
      content: content,
      footer: footer
    })).show();
    modal.on('dismiss', (modal, event) => {
      // On saving changes
      if (event.target.dataset.action === 'save') {
        var inputs = modal.el.querySelectorAll('input');
        inputs.forEach(el => {
          var value = el.value;
          var field = el.name;

          this._editFeature.set(field, value,
          /*isSilent = */
          true);
        });

        this._editFeature.changed();

        this._addFeatureToEditedList(this._editFeature); // Force deselect to trigger handler


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


  _removeOverlayHelper(feature) {
    var featureId = feature.getId();

    if (!featureId) {
      return;
    }

    var overlay = this.map.getOverlayById(featureId);

    if (!overlay) {
      return;
    }

    this.map.removeOverlay(overlay);
  }

}

export default Wfst;
