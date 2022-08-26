// Ol
import { Geometry } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Control } from 'ol/control';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import { Collection, Feature, Overlay, PluggableMap, View } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector';
import { Vector as VectorSource } from 'ol/source';
import { getCenter } from 'ol/extent';
import { never, primaryAction } from 'ol/events/condition';
import { ProjectionLike } from 'ol/proj';
import { unByKey } from 'ol/Observable';

import { initModal, showError } from './modules/errors';
import { initLoading, showLoading } from './modules/loading';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import MainControl, {
    activateDrawButton,
    activateModeButtons,
    resetStateButtons
} from './modules/MainControl';
import Uploads from './modules/Uploads';
import {
    addFeatureToEditedList,
    getStoredMapLayers,
    isFeatureEdited,
    removeFeatureFromEditList,
    setLayerToInsert,
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

// External
import Modal from 'modal-vanilla';

// Images
import editFieldsSvg from './assets/images/editFields.svg';
import editGeomSvg from './assets/images/editGeom.svg';

import { GeometryType, Transact } from './@enums';
import { I18n, WfsGeoserverVendor, WmsGeoserverVendor } from './@types';
import * as i18n from './modules/i18n/index';
import { getDefaultOptions } from './defaults';

// Style
import './assets/scss/-ol-wfst.bootstrap5.scss';
import './assets/scss/ol-wfst.scss';
import EditControlEl from './modules/EditControl';
import styleFunction from './modules/styleFunction';
import { EditFieldsModal } from './modules/EditFieldsModal';
import Geoserver from './Geoserver';

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
 * @fires getFeature
 * @fires modifystart
 * @fires modifyend
 * @fires drawstart
 * @fires drawend
 * @fires load
 * @fires visible
 * @extends {ol/control/Control~Control}
 * @param options Wfst options, see [Wfst Options](#options) for more details.
 */
export default class Wfst extends Control {
    protected _options: Options;
    protected _i18n: I18n;

    // Ol
    protected _map: PluggableMap;
    protected _view: View;
    protected _viewport: HTMLElement;
    protected _initialized = false;
    protected _mainControl: MainControl;
    public overlay: Overlay;

    // Interactions
    protected interactionWfsSelect: Select;
    protected interactionSelectModify: Select;
    protected _collectionModify: Collection<any>;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;

    // Obserbable keys
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;

    // Controls
    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _selectDraw: HTMLSelectElement;

    // State
    protected _isVisible: boolean;
    protected _currentZoom: number;
    protected _lastZoom: number;

    // Editing
    protected _editFeature: Feature<Geometry>;
    protected _editFeatureOriginal: Feature<Geometry>;

    protected _uploads: Uploads;
    protected _editFields: EditFieldsModal;

    constructor(options?: Options) {
        super({
            target: null,
            element: controlElement
        });

        i18n.setLang(options.language, options.i18n);

        const defaultOptions = getDefaultOptions();

        this._options = deepObjectAssign(defaultOptions, options);

        // By default, the first layer is ready to accept new draws
        setLayerToInsert(this._options.layers[0]);

        this._controlWidgetToolsDiv = controlElement;
        this._controlWidgetToolsDiv.className = 'ol-wfst--tools-control';

        this._uploads = new Uploads(this._options);

        this._editFields = new EditFieldsModal(this._options.modal);
    }

    init(): void {
        this._map = super.getMap();
        this._view = this._map.getView();
        this._viewport = this._map.getViewport();

        setMap(this._map);

        // State
        this.set(
            '_isVisible',
            this._view.getZoom() > this._options.minZoom,
            /** opt_silent */ true
        );

        //@ts-expect-error
        this._uploads.on('addedFeatures', ({ features }) => {
            const layer = getActiveLayerToInsertEls();
            layer.transactFeatures(Transact.Insert, features);
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
     * Gat all the layers in the ol-wfst instance
     * @public
     */
    getLayers(): Array<WfsLayer | WmsLayer> {
        return Object.values(getStoredMapLayers());
    }

    /**
     * Gat the layer
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
     * Return boolean if the vector are visible on the map (zoom level and min resolution)
     * @public
     * @returns
     */
    isVisible(): boolean {
        return this.get('_isVisible');
    }

    /**
     * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
     * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
     * @private
     */
    async _initMapAndLayers(): Promise<void> {
        try {
            if (this.get('_isVisible')) {
                showLoading();
            }

            const layers = this._options.layers;

            if (layers.length) {
                let layerLoaded = 0;
                let layersNumber = 0; // Only count visibles

                layers.forEach((layer) => {
                    if (layer.getVisible()) layersNumber++;

                    layer.init();

                    //@ts-expect-error
                    layer.on('layerLoaded', () => {
                        layerLoaded++;
                        if (layerLoaded >= layersNumber) {
                            // run only once
                            if (!this._initialized) {
                                this.dispatchEvent('load');
                                this._initialized = true;
                            }
                            showLoading(false);
                        }
                    });

                    this._map.addLayer(layer);

                    setMapLayers({ [layer.get('name')]: layer });
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
            this.interactionWfsSelect = new Select({
                hitTolerance: 10,
                style: (feature: Feature<Geometry>) => styleFunction(feature),
                toggleCondition: never, // Prevent add features to the current selection using shift
                filter: (feature, layer) => {
                    return (
                        getMode() !== Modes.Edit &&
                        layer &&
                        layer instanceof WfsLayer
                    );
                }
            });

            this._map.addInteraction(this.interactionWfsSelect);

            this.interactionWfsSelect.on(
                'select',
                ({ selected, deselected, mapBrowserEvent }) => {
                    const coordinate = mapBrowserEvent.coordinate;

                    if (selected.length) {
                        selected.forEach((feature) => {
                            if (!isFeatureEdited(feature)) {
                                // Remove the feature from the original layer
                                const layer =
                                    this.interactionWfsSelect.getLayer(feature);
                                layer.getSource().removeFeature(feature);
                                this._addFeatureToEdit(feature, coordinate);
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
            this.interactionSelectModify = new Select({
                style: (feature: Feature<Geometry>) => styleFunction(feature),
                layers: [getEditLayer()],
                toggleCondition: never, // Prevent add features to the current selection using shift
                removeCondition: () => (getMode() === Modes.Edit ? true : false) // Prevent deselect on clicking outside the feature
            });

            this._map.addInteraction(this.interactionSelectModify);

            this._collectionModify = this.interactionSelectModify.getFeatures();

            this._keyClickWms = this._map.on(
                this._options.evtType,
                async (evt) => {
                    if (this._map.hasFeatureAtPixel(evt.pixel)) {
                        return;
                    }
                    if (!this.isVisible()) {
                        return;
                    }
                    // Only get other features if editmode is disabled
                    if (getMode() !== Modes.Edit) {
                        const ll = getStoredMapLayers();

                        for (const layerName in ll) {
                            const layer = ll[layerName];

                            // If layer is hidden or is a wfs, skip
                            if (
                                !layer.getVisible() ||
                                layer instanceof WfsLayer
                            ) {
                                continue;
                            }

                            const features = await layer.getFeatures(evt);

                            if (!features.length) {
                                continue;
                            }

                            features.forEach((feature) =>
                                this._addFeatureToEdit(
                                    feature,
                                    evt.coordinate,
                                    layerName
                                )
                            );
                        }
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

        this.interactionModify = new Modify({
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

        this._map.addInteraction(this.interactionModify);

        this.interactionSnap = new Snap({
            source: getEditLayer().getSource()
        });
        this._map.addInteraction(this.interactionSnap);
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

        /**
         * @private
         */
        const handleZoomEnd = (): void => {
            if (this._currentZoom > this._options.minZoom) {
                // Show the layers
                if (!this.get('_isVisible')) {
                    this.set('_isVisible', true);
                }
            } else {
                // Hide the layer
                if (this.get('_isVisible')) {
                    this.set('_isVisible', false);
                }
            }
        };

        this._map.on('moveend', (): void => {
            this._currentZoom = this._view.getZoom();

            if (this._currentZoom !== this._lastZoom) {
                handleZoomEnd();
            }

            this._lastZoom = this._currentZoom;
        });

        // @ts-expect-error
        this.on('change:_isVisible', () => {
            this.dispatchEvent({
                type: 'visible',
                // @ts-expect-error
                data: this.get('_isVisible')
            });
        });

        keyboardEvents();
    }

    /**
     * Add map handlers
     * @private
     */
    _addInteractionHandlers(): void {
        // When a feature is modified, add this to a list.
        // This prevent events fired on select and deselect features that has no changes and should
        // not be updated in the geoserver
        this.interactionModify.on('modifyend', (evt) => {
            const feature = evt.features.item(0);
            addFeatureToEditedList(feature);
            super.dispatchEvent(evt);
        });

        this.interactionModify.on('modifystart', (evt) => {
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
        this._mainControl = new MainControl(
            this._options.showUpload ? this._uploads.process : null,
            this._options.uploadFormats
        );

        // @ts-expect-error
        this._mainControl.on('drawMode', () => {
            if (getMode() === Modes.Draw) {
                resetStateButtons();
                this.activateEditMode();
            } else {
                this.activateDrawMode(getActiveLayerToInsertEls());
            }
        });

        // @ts-expect-error
        this._mainControl.on('changeGeom', () => {
            if (getMode() === Modes.Draw) {
                this.activateDrawMode(getActiveLayerToInsertEls());
            }
        });

        const controlEl = this._mainControl.render();

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
                (layer) => layer.get('name') === layerName
            );

            if (layer instanceof WfsLayer) {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }

            if (isFeatureEdited(feature)) {
                layer.transactFeatures(Transact.Update, feature);
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

                ll.transactFeatures(Transact.Delete, feature);

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

        this._controlApplyDiscardChanges = new EditControlEl(feature);

        //@ts-expect-error
        this._controlApplyDiscardChanges.on('cancel', ({ feature }) => {
            feature.setGeometry(this._editFeatureOriginal.getGeometry());
            removeFeatureFromEditList(feature);
            this._collectionModify.remove(feature);
        });

        //@ts-expect-error
        this._controlApplyDiscardChanges.on('apply', ({ feature }) => {
            showLoading();
            this._collectionModify.remove(feature);
        });

        //@ts-expect-error
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
                (layer) => layer.get('name') === layerName
            );

            if (layer instanceof WfsLayer) {
                this.interactionWfsSelect.getFeatures().remove(feature);
            }
        };

        if (confirm) {
            const confirmModal = Modal.confirm(
                this._i18n.labels.confirmDelete,
                {
                    ...this._options.modal
                }
            );

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
    _addFeatureToEdit(
        feature: Feature<Geometry>,
        coordinate = null,
        layerName = null
    ): void {
        const prepareOverlay = () => {
            const svgFields = `<img src="${editFieldsSvg}"/>`;
            const editFieldsEl = document.createElement('div');
            editFieldsEl.className = 'ol-wfst--edit-button-cnt';
            editFieldsEl.innerHTML = `<button class="ol-wfst--edit-button" type="button" title="${this._i18n.labels.editFields}">${svgFields}</button>`;

            editFieldsEl.onclick = () => {
                this._editFields.show(feature);
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

            const position =
                coordinate || getCenter(feature.getGeometry().getExtent());

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
                getEditLayer().getSource().addFeature(feature);
                this._collectionModify.push(feature);
                prepareOverlay();

                const layer = getStoredLayer(layerName);
                layer.maybeLockFeature(feature.getId());
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
         * @param layerName
         * @private
         */
        const addDrawInteraction = (layer: WfsLayer | WmsLayer): void => {
            this.activateEditMode(false);

            // If already exists, remove
            if (this.interactionDraw) {
                this._map.removeInteraction(this.interactionDraw);
            }

            const geomDrawType = this._selectDraw.value;

            this.interactionDraw = new Draw({
                source: getEditLayer().getSource(),
                type: geomDrawType as GeometryType,
                style: (feature: Feature<Geometry>) => styleFunction(feature)
            });

            this._map.addInteraction(this.interactionDraw);

            this.interactionDraw.on('drawstart', (evt) => {
                super.dispatchEvent(evt);
            });

            this.interactionDraw.on('drawend', (evt) => {
                const feature: Feature<Geometry> = evt.feature;
                layer.transactFeatures(Transact.Insert, feature);
                super.dispatchEvent(evt);
            });
        };

        if (!this.interactionDraw && !layer) {
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
            this._map.removeInteraction(this.interactionDraw);
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

        if (this.interactionSelectModify) {
            this.interactionSelectModify.setActive(bool);
        }

        this.interactionModify.setActive(bool);

        if (this.interactionWfsSelect)
            this.interactionWfsSelect.setActive(bool);
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
 * **_[interface]_**
 * @public
 */
export interface GeoServerAdvanced {
    getCapabilitiesVersion?: string;
    getFeatureVersion?: string;
    lockFeatureVersion?: string;
    describeFeatureTypeVersion?: string;
    wfsTransactionVersion?: string;
    projection?: ProjectionLike;
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
 *  useLockFeature: true,
 *  minZoom: 9,
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
     * Zoom level to hide features to prevent too much features being loaded
     *
     * This sets the attribute globally.
     * To use different parameters between different layers, set it within each layer.
     */
    minZoom?: number;

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
 *  label: null, // `name` if not provided
 *  mode: 'wfs',
 *  wfsStrategy: 'bbox',
 *  geoServerVendor: null
 * }
 * ```
 */
interface LayerParams extends Omit<VectorLayerOptions<any>, 'source'> {
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
     * Strategy function for loading features.
     * Only for WFS
     */
    wfsStrategy?: string;

    /**
     * Available geoserver options
     */
    geoServerVendor?: WfsGeoserverVendor | WmsGeoserverVendor;
}

export { Options, I18n, LayerParams, Geoserver, WmsLayer, WfsLayer };
