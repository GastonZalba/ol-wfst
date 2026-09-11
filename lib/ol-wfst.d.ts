import Geometry from 'ol/geom/Geometry.js';
import Control from 'ol/control/Control.js';
import Draw from 'ol/interaction/Draw.js';
import DragBox from 'ol/interaction/DragBox.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import { EventsKey } from 'ol/events.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Map from 'ol/Map.js';
import BaseEvent from 'ol/events/Event.js';
import { LoadingStrategy } from 'ol/source/Vector.js';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import LayersControl from './modules/LayersControl';
import Uploads from './modules/Uploads';
import { TransactionType } from './@enums';
import { I18n, IGeoserverDescribeFeatureType, IProperty, WfsGeoserverVendor, WmsGeoserverVendor } from './@types';
import EditControlChangesEl from './modules/EditControlChanges';
import { EditFieldsModal } from './modules/EditFieldsModal';
import Geoserver from './Geoserver';
import ExtendLineOverlay from './modules/ExtendLineOverlay';
import './assets/scss/-ol-wfst.bootstrap5.scss';
import './assets/scss/ol-wfst.scss';
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
    protected _map: Map;
    protected _view: View;
    protected _viewport: HTMLElement;
    protected _initialized: boolean;
    protected _layersControl: LayersControl;
    protected _overlay: Overlay;
    protected _interactionWfsSelect: Select;
    protected _interactionSelectModify: Select;
    protected _collectionModify: Collection<any>;
    protected _interactionModify: Modify;
    protected _interactionSnap: Snap;
    protected _interactionDraw: Draw;
    protected _interactionDragBox: DragBox;
    protected _interactionFreehandSelect: Draw;
    protected _keyClickQuery: EventsKey;
    protected _queryOverlay: Overlay;
    protected _queryOverlayId: string;
    protected _highlightSource: VectorSource;
    protected _highlightLayer: VectorLayer;
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _shiftPressed: boolean;
    protected _controlApplyDiscardChanges: EditControlChangesEl;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _layersWidgetDiv: HTMLElement;
    protected _selectDraw: HTMLSelectElement;
    protected _currentZoom: number;
    protected _lastZoom: number;
    protected _hoveredFeature: Feature<Geometry>;
    protected _keySelectBound: boolean;
    protected _editFeaturesOriginal: {
        [key: string]: Feature<Geometry>;
    };
    protected _multiOverlayId: string;
    protected _extendOverlays: ExtendLineOverlay[];
    protected _extendDraw: Draw;
    protected _uploads: Uploads;
    protected _editFields: EditFieldsModal;
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<WfstEventTypes, WfstEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<WfstEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<WfstEventTypes, WfstEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<WfstEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<WfstEventTypes, WfstEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<WfstEventTypes | ObjectEventTypes | EventTypes, void>;
    constructor(options?: Options);
    /**
     * Get all the layers in the ol-wfst instance
     * @public
     */
    getLayers(): Array<WfsLayer | WmsLayer>;
    /**
     * Get a layer
     * @public
     */
    getLayerByName(layerName?: string): WfsLayer | WmsLayer;
    /**
     * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
     * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
     * @fires describeFeatureType
     * @private
     */
    private _initMapAndLayers;
    /**
     * @private
     */
    private _init;
    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controls and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    private _createMapElements;
    /**
     * @private
     */
    private _addInteractions;
    /**
     * Interactions to select features by drawing a box (DragBox) or a freehand
     * polygon (freehand Draw lasso). The selected features are added to the
     * edit list, keeping the same behaviour as the single click selection.
     *
     * @private
     */
    private _addSelectionInteractions;
    /**
     * Whether a selection tool mode is currently usable: only outside the
     * edit/draw modes.
     *
     * @param mode
     * @private
     */
    private _isSelectMode;
    /**
     * Enable/disable the box and freehand selection interactions according to
     * the current selection tool and map mode.
     *
     * @private
     */
    private _refreshSelectionInteractions;
    /**
     * Select the features that intersect the given polygon on the active layer
     * and add them to the edit list. WFS features are picked from the already
     * loaded source, while WMS features are requested to the GeoServer with a
     * WFS GetFeature INTERSECTS filter.
     *
     * @param geometry
     * @private
     */
    private _selectByGeometry;
    /**
     * Add the given features to the edit mode:
     * remove them from their original layer and push them into the edit
     * collection so they can be modified/deleted like the ones selected
     * with a single click.
     *
     * @param features
     * @private
     */
    private _selectFeatures;
    /**
     * Layer to store temporary the elements to be edited
     * @private
     */
    private _prepareEditLayer;
    /**
     * Create the dedicated layer used to highlight the queried feature, so
     * the source layers keep their own rendering untouched.
     * @private
     */
    private _prepareHighlightLayer;
    /**
     * Listen for clicks while the query mode is active: get the clicked
     * feature of the active layer (from the already loaded source for WFS,
     * or through a GetFeatureInfo request for WMS), highlight it and show
     * its attributes in a popup.
     * @private
     */
    private _addQueryInteraction;
    /**
     * Highlight the given feature and attach a popup with its attributes.
     * @param feature
     * @param layer
     * @param coordinate
     * @private
     */
    private _showQueryResult;
    /**
     * Remove the query popup overlay if any.
     * @private
     */
    private _removeQueryOverlay;
    /**
     * Clear the highlight and remove the query popup.
     * @private
     */
    private _clearQueryResult;
    /**
     * Activate/deactivate the query mode: while it is active, clicking a
     * feature of the active layer shows its info in a popup instead of
     * selecting it for editing.
     *
     * @param bool
     * @public
     */
    activateQueryMode(bool?: boolean): void;
    /**
     * @private
     */
    private _addMapEvents;
    /**
     * Allow panning with the middle mouse button at all times, even when the
     * draw/freehand/box interactions are consuming the left button. The
     * middle pointerdown is intercepted in the capture phase so OpenLayers
     * never processes it and the active tool is not affected.
     *
     * @private
     */
    private _addMiddleButtonPan;
    /**
     * Add map handlers
     * @private
     */
    private _addInteractionHandlers;
    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    private _addMapControl;
    /**
     *
     * @param feature
     * @private
     */
    private _deselectEditFeature;
    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    private _restoreFeatureToLayer;
    /**
     * @param feature
     * @private
     */
    private _removeFeatureFromTmpLayer;
    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    private _onDeselectFeatureEvent;
    /**
     * Trigger on removing a feature from the Edit layer
     *
     * @private
     */
    private _onRemoveFeatureEvent;
    /**
     *
     * @param features
     * @private
     */
    private _editModeOn;
    /**
     * @private
     */
    private _editModeOff;
    /**
     * Get the first and last coordinate of every line component of a
     * LineString/MultiLineString geometry, including the line components
     * nested inside a GeometryCollection. Anything else returns an empty
     * array.
     *
     * @param geometry
     * @private
     */
    private _getLineEndPoints;
    /**
     * Remove every "continue drawing" overlay and abort any active line
     * extension draw.
     *
     * @private
     */
    private _destroyExtendLineOverlays;
    /**
     * Keep the "continue drawing" overlays in sync with the current edit
     * selection: they are only shown while editing LineString/MultiLineString
     * features, and they are repositioned on the endpoints of each line
     * component.
     *
     * @private
     */
    private _syncExtendLineOverlays;
    /**
     * Move the "continue drawing" overlays to the current position of their
     * line endpoints, e.g. after a vertex is dragged with the Modify
     * interaction.
     *
     * @private
     */
    private _updateExtendOverlayPositions;
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
    private _startExtendLineDraw;
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
    private _mergeExtendLine;
    /**
     * Remove the active line extension draw and restore the interactions that
     * were disabled while drawing.
     *
     * @private
     */
    private _finishExtendDraw;
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
    private _transactEditList;
    /**
     * Remove features from the edit Layer and from the Geoserver
     *
     * @param feature
     * @param confirm
     * @private
     */
    private _deleteFeature;
    /**
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     *
     * @param feature
     * @param coordinate
     * @param layerName
     * @private
     */
    private _addFeatureToEditMode;
    /**
     * Lock the whole current selection with a single LockFeature request per
     * layer, so the transaction LockId covers all the selected features
     *
     * @private
     */
    private _lockSelectedFeatures;
    /**
     * Create an EditOverlay helper and attach the edit listeners
     *
     * @param feature
     * @param coordinate
     * @param id
     * @private
     */
    private _createEditOverlay;
    /**
     * Sync the edit overlay helpers with the current selection: a single
     * per-feature overlay while a feature is selected, or a unique overlay
     * centered between all the selected features when editing several at once
     *
     * @private
     */
    private _syncEditOverlays;
    /**
     * Activate/deactivate the draw mode
     *
     * @param layer
     * @public
     */
    activateDrawMode(layer: WfsLayer | WmsLayer | false): void;
    /**
     * Activate/desactivate the edit mode
     *
     * @param bool
     * @public
     */
    activateEditMode(bool?: boolean): void;
    /**
     * Reset the cursor and remove the hover style of the last hovered feature
     * @private
     */
    private _clearHoverState;
    /**
     * Change the map cursor while in edit mode: `move` when the pointer is
     * over an editable vertex and `copy` when it is over a segment (where a
     * new vertex can be inserted), mirroring the Modify interaction hit
     * tolerance.
     *
     * @param evt
     * @private
     */
    private _updateEditCursor;
    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    private _removeOverlayHelper;
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
    beforeTransactFeature?(feature: Feature<Geometry>, transaction: TransactionType): Feature<Geometry>;
    /**
     * Hook to customize the html elements showed in the fields modal
     * Return `null` to hide the field from the modal
     */
    beforeShowFieldsModal?: (field: IProperty, value: string, formElement: HTMLElement) => HTMLElement | string | null;
}
declare class WfstEvent extends BaseEvent {
    data: IGeoserverDescribeFeatureType;
    layer: WfsLayer | WmsLayer;
    constructor(options: {
        type: WfstEventTypes;
        layer: WfsLayer | WmsLayer;
        data: IGeoserverDescribeFeatureType;
    });
}
type WfstEventTypes = 'describeFeatureType';
export { Options, WfstEventTypes, WfstEvent, I18n, LayerOptions, Geoserver, WmsLayer, WfsLayer };
//# sourceMappingURL=ol-wfst.d.ts.map