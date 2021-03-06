import GeometryType from 'ol/geom/GeometryType';
import { Style } from 'ol/style';
import { Control } from 'ol/control';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import { Collection, Feature, Overlay, PluggableMap, View } from 'ol';
import { GeoJSON, KML, WFS } from 'ol/format';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Options as VectorLayerOptions } from 'ol/layer/BaseVector';
import './assets/css/ol-wfst.css';
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
export default class Wfst {
    protected options: Options;
    protected _i18n: I18n;
    map: PluggableMap;
    view: View;
    overlay: Overlay;
    viewport: HTMLElement;
    protected _mapLayers: Array<VectorLayer | TileLayer>;
    protected _geoServerData: LayerData;
    protected _useLockFeature: boolean;
    protected _hasLockFeature: boolean;
    protected _hasTransaction: boolean;
    protected _geoServerCapabilities: XMLDocument;
    protected interactionWfsSelect: Select;
    protected interactionSelectModify: Select;
    protected collectionModify: Collection<any>;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetTools: Control;
    protected _controlWidgetToolsDiv: HTMLElement;
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;
    protected _countRequests: number;
    protected _isVisible: boolean;
    protected _currentZoom: number;
    protected _lastZoom: number;
    protected _editedFeatures: Set<string>;
    protected _editLayer: VectorLayer;
    protected _isEditModeOn: boolean;
    protected _isDrawModeOn: boolean;
    protected _editFeature: Feature;
    protected _editFeatureOriginal: Feature;
    protected _layerToInsertElements: string;
    protected _insertFeatures: Array<Feature>;
    protected _updateFeatures: Array<Feature>;
    protected _deleteFeatures: Array<Feature>;
    protected _modalLoading: HTMLDivElement;
    protected _selectDraw: HTMLSelectElement;
    constructor(map: PluggableMap, opt_options?: Options);
    /**
     * Connect to the GeoServer and retrieve metadata about the service (GetCapabilities).
     * Get each layer specs (DescribeFeatureType) and create the layers and map controls.
     *
     * @param layers
     * @param showControl
     * @param active
     * @private
     */
    _initAsyncOperations(): Promise<void>;
    /**
     * Creates a base control
     *
     * @private
     */
    _createBaseControl(): void;
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @private
     */
    _connectToGeoServerAndGetCapabilities(): Promise<boolean>;
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @param layers
     * @param geoServerUrl
     * @private
     */
    _getGeoserverLayersData(layers: Array<LayerParams>, geoServerUrl: string): Promise<void>;
    /**
     * Create map layers in wfs o wms modes.
     *
     * @param layers
     * @private
     */
    _createLayers(layers: Array<LayerParams>): void;
    /**
     * Create the edit layer to allow modify elements, add interactions,
     * map controls and keyboard handlers.
     *
     * @param showControl
     * @param active
     * @private
     */
    _initMapElements(showControl: boolean, active: boolean): Promise<void>;
    /**
     * @private
     */
    _addInteractions(): void;
    /**
     * Layer to store temporary the elements to be edited
     *
     * @private
     */
    _createEditLayer(): void;
    /**
     * Add map handlers
     *
     * @private
     */
    _addHandlers(): void;
    /**
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addMapControl(): void;
    /**
     * Show Loading modal
     *
     * @private
     */
    _showLoading(): void;
    _hideLoading(): void;
    /**
     * Lock a feature in the geoserver before edit
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @private
     */
    _lockFeature(featureId: string | number, layerName: string, retry?: number): Promise<string>;
    /**
     * Show modal with errors
     *
     * @param msg
     * @private
     */
    _showError(msg: string): void;
    /**
     * Make the WFS Transactions
     *
     * @param action
     * @param features
     * @param layerName
     * @private
     */
    _transactWFS(action: string, features: Array<Feature> | Feature, layerName: string): Promise<void>;
    /**
     *
     * @param feature
     * @private
     */
    _addFeatureToEditedList(feature: Feature): void;
    /**
     *
     * @param feature
     * @private
     */
    _removeFeatureFromEditList(feature: Feature): void;
    /**
     *
     * @param feature
     * @private
     */
    _isFeatureEdited(feature: Feature): boolean;
    /**
     *
     * @param feature
     * @private
     */
    _deselectEditFeature(feature: Feature): void;
    /**
     *
     * @param feature
     * @param layerName
     * @private
     */
    _restoreFeatureToLayer(feature: Feature, layerName?: string): void;
    _removeFeatureFromTmpLayer(feature: Feature): void;
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
     * Master style that handles two modes on the Edit Layer:
     * - one is the basic, showing only the vertices
     * - and the other when modify is active, showing bigger vertices
     *
     * @param feature
     * @private
     */
    _styleFunction(feature: Feature): Array<Style>;
    /**
     *
     * @param feature
     * @private
     */
    _editModeOn(feature: Feature): void;
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
    _deleteFeature(feature: Feature, confirm: boolean): void;
    /**
     * Add a feature to the Edit Layer to allow editing, and creates an Overlay Helper to show options
     *
     * @param feature
     * @param coordinate
     * @param layerName
     * @private
     */
    _addFeatureToEdit(feature: Feature, coordinate?: any, layerName?: any): void;
    /**
     * Removes in the DOM the class of the tools
     * @private
     */
    _resetStateButtons(): void;
    /**
     * Confirm modal before transact to the GeoServer the features in the file
     *
     * @param content
     * @param featureToInsert
     * @private
     */
    _initUploadFileModal(content: string, featuresToInsert: Array<Feature>): void;
    /**
     * Parse and check geometry of uploaded files
     *
     * @param evt
     * @private
     */
    _processUploadFile(evt: Event): Promise<void>;
    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     */
    _changeStateSelect(layerName: string, geomDrawTypeSelected?: GeometryType): GeometryType;
    /**
     * Activate/deactivate the draw mode
     *
     * @param layerName
     * @public
     */
    activateDrawMode(layerName: string | boolean): void;
    /**
     * Activate/desactivate the edit mode
     *
     * @param bool
     * @public
     */
    activateEditMode(bool?: boolean): void;
    /**
     * Add features directly to the geoserver, in a custom layer
     * without checking geometry or showing modal to confirm.
     *
     * @param layerName
     * @param features
     * @public
     */
    insertFeaturesTo(layerName: string, features: Array<Feature>): void;
    /**
     * Shows a fields form in a modal window to allow changes in the properties of the feature.
     *
     * @param feature
     * @private
     */
    _initEditFieldsModal(feature: Feature): void;
    /**
     * Remove the overlay helper atttached to a specify feature
     * @param feature
     * @private
     */
    _removeOverlayHelper(feature: Feature): void;
}
/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 * Default values:
 * ```javascript
 * {
 *  geoServerUrl: null,
 *  headers: {},
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
 *  beforeInsertFeature: null,
 * }
 * ```
 */
