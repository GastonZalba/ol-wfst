import { Feature, PluggableMap, View, Overlay } from 'ol';
import { KML, WFS, GeoJSON } from 'ol/format';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { EventsKey } from 'ol/events';
import { Style } from 'ol/style';
import Control from 'ol/control/Control';
/**
 * @constructor
 * @param {class} map
 * @param {object} opt_options
 */
export default class Wfst {
    protected options: Options;
    protected _i18n: i18n;
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
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetTools: Control;
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
    constructor(map: PluggableMap, opt_options?: Options);
    /**
     * Connect to the GeoServer, get Capabilities,
     * get each layer specs and create the layers and map controllers.
     *
     * @param layers
     * @param showControl
     * @param active
     * @private
     */
    _initAsyncOperations(): Promise<void>;
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @private
     */
    _connectToGeoServer(): Promise<boolean>;
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
     * map controllers and keyboard handlers.
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
    _addControlTools(): void;
    /**
     * Lock a feature in the geoserver before edit
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @private
     */
    _lockFeature(featureId: string | number, layerName: string, retry?: number): Promise<void>;
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
     * @param mode
     * @param features
     * @param layerName
     * @private
     */
    _transactWFS(mode: string, features: Array<Feature> | Feature, layerName: string): Promise<void>;
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
    _cancelEditFeature(feature: Feature): void;
    /**
     *
     * @param feature
     * @private
     */
    _finishEditFeature(feature: Feature): void;
    /**
     * @private
     */
    _onSelectFeatureEvent(): void;
    /**
     * @private
     */
    _onRemoveFeatureEvent(): void;
    /**
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
    _deleteElement(feature: Feature, confirm: boolean): void;
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
    * @param feature
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
     * Add features to the geoserver, in a custom layer
     * witout verifiyn geometry and showing modal to confirm.
     *
     * @param layerName
     * @param features
     * @public
     */
    insertFeaturesTo(layerName: string, features: Array<Feature>): void;
    /**
     * Activate/deactivate the draw mode
     * @param bool
     * @public
     */
    activateDrawMode(bool: string | boolean): void;
    /**
     * Activate/desactivate the edit mode
     * @param bool
     * @public
     */
    activateEditMode(bool?: boolean): void;
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
 * **_[interface]_** - Data obtained from geoserver
 * @protected
 */
interface LayerData {
    namespace?: string;
    properties?: Record<string, unknown>;
    geomType?: string;
}
/**
 * **_[interface]_** - Custom Language specified when creating a WFST instance
 */
interface i18n {
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
        editFields: string;
        editGeom: string;
        uploadToLayer: string;
        uploadFeatures: string;
        validFeatures: string;
        invalidFeatures: string;
    };
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
/**
 * **_[interface]_** - Parameters to create an load the GeoServer layers
 */
interface LayerParams {
    name: string;
    label?: string;
    cql_filter?: string;
    buffer?: number;
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
    *  layerMode: 'wms',
    *  evtType: 'singleclick',
    *  active: true,
    *  showControl: true,
    *  useLockFeature: true,
    *  minZoom: 9,
    *  language: 'es',
    *  uploadFormats: '.geojson,.json,.kml'
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
     * Url headers for GeoServer requests. You can use it to add the Authorization credentials
     */
    headers?: HeadersInit;
    /**
    * Layers names to be loaded from teh geoserver
    */
    layers?: Array<LayerParams>;
    /**
     * Service to use as base layer. You can choose to use vectors or raster images
     */
    layerMode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features if layerMode is on "wfs" requests
     */
    wfsStrategy?: string;
    /**
     * Click event to select the features
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Initialize activated
     */
    active?: boolean;
    /**
     * Use LockFeatue request on GeoServer when selecting features.
     * This is not always supportedd by the GeoServer.
     */
    useLockFeature?: boolean;
    /**
     * Display the control map
     */
    showControl?: boolean;
    /**
     * Zoom level to hide features to prevent too much features being loaded
     */
    minZoom?: number;
    /**
    * Language to be used
    */
    language?: string;
    /**
     * Show/hide the upload button
     */
    upload?: boolean;
    /**
     * Accepted extension formats on upload
     */
    uploadFormats?: string;
    /**
     * Triggered to process the uploaded files.
     * Use this to apply custom preocces or parse custom formats by filtering the extension.
     * If this doesn't return features, the default function will be used to extract the features.
     */
    processUpload?(file: File): Array<Feature>;
    /**
     * Triggered before insert new features to the Geoserver.
     * Use this to insert custom properties, modify the feature, etc.
     */
    beforeInsertFeature?(feature: Feature): Feature;
}
export { Options, i18n };
