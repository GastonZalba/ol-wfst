// Ol
import Geometry from 'ol/geom/Geometry.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Control from 'ol/control/Control.js';
import FullScreen from 'ol/control/FullScreen.js';
import Draw from 'ol/interaction/Draw.js';
import DragBox from 'ol/interaction/DragBox.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import Polygon from 'ol/geom/Polygon.js';
import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import SimpleGeometry from 'ol/geom/SimpleGeometry.js';
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
import { shiftKeyOnly, primaryAction } from 'ol/events/condition.js';
import {
    unByKey,
    CombinedOnSignature,
    EventTypes,
    OnSignature
} from 'ol/Observable.js';
import { Coordinate } from 'ol/coordinate.js';
import { createEmpty, extend, getCenter, Extent } from 'ol/extent.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';

import { initModal, showError } from './modules/errors';
import { initLoading, showLoading } from './modules/loading';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import LayersControl, {
    activateDrawButton,
    activateModeButtons,
    activateSelectModeButton,
    deactivateSelectModeButton,
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
    setSelectionMode,
    getSelectionMode,
    SelectionMode,
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
    IProperty,
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

// Images
import fullscreenSvg from './assets/images/fullscreen.svg';
import fullscreenExitSvg from './assets/images/fullscreenExit.svg';

// Style
import './assets/scss/-ol-wfst.bootstrap5.scss';
import './assets/scss/ol-wfst.scss';

const controlElement = document.createElement('div');

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
    protected _interactionDragBox: DragBox;
    protected _interactionFreehandSelect: Draw;

    // Obserbable keys
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _shiftPressed = false;

    // Controls
    protected _controlApplyDiscardChanges: EditControlChangesEl;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _layersWidgetDiv: HTMLElement;
    protected _selectDraw: HTMLSelectElement;

    // State
    protected _currentZoom: number;
    protected _lastZoom: number;
    protected _hoveredFeature: Feature<Geometry> = null;
    protected _keySelectBound = false;
    // Editing
    protected _editFeaturesOriginal: {
        [key: string]: Feature<Geometry>;
    } = {};
    protected _multiOverlayId = 'ol-wfst--multi-edit-overlay';

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

        this._editFields = new EditFieldsModal(this._options);
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
    private async _initMapAndLayers(): Promise<void> {
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
    private _init(): void {
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
            const list: Feature<Geometry>[] = features || [feature];
            const ok = await this._transactEditList(list);
            if (ok) {
                Array.from(list).forEach((f) =>
                    this._collectionModify.remove(f)
                );
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
        this._map.addControl(
            new Control({
                element: this._layersWidgetDiv
            })
        );

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
    private async _createMapElements(
        showControl: boolean,
        active: boolean
    ): Promise<void> {
        // VectorLayer to store features on editing and inserting
        this._prepareEditLayer();

        this._addInteractions();
        this._addInteractionHandlers();

        if (showControl) {
            this._addMapControl();

            if (this._options.fullscreen) {
                this._map.addControl(
                    new FullScreen({
                        className: 'ol-wfst--fullscreen',
                        tipLabel: i18n.I18N.labels.fullscreen,
                        label: fullscreenSvg(),
                        labelActive: fullscreenExitSvg()
                    })
                );
            }
        }

        // By default, init in edit mode
        this.activateEditMode(active);
    }

    /**
     * @private
     */
    private _addInteractions(): void {
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
                toggleCondition: shiftKeyOnly, // Allow adding features to the selection with shift
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

                    // Clear hover to avoid keeping the style on the selected feature
                    this._clearHoverState();

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
                toggleCondition: shiftKeyOnly, // Allow adding features with shift
                removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
            });

            this._map.addInteraction(this._interactionSelectModify);

            // When clicking without shift, replace the current selection: remove
            // any previously selected and not re-selected feature from the edit list
            this._interactionSelectModify.on(
                'select',
                ({ selected, mapBrowserEvent }) => {
                    if (
                        !selected.length ||
                        !mapBrowserEvent ||
                        shiftKeyOnly(mapBrowserEvent)
                    ) {
                        return;
                    }

                    const selectedSet = new Set(selected);
                    Array.from(this._collectionModify.getArray()).forEach(
                        (feature) => {
                            if (!selectedSet.has(feature)) {
                                this._collectionModify.remove(feature);
                            }
                        }
                    );
                }
            );

            this._collectionModify =
                this._interactionSelectModify.getFeatures();

            this._keyClickWms = this._map.on(
                this._options.evtType || 'singleclick',
                async (evt: MapBrowserEvent<PointerEvent>) => {
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

                        const features =
                            await layer._getFeaturesByClickEvent(evt);

                        if (!features?.length) {
                            return;
                        }

                        // Without shift, replace the current selection
                        if (!shiftKeyOnly(evt)) {
                            Array.from(
                                this._collectionModify.getArray()
                            ).forEach((feature) => {
                                this._collectionModify.remove(feature);
                            });
                        }

                        this._addFeatureToEditMode(
                            features[0],
                            evt.coordinate,
                            layer.get(BaseLayerProperty.NAME)
                        );

                        this._lockSelectedFeatures();
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

        this._addSelectionInteractions();
    }

    /**
     * Interactions to select features by drawing a box (DragBox) or a freehand
     * polygon (freehand Draw lasso). The selected features are added to the
     * edit list, keeping the same behaviour as the single click selection.
     *
     * @private
     */
    private _addSelectionInteractions(): void {
        const selectionStyle = new Style({
            fill: new Fill({
                color: 'rgba(255, 200, 0, 0.1)'
            }),
            stroke: new Stroke({
                color: '#ffc800',
                width: 2,
                lineDash: [6, 4]
            })
        });

        // Box selection (dragging a rectangle)
        this._interactionDragBox = new DragBox({
            condition: (evt) =>
                primaryAction(evt) && this._isSelectMode(SelectionMode.Box),
            className: 'ol-wfst--dragbox'
        });

        this._interactionDragBox.on('boxend', (evt) => {
            if (!this._isSelectMode(SelectionMode.Box)) {
                return;
            }

            // Without shift, replace the current selection
            if (!(evt.mapBrowserEvent.originalEvent as MouseEvent).shiftKey) {
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
            condition: (evt) =>
                primaryAction(evt) && this._isSelectMode(SelectionMode.Freehand)
        });

        this._interactionFreehandSelect.on('drawend', (evt) => {
            if (!this._isSelectMode(SelectionMode.Freehand)) {
                return;
            }

            const geometry = evt.feature.getGeometry() as Polygon;
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
    private _isSelectMode(mode: SelectionMode): boolean {
        return getMode() === null && getSelectionMode() === mode;
    }

    /**
     * Enable/disable the box and freehand selection interactions according to
     * the current selection tool and map mode.
     *
     * @private
     */
    private _refreshSelectionInteractions(): void {
        const active = getMode() === null;

        if (this._interactionDragBox) {
            this._interactionDragBox.setActive(
                active && getSelectionMode() === SelectionMode.Box
            );
        }

        if (this._interactionFreehandSelect) {
            this._interactionFreehandSelect.setActive(
                active && getSelectionMode() === SelectionMode.Freehand
            );
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
    private async _selectByGeometry(geometry: Polygon): Promise<void> {
        const layer = getActiveLayerToInsertEls();

        if (!layer || !layer.getVisible() || !layer.isVisibleByZoom()) {
            showError(i18n.I18N.errors.layerNotVisible);
            return;
        }

        let features: Feature<Geometry>[];

        if (layer instanceof WfsLayer) {
            const candidates = layer
                .getSource()
                .getFeaturesInExtent(geometry.getExtent());

            // The extent is only a bounding box; for the freehand lasso be
            // more precise and keep the features whose vertices fall inside it
            if (getSelectionMode() === SelectionMode.Freehand) {
                features = candidates.filter((feature) => {
                    const featureGeom = feature.getGeometry() as SimpleGeometry;
                    if (!featureGeom) {
                        return false;
                    }
                    const flatCoords = featureGeom.getFlatCoordinates();
                    const stride = featureGeom.getStride();
                    for (let i = 0; i < flatCoords.length; i += stride) {
                        if (
                            geometry.intersectsCoordinate([
                                flatCoords[i],
                                flatCoords[i + 1]
                            ])
                        ) {
                            return true;
                        }
                    }
                    return false;
                });
            } else {
                features = candidates;
            }
        } else if (layer instanceof WmsLayer) {
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
    private _selectFeatures(features: Feature<Geometry>[]): void {
        if (!features || !features.length) {
            return;
        }

        const layer = getActiveLayerToInsertEls();
        const layerName = layer.get(BaseLayerProperty.NAME);

        const selectedIds = new Set(
            this._collectionModify.getArray().map((feature) => feature.getId())
        );

        features.forEach((feature) => {
            if (isFeatureEdited(feature) || selectedIds.has(feature.getId())) {
                return;
            }

            // WFS features are stored in their layer source: remove them from
            // there while they are being edited
            if (
                layer instanceof WfsLayer &&
                layer.getSource().hasFeature(feature)
            ) {
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
    private _prepareEditLayer(): void {
        this._map.addLayer(getEditLayer());
    }

    /**
     * @private
     */
    private _addMapEvents(): void {
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
        const pointerMoveHandler = (
            evt: MapBrowserEvent<PointerEvent>
        ): void => {
            if (evt.dragging) {
                return;
            }

            // Only show the hover outside edit and draw modes
            if (getMode() !== null) {
                this._clearHoverState();
                return;
            }

            const layer = getActiveLayerToInsertEls();

            // Hover only works on visible WFS layers
            if (
                !layer ||
                !layer.getVisible() ||
                !layer.isVisibleByZoom() ||
                !(layer instanceof WfsLayer)
            ) {
                this._clearHoverState();
                return;
            }

            const features = this._map.getFeaturesAtPixel(evt.pixel, {
                hitTolerance: 10,
                layerFilter: (candidate) => candidate === layer
            });

            if (features && features.length) {
                const feature = features[0] as Feature<Geometry>;

                if (feature !== this._hoveredFeature) {
                    this._clearHoverState();
                    this._hoveredFeature = feature;
                    this._hoveredFeature.setStyle((f) =>
                        styleFunction(f as Feature<Geometry>, true)
                    );
                }

                if (this._viewport.style.cursor !== 'pointer') {
                    this._viewport.style.cursor = 'pointer';
                }
            } else {
                this._clearHoverState();
            }
        };

        this._map.on('pointermove', pointerMoveHandler);

        // Store the shift state when a gesture starts, so the freehand
        // selection can decide between adding or replacing the selection
        this._viewport.addEventListener('pointerdown', (evt: PointerEvent) => {
            this._shiftPressed = evt.shiftKey;
        });

        // Clear the hover before firing a click, otherwise the Select interaction
        // would capture the hover style as the original style of the feature and
        // restore it on deselect, leaving the highlight permanently enabled.
        this._viewport.addEventListener('pointerdown', () =>
            this._clearHoverState()
        );

        this._viewport.addEventListener(
            'pointerleave',
            () => this._clearHoverState(),
            { once: false }
        );

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
     * Allow panning with the middle mouse button at all times, even when the
     * draw/freehand/box interactions are consuming the left button. The
     * middle pointerdown is intercepted in the capture phase so OpenLayers
     * never processes it and the active tool is not affected.
     *
     * @private
     */
    private _addMiddleButtonPan(): void {
        const viewport = this._viewport;

        let panning = false;
        let lastX = 0;
        let lastY = 0;

        const isMiddleButton = (evt: PointerEvent): boolean =>
            evt.pointerType === 'mouse' && evt.button === 1;

        const stopPanning = (): void => {
            panning = false;
        };

        viewport.addEventListener(
            'pointerdown',
            (evt: PointerEvent) => {
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
            },
            true
        );

        viewport.addEventListener('pointermove', (evt: PointerEvent) => {
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

        const endPan = (): void => {
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
    private _addInteractionHandlers(): void {
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

        this._onDeselectFeatureEvent();
        this._onRemoveFeatureEvent();
    }

    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    private _addMapControl(): void {
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

        // @ts-expect-error
        this._layersControl.on('changeLayer', () => {
            if (getMode() === Modes.Draw) {
                this.activateDrawMode(getActiveLayerToInsertEls());
            }
        });

        (
            [
                ['selectModeSingle', SelectionMode.Single],
                ['selectModeBox', SelectionMode.Box],
                ['selectModeFreehand', SelectionMode.Freehand]
            ] as Array<[string, SelectionMode]>
        ).forEach(([evtName, mode]) => {
            // @ts-expect-error
            this._layersControl.on(evtName, () => {
                // Leaving the draw mode when a select tool is chosen
                if (getMode() === Modes.Draw) {
                    resetStateButtons();
                    this.activateEditMode();
                }

                setSelectionMode(mode);
                activateSelectModeButton(mode);
                this._refreshSelectionInteractions();
            });
        });

        const controlEl = this._layersControl.render();

        this._selectDraw = controlEl.querySelector(
            '.wfst--tools-control--select-draw'
        );

        this._controlWidgetToolsDiv.append(
            controlEl.querySelector('.wfst--tools-control--head')
        );
        this._layersWidgetDiv.append(
            controlEl.querySelector('.wfst--tools-control--select-layers')
        );
    }

    /**
     *
     * @param feature
     * @private
     */
    private _deselectEditFeature(feature: FeatureLike): void {
        this._removeOverlayHelper(feature);
    }

    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    private _restoreFeatureToLayer(
        feature: Feature<Geometry>,
        layerName?: string
    ): void {
        layerName = layerName || feature.get('_layerName_');
        const layer = getStoredMapLayers()[layerName];
        // Reset any per-feature style (e.g. hover) before returning the feature
        // to its layer, so it renders with the layer's default style.
        feature.setStyle(undefined);
        (layer.getSource() as VectorSource).addFeature(feature);
    }

    /**
     * @param feature
     * @private
     */
    private _removeFeatureFromTmpLayer(feature: Feature<Geometry>): void {
        // Remove element from the Layer
        getEditLayer().getSource().removeFeature(feature);
    }

    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    private _onDeselectFeatureEvent(): void {
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
    private _onRemoveFeatureEvent(): void {
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
    private _editModeOn(features: Feature<Geometry>[]): void {
        features = Array.isArray(features) ? features : [features];

        features.forEach((feature) => {
            this._editFeaturesOriginal[String(feature.getId())] =
                feature.clone();
        });

        activateMode(Modes.Edit);

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
            const list: Feature<Geometry>[] = (evt as any).features;
            Array.from(list).forEach((feature) => {
                const original =
                    this._editFeaturesOriginal[String(feature.getId())];
                if (original) {
                    feature.setGeometry(original.getGeometry());
                }
                removeFeatureFromEditList(feature);
                this._collectionModify.remove(feature);
            });
        });

        this._controlApplyDiscardChanges.on('apply', async (evt) => {
            showLoading();
            const list: Feature<Geometry>[] = (evt as any).features;
            const ok = await this._transactEditList(list);
            if (ok) {
                Array.from(list).forEach((feature) => {
                    this._collectionModify.remove(feature);
                });
            }
        });

        this._controlApplyDiscardChanges.on('delete', (evt) => {
            this._deleteFeature((evt as any).features, true);
        });

        this._map.addControl(this._controlApplyDiscardChanges);
    }

    /**
     * @private
     */
    private _editModeOff(): void {
        activateMode(null);
        this._map.removeControl(this._controlApplyDiscardChanges);
        this._refreshSelectionInteractions();
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
    private async _transactEditList(
        list: Feature<Geometry>[]
    ): Promise<boolean> {
        if (!list.length) {
            return true;
        }

        const byLayer: { [key: string]: Feature<Geometry>[] } = {};

        list.forEach((feature) => {
            const layerName = feature.get('_layerName_');
            if (!byLayer[layerName]) {
                byLayer[layerName] = [];
            }
            byLayer[layerName].push(feature);
        });

        for (const layerName of Object.keys(byLayer)) {
            const layer = this._options.layers.find(
                (layer) => layer.get(BaseLayerProperty.NAME) === layerName
            );

            if (!layer) {
                continue;
            }

            byLayer[layerName].forEach((feature) => {
                removeFeatureFromEditList(feature);
            });

            let ok;
            try {
                ok = await layer.transactFeatures(
                    TransactionType.Update,
                    byLayer[layerName]
                );
            } catch (err) {
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
    private _deleteFeature(
        feature: Feature<Geometry> | Feature<Geometry>[],
        confirm: boolean
    ): void {
        const deleteEl = () => {
            const features = Array.isArray(feature) ? feature : [feature];
            features.forEach((feature) => {
                feature.set('_delete_', true, true);
                getEditLayer().getSource().removeFeature(feature);
            });
            this._collectionModify.clear();

            this._editModeOff();
            this._syncEditOverlays();

            const layerName = features[0]?.get('_layerName_');
            const layer = layerName
                ? this._options.layers.find(
                      (layer) => layer.get(BaseLayerProperty.NAME) === layerName
                  )
                : null;

            if (layer instanceof WfsLayer) {
                features.forEach((feature) => {
                    this._interactionWfsSelect.getFeatures().remove(feature);
                });
            }
        };

        if (confirm) {
            const features = Array.isArray(feature) ? feature : [feature];
            const message =
                features.length > 1
                    ? i18n.I18N_('confirmDeleteElements', features.length)
                    : i18n.I18N.labels.confirmDelete;

            const confirmModal = Modal.confirm(message, {
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
    private _addFeatureToEditMode(
        feature: Feature<Geometry>,
        coordinate: Coordinate = null,
        layerName = null
    ): void {
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
    private async _lockSelectedFeatures(): Promise<void> {
        const byLayer: { [key: string]: Array<string | number> } = {};

        this._collectionModify.getArray().forEach((selected) => {
            const layerName = selected.get('_layerName_');

            if (!layerName) {
                return;
            }

            (byLayer[layerName] || (byLayer[layerName] = [])).push(
                selected.getId()
            );
        });

        const locks: Array<Promise<string>> = [];

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
    private _createEditOverlay(
        feature: Feature<Geometry> = null,
        coordinate: Coordinate = null,
        id: string | number = null
    ): void {
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
    private _syncEditOverlays(): void {
        if (getMode() === Modes.Edit) {
            return;
        }

        const multiOverlay = this._map.getOverlayById(this._multiOverlayId);
        if (multiOverlay) {
            this._map.removeOverlay(multiOverlay);
        }

        const items: Feature<Geometry>[] = this._collectionModify.getArray();

        if (items.length > 1) {
            items.forEach((feature) => {
                this._removeOverlayHelper(feature);
            });

            const extent: Extent = createEmpty();
            items.forEach((feature) => {
                extend(extent, feature.getGeometry().getExtent());
            });

            this._createEditOverlay(
                null,
                getCenter(extent),
                this._multiOverlayId
            );
        } else if (items.length === 1) {
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

            // Clear hover style while drawing
            this._clearHoverState();

            activateDrawButton();
            deactivateSelectModeButton();

            this._viewport.classList.add('draw-mode');

            addDrawInteraction(layer);
        } else {
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
    activateEditMode(bool = true): void {
        if (bool) {
            activateModeButtons();
            this.activateDrawMode(false);
        } else {
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
    private _clearHoverState(): void {
        if (this._viewport) {
            this._viewport.style.cursor = '';
        }

        if (this._hoveredFeature) {
            this._hoveredFeature.setStyle(undefined);
            this._hoveredFeature = null;
        }
    }

    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    private _removeOverlayHelper(feature: FeatureLike): void {
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
 *  fullscreen: true,
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
     * Show/hide the fullscreen button on the map
     */
    fullscreen?: boolean;

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
interface LayerOptions extends Omit<VectorLayerOptions<any, any>, 'source'> {
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

    /**
     * Hook to customize the html elements showed in the fields modal
     * Return `null` to hide the field from the modal
     */
    beforeShowFieldsModal?: (
        field: IProperty,
        value: string,
        formElement: HTMLElement
    ) => HTMLElement | string | null;
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