interface Options {
    /**
     * Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests
     */
    geoServerUrl: string;
    /**
     * Url headers for GeoServer requests. You can use it to add Authorization credentials
     */
    headers?: HeadersInit;
    /**
     * Layers to be loaded from the geoserver
     */
    layers?: Array<LayerParams>;
    /**
     * Init active
     */
    active?: boolean;
    /**
     * The click event to allow selection of Features to be edited
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Use LockFeatue request on GeoServer when selecting features.
     * This is not always supportedd by the GeoServer.
     * See https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
     */
    useLockFeature?: boolean;
    /**
     * Show/hide the control map
     */
    showControl?: boolean;
    /**
     * Zoom level to hide features to prevent too much features being loaded
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
    language?: 'es' | 'en';
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
    processUpload?(file: File): Array<Feature>;
    /**
     * Triggered before inserting new features to the Geoserver.
     * Use this to insert custom properties, modify the feature, etc.
     */
    beforeInsertFeature?(feature: Feature): Feature;
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
 *  label: (same as name),
 *  mode: 'wfs',
 *  wfsStrategy: 'bbox',
 *  cqlFilter: null,
 *  tilesBuffer: 0,
 * }
 * ```
 *
 */
interface LayerParams extends Omit<VectorLayerOptions, 'source'> {
    /**
     * Layer name in the GeoServer
     */
    name: string;
    /**
     * Label to be displayed in the widget control
     */
    label?: string;
    /**
     * Mode to use in the layer
     */
    mode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features. Only works if mode is "wfs"
     */
    wfsStrategy?: string;
    /**
     * The cql_filter GeoServer parameter is similar to the standard filter parameter,
     * but the filter is expressed using ECQL (Extended Common Query Language).
     * ECQL provides a more compact and readable syntax compared to OGC XML filters.
     * For full details see the [ECQL Reference](https://docs.geoserver.org/stable/en/user/filter/ecql_reference.html#filter-ecql-reference) and CQL and ECQL tutorial.
     */
    cqlFilter?: string;
    /**
     * The buffer parameter specifies the number of additional
     * border pixels that are used on requesting rasted tiles
     * Only works if mode is 'wms'
     */
    tilesBuffer?: number;
}
/**
 * **_[interface]_** - Data obtained from geoserver
 * @protected
 */
interface LayerData {
    namespace?: string;
    properties?: Record<string, unknown>;
    geomType?: string;
    geomField?: string;
}
/**
 * **_[interface]_** - Custom Language specified when creating a WFST instance
 */
interface I18n {
    /** Labels section */
    labels: {
        select: string;
        addElement: string;
        editElement: string;
        save: string;
        delete: string;
        cancel: string;
        apply: string;
        upload: string;
        editMode: string;
        confirmDelete: string;
        geomTypeNotSupported: string;
        editFields: string;
        editGeom: string;
        selectDrawType: string;
        uploadToLayer: string;
        uploadFeatures: string;
        validFeatures: string;
        invalidFeatures: string;
        loading: string;
        toggleVisibility: string;
        close: string;
    };
    /** Errors section */
    errors: {
        capabilities: string;
        wfst: string;
        layer: string;
        noValidGeometry: string;
        geoserver: string;
        badFormat: string;
        badFile: string;
        lockFeature: string;
        transaction: string;
        getFeatures: string;
    };
}
export { Options, I18n, LayerParams };
