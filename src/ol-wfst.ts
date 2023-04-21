// Ol
import Geometry from 'ol/geom/Geometry.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Control from 'ol/control/Control.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import { EventsKey } from 'ol/events.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import VectorSource from 'ol/source/Vector.js';
import Map from 'ol/Map.js';
import BaseEvent from 'ol/events/Event.js';
import { LoadingStrategy } from 'ol/source/Vector.js';
import { FeatureLike } from 'ol/Feature.js';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector.js';
import { never, primaryAction } from 'ol/events/condition.js';
import {
    unByKey,
    CombinedOnSignature,
    EventTypes,
    OnSignature
} from 'ol/Observable.js';
import { Coordinate } from 'ol/coordinate.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';

import { initModal, showError } from './modules/errors';
import { initLoading, showLoading } from './modules/loading';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import LayersControl, {
    activateDrawButton,
    activateModeButtons,
    resetStateButtons
} from './modules/LayersControl';
import Uploads from './modules/Uploads';
import {
    addFeatureToEditedList,
    getStoredMapLayers,
    isFeatureEdited,
    removeFeatureFromEditList,
    setActiveLayerToInsertEls,
    getActiveLayerToInsertEls,
    activateMode,
    getMode,
    Modes,
    setMap,
    setMapLayers,
    getStoredLayer
} from './modules/state';
import { deepObjectAssign } from './modules/helpers';
import { getEditLayer } from './modules/editLayer';
import { GeometryType, TransactionType } from './@enums';
import {
    I18n,
    IGeoserverDescribeFeatureType,
    WfsGeoserverVendor,
    WmsGeoserverVendor
} from './@types';
import * as i18n from './modules/i18n/index';
import { getDefaultOptions } from './defaults';
import EditControlChangesEl from './modules/EditControlChanges';
import styleFunction from './modules/styleFunction';
import { EditFieldsModal } from './modules/EditFieldsModal';
import Geoserver from './Geoserver';
import EditOverlay from './modules/EditOverlay';
import { BaseLayerProperty } from './modules/base/BaseLayer';

// External
import Modal from 'modal-vanilla';

// Style
import './assets/scss/-ol-wfst.bootstrap5.scss';
import './assets/scss/ol-wfst.scss';

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
export default class Wfst extends Control {
    protected _options: Options;
    protected _i18n: I18n;

    // Ol
    protected _map: Map;
    protected _view: View;
    protected _viewport: HTMLElement;
    protected _initialized = false;
    protected _layersControl: LayersControl;
    protected _overlay: Overlay;

    // Interactions
    protected _interactionWfsSelect: Select;
    protected _interactionSelectModify: Select;
    protected _collectionModify: Collection<any>;
    protected _interactionModify: Modify;
    protected _interactionSnap: Snap;
    protected _interactionDraw: Draw;

    // Obserbable keys
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;

    // Controls
    protected _controlApplyDiscardChanges: EditControlChangesEl;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _selectDraw: HTMLSelectElement;

    // State
    protected _currentZoom: number;
    protected _lastZoom: number;

    // Editing
    protected _editFeature: Feature<Geometry>;
    protected _editFeatureOriginal: Feature<Geometry>;

    protected _uploads: Uploads;
    protected _editFields: EditFieldsModal;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<WfstEventTypes, WfstEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            WfstEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<WfstEventTypes, WfstEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            WfstEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<WfstEventTypes, WfstEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, void> &
        CombinedOnSignature<
            WfstEventTypes | ObjectEventTypes | EventTypes,
            void
        >;

