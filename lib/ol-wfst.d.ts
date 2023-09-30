import Geometry from 'ol/geom/Geometry.js';
import Control from 'ol/control/Control.js';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';
import Snap from 'ol/interaction/Snap.js';
import { EventsKey } from 'ol/events.js';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import BaseEvent from 'ol/events/Event.js';
import { LoadingStrategy } from 'ol/source/Vector.js';
import { FeatureLike } from 'ol/Feature.js';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { Coordinate } from 'ol/coordinate.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import LayersControl from './modules/LayersControl';
import Uploads from './modules/Uploads';
import { TransactionType } from './@enums';
import { I18n, IGeoserverDescribeFeatureType, WfsGeoserverVendor, WmsGeoserverVendor } from './@types';
import EditControlChangesEl from './modules/EditControlChanges';
import { EditFieldsModal } from './modules/EditFieldsModal';
import Geoserver from './Geoserver';
import './assets/scss/-ol-wfst.bootstrap5.scss';
import './assets/scss/ol-wfst.scss';
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
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _controlApplyDiscardChanges: EditControlChangesEl;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _selectDraw: HTMLSelectElement;
    protected _currentZoom: number;
    protected _lastZoom: number;
    protected _editFeature: Feature<Geometry>;
    protected _editFeatureOriginal: Feature<Geometry>;
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
    _initMapAndLayers(): Promise<void>;
    /**
     * @private
     */
    _init(): void;
    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controls and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    _createMapElements(showControl: boolean, active: boolean): Promise<void>;
    /**
     * @private
     */
    _addInteractions(): void;
    /**
     * Layer to store temporary the elements to be edited
     * @private
     */
    _prepareEditLayer(): void;
    /**
     * @private
     */
    _addMapEvents(): void;
    /**
     * Add map handlers
     * @private
     */
    _addInteractionHandlers(): void;
    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addMapControl(): void;
    /**
     *
     * @param feature
     * @private
     */
    _deselectEditFeature(feature: FeatureLike): void;
    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    _restoreFeatureToLayer(feature: Feature<Geometry>, layerName?: string): void;
    /**
     * @param feature
     * @private
     */
    _removeFeatureFromTmpLayer(feature: Feature<Geometry>): void;
    /**
     * Trigger on deselecting a feature from in the Edit layer
     *
     * @private
     */
    _onDeselectFeatureEvent(): void;
    /**
     * Trigger on removing a feature from the Edit layer
     *
     * @private
     */
    _onRemoveFeatureEvent(): void;
    /**
     *
     * @param feature
     * @private
     */
    _editModeOn(feature: Feature<Geometry>): void;
    /**
     * @private
     */
    _editModeOff(): void;
    /**
     * Remove a feature from the edit Layer and from the Geoserver
     *
     * @param feature
     * @private
     */
    _deleteFeature(feature: Feature<Geometry>, confirm: boolean): void;
    /**
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     *
     * @param feature
     * @param coordinate
     * @param layerName
     * @private
     */
    _addFeatureToEditMode(feature: Feature<Geometry>, coordinate?: Coordinate, layerName?: any): void;
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
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    _removeOverlayHelper(feature: FeatureLike): void;
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
    beforeTransactFeature?(feature: Feature<Geometry>, transaction: TransactionType): Feature<Geometry>;
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