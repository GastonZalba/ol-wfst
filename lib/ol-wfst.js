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
// Ol
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
var condition_1 = require("ol/events/condition");
var Control_1 = __importDefault(require("ol/control/Control"));
var OverlayPositioning_1 = __importDefault(require("ol/OverlayPositioning"));
// External
var modal_vanilla_1 = __importDefault(require("modal-vanilla"));
// Images
var draw_svg_1 = __importDefault(require("./assets/images/draw.svg"));
var select_svg_1 = __importDefault(require("./assets/images/select.svg"));
var editGeom_svg_1 = __importDefault(require("./assets/images/editGeom.svg"));
var editFields_svg_1 = __importDefault(require("./assets/images/editFields.svg"));
var upload_svg_1 = __importDefault(require("./assets/images/upload.svg"));
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
        var active = ('active' in opt_options) ? opt_options.active : true;
        var layers = (opt_options.layers) ? (Array.isArray(opt_options.layers) ? opt_options.layers : [opt_options.layers]) : null;
        var showControl = ('showControl' in opt_options) ? opt_options.showControl : true;
        this.urlGeoserver = opt_options.urlGeoserver;
        this.map = map;
        this.view = map.getView();
        this.viewport = map.getViewport();
        this._editedFeatures = new Set();
        this._layers = [];
        // By default, the first layer is ready to accept new draws
        this._layerToInsertElements = layers[0];
        this._geoserverData = {};
        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];
        this._formatWFS = new format_1.WFS();
        this._formatGeoJSON = new format_2.GeoJSON();
        this._xs = new XMLSerializer();
        this._countRequests = 0;
        this._isEditModeOn = false;
        // VectorLayer to store features on editing and isnerting
        this._createEditLayer();
        this._addInteractions();
        this._addHandlers();
        if (layers) {
            this._prepareLayers(layers);
        }
        this._addKeyboardEvents();
        if (showControl)
            this._addControlTools();
        this.activateEditMode(active);
    }
    /**
     * @private
     */
    Wfst.prototype._prepareLayers = function (layers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._createLayers(layers);
                        return [4 /*yield*/, this._getLayersData(layers)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Layer to store temporary all the elements to edit
     * @private
     */
    Wfst.prototype._createEditLayer = function () {
        this._editLayer = new layer_1.Vector({
            source: new source_1.Vector(),
            zIndex: 5
        });
        this.map.addLayer(this._editLayer);
    };
    /**
     * Add already created layers to the map
     * @param layers
     * @public
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
        this._getLayersData(layersStr);
    };
    /**
     *
     * @param layers
     * @private
     */
    Wfst.prototype._getLayersData = function (layers) {
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
                                            service: 'wfs',
                                            version: '2.0.0',
                                            request: 'DescribeFeatureType',
                                            typeNames: layerName,
                                            outputFormat: 'application/json',
                                            exceptions: 'application/json'
                                        });
                                        url_fetch = this.urlGeoserver + '?' + params.toString();
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
                            this._geoserverData[layerName] = {
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
     * @private
     */
    Wfst.prototype._createLayers = function (layers) {
        var _this = this;
        var newWmsLayer = function (layerName) {
            var layer = new layer_1.Tile({
                source: new source_1.TileWMS({
                    url: _this.urlGeoserver,
                    params: {
                        'SERVICE': 'WMS',
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
                                    service: 'wfs',
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
                                url_fetch = this.urlGeoserver + '?' + params.toString();
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
    /**
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
     *
     * @param mode
     * @param features
     * @private
     */
    Wfst.prototype._transactWFS = function (mode, features, layerName) {
        return __awaiter(this, void 0, void 0, function () {
            var cloneFeature, refreshWmsLayer, refreshWfsLayer;
            var _this = this;
            return __generator(this, function (_a) {
                cloneFeature = function (feature) {
                    _this._removeFeatureFromEditList(feature);
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
                features = Array.isArray(features) ? features : [features];
                features.forEach(function (feature) {
                    var clone = cloneFeature(feature);
                    // Peevent fire multiples times
                    _this._countRequests++;
                    var numberRequest = _this._countRequests;
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var options, transaction, payload, response, parseResponse, responseStr, findError, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (numberRequest !== this._countRequests)
                                        return [2 /*return*/];
                                    options = {
                                        featureNS: this._geoserverData[layerName].namespace,
                                        featureType: layerName,
                                        srsName: 'urn:ogc:def:crs:EPSG::4326',
                                        featurePrefix: null,
                                        nativeElements: null
                                    };
                                    switch (mode) {
                                        case 'insert':
                                            this._insertFeatures = __spreadArrays(this._insertFeatures, [clone]);
                                            break;
                                        case 'update':
                                            this._updateFeatures = __spreadArrays(this._updateFeatures, [clone]);
                                            break;
                                        case 'delete':
                                            this._deleteFeatures = __spreadArrays(this._deleteFeatures, [clone]);
                                            break;
                                    }
                                    transaction = this._formatWFS.writeTransaction(this._insertFeatures, this._updateFeatures, this._deleteFeatures, options);
                                    payload = this._xs.serializeToString(transaction);
                                    // Fixes geometry name
                                    payload = payload.replaceAll("geometry", "geom");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, fetch(this.urlGeoserver, {
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
                                    if (!!Object.keys(parseResponse).length) return [3 /*break*/, 4];
                                    return [4 /*yield*/, response.text()];
                                case 3:
                                    responseStr = _a.sent();
                                    findError = String(responseStr).match(/<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/);
                                    if (findError)
                                        this._showError(findError[1]);
                                    _a.label = 4;
                                case 4:
                                    if (mode !== 'delete')
                                        this._editLayer.getSource().removeFeature(feature);
                                    if (this.layerMode === 'wfs')
                                        refreshWfsLayer(this._layers[layerName]);
                                    else if (this.layerMode === 'wms')
                                        refreshWmsLayer(this._layers[layerName]);
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_3 = _a.sent();
                                    console.error(err_3);
                                    return [3 /*break*/, 6];
                                case 6:
                                    this._insertFeatures = [];
                                    this._updateFeatures = [];
                                    this._deleteFeatures = [];
                                    this._countRequests = 0;
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 300);
                });
                return [2 /*return*/];
            });
        });
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
    Wfst.prototype._addFeatureToEditedList = function (feature) {
        this._editedFeatures.add(String(feature.getId()));
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
     * @private
     */
    Wfst.prototype._addInteractions = function () {
        var _this = this;
        // Select the wfs feature already downloaded
        var prepareWfsInteraction = function () {
            // Interaction to select wfs layer elements
            _this.interactionWfsSelect = new interaction_1.Select({
                hitTolerance: 10,
                style: function (feature) { return _this._styleFunction(feature); },
                filter: function (feature, layer) {
                    return !_this._isEditModeOn && layer && layer.get('type') === '_wfs_';
                }
            });
            _this.map.addInteraction(_this.interactionWfsSelect);
            _this.interactionWfsSelect.on('select', function (_a) {
                var selected = _a.selected, deselected = _a.deselected, mapBrowserEvent = _a.mapBrowserEvent;
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
        };
        // Call the geoserver to get the clicked feature
        var prepareWmsInteraction = function () {
            var getFeatures = function (evt) { return __awaiter(_this, void 0, void 0, function () {
                var _loop_1, this_1, _a, _b, _i, layerName;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _loop_1 = function (layerName) {
                                var layer, coordinate, buffer, url, response, data, features, err_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            layer = this_1._layers[layerName];
                                            coordinate = evt.coordinate;
                                            buffer = (this_1.view.getZoom() > 10) ? 10 : 5;
                                            url = layer.getSource().getFeatureInfoUrl(coordinate, this_1.view.getResolution(), this_1.view.getProjection(), {
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
                                                return [2 /*return*/, "continue"];
                                            features.forEach(function (feature) { return _this._addFeatureToEdit(feature, coordinate, layerName); });
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
                            _c.sent();
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
                            if (!!this._isEditModeOn) return [3 /*break*/, 2];
                            return [4 /*yield*/, getFeatures(evt)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        };
        if (this.layerMode === 'wfs')
            prepareWfsInteraction();
        else if (this.layerMode === 'wms')
            prepareWmsInteraction();
        // Interaction to allow select features in the edit layer
        this.interactionSelectModify = new interaction_1.Select({
            style: function (feature) { return _this._styleFunction(feature); },
            layers: [this._editLayer],
            toggleCondition: condition_1.never,
            removeCondition: function (evt) { return (_this._isEditModeOn) ? true : false; } // Prevent deselect on clicking outside the feature
        });
        this.map.addInteraction(this.interactionSelectModify);
        this.interactionModify = new interaction_1.Modify({
            style: function () {
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
                }
                else {
                    return;
                }
            },
            features: this.interactionSelectModify.getFeatures(),
            condition: function (evt) {
                return condition_1.primaryAction(evt) && _this._isEditModeOn;
            }
        });
        this.map.addInteraction(this.interactionModify);
        this.interactionSnap = new interaction_1.Snap({
            source: this._editLayer.getSource(),
        });
        this.map.addInteraction(this.interactionSnap);
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
     *
     * @param feature
     * @private
     */
    Wfst.prototype._finishEditFeature = function (feature) {
        var _this = this;
        Observable_1.unByKey(this._keyRemove);
        var layerName = feature.get('_layerName_');
        if (this._isFeatureEdited(feature)) {
            this._transactWFS('update', feature, layerName);
        }
        else {
            // Si es wfs y el elemento no tuvo cambios, lo devolvemos a la layer original
            if (this.layerMode === 'wfs') {
                var layer = this._layers[layerName];
                layer.getSource().addFeature(feature);
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
            this.interactionSelectModify.getFeatures().remove(feature);
            this._editLayer.getSource().removeFeature(feature);
        }
        setTimeout(function () {
            _this._removeFeatureHandler();
        }, 150);
    };
    /**
     * @private
     */
    Wfst.prototype._selectFeatureHandler = function () {
        var _this = this;
        // This is fired when a feature is deselected and fires the transaction process
        this._keySelect = this.interactionSelectModify.getFeatures().on('remove', function (evt) {
            var feature = evt.element;
            _this._cancelEditFeature(feature);
            _this._finishEditFeature(feature);
        });
    };
    /**
     * @private
     */
    Wfst.prototype._removeFeatureHandler = function () {
        var _this = this;
        // If a feature is removed from the edit layer
        this._keyRemove = this._editLayer.getSource().on('removefeature', function (evt) {
            if (_this._keySelect)
                Observable_1.unByKey(_this._keySelect);
            var feature = evt.feature;
            var layerName = feature.get('_layerName');
            _this._transactWFS('delete', feature, layerName);
            _this._cancelEditFeature(feature);
            if (_this._keySelect) {
                setTimeout(function () {
                    _this._selectFeatureHandler();
                }, 150);
            }
        });
    };
    /**
     * @private
     */
    Wfst.prototype._addHandlers = function () {
        var _this = this;
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifystart', function (evt) {
            _this._addFeatureToEditedList(evt.features.item(0));
        });
        this._selectFeatureHandler();
        this._removeFeatureHandler();
    };
    /**
     *
     * @param feature
     * @private
     */
    Wfst.prototype._styleFunction = function (feature) {
        var type = feature.getGeometry().getType();
        switch (type) {
            case 'Point':
            case 'MultiPoint':
                if (this._isEditModeOn) {
                    return [
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 6,
                                fill: new style_1.Fill({
                                    color: '#000000'
                                })
                            })
                        }),
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 4,
                                fill: new style_1.Fill({
                                    color: '#ff0000'
                                })
                            })
                        })
                    ];
                }
                else {
                    return [
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 5,
                                fill: new style_1.Fill({
                                    color: '#ff0000'
                                })
                            })
                        }),
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 2,
                                fill: new style_1.Fill({
                                    color: '#000000'
                                })
                            })
                        })
                    ];
                }
            default:
                if (this._isEditModeOn || this._isDrawModeOn) {
                    return [
                        new style_1.Style({
                            stroke: new style_1.Stroke({
                                color: 'rgba( 255, 0, 0, 1)',
                                width: 4
                            }),
                            fill: new style_1.Fill({
                                color: 'rgba(255, 0, 0, 0.7)',
                            })
                        }),
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 4,
                                fill: new style_1.Fill({
                                    color: '#ff0000'
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
                        }),
                        new style_1.Style({
                            stroke: new style_1.Stroke({
                                color: 'rgba(255, 255, 255, 0.7)',
                                width: 2
                            })
                        }),
                    ];
                }
                else {
                    return [
                        new style_1.Style({
                            image: new style_1.Circle({
                                radius: 2,
                                fill: new style_1.Fill({
                                    color: '#000000'
                                })
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
                        }),
                        new style_1.Style({
                            stroke: new style_1.Stroke({
                                color: '#ff0000',
                                width: 4
                            }),
                            fill: new style_1.Fill({
                                color: 'rgba(255, 0, 0, 0.7)',
                            })
                        })
                    ];
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
        this._isEditModeOn = true;
        // To refresh the style
        this._editLayer.getSource().changed();
        this._removeOverlayHelper(feature);
        var controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--changes-control';
        var elements = document.createElement('div');
        elements.className = 'ol-wfst--changes-control-el';
        var elementId = document.createElement('div');
        elementId.className = 'ol-wfst--changes-control-id';
        elementId.innerHTML = "<b>Modo Edici\u00F3n</b> - <i>" + String(feature.getId()) + "</i>";
        var acceptButton = document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = 'Aplicar cambios';
        acceptButton.className = 'btn btn-danger';
        acceptButton.onclick = function () {
            _this.interactionSelectModify.getFeatures().remove(feature);
        };
        var cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.onclick = function () {
            feature.setGeometry(_this._editFeatureOriginal.getGeometry());
            _this._removeFeatureFromEditList(feature);
            _this.interactionSelectModify.getFeatures().remove(feature);
        };
        elements.append(elementId);
        elements.append(acceptButton);
        elements.append(cancelButton);
        controlDiv.append(elements);
        this._controlApplyDiscardChanges = new Control_1.default({
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
     * @param feature
     * @private
     */
    Wfst.prototype._deleteElement = function (feature) {
        var _this = this;
        var features = Array.isArray(feature) ? feature : [feature];
        features.forEach(function (feature) { return _this._editLayer.getSource().removeFeature(feature); });
        this.interactionSelectModify.getFeatures().clear();
    };
    /**
     * Add Keyboards events to allow shortcuts on editing features
     * @private
     */
    Wfst.prototype._addKeyboardEvents = function () {
        var _this = this;
        document.addEventListener('keydown', function (_a) {
            var key = _a.key;
            var inputFocus = document.querySelector('input:focus');
            if (inputFocus)
                return;
            if (key === "Delete") {
                var selectedFeatures = _this.interactionSelectModify.getFeatures();
                if (selectedFeatures) {
                    selectedFeatures.forEach(function (feature) {
                        _this._deleteElement(feature);
                    });
                }
            }
        });
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
        if (coordinate === void 0) { coordinate = null; }
        if (layerName === void 0) { layerName = null; }
        var prepareOverlay = function () {
            var svgFields = "<img src=\"" + editFields_svg_1.default + "\"/>";
            var editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt';
            editFieldsEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"Editar campos\">" + svgFields + "</button>";
            editFieldsEl.onclick = function () {
                _this._initEditFieldsModal(feature);
            };
            var buttons = document.createElement('div');
            buttons.append(editFieldsEl);
            var svgGeom = "<img src=\"" + editGeom_svg_1.default + "\"/>";
            var editGeomEl = document.createElement('div');
            editGeomEl.className = 'ol-wfst--edit-button-cnt';
            editGeomEl.innerHTML = "<button class=\"ol-wfst--edit-button\" type=\"button\" title=\"Editar geometr\u00EDa\">" + svgGeom + "</button>";
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
        var props = (feature) ? feature.getProperties() : '';
        if (props) {
            if (feature.getGeometry()) {
                this._editLayer.getSource().addFeature(feature);
                this.interactionSelectModify.getFeatures().push(feature);
                prepareOverlay();
            }
        }
    };
    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    Wfst.prototype._resetStateButtons = function () {
        var activeBtn = document.querySelector('.ol-wfst--tools-control-btn.wfst--active');
        if (activeBtn)
            activeBtn.classList.remove('wfst--active');
    };
    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    Wfst.prototype._addControlTools = function () {
        var _this = this;
        var createLayerElement = function (layerName) {
            return "\n                <div>       \n                    <label for=\"wfst--" + layerName + "\">\n                        <input value=\"" + layerName + "\" id=\"wfst--" + layerName + "\" type=\"radio\" class=\"ol-wfst--tools-control-input\" name=\"wfst--select-layer\" " + ((layerName === _this._layerToInsertElements) ? 'checked="checked"' : '') + ">\n                        " + layerName + "\n                    </label>\n                </div>\n            ";
        };
        var controlDiv = document.createElement('div');
        controlDiv.className = 'ol-wfst--tools-control';
        // Select Tool
        var selectionButton = document.createElement('button');
        selectionButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-edit';
        selectionButton.type = 'button';
        selectionButton.innerHTML = "<img src=\"" + select_svg_1.default + "\"/>";
        selectionButton.title = 'Seleccionar';
        selectionButton.onclick = function () {
            _this._resetStateButtons();
            _this.activateEditMode();
        };
        // Draw Tool
        var drawButton = document.createElement('button');
        drawButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw';
        drawButton.type = 'button';
        drawButton.innerHTML = "<img src=\"" + draw_svg_1.default + "\"/>";
        drawButton.title = 'Añadir elemento';
        drawButton.onclick = function () {
            _this._resetStateButtons();
            _this.activateDrawMode(_this._layerToInsertElements);
        };
        // Upload Tool
        var uploadButton = document.createElement('label');
        uploadButton.className = 'ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload';
        uploadButton.htmlFor = 'ol-wfst--upload';
        uploadButton.innerHTML = "<img src=\"" + upload_svg_1.default + "\"/>";
        uploadButton.title = 'Subir archivo';
        uploadButton.onclick = function () {
        };
        var uploadInput = document.createElement('input');
        uploadInput.id = 'ol-wfst--upload';
        uploadInput.type = 'file';
        uploadInput.accept = '.geojson';
        uploadInput.onchange = function (evt) {
            console.log(evt);
        };
        var buttons = document.createElement('div');
        buttons.className = 'wfst--tools-control--buttons';
        buttons.append(uploadInput);
        buttons.append(selectionButton);
        buttons.append(drawButton);
        buttons.append(uploadButton);
        this._controlWidgetTools = new Control_1.default({
            element: controlDiv
        });
        controlDiv.append(buttons);
        if (Object.keys(this._layers).length > 1) {
            var html = Object.keys(this._layers).map(function (key) { return createLayerElement(key); });
            var selectLayers = document.createElement('div');
            selectLayers.className = 'wfst--tools-control--layers';
            selectLayers.innerHTML = html.join('');
            var radioInputs = selectLayers.querySelectorAll('input');
            radioInputs.forEach(function (radioInput) {
                radioInput.onchange = function () {
                    _this._layerToInsertElements = radioInput.value;
                    _this._resetStateButtons();
                    _this.activateDrawMode(_this._layerToInsertElements);
                };
            });
            controlDiv.append(selectLayers);
        }
        this.map.addControl(this._controlWidgetTools);
    };
    Wfst.prototype.insertFeaturesTo = function (layerName, features) {
        var layer = this._layers[layerName];
    };
    /**
     * Activate/deactivate the draw mode
     * @param bool
     * @public
     */
    Wfst.prototype.activateDrawMode = function (bool) {
        var _this = this;
        var addDrawInteraction = function (layerName) {
            _this.activateEditMode(false);
            // If already exists, remove
            if (_this.interactionDraw)
                _this.map.removeInteraction(_this.interactionDraw);
            _this.interactionDraw = new interaction_1.Draw({
                source: _this._editLayer.getSource(),
                type: _this._geoserverData[layerName].geomType,
                style: function (feature) { return _this._styleFunction(feature); }
            });
            _this.map.addInteraction(_this.interactionDraw);
            var drawHandler = function () {
                _this.interactionDraw.on('drawend', function (evt) {
                    Observable_1.unByKey(_this._keyRemove);
                    var feature = evt.feature;
                    _this._transactWFS('insert', feature, layerName);
                    setTimeout(function () {
                        _this._removeFeatureHandler();
                    }, 150);
                });
            };
            drawHandler();
        };
        if (!this.interactionDraw && !bool)
            return;
        this._isDrawModeOn = (bool) ? true : false;
        if (bool) {
            var btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
            if (btn)
                btn.classList.add('wfst--active');
            addDrawInteraction(String(bool));
        }
        else {
            this.map.removeInteraction(this.interactionDraw);
        }
    };
    /**
     * Activate/desactivate the edit mode
     * @param bool
     * @public
     */
    Wfst.prototype.activateEditMode = function (bool) {
        if (bool === void 0) { bool = true; }
        if (bool) {
            var btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
            if (btn)
                btn.classList.add('wfst--active');
        }
        this.activateDrawMode(false);
        this.interactionSelectModify.setActive(bool);
        this.interactionModify.setActive(bool);
        if (this.layerMode === 'wms') {
            // if (!bool) unByKey(this.clickWmsKey);
        }
        else {
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
        var layer = feature.get('_layerName_');
        // Data schema from the geoserver
        var dataSchema = this._geoserverData[layer].properties;
        var content = '<form autocomplete="false">';
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
                    content += "\n                    <div class=\"ol-wfst--input-field-container\">\n                        <label class=\"ol-wfst--input-field-label\" for=\"" + key + "\">" + key + "</label>\n                        <input placeholder=\"NULL\" class=\"ol-wfst--input-field-input\" type=\"" + type + "\" name=\"" + key + "\" value=\"" + (properties[key] || '') + "\">\n                    </div>\n                    ";
                }
            }
        });
        content += '</form>';
        var footer = "\n            <button type=\"button\" class=\"btn btn-danger\" data-action=\"delete\" data-dismiss=\"modal\">Eliminar</button>\n            <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancelar</button>\n            <button type=\"button\" class=\"btn btn-primary\" data-action=\"save\" data-dismiss=\"modal\">Guardar</button>\n        ";
        this.modal = new modal_vanilla_1.default({
            header: true,
            headerClose: true,
            title: "Editar elemento " + this._editFeature.getId(),
            content: content,
            footer: footer,
            animateInClass: 'in'
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
                _this._addFeatureToEditedList(_this._editFeature);
                var layerName = _this._editFeature.get('_layerName_');
                _this._transactWFS('update', _this._editFeature, layerName);
            }
            else if (event.target.dataset.action === 'delete') {
                _this._deleteElement(_this._editFeature);
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
        if (!featureId)
            return;
        var overlay = this.map.getOverlayById(featureId);
        if (!overlay)
            return;
        this.map.removeOverlay(overlay);
    };
    return Wfst;
}());
exports.default = Wfst;