    constructor(options?: Options) {
        super({
            target: null,
            element: controlElement,
            render: () => {
                if (!this._map) this._init();
            }
        });

        i18n.setLang(options.language, options.i18n);

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
    getLayers(): Array<WfsLayer | WmsLayer> {
        return Object.values(getStoredMapLayers());
    }

    /**
     * Get a layer
     * @public
     */
    getLayerByName(layerName = ''): WfsLayer | WmsLayer {
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
    async _initMapAndLayers(): Promise<void> {
        try {
            const layers = this._options.layers;

            if (layers.length) {
                let layerRendered = 0;
                let layersNumber = 0; // Only count visibles

                layers.forEach((layer) => {
                    if (layer.getVisible()) layersNumber++;

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
                            const layerNotVisible =
                                'ol-wfst--layer-not-visible';

                            const visible = layer.isVisibleByZoom();
                            if (visible)
                                domEl.classList.remove(layerNotVisible);
                            else domEl.classList.add(layerNotVisible);
                        });

                        layer.set(
                            BaseLayerProperty.ISVISIBLE,
                            this._currentZoom > layer.getMinZoom()
                        );

                        this.dispatchEvent(
                            new WfstEvent({
                                type: 'describeFeatureType',
                                layer: layer,
                                data: layer.getDescribeFeatureType()
                            })
                        );
                    });

                    layer._init();

                    this._map.addLayer(layer);

                    setMapLayers({
                        [layer.get(BaseLayerProperty.NAME)]: layer
                    });
                });

                this._createMapElements(
                    this._options.showControl,
                    this._options.active
                );
            }
        } catch (err) {
            showLoading(false);
            showError(err.message, err);
        }
    }

    /**
     * @private
     */
    _init(): void {
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
    async _createMapElements(
        showControl: boolean,
        active: boolean
    ): Promise<void> {
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
    _addInteractions(): void {
        /**
         * Select the wfs feature already downloaded
         * @private
         */
        const prepareWfsInteraction = () => {
            this._collectionModify = new Collection();

            // Interaction to select wfs layer elements
            this._interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature: Feature<Geometry>) => styleFunction(feature),
                toggleCondition: never, // Prevent add features to the current selection using shift
                filter: (feature, layer) => {
                    return (
                        getMode() !== Modes.Edit &&
                        layer &&
                        layer instanceof WfsLayer &&
                        layer === getActiveLayerToInsertEls()
                    );
                }
            });

            this._map.addInteraction(this._interactionWfsSelect);

            this._interactionWfsSelect.on(
                'select',
                ({ selected, deselected, mapBrowserEvent }) => {
                    const coordinate = mapBrowserEvent.coordinate;

                    if (selected.length) {
                        selected.forEach((feature) => {
                            if (!isFeatureEdited(feature)) {
                                // Remove the feature from the original layer
                                const layer =
                                    this._interactionWfsSelect.getLayer(
                                        feature
                                    );
                                layer.getSource().removeFeature(feature);
                                this._addFeatureToEditMode(
                                    feature,
                                    coordinate,
                                    layer.get(BaseLayerProperty.NAME)
                                );
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
                }
            );
        };

        /**
         * Call the geoserver to get the clicked feature
         * @private
         */
        const prepareWmsInteraction = (): void => {
            // Interaction to allow select features in the edit layer
            this._interactionSelectModify = new Select({
                style: (feature: Feature<Geometry>) => styleFunction(feature),
                layers: [getEditLayer()],
                toggleCondition: never, // Prevent add features to the current selection using shift
                removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
            });

            this._map.addInteraction(this._interactionSelectModify);

            this._collectionModify =
                this._interactionSelectModify.getFeatures();

            this._keyClickWms = this._map.on(
                this._options.evtType,
                async (evt: MapBrowserEvent<MouseEvent>) => {
                    if (this._map.hasFeatureAtPixel(evt.pixel)) {
                        return;
                    }

                    // Only get other features if editmode is disabled
                    if (getMode() !== Modes.Edit) {
                        const layer = getActiveLayerToInsertEls();

                        // If layer is hidden or is a wfs, skip
                        if (
                            !layer.getVisible() ||
                            !layer.isVisibleByZoom() ||
                            layer instanceof WfsLayer
                        ) {
                            return;
                        }

                        const features = await layer._getFeaturesByClickEvent(
                            evt
                        );

                        if (!features.length) {
                            return;
                        }

                        // For now, support is only for one feature at time
                        this._addFeatureToEditMode(
                            features[0],
                            evt.coordinate,
                            layer.get(BaseLayerProperty.NAME)
                        );
                    }
                }
            );
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
    _prepareEditLayer(): void {
        this._map.addLayer(getEditLayer());
    }

    /**
     * @private
     */
    _addMapEvents(): void {
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

        this._map.on('moveend', (): void => {
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
                    } else {
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
    _addInteractionHandlers(): void {
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
    _addMapControl(): void {
        this._layersControl = new LayersControl(
            this._options.showUpload ? this._uploads : null,
            this._options.uploadFormats
        );

        // @ts-expect-error
        this._layersControl.on('drawMode', () => {
            if (getMode() === Modes.Draw) {
                resetStateButtons();
                this.activateEditMode();
            } else {
                const activeLayer = getActiveLayerToInsertEls();

                if (!activeLayer.isVisibleByZoom()) {
                    showError(i18n.I18N.errors.layerNotVisible);
                } else {
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

        this._selectDraw = controlEl.querySelector(
            '.wfst--tools-control--select-draw'
        );

        this._controlWidgetToolsDiv.append(controlEl);
    }

    /**
     *
     * @param feature
     * @private
     */
    _deselectEditFeature(feature: FeatureLike): void {
        this._removeOverlayHelper(feature);
    }

    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    _restoreFeatureToLayer(
        feature: Feature<Geometry>,
        layerName?: string
    ): void {
        layerName = layerName || feature.get('_layerName_');
        const layer = getStoredMapLayers()[layerName];
        (layer.getSource() as VectorSource<Geometry>).addFeature(feature);
    }

    /**
     * @param feature
     * @private
     */
    _removeFeatureFromTmpLayer(feature: Feature<Geometry>): void {
        // Remove element from the Layer
        getEditLayer().getSource().removeFeature(feature);
    }

    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    _onDeselectFeatureEvent(): void {
        const checkIfFeatureIsChanged = (feature: Feature<Geometry>): void => {
            const layerName = feature.get('_layerName_');

            const layer = this._options.layers.find(
                (layer) => layer.get(BaseLayerProperty.NAME) === layerName
            );

            if (layer instanceof WfsLayer) {
                this._interactionWfsSelect.getFeatures().remove(feature);
            }

            if (isFeatureEdited(feature)) {
                layer.transactFeatures(TransactionType.Update, feature);
            } else {
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
    _onRemoveFeatureEvent(): void {
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
    _editModeOn(feature: Feature<Geometry>): void {
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
    _editModeOff(): void {
        activateMode(null);
        this._map.removeControl(this._controlApplyDiscardChanges);
    }

    /**
     * Remove a feature from the edit Layer and from the Geoserver
     *
     * @param feature
     * @private
     */
    _deleteFeature(feature: Feature<Geometry>, confirm: boolean): void {
        const deleteEl = () => {
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach((feature) => {
                feature.set('_delete_', true, true);
                getEditLayer().getSource().removeFeature(feature);
            });
            this._collectionModify.clear();

            const layerName = feature.get('_layerName_');
            const layer = this._options.layers.find(
                (layer) => layer.get(BaseLayerProperty.NAME) === layerName
            );

            if (layer instanceof WfsLayer) {
                this._interactionWfsSelect.getFeatures().remove(feature);
            }
        };

        if (confirm) {
            const confirmModal = Modal.confirm(i18n.I18N.labels.confirmDelete, {
                ...this._options.modal
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
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     *
     * @param feature
     * @param coordinate
     * @param layerName
     * @private
     */
    _addFeatureToEditMode(
        feature: Feature<Geometry>,
        coordinate: Coordinate = null,
        layerName = null
    ): void {
        // For now, only allow one element at time
        // @TODO: allow edit multiples elements
        if (this._collectionModify.getLength()) return;

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
    activateDrawMode(layer: WfsLayer | WmsLayer | false): void {
        /**
         *
         * @param layer
         * @private
         */
        const addDrawInteraction = (layer: WfsLayer | WmsLayer): void => {
            this.activateEditMode(false);

            // If already exists, remove
            if (this._interactionDraw) {
                this._map.removeInteraction(this._interactionDraw);
            }

            const geomDrawType = this._selectDraw.value;

            this._interactionDraw = new Draw({
                source: getEditLayer().getSource(),
                type: geomDrawType as GeometryType,
                style: (feature: Feature<Geometry>) => styleFunction(feature),
                stopClick: true // To prevent firing a map/wms click
            });

            this._map.addInteraction(this._interactionDraw);

            this._interactionDraw.on('drawstart', (evt) => {
                super.dispatchEvent(evt);
            });

            this._interactionDraw.on('drawend', (evt) => {
                const feature: Feature<Geometry> = evt.feature;
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
        } else {
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
    activateEditMode(bool = true): void {
        if (bool) {
            activateModeButtons();
            this.activateDrawMode(false);
        } else {
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
    _removeOverlayHelper(feature: FeatureLike): void {
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
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 * Default values:
 * ```javascript
 * {
 *  layers: null,
 *  evtType: 'singleclick',
 *  active: true,
 *  showControl: true,
 *  language: 'en',
 *  i18n: {...}, // according to language selection
 *  uploadFormats: '.geojson,.json,.kml',
 *  processUpload: null,
 * }
 * ```
 */
interface Options {
    /**
     * Layers to be loaded from the geoserver
     */
    layers?: Array<WfsLayer | WmsLayer>;

    /**
     * Init active
     */
    active?: boolean;

    /**
     * The click event to allow selection of Features to be edited
     */
    evtType?: 'singleclick' | 'dblclick';

    /**
     * Show/hide the control map
     */
    showControl?: boolean;

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
    language?: 'es' | 'en' | 'zh';

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
    processUpload?(file: File): Array<Feature<Geometry>>;
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
 *  geoserver: null,
 *  label: null, // `name` if not provided
 *  strategy: all,
 *  geoserverVendor: null
 * }
 * ```
 */
interface LayerOptions extends Omit<VectorLayerOptions<any>, 'source'> {
    /**
     * Layer name in the GeoServer
     */
    name: string;

    /**
     * Geoserver Object
     */
    geoserver: Geoserver;

    /**
     * Label to be displayed in the widget control
     */
    label?: string;

    /**
     * Available geoserver options
     */
    geoserverVendor?: WfsGeoserverVendor | WmsGeoserverVendor;

    /**
     * Strategy function for loading features.
     * Only for WFS
     * By default `all` strategy is used
     */
    strategy?: LoadingStrategy;

    /**
     * Triggered before inserting new features to the Geoserver.
     * Use this to insert custom properties, modify the feature, etc.
     */
    beforeTransactFeature?(
        feature: Feature<Geometry>,
        transaction: TransactionType
    ): Feature<Geometry>;
}
class WfstEvent extends BaseEvent {
    public data: IGeoserverDescribeFeatureType;
    public layer: WfsLayer | WmsLayer;

    constructor(options: {
        type: WfstEventTypes;
        layer: WfsLayer | WmsLayer;
        data: IGeoserverDescribeFeatureType;
    }) {
        super(options.type);
        this.layer = options.layer;
        this.data = options.data;
    }
}

type WfstEventTypes = 'describeFeatureType';

export {
    Options,
    WfstEventTypes,
    WfstEvent,
    I18n,
    LayerOptions,
    Geoserver,
    WmsLayer,
    WfsLayer
};
