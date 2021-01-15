(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    var __assign = undefined && undefined.__assign || function () {
      __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };

    var __createBinding = undefined && undefined.__createBinding || (Object.create ? function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      Object.defineProperty(o, k2, {
        enumerable: true,
        get: function get() {
          return m[k];
        }
      });
    } : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });

    var __setModuleDefault = undefined && undefined.__setModuleDefault || (Object.create ? function (o, v) {
      Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
      });
    } : function (o, v) {
      o["default"] = v;
    });

    var __importStar = undefined && undefined.__importStar || function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) for (var k in mod) {
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }

      __setModuleDefault(result, mod);

      return result;
    };

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
    };

    var __generator = undefined && undefined.__generator || function (thisArg, body) {
      var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
          f,
          y,
          t,
          g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;

      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }

      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");

        while (_) {
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];

            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;

              case 4:
                _.label++;
                return {
                  value: op[1],
                  done: false
                };

              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;

              case 7:
                op = _.ops.pop();

                _.trys.pop();

                continue;

              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }

                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }

                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }

                if (t && _.label < t[2]) {
                  _.label = t[2];

                  _.ops.push(op);

                  break;
                }

                if (t[2]) _.ops.pop();

                _.trys.pop();

                continue;
            }

            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        }

        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };

    var __spreadArrays = undefined && undefined.__spreadArrays || function () {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
      }

      for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
          r[k] = a[j];
        }
      }

      return r;
    };

    var __importDefault = undefined && undefined.__importDefault || function (mod) {
      return mod && mod.__esModule ? mod : {
        "default": mod
      };
    };

    Object.defineProperty(exports, "__esModule", {
      value: true
    }); // Ol

    var ol_1 = require("ol");

    var format_1 = require("ol/format");

    var source_1 = require("ol/source");

    var layer_1 = require("ol/layer");

    var interaction_1 = require("ol/interaction");

    var Observable_1 = require("ol/Observable");

    var geom_1 = require("ol/geom");

    var loadingstrategy_1 = require("ol/loadingstrategy");

    var extent_1 = require("ol/extent");

    var style_1 = require("ol/style");

    var condition_1 = require("ol/events/condition");

    var control_1 = require("ol/control");

    var OverlayPositioning_1 = __importDefault(require("ol/OverlayPositioning"));

    var TileState_1 = __importDefault(require("ol/TileState"));

    var proj_1 = require("ol/proj"); // External


    var modal_vanilla_1 = __importDefault(require("modal-vanilla")); // Images


    var draw_svg_1 = __importDefault(require("./assets/images/draw.svg"));

    var select_svg_1 = __importDefault(require("./assets/images/select.svg"));

    var editGeom_svg_1 = __importDefault(require("./assets/images/editGeom.svg"));

    var editFields_svg_1 = __importDefault(require("./assets/images/editFields.svg"));

    var upload_svg_1 = __importDefault(require("./assets/images/upload.svg"));

    var languages = __importStar(require("./assets/i18n/index"));

    var GeometryType_1 = __importDefault(require("ol/geom/GeometryType"));

    var Polygon_1 = require("ol/geom/Polygon");

    var DEFAULT_GEOSERVER_SRS = 'urn:x-ogc:def:crs:EPSG:4326';
    /**
     * @constructor
     * @param {class} map
     * @param {object} opt_options
     */

    var Wfst =
    /** @class */
    function () {
      function Wfst(map, opt_options) {
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
        }; // Assign user options

        this.options = __assign(__assign({}, this.options), opt_options); // Language support

        this._i18n = languages[this.options.language]; // GeoServer

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

        this._formatWFS = new format_1.WFS();
        this._formatGeoJSON = new format_1.GeoJSON();
        this._formatKml = new format_1.KML({
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
       * Connect to the GeoServer, get Capabilities,
       * get each layer specs and create the layers and map controllers.
       *
       * @param layers
       * @param showControl
       * @param active
       * @private
       */


      Wfst.prototype._initAsyncOperations = function () {
        return __awaiter(this, void 0, void 0, function () {
          var err_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 4,, 5]);

                return [4
                /*yield*/
                , this._connectToGeoServer()];

              case 1:
                _a.sent();

                if (!this.options.layers) return [3
                /*break*/
                , 3];
                return [4
                /*yield*/
                , this._getGeoserverLayersData(this.options.layers, this.options.geoServerUrl)];

              case 2:
                _a.sent();

                this._createLayers(this.options.layers);

                _a.label = 3;

              case 3:
                this._initMapElements(this.options.showControl, this.options.active);

                return [3
                /*break*/
                , 5];

              case 4:
                err_1 = _a.sent();

                this._showError(err_1.message);

                return [3
                /*break*/
                , 5];

              case 5:
                return [2
                /*return*/
                ];
            }
          });
        });
      };
      /**
       * Get the capabilities from the GeoServer and check
       * all the available operations.
       *
       * @private
       */


      Wfst.prototype._connectToGeoServer = function () {
        return __awaiter(this, void 0, void 0, function () {
          var getCapabilities, _a, operations, _i, _b, operation;

          var _this = this;

          return __generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                getCapabilities = function getCapabilities() {
                  return __awaiter(_this, void 0, void 0, function () {
                    var params, url_fetch, response, data, capabilities, err_2;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          params = new URLSearchParams({
                            service: 'wfs',
                            version: '1.3.0',
                            request: 'GetCapabilities',
                            exceptions: 'application/json'
                          });
                          url_fetch = this.options.geoServerUrl + '?' + params.toString();
                          _a.label = 1;

                        case 1:
                          _a.trys.push([1, 4,, 5]);

                          return [4
                          /*yield*/
                          , fetch(url_fetch, {
                            headers: this.options.headers
                          })];

                        case 2:
                          response = _a.sent();

                          if (!response.ok) {
                            throw new Error('');
                          }

                          return [4
                          /*yield*/
                          , response.text()];

                        case 3:
                          data = _a.sent();
                          capabilities = new window.DOMParser().parseFromString(data, 'text/xml');
                          return [2
                          /*return*/
                          , capabilities];

                        case 4:
                          err_2 = _a.sent();
                          throw new Error(this._i18n.errors.capabilities);

                        case 5:
                          return [2
                          /*return*/
                          ];
                      }
                    });
                  });
                };

                _a = this;
                return [4
                /*yield*/
                , getCapabilities()];

              case 1:
                _a._geoServerCapabilities = _c.sent();
                operations = this._geoServerCapabilities.getElementsByTagName("ows:Operation");

                for (_i = 0, _b = operations; _i < _b.length; _i++) {
                  operation = _b[_i];
                  if (operation.getAttribute('name') === 'Transaction') this._hasTransaction = true;else if (operation.getAttribute('name') === 'LockFeature') this._hasLockFeature = true;
                }

                if (!this._hasTransaction) throw new Error(this._i18n.errors.wfst);
                return [2
                /*return*/
                , true];
            }
          });
        });
      };
      /**
       * Request and store data layers obtained by DescribeFeatureType
       *
       * @param layers
       * @param geoServerUrl
       * @private
       */


      Wfst.prototype._getGeoserverLayersData = function (layers, geoServerUrl) {
        return __awaiter(this, void 0, void 0, function () {
          var getLayerData, _i, layers_1, layer, layerName, layerLabel, data, targetNamespace, properties, geom, err_3;

          var _this = this;

          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                getLayerData = function getLayerData(layerName) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var params, url_fetch, response;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          params = new URLSearchParams({
                            service: 'wfs',
                            version: '2.0.0',
                            request: 'DescribeFeatureType',
                            typeNames: layerName,
                            outputFormat: 'application/json',
                            exceptions: 'application/json'
                          });
                          url_fetch = geoServerUrl + '?' + params.toString();
                          return [4
                          /*yield*/
                          , fetch(url_fetch, {
                            headers: this.options.headers
                          })];

                        case 1:
                          response = _a.sent();

                          if (!response.ok) {
                            throw new Error('');
                          }

                          return [4
                          /*yield*/
                          , response.json()];

                        case 2:
                          return [2
                          /*return*/
                          , _a.sent()];
                      }
                    });
                  });
                };

                _i = 0, layers_1 = layers;
                _a.label = 1;

              case 1:
                if (!(_i < layers_1.length)) return [3
                /*break*/
                , 6];
                layer = layers_1[_i];
                layerName = layer.name;
                layerLabel = layer.label || layerName;
                _a.label = 2;

              case 2:
                _a.trys.push([2, 4,, 5]);

                return [4
                /*yield*/
                , getLayerData(layerName)];

              case 3:
                data = _a.sent();

                if (data) {
                  targetNamespace = data.targetNamespace;
                  properties = data.featureTypes[0].properties;
                  geom = properties.find(function (el) {
                    return el.type.indexOf('gml:') >= 0;
                  });
                  this._geoServerData[layerName] = {
                    namespace: targetNamespace,
                    properties: properties,
                    geomType: geom.localType,
                    geomField: geom.name
                  };
                }

                return [3
                /*break*/
                , 5];

              case 4:
                err_3 = _a.sent();

                this._showError(this._i18n.errors.layer + " \"" + layerLabel + "\"");

                return [3
                /*break*/
                , 5];

              case 5:
                _i++;
                return [3
                /*break*/
                , 1];

              case 6:
                return [2
                /*return*/
                ];
            }
          });
        });
      };
      /**
       * Create map layers in wfs o wms modes.
       *
       * @param layers
       * @private
       */


      Wfst.prototype._createLayers = function (layers) {
        var _this = this;

        var newWmsLayer = function newWmsLayer(layerParams) {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var params = {
            'SERVICE': 'WMS',
            'LAYERS': layerName,
            'TILED': true
          };

          if (cqlFilter) {
            params['CQL_FILTER'] = cqlFilter;
          }

          var layer = new layer_1.Tile({
            source: new source_1.TileWMS({
              url: _this.options.geoServerUrl,
              params: params,
              serverType: 'geoserver',
              tileLoadFunction: function tileLoadFunction(tile, src) {
                return __awaiter(_this, void 0, void 0, function () {
                  var response, data, err_4;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        _a.trys.push([0, 3,, 4]);

                        return [4
                        /*yield*/
                        , fetch(src, {
                          headers: this.options.headers
                        })];

                      case 1:
                        response = _a.sent();

                        if (!response.ok) {
                          throw new Error('');
                        }

                        return [4
                        /*yield*/
                        , response.blob()];

                      case 2:
                        data = _a.sent();

                        if (data !== undefined) {
                          tile.getImage().src = URL.createObjectURL(data);
                        } else {
                          throw new Error('');
                        }

                        return [3
                        /*break*/
                        , 4];

                      case 3:
                        err_4 = _a.sent();
                        tile.setState(TileState_1.default.ERROR);
                        return [3
                        /*break*/
                        , 4];

                      case 4:
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }
            }),
            zIndex: 4,
            minZoom: _this.options.minZoom
          });
          layer.setProperties({
            name: layerName,
            type: "_wms_"
          });
          return layer;
        };

        var newWfsLayer = function newWfsLayer(layerParams) {
          var layerName = layerParams.name;
          var cqlFilter = layerParams.cql_filter;
          var source = new source_1.Vector({
            format: new format_1.GeoJSON(),
            strategy: _this.options.wfsStrategy === 'bbox' ? loadingstrategy_1.bbox : loadingstrategy_1.all,
            loader: function loader(extent) {
              return __awaiter(_this, void 0, void 0, function () {
                var params, extentGeoServer, url_fetch, response, data, features, err_5;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      params = new URLSearchParams({
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


                      if (this.options.wfsStrategy === 'bbox') {
                        extentGeoServer = proj_1.transformExtent(extent, this.view.getProjection().getCode(), DEFAULT_GEOSERVER_SRS);
                        params.append('bbox', extentGeoServer.join(','));
                      }

                      url_fetch = this.options.geoServerUrl + '?' + params.toString();
                      _a.label = 1;

                    case 1:
                      _a.trys.push([1, 4,, 5]);

                      return [4
                      /*yield*/
                      , fetch(url_fetch, {
                        headers: this.options.headers
                      })];

                    case 2:
                      response = _a.sent();

                      if (!response.ok) {
                        throw new Error('');
                      }

                      return [4
                      /*yield*/
                      , response.json()];

                    case 3:
                      data = _a.sent();
                      features = source.getFormat().readFeatures(data, {
                        featureProjection: this.view.getProjection().getCode(),
                        dataProjection: DEFAULT_GEOSERVER_SRS
                      });
                      features.forEach(function (feature) {
                        feature.set('_layerName_', layerName,
                        /* silent = */
                        true);
                      });
                      source.addFeatures(features);
                      return [3
                      /*break*/
                      , 5];

                    case 4:
                      err_5 = _a.sent();

                      this._showError(this._i18n.errors.geoserver);

                      console.error(err_5);
                      source.removeLoadedExtent(extent);
                      return [3
                      /*break*/
                      , 5];

                    case 5:
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }
          });
          var layer = new layer_1.Vector({
            visible: _this._isVisible,
            minZoom: _this.options.minZoom,
            source: source,
            zIndex: 2
          });
          layer.setProperties({
            name: layerName,
            type: "_wfs_"
          });
          return layer;
        };

        layers.forEach(function (layerParams) {
          var layerName = layerParams.name; // Only create the layer if we can get the GeoserverData

          if (_this._geoServerData[layerName]) {
            var layer = void 0;

            if (_this.options.layerMode === 'wms') {
              layer = newWmsLayer(layerParams);
            } else {
              layer = newWfsLayer(layerParams);
            }

            _this.map.addLayer(layer);

            _this._mapLayers[layerName] = layer;
          }
        });
      };
      /**
       * Create the edit layer to allow modify elements, add interactions,
       * map controllers and keyboard handlers.
       *
       * @param showControl
       * @param active
       * @private
       */


      Wfst.prototype._initMapElements = function (showControl, active) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            // VectorLayer to store features on editing and isnerting
            this._createEditLayer();

            this._addInteractions();

            this._addHandlers();

            if (showControl) this._addControlTools(); // By default, init in edit mode

            this.activateEditMode(active);
            return [2
            /*return*/
            ];
          });
        });
      };
      /**
       * @private
       */


      Wfst.prototype._addInteractions = function () {
        var _this = this; // Select the wfs feature already downloaded


        var prepareWfsInteraction = function prepareWfsInteraction() {
          // Interaction to select wfs layer elements
          _this.interactionWfsSelect = new interaction_1.Select({
            hitTolerance: 10,
            style: function style(feature) {
              return _this._styleFunction(feature);
            },
            filter: function filter(feature, layer) {
              return !_this._isEditModeOn && layer && layer.get('type') === '_wfs_';
            }
          });

          _this.map.addInteraction(_this.interactionWfsSelect);

          _this.interactionWfsSelect.on('select', function (_a) {
            var selected = _a.selected,
                deselected = _a.deselected,
                mapBrowserEvent = _a.mapBrowserEvent;
            var coordinate = mapBrowserEvent.coordinate;

            if (selected.length) {
              selected.forEach(function (feature) {
                if (!_this._editedFeatures.has(String(feature.getId()))) {
                  // Remove the feature from the original layer                            
                  var layer = _this.interactionWfsSelect.getLayer(feature);

                  layer.getSource().removeFeature(feature);

                  _this._addFeatureToEdit(feature, coordinate);
                }
              });
            }
          });
        }; // Call the geoserver to get the clicked feature


        var prepareWmsInteraction = function prepareWmsInteraction() {
          var getFeatures = function getFeatures(evt) {
            return __awaiter(_this, void 0, void 0, function () {
              var _loop_1, this_1, _a, _b, _i, layerName;

              var _this = this;

              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    _loop_1 = function _loop_1(layerName) {
                      var layer, coordinate, buffer, url, response, data, features, err_6;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            layer = this_1._mapLayers[layerName];
                            coordinate = evt.coordinate;
                            buffer = this_1.view.getZoom() > 10 ? 10 : 5;
                            url = layer.getSource().getFeatureInfoUrl(coordinate, this_1.view.getResolution(), this_1.view.getProjection().getCode(), {
                              'INFO_FORMAT': 'application/json',
                              'BUFFER': buffer,
                              'FEATURE_COUNT': 1,
                              'EXCEPTIONS': 'application/json'
                            });
                            _a.label = 1;

                          case 1:
                            _a.trys.push([1, 4,, 5]);

                            return [4
                            /*yield*/
                            , fetch(url, {
                              headers: this_1.options.headers
                            })];

                          case 2:
                            response = _a.sent();

                            if (!response.ok) {
                              throw new Error(this_1._i18n.errors.getFeatures + " " + response.status);
                            }

                            return [4
                            /*yield*/
                            , response.json()];

                          case 3:
                            data = _a.sent();
                            features = this_1._formatGeoJSON.readFeatures(data);
                            if (!features.length) return [2
                            /*return*/
                            , "continue"];
                            features.forEach(function (feature) {
                              return _this._addFeatureToEdit(feature, coordinate, layerName);
                            });
                            return [3
                            /*break*/
                            , 5];

                          case 4:
                            err_6 = _a.sent();

                            this_1._showError(err_6.message);

                            return [3
                            /*break*/
                            , 5];

                          case 5:
                            return [2
                            /*return*/
                            ];
                        }
                      });
                    };

                    this_1 = this;
                    _a = [];

                    for (_b in this._mapLayers) {
                      _a.push(_b);
                    }

                    _i = 0;
                    _c.label = 1;

                  case 1:
                    if (!(_i < _a.length)) return [3
                    /*break*/
                    , 4];
                    layerName = _a[_i];
                    return [5
                    /*yield**/
                    , _loop_1(layerName)];

                  case 2:
                    _c.sent();

                    _c.label = 3;

                  case 3:
                    _i++;
                    return [3
                    /*break*/
                    , 1];

                  case 4:
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          };

          _this._keyClickWms = _this.map.on(_this.options.evtType, function (evt) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (this.map.hasFeatureAtPixel(evt.pixel)) return [2
                    /*return*/
                    ];
                    if (!this._isVisible) return [2
                    /*return*/
                    ];
                    if (!!this._isEditModeOn) return [3
                    /*break*/
                    , 2];
                    return [4
                    /*yield*/
                    , getFeatures(evt)];

                  case 1:
                    _a.sent();

                    _a.label = 2;

                  case 2:
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          });
        };

        if (this.options.layerMode === 'wfs') prepareWfsInteraction();else if (this.options.layerMode === 'wms') prepareWmsInteraction(); // Interaction to allow select features in the edit layer

        this.interactionSelectModify = new interaction_1.Select({
          style: function style(feature) {
            return _this._styleFunction(feature);
          },
          layers: [this._editLayer],
          toggleCondition: condition_1.never,
          removeCondition: function removeCondition(evt) {
            return _this._isEditModeOn ? true : false;
          } // Prevent deselect on clicking outside the feature

        });
        this.map.addInteraction(this.interactionSelectModify);
        this.interactionModify = new interaction_1.Modify({
          style: function style() {
            if (_this._isEditModeOn) {
              return new style_1.Style({
                image: new style_1.Circle({
                  radius: 6,
                  fill: new style_1.Fill({
                    color: '#ff0000'
                  }),
                  stroke: new style_1.Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                  })
                })
              });
            } else {
              return;
            }
          },
          features: this.interactionSelectModify.getFeatures(),
          condition: function condition(evt) {
            return condition_1.primaryAction(evt) && _this._isEditModeOn;
          }
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new interaction_1.Snap({
          source: this._editLayer.getSource()
        });
        this.map.addInteraction(this.interactionSnap);
      };
      /**
       * Layer to store temporary the elements to be edited
       *
       * @private
       */


      Wfst.prototype._createEditLayer = function () {
        var _this = this;

        this._editLayer = new layer_1.Vector({
          source: new source_1.Vector(),
          zIndex: 5,
          style: function style(feature) {
            return _this._styleFunction(feature);
          }
        });
        this.map.addLayer(this._editLayer);
      };
      /**
       * Add map handlers
       *
       * @private
       */


      Wfst.prototype._addHandlers = function () {
        var _this = this;

        var keyboardEvents = function keyboardEvents() {
          document.addEventListener('keydown', function (_a) {
            var key = _a.key;
            var inputFocus = document.querySelector('input:focus');
            if (inputFocus) return;

            if (key === "Delete") {
              var selectedFeatures = _this.interactionSelectModify.getFeatures();

              if (selectedFeatures) {
                selectedFeatures.forEach(function (feature) {
                  _this._deleteElement(feature, true);
                });
              }
            }
          });
        }; // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver


        this.interactionModify.on('modifystart', function (evt) {
          _this._addFeatureToEditedList(evt.features.item(0));
        });

        this._onDeselectFeatureEvent();

        this._onRemoveFeatureEvent();

        var handleZoomEnd = function handleZoomEnd() {
          if (_this._currentZoom > _this.options.minZoom) {
            // Show the layers
            if (!_this._isVisible) {
              _this._isVisible = true;
            }
          } else {
            // Hide the layer
            if (_this._isVisible) {
              _this._isVisible = false;
            }
          }
        };

        this.map.on('moveend', function () {
          _this._currentZoom = _this.view.getZoom();
          if (_this._currentZoom !== _this._lastZoom) handleZoomEnd();
          _this._lastZoom = _this._currentZoom;
        });
        keyboardEvents();
      };
      /**
      * Add the widget on the map to allow change the tools and select active layers
      * @private
      */


      Wfst.prototype._addControlTools = function () {
        var _this = this;

        var createUploadElements = function createUploadElements() {
          var container = document.createElement('div'); // Upload button Tool

          var uploadButton = document.createElement('label');
          uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
          uploadButton.htmlFor = 'ol-wfst--upload';
          uploadButton.innerHTML = "<img src=\"" + upload_svg_1.default + "\"/> ";
          uploadButton.title = _this._i18n.labels.uploadToLayer; // Hidden Input form

          var uploadInput = document.createElement('input');
          uploadInput.id = 'ol-wfst--upload';
          uploadInput.type = 'file';
          uploadInput.accept = _this.options.uploadFormats;

          uploadInput.onchange = function (evt) {
            return _this._processUploadFile(evt);
          };

          container.append(uploadInput);
          container.append(uploadButton);
          return container;
        };

        var createToolSelector = function createToolSelector() {
          var controlDiv = document.createElement('div');
          controlDiv.className = 'ol-wfst--tools-control'; // Select Tool

          var selectionButton = document.createElement('button');
          selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
          selectionButton.type = 'button';
          selectionButton.innerHTML = "<img src=\"" + select_svg_1.default + "\"/>";
          selectionButton.title = _this._i18n.labels.select;

          selectionButton.onclick = function () {
            _this._resetStateButtons();

            _this.activateEditMode();
          }; // Draw Tool


          var drawButton = document.createElement('button');
          drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
          drawButton.type = 'button';
          drawButton.innerHTML = "<img src = \"" + draw_svg_1.default + "\"/>";
          drawButton.title = _this._i18n.labels.addElement;

          drawButton.onclick = function () {
            _this._resetStateButtons();

            _this.activateDrawMode(_this._layerToInsertElements);
          }; // Buttons container


          var buttons = document.createElement('div');
          buttons.className = 'wfst--tools-control--buttons';
          buttons.append(selectionButton);
          buttons.append(drawButton);
          _this._controlWidgetTools = new control_1.Control({
            element: controlDiv
          });
          controlDiv.append(buttons);
          return controlDiv;
        };

        var createSubControl = function createSubControl() {
          var createSelectDrawElement = function createSelectDrawElement() {
            var select = document.createElement('select');
            select.className = 'wfst--tools-control--select-draw';
            select.disabled = _this._geoServerData[_this._layerToInsertElements].geomType === GeometryType_1.default.GEOMETRY_COLLECTION ? false : true;

            select.onchange = function () {
              _this.activateDrawMode(_this._layerToInsertElements, select.value);
            };

            var types = [GeometryType_1.default.LINE_STRING, GeometryType_1.default.POLYGON, GeometryType_1.default.POINT, GeometryType_1.default.CIRCLE];

            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
              var type = types_1[_i];
              var option = document.createElement('option');
              option.value = type;
              option.text = type;
              option.selected = _this._geoServerData[_this._layerToInsertElements].geomType === type || false;
              select.appendChild(option);
            }

            return select;
          };

          var createLayerElements = function createLayerElements(layerParams) {
            var layerName = layerParams.name;
            var layerLabel = "<span title=\"" + _this._geoServerData[layerName].geomType + "\">" + (layerParams.label || layerName) + "</span>";
            return "\n                <div>\n                    <label for=\"wfst--" + layerName + "\">\n                        <input value=\"" + layerName + "\" id=\"wfst--" + layerName + "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" " + (layerName === _this._layerToInsertElements ? 'checked="checked"' : '') + ">\n                        " + layerLabel + "\n                    </label>\n                </div>";
          };

          var subControl = document.createElement('div');
          subControl.className = 'wfst--tools-control--sub-control';
          _this._selectDraw = createSelectDrawElement();
          subControl.append(_this._selectDraw);
          var htmlLayers = Object.keys(_this._mapLayers).map(function (key) {
            return createLayerElements(_this.options.layers.find(function (el) {
              return el.name === key;
            }));
          });
          var selectLayers = document.createElement('div');
          selectLayers.className = 'wfst--tools-control--select-layers';
          selectLayers.innerHTML = htmlLayers.join('');
          subControl.append(selectLayers);
          var radioInputs = subControl.querySelectorAll('input');
          radioInputs.forEach(function (radioInput) {
            radioInput.onchange = function () {
              _this._layerToInsertElements = radioInput.value;

              _this._resetStateButtons();

              _this.activateDrawMode(_this._layerToInsertElements);
            };
          });
          return subControl;
        };

        var controlDiv = createToolSelector();
        var subControl = createSubControl();
        controlDiv.append(subControl); // Upload section

        if (this.options.upload) {
          var uploadSection = createUploadElements();
          subControl.append(uploadSection);
        }

        this.map.addControl(this._controlWidgetTools);
      };
      /**
       * Lock a feature in the geoserver before edit
       *
       * @param featureId
       * @param layerName
       * @param retry
       * @private
       */


      Wfst.prototype._lockFeature = function (featureId, layerName, retry) {
        if (retry === void 0) {
          retry = 0;
        }

        return __awaiter(this, void 0, void 0, function () {
          var params, url_fetch, response, data, err_7;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                params = new URLSearchParams({
                  service: 'wfs',
                  version: '1.1.0',
                  request: 'LockFeature',
                  expiry: String(5),
                  LockId: 'GeoServer',
                  typeName: layerName,
                  releaseAction: 'SOME',
                  exceptions: 'application/json',
                  featureid: "" + featureId
                });
                url_fetch = this.options.geoServerUrl + '?' + params.toString();
                _a.label = 1;

              case 1:
                _a.trys.push([1, 4,, 5]);

                return [4
                /*yield*/
                , fetch(url_fetch, {
                  headers: this.options.headers
                })];

              case 2:
                response = _a.sent();

                if (!response.ok) {
                  throw new Error(this._i18n.errors.lockFeature);
                }

                return [4
                /*yield*/
                , response.text()];

              case 3:
                data = _a.sent();

                try {
                  // First, check if is a JSON (with errors)
                  data = JSON.parse(data);

                  if ('exceptions' in data) {
                    if (data.exceptions[0].code === "CannotLockAllFeatures") {
                      // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                      if (!retry) this._lockFeature(featureId, layerName, 1);else this._showError(this._i18n.errors.lockFeature);
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

                return [2
                /*return*/
                , data];

              case 4:
                err_7 = _a.sent();

                this._showError(err_7.message);

                return [3
                /*break*/
                , 5];

              case 5:
                return [2
                /*return*/
                ];
            }
          });
        });
      };
      /**
       * Show modal with errors
       *
       * @param msg
       * @private
       */


      Wfst.prototype._showError = function (msg) {
        modal_vanilla_1.default.alert('Error: ' + msg, {
          animateInClass: 'in'
        }).show();
      };
      /**
       * Make the WFS Transactions
       *
       * @param mode
       * @param features
       * @param layerName
       * @private
       */


      Wfst.prototype._transactWFS = function (mode, features, layerName) {
        return __awaiter(this, void 0, void 0, function () {
          var cloneFeature, refreshWmsLayer, refreshWfsLayer, clonedFeatures, _i, features_1, feature, clone, cloneGeom, geom, geom, numberRequest;

          var _this = this;

          return __generator(this, function (_a) {
            features = Array.isArray(features) ? features : [features];

            cloneFeature = function cloneFeature(feature) {
              _this._removeFeatureFromEditList(feature);

              var featureProperties = feature.getProperties();
              delete featureProperties.boundedBy;
              delete featureProperties._layerName_;
              var clone = new ol_1.Feature(featureProperties);
              clone.setId(feature.getId());
              return clone;
            };

            refreshWmsLayer = function refreshWmsLayer(layer) {
              var source = layer.getSource(); // Refrescamos el wms

              source.refresh(); // Force refresh the tiles

              var params = source.getParams();
              params.t = new Date().getMilliseconds();
              source.updateParams(params);
            };

            refreshWfsLayer = function refreshWfsLayer(layer) {
              var source = layer.getSource(); // Refrescamos el wms

              source.refresh();
            };

            clonedFeatures = [];

            for (_i = 0, features_1 = features; _i < features_1.length; _i++) {
              feature = features_1[_i];
              clone = cloneFeature(feature);
              cloneGeom = clone.getGeometry(); // Ugly fix to support GeometryCollection on GML
              // See https://github.com/openlayers/openlayers/issues/4220

              if (cloneGeom.getType() === GeometryType_1.default.GEOMETRY_COLLECTION) {
                geom = cloneGeom.getGeometries()[0];
                clone.setGeometry(geom);
              } else if (cloneGeom.getType() === GeometryType_1.default.CIRCLE) {
                geom = Polygon_1.fromCircle(cloneGeom);
                clone.setGeometry(geom);
              }

              if (mode === 'insert') {
                // Filters
                if (this.options.beforeInsertFeature) {
                  clone = this.options.beforeInsertFeature(clone);
                }
              }

              if (clone) clonedFeatures.push(clone);
            }

            if (!clonedFeatures.length) {
              return [2
              /*return*/
              , this._showError(this._i18n.errors.noValidGeometry)];
            }

            switch (mode) {
              case 'insert':
                this._insertFeatures = __spreadArrays(this._insertFeatures, clonedFeatures);
                break;

              case 'update':
                this._updateFeatures = __spreadArrays(this._updateFeatures, clonedFeatures);
                break;

              case 'delete':
                this._deleteFeatures = __spreadArrays(this._deleteFeatures, clonedFeatures);
                break;
            }

            this._countRequests++;
            numberRequest = this._countRequests;
            setTimeout(function () {
              return __awaiter(_this, void 0, void 0, function () {
                var srs, options, transaction, payload, geomType, geomField, gmemberIn, gmemberOut, headers, response, parseResponse, responseStr, findError, _i, _a, feature, err_8;

                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      // Prevent fire multiples times   
                      if (numberRequest !== this._countRequests) return [2
                      /*return*/
                      ];
                      srs = this.view.getProjection().getCode(); // Force latitude/longitude order on transactions
                      // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3

                      srs = srs === 'EPSG:4326' ? DEFAULT_GEOSERVER_SRS : srs;
                      options = {
                        featureNS: this._geoServerData[layerName].namespace,
                        featureType: layerName,
                        srsName: srs,
                        featurePrefix: null,
                        nativeElements: null
                      };
                      transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                      payload = this._xs.serializeToString(transaction);
                      geomType = this._geoServerData[layerName].geomType;
                      geomField = this._geoServerData[layerName].geomField; // Ugly fix to support GeometryCollection on GML
                      // See https://github.com/openlayers/openlayers/issues/4220

                      if (geomType === GeometryType_1.default.GEOMETRY_COLLECTION) {
                        if (mode === 'insert') {
                          payload = payload.replace(/<geometry>/g, "<geometry><MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"" + srs + "\"><geometryMember>");
                          payload = payload.replace(/<\/geometry>/g, "</geometryMember></MultiGeometry></geometry>");
                        } else if (mode === 'update') {
                          gmemberIn = "<MultiGeometry xmlns=\"http://www.opengis.net/gml\" srsName=\"" + srs + "\"><geometryMember>";
                          gmemberOut = "</geometryMember></MultiGeometry>";
                          payload = payload.replace(/(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g, "$1$2" + gmemberIn + "$3" + gmemberOut + "$4$5");
                        }
                      }

                      if (mode === 'insert') {
                        // Fixes geometry name, weird bug with GML:
                        // The property for the geometry column is always named "geometry"
                        payload = payload.replace(/(.*?)(<geometry>)(.*)(<\/geometry>)(.*)/g, "$1<" + geomField + ">$3</" + geomField + ">$5");
                      } else {
                        payload = payload.replace(/<Name>geometry<\/Name>/g, "<Name>" + geomField + "</Name>");
                      } // Add default LockId value


                      if (this._hasLockFeature && this._useLockFeature && mode !== 'insert') {
                        payload = payload.replace("</Transaction>", "<LockId>GeoServer</LockId></Transaction>");
                      }

                      _b.label = 1;

                    case 1:
                      _b.trys.push([1, 5,, 6]);

                      headers = __assign({
                        'Content-Type': 'text/xml',
                        'Access-Control-Allow-Origin': '*'
                      }, this.options.headers);
                      return [4
                      /*yield*/
                      , fetch(this.options.geoServerUrl, {
                        method: 'POST',
                        body: payload,
                        headers: headers
                      })];

                    case 2:
                      response = _b.sent();

                      if (!response.ok) {
                        throw new Error(this._i18n.errors.transaction + " " + response.status);
                      }

                      parseResponse = this._formatWFS.readTransactionResponse(response);
                      if (!!Object.keys(parseResponse).length) return [3
                      /*break*/
                      , 4];
                      return [4
                      /*yield*/
                      , response.text()];

                    case 3:
                      responseStr = _b.sent();
                      findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                      if (findError) this._showError(findError[1]);
                      _b.label = 4;

                    case 4:
                      if (mode !== 'delete') {
                        for (_i = 0, _a = features; _i < _a.length; _i++) {
                          feature = _a[_i];

                          this._editLayer.getSource().removeFeature(feature);
                        }
                      }

                      if (this.options.layerMode === 'wfs') refreshWfsLayer(this._mapLayers[layerName]);else if (this.options.layerMode === 'wms') refreshWmsLayer(this._mapLayers[layerName]);
                      return [3
                      /*break*/
                      , 6];

                    case 5:
                      err_8 = _b.sent();
                      console.error(err_8);
                      return [3
                      /*break*/
                      , 6];

                    case 6:
                      this._insertFeatures = [];
                      this._updateFeatures = [];
                      this._deleteFeatures = [];
                      this._countRequests = 0;
                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }, 300);
            return [2
            /*return*/
            ];
          });
        });
      };
      /**
       *
       * @param feature
       * @private
       */


      Wfst.prototype._addFeatureToEditedList = function (feature) {
        this._editedFeatures.add(String(feature.getId()));
      };
      /**
       *
       * @param feature
       * @private
       */


      Wfst.prototype._removeFeatureFromEditList = function (feature) {
        this._editedFeatures.delete(String(feature.getId()));
      };
      /**
       *
       * @param feature
       * @private
       */


      Wfst.prototype._isFeatureEdited = function (feature) {
        return this._editedFeatures.has(String(feature.getId()));
      };
      /**
       *
       * @param feature
       * @private
       */


      Wfst.prototype._cancelEditFeature = function (feature) {
        this._removeOverlayHelper(feature);

        this._editModeOff();
      };
      /**
       * Trigger on deselecting a feature from in the Edit layer
       *
       * @private
       */


      Wfst.prototype._onDeselectFeatureEvent = function () {
        var _this = this;

        var finishEditFeature = function finishEditFeature(feature) {
          Observable_1.unByKey(_this._keyRemove);
          var layerName = feature.get('_layerName_');

          if (_this._isFeatureEdited(feature)) {
            _this._transactWFS('update', feature, layerName);
          } else {
            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (_this.options.layerMode === 'wfs') {
              var layer = _this._mapLayers[layerName];
              layer.getSource().addFeature(feature);

              _this.interactionWfsSelect.getFeatures().remove(feature);
            }

            _this.interactionSelectModify.getFeatures().remove(feature);

            _this._editLayer.getSource().removeFeature(feature);
          }

          setTimeout(function () {
            _this._onRemoveFeatureEvent();
          }, 150);
        }; // This is fired when a feature is deselected and fires the transaction process


        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', function (evt) {
          var feature = evt.element;

          _this._cancelEditFeature(feature);

          finishEditFeature(feature);
        });
      };
      /**
       * Trigger on removing a feature from the Edit layer
       *
       * @private
       */


      Wfst.prototype._onRemoveFeatureEvent = function () {
        var _this = this; // If a feature is removed from the edit layer


        this._keyRemove = this._editLayer.getSource().on('removefeature', function (evt) {
          if (_this._keySelect) Observable_1.unByKey(_this._keySelect);
          var feature = evt.feature;
          var layerName = feature.get('_layerName_');

          _this._transactWFS('delete', feature, layerName);

          _this._cancelEditFeature(feature);

          if (_this._keySelect) {
            setTimeout(function () {
              _this._onDeselectFeatureEvent();
            }, 150);
          }
        });
      };
      /**
       * Master style that handles two modes on the Edit Layer:
       * - one is the basic, showing only the vertices
       * - and the other when modify is active, showing bigger vertices
       *
       * @param feature
       * @private
       */


      Wfst.prototype._styleFunction = function (feature) {
        var geometry = feature.getGeometry();
        var type = geometry.getType();

        if (type === GeometryType_1.default.GEOMETRY_COLLECTION) {
          geometry = geometry.getGeometries()[0];
          type = geometry.getType();
        }

        switch (type) {
          case 'Point':
          case 'MultiPoint':
            if (this._isEditModeOn) {
              return [new style_1.Style({
                image: new style_1.Circle({
                  radius: 6,
                  fill: new style_1.Fill({
                    color: '#000000'
                  })
                })
              }), new style_1.Style({
                image: new style_1.Circle({
                  radius: 4,
                  fill: new style_1.Fill({
                    color: '#ff0000'
                  })
                })
              })];
            } else {
              return [new style_1.Style({
                image: new style_1.Circle({
                  radius: 5,
                  fill: new style_1.Fill({
                    color: '#ff0000'
                  })
                })
              }), new style_1.Style({
                image: new style_1.Circle({
                  radius: 2,
                  fill: new style_1.Fill({
                    color: '#000000'
                  })
                })
              })];
            }

          default:
            if (this._isEditModeOn || this._isDrawModeOn) {
              return [new style_1.Style({
                stroke: new style_1.Stroke({
                  color: 'rgba( 255, 0, 0, 1)',
                  width: 4
                }),
                fill: new style_1.Fill({
                  color: 'rgba(255, 0, 0, 0.7)'
                })
              }), new style_1.Style({
                image: new style_1.Circle({
                  radius: 4,
                  fill: new style_1.Fill({
                    color: '#ff0000'
                  }),
                  stroke: new style_1.Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                  })
                }),
                geometry: function geometry(feature) {
                  var geometry = feature.getGeometry();
                  var type = geometry.getType();

                  if (type === GeometryType_1.default.GEOMETRY_COLLECTION) {
                    geometry = geometry.getGeometries()[0];
                    type = geometry.getType();
                  }
                  var coordinates = geometry.getCoordinates();

                  if (type == GeometryType_1.default.POLYGON || type == GeometryType_1.default.MULTI_LINE_STRING) {
                    coordinates = coordinates.flat(1);
                  }

                  if (!coordinates || !coordinates.length) return;
                  return new geom_1.MultiPoint(coordinates);
                }
              }), new style_1.Style({
                stroke: new style_1.Stroke({
                  color: 'rgba(255, 255, 255, 0.7)',
                  width: 2
                })
              })];
            } else {
              return [new style_1.Style({
                image: new style_1.Circle({
                  radius: 2,
                  fill: new style_1.Fill({
                    color: '#000000'
                  })
                }),
                geometry: function geometry(feature) {
                  var geometry = feature.getGeometry();
                  var type = geometry.getType();

                  if (type === GeometryType_1.default.GEOMETRY_COLLECTION) {
                    geometry = geometry.getGeometries()[0];
                  }
                  var coordinates = geometry.getCoordinates();

                  if (type == GeometryType_1.default.POLYGON || type == GeometryType_1.default.MULTI_LINE_STRING) {
                    coordinates = coordinates.flat(1);
                  }

                  if (!coordinates.length) return;
                  return new geom_1.MultiPoint(coordinates);
                }
              }), new style_1.Style({
                stroke: new style_1.Stroke({
                  color: '#ff0000',
                  width: 4
                }),
                fill: new style_1.Fill({
                  color: 'rgba(255, 0, 0, 0.7)'
                })
              })];
            }

        }
      };
      /**
       *
       * @param feature
       * @private
       */


      Wfst.prototype._editModeOn = function (feature) {
        var _this = this;

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
        elementId.innerHTML = "<b>" + this._i18n.labels.editMode + "</b> - <i>" + String(feature.getId()) + "</i>";
        var acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = this._i18n.labels.apply;
        acceptButton.className = 'btn btn-primary';

        acceptButton.onclick = function () {
          _this.interactionSelectModify.getFeatures().remove(feature);
        };

        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = this._i18n.labels.cancel;
        cancelButton.className = 'btn btn-secondary';

        cancelButton.onclick = function () {
          feature.setGeometry(_this._editFeatureOriginal.getGeometry());

          _this._removeFeatureFromEditList(feature);

          _this.interactionSelectModify.getFeatures().remove(feature);
        };

        elements.append(elementId);
        elements.append(cancelButton);
        elements.append(acceptButton);
        controlDiv.append(elements);
        this._controlApplyDiscardChanges = new control_1.Control({
          element: controlDiv
        });
        this.map.addControl(this._controlApplyDiscardChanges);
      };
      /**
       * @private
       */


      Wfst.prototype._editModeOff = function () {
        this._isEditModeOn = false;
        this.map.removeControl(this._controlApplyDiscardChanges);
      };
      /**
       * Remove a feature from the edit Layer and from the Geoserver
       *
       * @param feature
       * @private
       */


      Wfst.prototype._deleteElement = function (feature, confirm) {
        var _this = this;

        var deleteEl = function deleteEl() {
          var features = Array.isArray(feature) ? feature : [feature];
          features.forEach(function (feature) {
            return _this._editLayer.getSource().removeFeature(feature);
          });

          _this.interactionSelectModify.getFeatures().clear();
        };

        if (confirm) {
          var confirmModal = modal_vanilla_1.default.confirm(this._i18n.labels.confirmDelete, {
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
      };
      /**
       * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
       *
       * @param feature
       * @param coordinate
       * @param layerName
       * @private
       */


      Wfst.prototype._addFeatureToEdit = function (feature, coordinate, layerName) {
        var _this = this;

        if (coordinate === void 0) {
          coordinate = null;
        }

        if (layerName === void 0) {
          layerName = null;
        }

        var prepareOverlay = function prepareOverlay() {
          var svgFields = "<img src=\"" + editFields_svg_1.default + "\"/>";
          var editFieldsEl = document.createElement('div');
          editFieldsEl.className = 'ol-wfst--edit-button-cnt';
          editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"" + _this._i18n.labels.editFields + "\">" + svgFields + "</button>";

          editFieldsEl.onclick = function () {
            _this._initEditFieldsModal(feature);
          };

          var buttons = document.createElement('div');
          buttons.append(editFieldsEl);
          var svgGeom = "<img src=\"" + editGeom_svg_1.default + "\"/>";
          var editGeomEl = document.createElement('div');
          editGeomEl.className = 'ol-wfst--edit-button-cnt';
          editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"" + _this._i18n.labels.editGeom + "\">" + svgGeom + "</button>";

          editGeomEl.onclick = function () {
            _this._editModeOn(feature);
          };

          buttons.append(editGeomEl);
          var position = coordinate || extent_1.getCenter(feature.getGeometry().getExtent());
          var buttonsOverlay = new ol_1.Overlay({
            id: feature.getId(),
            position: position,
            positioning: OverlayPositioning_1.default.CENTER_CENTER,
            element: buttons,
            offset: [0, -40],
            stopEvent: true
          });

          _this.map.addOverlay(buttonsOverlay);
        };

        if (layerName) {
          // Guardamos el nombre de la capa de donde sale la feature
          feature.set('_layerName_', layerName);
        }

        var props = feature ? feature.getProperties() : '';

        if (props) {
          if (feature.getGeometry()) {
            this._editLayer.getSource().addFeature(feature);

            this.interactionSelectModify.getFeatures().push(feature);
            prepareOverlay();
            if (this._useLockFeature && this._hasLockFeature) this._lockFeature(feature.getId(), feature.get('_layerName_'));
          }
        }
      };
      /**
       * Removes in the DOM the class of the tools
       * @private
       */


      Wfst.prototype._resetStateButtons = function () {
        var activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
        if (activeBtn) activeBtn.classList.remove('wfst--active');
      };
      /**
      * Confirm modal before transact to the GeoServer the features in the file
      *
      * @param feature
      * @private
      */


      Wfst.prototype._initUploadFileModal = function (content, featuresToInsert) {
        var _this = this;

        var footer = "\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">\n                " + this._i18n.labels.cancel + "\n            </button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                " + this._i18n.labels.upload + "\n            </button>\n        ";
        var modal = new modal_vanilla_1.default({
          header: true,
          headerClose: false,
          title: this._i18n.labels.uploadFeatures + ' ' + this._layerToInsertElements,
          content: content,
          backdrop: 'static',
          footer: footer,
          animateInClass: 'in'
        }).show();
        modal.on('dismiss', function (modal, event) {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            _this._transactWFS('insert', featuresToInsert, _this._layerToInsertElements);
          } else {
            // On cancel button
            Observable_1.unByKey(_this._keyRemove);

            _this._editLayer.getSource().clear();

            setTimeout(function () {
              _this._onRemoveFeatureEvent();
            }, 150);
          }
        });
      };
      /**
       * Parse and check geometry of uploaded files
       *
       * @param evt
       * @private
       */


      Wfst.prototype._processUploadFile = function (evt) {
        return __awaiter(this, void 0, void 0, function () {
          var fileReader, fixGeometry, checkGeometry, file, features, extension, string, err_9, invalidFeaturesCount, validFeaturesCount, featuresToInsert, _i, features_2, feature, content;

          var _this = this;

          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                fileReader = function fileReader(file) {
                  return new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.addEventListener('load', function (e) {
                      return __awaiter(_this, void 0, void 0, function () {
                        var fileData;
                        return __generator(this, function (_a) {
                          fileData = e.target.result;
                          resolve(fileData);
                          return [2
                          /*return*/
                          ];
                        });
                      });
                    });
                    reader.addEventListener('error', function (err) {
                      console.error('Error' + err);
                      reject();
                    });
                    reader.readAsText(file);
                  });
                };

                fixGeometry = function fixGeometry(feature) {
                  // Geometry of the layer
                  var geomTypeLayer = _this._geoServerData[_this._layerToInsertElements].geomType;
                  var geomTypeFeature = feature.getGeometry().getType();
                  var geom;

                  switch (geomTypeFeature) {
                    case 'Point':
                      {
                        if (geomTypeLayer === 'MultiPoint') {
                          var coords = feature.getGeometry().getCoordinates();
                          geom = new geom_1.MultiPoint([coords]);
                        }

                        break;
                      }

                    case 'LineString':
                      if (geomTypeLayer === 'MultiLineString') {
                        var coords = feature.getGeometry().getCoordinates();
                        geom = new geom_1.MultiLineString([coords]);
                      }

                      break;

                    case 'Polygon':
                      if (geomTypeLayer === 'MultiPolygon') {
                        var coords = feature.getGeometry().getCoordinates();
                        geom = new geom_1.MultiPolygon([coords]);
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

                checkGeometry = function checkGeometry(feature) {
                  // Geometry of the layer
                  var geomTypeLayer = _this._geoServerData[_this._layerToInsertElements].geomType;
                  var geomTypeFeature = feature.getGeometry().getType(); // This geom accepts every type of geometry

                  if (geomTypeLayer === GeometryType_1.default.GEOMETRY_COLLECTION) return true;
                  return geomTypeFeature === geomTypeLayer;
                };

                file = evt.target.files[0];
                if (!file) return [2
                /*return*/
                ];
                extension = file.name.split('.').pop().toLowerCase();
                _a.label = 1;

              case 1:
                _a.trys.push([1, 4,, 5]); // If the user uses a custom fucntion...


                if (this.options.processUpload) {
                  features = this.options.processUpload(file);
                }

                if (!!features) return [3
                /*break*/
                , 3];
                return [4
                /*yield*/
                , fileReader(file)];

              case 2:
                string = _a.sent();

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

                _a.label = 3;

              case 3:
                return [3
                /*break*/
                , 5];

              case 4:
                err_9 = _a.sent();

                this._showError(this._i18n.errors.badFile);

                return [3
                /*break*/
                , 5];

              case 5:
                invalidFeaturesCount = 0;
                validFeaturesCount = 0;
                featuresToInsert = [];

                for (_i = 0, features_2 = features; _i < features_2.length; _i++) {
                  feature = features_2[_i]; // If the geometry doesn't correspond to the layer, try to fixit.
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
                  content = "\n                " + this._i18n.labels.validFeatures + ": " + validFeaturesCount + "<br>\n                " + (invalidFeaturesCount ? this._i18n.labels.invalidFeatures + ": " + invalidFeaturesCount : '') + "\n            ";

                  this._initUploadFileModal(content, featuresToInsert);

                  this._editLayer.getSource().addFeatures(featuresToInsert);

                  this.view.fit(this._editLayer.getSource().getExtent(), {
                    size: this.map.getSize(),
                    maxZoom: 21,
                    padding: [100, 100, 100, 100]
                  });
                } // Reset the input to allow another onChange trigger


                evt.target.value = null;
                return [2
                /*return*/
                ];
            }
          });
        });
      };
      /**
       * Add features to the geoserver, in a custom layer
       * witout verifiyn geometry and showing modal to confirm.
       *
       * @param layerName
       * @param features
       * @public
       */


      Wfst.prototype.insertFeaturesTo = function (layerName, features) {
        this._transactWFS('insert', features, layerName);
      };
      /**
       * Activate/deactivate the draw mode
       * @param layerName
       * @public
       */


      Wfst.prototype.activateDrawMode = function (layerName, geomDrawTypeSelected) {
        var _this = this;

        if (geomDrawTypeSelected === void 0) {
          geomDrawTypeSelected = null;
        }

        var getDrawTypeSelected = function getDrawTypeSelected(layerName) {
          var drawType;

          if (_this._selectDraw) {
            var geomLayer = _this._geoServerData[layerName].geomType;
            var geomTypeForSelect = geomLayer.replace('Multi', ''); // If a draw Type is selected, is a GeometryCollection

            if (geomDrawTypeSelected) {
              drawType = _this._selectDraw.value;
            } else {
              if (geomLayer === GeometryType_1.default.GEOMETRY_COLLECTION) {
                drawType = GeometryType_1.default.POINT; // Default drawing type for GeometryCollection

                _this._selectDraw.value = drawType;
                _this._selectDraw.disabled = false;
              } else {
                drawType = geomLayer;
                _this._selectDraw.value = geomTypeForSelect;
                _this._selectDraw.disabled = true;
              }
            }
          }

          return drawType;
        };

        var addDrawInteraction = function addDrawInteraction(layerName) {
          _this.activateEditMode(false); // If already exists, remove


          if (_this.interactionDraw) _this.map.removeInteraction(_this.interactionDraw);
          var geomDrawType = getDrawTypeSelected(layerName);
          _this.interactionDraw = new interaction_1.Draw({
            source: _this._editLayer.getSource(),
            type: geomDrawType,
            style: function style(feature) {
              return _this._styleFunction(feature);
            }
          });

          _this.map.addInteraction(_this.interactionDraw);

          var drawHandler = function drawHandler() {
            _this.interactionDraw.on('drawend', function (evt) {
              Observable_1.unByKey(_this._keyRemove);
              var feature = evt.feature;

              _this._transactWFS('insert', feature, layerName);

              setTimeout(function () {
                _this._onRemoveFeatureEvent();
              }, 150);
            });
          };

          drawHandler();
        };

        if (!this.interactionDraw && !layerName) return;
        this._isDrawModeOn = layerName ? true : false;

        if (layerName) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
          if (btn) btn.classList.add('wfst--active');
          this.viewport.classList.add('draw-mode');
          addDrawInteraction(String(layerName));
        } else {
          this.map.removeInteraction(this.interactionDraw);
          this.viewport.classList.remove('draw-mode');
        }
      };
      /**
       * Activate/desactivate the edit mode
       * @param bool
       * @public
       */


      Wfst.prototype.activateEditMode = function (bool) {
        if (bool === void 0) {
          bool = true;
        }

        if (bool) {
          var btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
          if (btn) btn.classList.add('wfst--active');
          this.activateDrawMode(false);
        } else {
          // Deselct features
          this.interactionSelectModify.getFeatures().clear();
        }

        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);

        if (this.options.layerMode === 'wms') ; else {
          this.interactionWfsSelect.setActive(bool);
        }
      };
      /**
       * Shows a fields form in a modal window to allow changes in the properties of the feature.
       *
       * @param feature
       * @private
       */


      Wfst.prototype._initEditFieldsModal = function (feature) {
        var _this = this;

        this._editFeature = feature;
        var properties = feature.getProperties();
        var layer = feature.get('_layerName_'); // Data schema from the geoserver

        var dataSchema = this._geoServerData[layer].properties;
        var content = '<form autocomplete="false">';
        Object.keys(properties).forEach(function (key) {
          // If the feature field exists in the geoserver and is not added by openlayers
          var field = dataSchema.find(function (data) {
            return data.name === key;
          });

          if (field) {
            var typeXsd = field.type;
            var type = void 0;

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
              content += "\n                <div class=\"ol-wfst--input-field-container\">\n                    <label class=\"ol-wfst--input-field-label\" for=\"" + key + "\">" + key + "</label>\n                    <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"" + type + "\" name=\"" + key + "\" value=\"" + (properties[key] || '') + "\">\n                </div>";
            }
          }
        });
        content += '</form>';
        var footer = "\n            <button type=\"button\" class=\"btn btn-link btn-third\" data-action=\"delete\" data-dismiss=\"modal\">\n                " + this._i18n.labels.delete + "\n            </button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">\n                " + this._i18n.labels.cancel + "\n            </button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">\n                " + this._i18n.labels.save + "\n            </button>\n        ";
        var modal = new modal_vanilla_1.default({
          header: true,
          headerClose: true,
          title: this._i18n.labels.editElement + " " + this._editFeature.getId() + " ",
          content: content,
          footer: footer,
          animateInClass: 'in'
        }).show();
        modal.on('dismiss', function (modal, event) {
          // On saving changes
          if (event.target.dataset.action === 'save') {
            var inputs = modal.el.querySelectorAll('input');
            inputs.forEach(function (el) {
              var value = el.value;
              var field = el.name;

              _this._editFeature.set(field, value,
              /*isSilent = */
              true);
            });

            _this._editFeature.changed();

            _this._addFeatureToEditedList(_this._editFeature); // Force deselect to trigger handler


            _this.interactionSelectModify.getFeatures().remove(_this._editFeature);
          } else if (event.target.dataset.action === 'delete') {
            _this._deleteElement(_this._editFeature, true);
          }
        });
      };
      /**
       * Remove the overlay helper atttached to a specify feature
       * @param feature
       * @private
       */


      Wfst.prototype._removeOverlayHelper = function (feature) {
        var featureId = feature.getId();
        if (!featureId) return;
        var overlay = this.map.getOverlayById(featureId);
        if (!overlay) return;
        this.map.removeOverlay(overlay);
      };

      return Wfst;
    }();

    exports.default = Wfst;

})));
