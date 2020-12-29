"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ol_1 = require("ol");
var format_1 = require("ol/format");
var source_1 = require("ol/source");
var layer_1 = require("ol/layer");
var interaction_1 = require("ol/interaction");
var format_2 = require("ol/format");
var Observable_1 = require("ol/Observable");
var geom_1 = require("ol/geom");
var loadingstrategy_1 = require("ol/loadingstrategy");
var extent_1 = require("ol/extent");
var style_1 = require("ol/style");
var modal_vanilla_1 = __importDefault(require("modal-vanilla"));
/**
 * @constructor
 * @param {class} map
 * @param {object} opt_options
 */
var Wfst = /** @class */ (function () {
    function Wfst(map, opt_options) {
        this.layerMode = opt_options.layerMode || 'wms';
        this.evtType = opt_options.evtType || 'singleclick';
        this.wfsStrategy = opt_options.wfsStrategy || 'bbox';
        // const active = ('active' in opt_options) ? opt_options.active : true;
        var layers = (opt_options.layers) ? (Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers]) : null;
        this.urlGeoserverWms = opt_options.urlWms;
        this.urlGeoserverWfs = opt_options.urlWfs;
        if (opt_options.showError) {
            this.showError = function (msg) { return opt_options.showError(msg); };
        }
        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._editedFeatures = new Set();
        this._layers = [];
        this._layersData = {};
        this.insertFeatures = [];
        this.updateFeatures = [];
        this.deleteFeatures = [];
        this._formatWFS = new format_1.WFS();
        this._formatGeoJSON = new format_2.GeoJSON();
        this._xs = new XMLSerializer();
        this._countRequests = 0;
        this.init(layers);
    }
    Wfst.prototype.init = function (layers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layers) return [3 /*break*/, 2];
                        this.createLayers(layers);
                        return [4 /*yield*/, this.getLayersData(layers)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.createEditLayer();
                        this.addLayerModeInteractions();
                        this.addInteractions();
                        this.addHandlers();
                        this.addDrawInteraction(layers[0]);
                        this.addKeyboardEvents();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Layer to store temporary all the elements to edit
     */
    Wfst.prototype.createEditLayer = function () {
        this._editLayer = new layer_1.Vector({
            source: new source_1.Vector(),
            zIndex: 5
        });
        this.map.addLayer(this._editLayer);
    };
    /**
     * Add already created layers to the map
     * @param layers
     */
    Wfst.prototype.addLayers = function (layers) {
        var _this = this;
        layers = Array.isArray(layers) ? layers : [layers];
        var layersStr = [];
        if (!layers.length)
            return;
        layers.forEach(function (layer) {
            if (layer instanceof layer_1.Vector) {
                layer.set('type', '_wfs_');
            }
            else {
                layer.set('type', '_wms_');
            }
            _this.map.addLayer((layer));
            var layerName = layer.get('name');
            _this._layers[layerName] = layer;
            layersStr.push(layerName);
        });
        this.getLayersData(layersStr);
    };
    /**
     *
     * @param layers
     */
    Wfst.prototype.getLayersData = function (layers) {
        return __awaiter(this, void 0, void 0, function () {
            var getLayerData, _i, layers_1, layerName, data, targetNamespace, properties, geom;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getLayerData = function (layerName) { return __awaiter(_this, void 0, void 0, function () {
                            var params, url_fetch, response, data, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        params = new URLSearchParams({
                                            version: '2.0.0',
                                            request: 'DescribeFeatureType',
                                            typeNames: layerName,
                                            outputFormat: 'application/json',
                                            exceptions: 'application/json'
                                        });
                                        url_fetch = this.urlGeoserverWfs + '?' + params.toString();
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, , 5]);
                                        return [4 /*yield*/, fetch(url_fetch)];
                                    case 2:
                                        response = _a.sent();
                                        return [4 /*yield*/, response.json()];
                                    case 3:
                                        data = _a.sent();
                                        return [2 /*return*/, data];
                                    case 4:
                                        err_1 = _a.sent();
                                        console.error(err_1);
                                        return [2 /*return*/, null];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); };
                        _i = 0, layers_1 = layers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < layers_1.length)) return [3 /*break*/, 4];
                        layerName = layers_1[_i];
                        return [4 /*yield*/, getLayerData(layerName)];
                    case 2:
                        data = _a.sent();
                        if (data) {
                            targetNamespace = data.targetNamespace;
                            properties = data.featureTypes[0].properties;
                            geom = properties[0];
                            this._layersData[layerName] = {
                                namespace: targetNamespace,
                                properties: properties,
                                geomType: geom.localType
                            };
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param layers
     */
    Wfst.prototype.createLayers = function (layers) {
        var _this = this;
        var newWmsLayer = function (layerName) {
            var layer = new layer_1.Tile({
                source: new source_1.TileWMS({
                    url: _this.urlGeoserverWms,
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
            });
            return layer;
        };
        var newWfsLayer = function (layerName) {
            var source = new source_1.Vector({
                format: new format_2.GeoJSON(),
                strategy: (_this.wfsStrategy === 'bbox') ? loadingstrategy_1.bbox : loadingstrategy_1.all,
                loader: function (extent) { return __awaiter(_this, void 0, void 0, function () {
                    var params, url_fetch, response, data, features, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                params = new URLSearchParams({
                                    version: '1.0.0',
                                    request: 'GetFeature',
                                    typename: layerName,
                                    outputFormat: 'application/json',
                                    exceptions: 'application/json',
                                    srsName: 'urn:ogc:def:crs:EPSG::4326'
                                });
                                // If bbox, add extent to the request
                                if (this.wfsStrategy === 'bbox')
                                    params.append('bbox', extent.join(','));
                                url_fetch = this.urlGeoserverWfs + '?' + params.toString();
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, fetch(url_fetch)];
                            case 2:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 3:
                                data = _a.sent();
                                features = source.getFormat().readFeatures(data);
                                features.forEach(function (feature) {
                                    feature.set('_layerName_', layerName, /* silent = */ true);
                                });
                                source.addFeatures(features);
                                return [3 /*break*/, 5];
                            case 4:
                                err_2 = _a.sent();
                                console.error(err_2);
                                source.removeLoadedExtent(extent);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }
            });
            var layer = new layer_1.Vector({
                source: source,
                zIndex: 2
            });
            layer.setProperties({
                name: layerName,
                type: "_wfs_"
            });
            return layer;
        };
        layers.forEach(function (layerName) {
            var layer;
            if (_this.layerMode === 'wms') {
                layer = newWmsLayer(layerName);
            }
            else {
                layer = newWfsLayer(layerName);
            }
            _this.map.addLayer(layer);
            _this._layers[layerName] = layer;
        });
    };
    Wfst.prototype.showError = function (msg) {
        modal_vanilla_1.default.alert(msg).show();
    };
    Wfst.prototype.transactWFS = function (mode, feature) {
        return __awaiter(this, void 0, void 0, function () {
            var cloneFeature, refreshWmsLayer, refreshWfsLayer, clone, numberRequest;
            var _this = this;
            return __generator(this, function (_a) {
                cloneFeature = function (feature) {
                    _this._editedFeatures.delete(String(feature.getId()));
                    var featureProperties = feature.getProperties();
                    delete featureProperties.boundedBy;
                    delete featureProperties._layerName_;
                    var clone = new ol_1.Feature(featureProperties);
                    clone.setId(feature.getId());
                    return clone;
                };
                refreshWmsLayer = function (layer) {
                    var source = layer.getSource();
                    // Refrescamos el wms
                    source.refresh();
                    // Force refresh the tiles
                    var params = source.getParams();
                    params.t = new Date().getMilliseconds();
                    source.updateParams(params);
                };
                refreshWfsLayer = function (layer) {
                    var source = layer.getSource();
                    // Refrescamos el wms
                    source.refresh();
                };
                clone = cloneFeature(feature);
                // Peevent fire multiples times
                this._countRequests++;
                numberRequest = this._countRequests;
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var layerName, options, transaction, payload, response, parseResponse, findError, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (numberRequest !== this._countRequests)
                                    return [2 /*return*/];
                                layerName = feature.get('_layerName_');
                                options = {
                                    featureNS: this._layersData[layerName].namespace,
                                    featureType: layerName,
                                    srsName: 'urn:ogc:def:crs:EPSG::4326',
                                    featurePrefix: null,
                                    nativeElements: null
                                };
                                switch (mode) {
                                    case 'insert':
                                        this.insertFeatures = __spreadArrays(this.insertFeatures, [clone]);
                                        break;
                                    case 'update':
                                        this.updateFeatures = __spreadArrays(this.updateFeatures, [clone]);
                                        break;
                                    case 'delete':
                                        this.deleteFeatures = __spreadArrays(this.deleteFeatures, [clone]);
                                        break;
                                }
                                transaction = this._formatWFS.writeTransaction(this.insertFeatures, this.updateFeatures, this.deleteFeatures, options);
                                payload = this._xs.serializeToString(transaction);
                                // Fixes geometry name
                                payload = payload.replaceAll("geometry", "geom");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, fetch(this.urlGeoserverWfs, {
                                        method: 'POST',
                                        body: payload,
                                        headers: {
                                            'Content-Type': 'text/xml',
                                            'Access-Control-Allow-Origin': '*'
                                        }
                                    })];
                            case 2:
                                response = _a.sent();
                                parseResponse = this._formatWFS.readTransactionResponse(response);
                                if (!Object.keys(parseResponse).length) {
                                    findError = String(response).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                                    if (findError)
                                        this.showError(findError[1]);
                                }
                                if (mode !== 'delete')
                                    this._editLayer.getSource().removeFeature(feature);
                                if (this.layerMode === 'wfs')
                                    refreshWfsLayer(this._layers[layerName]);
                                else if (this.layerMode === 'wms')
                                    refreshWmsLayer(this._layers[layerName]);
                                return [3 /*break*/, 4];
                            case 3:
                                err_3 = _a.sent();
                                console.error(err_3);
                                return [3 /*break*/, 4];
                            case 4:
                                this.insertFeatures = [];
                                this.updateFeatures = [];
                                this.deleteFeatures = [];
                                this._countRequests = 0;
                                return [2 /*return*/];
                        }
                    });
                }); }, 300);
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     */
    Wfst.prototype.addLayerModeInteractions = function () {
        var _this = this;
        // Select the wfs feature already downloaded
        var addWfsInteraction = function () {
            // Interaction to select wfs layer elements
            _this.interactionWfsSelect = new interaction_1.Select({
                hitTolerance: 10,
                style: function (feature) { return _this.styleFunction(feature); },
                filter: function (feature, layer) {
                    return layer && layer.get('type') === '_wfs_';
                }
            });
            _this.map.addInteraction(_this.interactionWfsSelect);
            _this.interactionWfsSelect.on('select', function (_a) {
                var selected = _a.selected, deselected = _a.deselected;
                if (deselected.length) {
                    deselected.forEach(function (feature) {
                        _this.map.removeOverlay(_this.map.getOverlayById(feature.getId()));
                    });
                }
                if (selected.length) {
                    selected.forEach(function (feature) {
                        if (!_this._editedFeatures.has(String(feature.getId()))) {
                            // Remove the feature from the original layer                            
                            var layer = _this.interactionWfsSelect.getLayer(feature);
                            layer.getSource().removeFeature(feature);
                            _this.addFeatureToEdit(feature);
                        }
                    });
                }
            });
        };
        // Call the geoserver to get the clicked feature
        var addWmsInteraction = function () {
            var getFeatures = function (evt) { return __awaiter(_this, void 0, void 0, function () {
                var _loop_1, this_1, _a, _b, _i, layerName, state_1;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _loop_1 = function (layerName) {
                                var layer, buffer, url, response, data, features, err_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            layer = this_1._layers[layerName];
                                            buffer = (this_1.view.getZoom() > 10) ? 10 : 5;
                                            url = layer.getSource().getFeatureInfoUrl(evt.coordinate, this_1.view.getResolution(), this_1.view.getProjection(), {
                                                'INFO_FORMAT': 'application/json',
                                                'BUFFER': buffer,
                                                'FEATURE_COUNT': 1,
                                                'EXCEPTIONS': 'application/json',
                                            });
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, fetch(url)];
                                        case 2:
                                            response = _a.sent();
                                            return [4 /*yield*/, response.json()];
                                        case 3:
                                            data = _a.sent();
                                            features = this_1._formatGeoJSON.readFeatures(data);
                                            if (!features.length)
                                                return [2 /*return*/, { value: void 0 }];
                                            features.forEach(function (feature) { return _this.addFeatureToEdit(feature, layerName); });
                                            return [3 /*break*/, 5];
                                        case 4:
                                            err_4 = _a.sent();
                                            console.error(err_4);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _a = [];
                            for (_b in this._layers)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            layerName = _a[_i];
                            return [5 /*yield**/, _loop_1(layerName)];
                        case 2:
                            state_1 = _c.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); };
            _this._keyClickWms = _this.map.on(_this.evtType, function (evt) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.map.hasFeatureAtPixel(evt.pixel))
                                return [2 /*return*/];
                            return [4 /*yield*/, getFeatures(evt)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        if (this.layerMode === 'wfs')
            addWfsInteraction();
        else if (this.layerMode === 'wms')
            addWmsInteraction();
    };
    Wfst.prototype.addFeatureToEditedList = function (feature) {
        this._editedFeatures.add(String(feature.getId()));
    };
    Wfst.prototype.isFeatureEdited = function (feature) {
        return this._editedFeatures.has(String(feature.getId()));
    };
    Wfst.prototype.addInteractions = function () {
        var _this = this;
        this.interactionSelect = new interaction_1.Select({
            style: function (feature) { return _this.styleFunction(feature); },
            layers: [this._editLayer]
        });
        this.map.addInteraction(this.interactionSelect);
        this.interactionModify = new interaction_1.Modify({
            features: this.interactionSelect.getFeatures()
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new interaction_1.Snap({
            source: this._editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);
    };
    Wfst.prototype.addDrawInteraction = function (layerName) {
        var _this = this;
        this.interactionDraw = new interaction_1.Draw({
            source: this._editLayer.getSource(),
            type: this._layersData[layerName].geomType
        });
        this.map.addInteraction(this.interactionDraw);
        this.activateDrawMode(false);
        var drawHandler = function () {
            _this.interactionDraw.on('drawend', function (evt) {
                Observable_1.unByKey(_this._keyRemove);
                var feature = evt.feature;
                feature.set('_layerName_', layerName, /* silent = */ true);
                //feature.setId(feature.id_);
                _this.transactWFS('insert', feature);
                setTimeout(function () {
                    _this.removeFeatureHandler();
                }, 150);
            });
        };
        drawHandler();
    };
    Wfst.prototype.selectFeatureHandler = function () {
        var _this = this;
        // This is fired when a feature is deselected and fires the transaction process
        // and update the geoserver
        this._keySelect = this.interactionSelect.getFeatures().on('remove', function (evt) {
            var feature = evt.element;
            Observable_1.unByKey(_this._keyRemove);
            if (_this.isFeatureEdited(feature)) {
                console.log('removed2');
                _this.transactWFS('update', feature);
            }
            else {
                // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
                if (_this.layerMode === 'wfs') {
                    var layer = _this._layers[feature.get('_layerName_')];
                    layer.getSource().addFeature(feature);
                }
                _this._editLayer.getSource().removeFeature(feature);
                _this.interactionSelect.getFeatures().clear();
            }
            setTimeout(function () {
                _this.removeFeatureHandler();
            }, 150);
        });
    };
    Wfst.prototype.removeFeatureHandler = function () {
        var _this = this;
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', function (evt) {
            Observable_1.unByKey(_this._keySelect);
            var feature = evt.feature;
            _this.transactWFS('delete', feature);
            setTimeout(function () {
                _this.selectFeatureHandler();
            }, 150);
        });
    };
    Wfst.prototype.addHandlers = function () {
        var _this = this;
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', function (evt) {
            _this.addFeatureToEditedList(evt.features.item(0));
        });
        this.selectFeatureHandler();
        this.removeFeatureHandler();
    };
    Wfst.prototype.styleFunction = function (feature) {
        var showVerticesStyle = new style_1.Style({
            image: new style_1.Circle({
                radius: 6,
                fill: new style_1.Fill({
                    color: '#ffffff'
                }),
                stroke: new style_1.Stroke({
                    width: 2,
                    color: 'rgba(5, 5, 5, 0.9)'
                }),
            }),
            geometry: function (feature) {
                var geometry = feature.getGeometry();
                var coordinates = geometry.getCoordinates();
                var type = geometry.getType();
                if (type == 'Polygon' ||
                    type == 'MultiLineString') {
                    coordinates = coordinates.flat(1);
                }
                if (!coordinates.length)
                    return;
                return new geom_1.MultiPoint(coordinates);
            }
        });
        var type = feature.getGeometry().getType();
        switch (type) {
            case 'Point':
            case 'MultiPoint':
                return [
                    new style_1.Style({
                        image: new style_1.Circle({
                            radius: 5,
                            stroke: new style_1.Stroke({
                                color: 'rgba( 255, 255, 255, 0.8)',
                                width: 12
                            })
                        })
                    }),
                ];
            default:
                return [
                    new style_1.Style({
                        stroke: new style_1.Stroke({
                            color: 'rgba( 255, 0, 0, 1)',
                            width: 4
                        })
                    }),
                    showVerticesStyle,
                    new style_1.Style({
                        stroke: new style_1.Stroke({
                            color: 'rgba( 255, 255, 255, 0.7)',
                            width: 2
                        })
                    }),
                ];
        }
    };
    Wfst.prototype.deleteElement = function (feature) {
        var _this = this;
        var features = Array.isArray(feature) ? feature : [feature];
        features.forEach(function (feature) { return _this._editLayer.getSource().removeFeature(feature); });
        this.interactionSelect.getFeatures().clear();
    };
    Wfst.prototype.addKeyboardEvents = function () {
        var _this = this;
        document.addEventListener('keydown', function (_a) {
            var key = _a.key;
            if (key === "Delete") {
                var selectedFeatures = _this.interactionSelect.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(function (feature) {
                        _this.deleteElement(feature);
                    });
                }
            }
        });
    };
    Wfst.prototype.addFeatureToEdit = function (feature, layerName) {
        var _this = this;
        if (layerName === void 0) { layerName = null; }
        var prepareOverlay = function () {
            var svg = "\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"448\" height=\"448\" viewBox=\"0 0 448 448\">\n            <path d=\"M222 296l29-29-38-38-29 29v14h24v24h14zM332 116c-2.25-2.25-6-2-8.25 0.25l-87.5 87.5c-2.25 2.25-2.5 6-0.25 8.25s6 2 8.25-0.25l87.5-87.5c2.25-2.25 2.5-6 0.25-8.25zM352 264.5v47.5c0 39.75-32.25 72-72 72h-208c-39.75 0-72-32.25-72-72v-208c0-39.75 32.25-72 72-72h208c10 0 20 2 29.25 6.25 2.25 1 4 3.25 4.5 5.75 0.5 2.75-0.25 5.25-2.25 7.25l-12.25 12.25c-2.25 2.25-5.25 3-8 2-3.75-1-7.5-1.5-11.25-1.5h-208c-22 0-40 18-40 40v208c0 22 18 40 40 40h208c22 0 40-18 40-40v-31.5c0-2 0.75-4 2.25-5.5l16-16c2.5-2.5 5.75-3 8.75-1.75s5 4 5 7.25zM328 80l72 72-168 168h-72v-72zM439 113l-23 23-72-72 23-23c9.25-9.25 24.75-9.25 34 0l38 38c9.25 9.25 9.25 24.75 0 34z\"></path>\n            </svg>";
            var editEl = document.createElement('div');
            editEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\">" + svg + "</button>";
            editEl.onclick = function () {
                _this.initModal(feature);
            };
            var buttons = document.createElement('div');
            buttons.append(editEl);
            var buttonsOverlay = new ol_1.Overlay({
                id: feature.getId(),
                position: extent_1.getCenter(feature.getGeometry().getExtent()),
                element: buttons,
                stopEvent: true
            });
            _this.map.addOverlay(buttonsOverlay);
        };
        if (layerName) {
            // Guardamos el nombre de la capa de donde sale la feature
            feature.set('_layerName_', layerName);
        }
        var props = (feature) ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                this._editLayer.getSource().addFeature(feature);
                this.interactionSelect.getFeatures().push(feature);
                prepareOverlay();
            }
        }
    };
    Wfst.prototype.activateDrawMode = function (bool) {
        if (bool === void 0) { bool = true; }
        this.interactionDraw.setActive(bool);
    };
    Wfst.prototype.activateEditMode = function (bool) {
        if (bool === void 0) { bool = true; }
        this.interactionSelect.setActive(bool);
        this.interactionModify.setActive(bool);
        // FIXME
        // if (this.layerMode === 'wms') {
        //     if (!bool) unByKey(this.clickWmsKey);
        // }
    };
    Wfst.prototype.initModal = function (feature) {
        var _this = this;
        this._editFeature = feature;
        var properties = feature.getProperties();
        var layer = feature.get('_layerName_');
        // Data schema from the geoserver
        var dataSchema = this._layersData[layer].properties;
        var content = '';
        Object.keys(properties).forEach(function (key) {
            // If the feature field exists in the geoserver and is not added by openlayers
            var field = dataSchema.find(function (data) { return data.name === key; });
            if (field) {
                var typeXsd = field.type;
                var type = void 0;
                switch (typeXsd) {
                    case 'xsd:string':
                        type = 'text';
                        break;
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
                    content += "\n                    <div class=\"ol-wfst--input-field-container\">\n                        <label class=\"ol-wfst--input-field-label\" for=\"" + key + "\">" + key + "</label>\n                        <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"" + type + "\" name=\"" + key + "\" value=\"" + (properties[key] || '') + "\">\n                    </div>\n                    ";
                }
            }
        });
        var footer = "\n            <button type=\"button\" class=\"btn btn-danger\" data-action=\"delete\" data-dismiss=\"modal\">Eliminar</button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancelar</button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">Guardar</button>\n        ";
        this.modal = new modal_vanilla_1.default({
            header: true,
            headerClose: true,
            title: "Editar elemento " + this._editFeature.getId(),
            content: content,
            footer: footer,
            animateInClass: 'in',
        }).show();
        this.modal.on('dismiss', function (modal, event) {
            if (event.target.dataset.action === 'save') {
                var inputs = modal.el.querySelectorAll('input');
                inputs.forEach(function (el) {
                    var value = el.value;
                    var field = el.name;
                    _this._editFeature.set(field, value, /*isSilent = */ true);
                });
                _this._editFeature.changed();
                _this.addFeatureToEditedList(_this._editFeature);
                _this.transactWFS('update', _this._editFeature);
            }
            else if (event.target.dataset.action === 'delete') {
                _this.map.removeOverlay(_this.map.getOverlayById(feature.getId()));
                _this.deleteElement(_this._editFeature);
            }
        });
    };
    return Wfst;
}());
exports.default = Wfst;
