import { Feature, PluggableMap, View, Overlay } from 'ol';
import { WFS } from 'ol/format';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { EventsKey } from 'ol/events';
import { Style } from 'ol/style';
import Control from 'ol/control/Control';
import Modal from 'modal-vanilla';
/**
 * @constructor
 * @param {class} map
 * @param {object} opt_options
 */
export default class Wfst {
    map: PluggableMap;
    view: View;
    overlay: Overlay;
    viewport: HTMLElement;
    protected layerMode: string;
    protected editMode: string;
    protected evtType: string;
    protected wfsStrategy: string;
    protected urlGeoserverWms: string;
    protected urlGeoserverWfs: string;
    protected _editedFeatures: Set<string>;
    protected _layers: Array<VectorLayer | TileLayer>;
    protected _layersData: LayerData;
    protected _editLayer: VectorLayer;
    protected _isEditMode: boolean;
    protected _isDrawMode: boolean;
    protected interactionWfsSelect: Select;
    protected interactionSelectModify: Select;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected _insertFeatures: Array<Feature>;
    protected _updateFeatures: Array<Feature>;
    protected _deleteFeatures: Array<Feature>;
    protected _countRequests: number;
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _xs: XMLSerializer;
    protected modal: typeof Modal;
    protected _editFeature: Feature;
    protected _editFeaturOriginal: Feature;
    protected _controlApplyDiscardChanges: Control;
    protected _controlWidgetTools: Control;
    protected _layerToInsertElements: string;
    constructor(map: PluggableMap, opt_options?: Options);
    /**
     * @private
     */
    _prepareLayers(layers: any): Promise<void>;
    /**
     * Layer to store temporary all the elements to edit
     * @private
     */
    _createEditLayer(): void;
    /**
     * Add already created layers to the map
     * @param layers
     * @public
     */
    addLayers(layers: Array<VectorLayer | TileLayer>): void;
    /**
     *
     * @param layers
     * @private
     */
    _getLayersData(layers: Array<string>): Promise<void>;
    /**
     *
     * @param layers
     * @private
     */
    _createLayers(layers: Array<string>): void;
    /**
     *
     * @param msg
     * @private
     */
    _showError(msg: string): void;
    /**
     *
     * @param mode
     * @param feature
     * @private
     */
    _transactWFS(mode: string, feature: Feature): Promise<void>;
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
    _addFeatureToEditedList(feature: Feature): void;
    /**
     *
     * @param feature
     * @private
     */
    _isFeatureEdited(feature: Feature): boolean;
    /**
     * @private
     */
    _addInteractions(): void;
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
    _selectFeatureHandler(): void;
    /**
     * @private
     */
    _removeFeatureHandler(): void;
    /**
     * @private
     */
    _addHandlers(): void;
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
     * @param feature
     * @private
     */
    _deleteElement(feature: Feature): void;
    /**
     * Add Keyboards events to allow shortcuts on editing features
     * @private
     */
    _addKeyboardEvents(): void;
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
     * Add the widget on the map to allow change the tools and select active layers
     * @private
     */
    _addControlTools(): void;
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
 * **_[interface]_** - Data obtainen from geoserver
 * @protected
 */
interface LayerData {
    namespace?: string;
    properties?: Record<string, unknown>;
    geomType?: string;
}
/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 */
interface Options {
    /**
     * Url for WFS requests
     */
    urlWfs: string;
    /**
     * Url for WMS requests
     */
    urlWms: string;
    /**
     * Service to use as base layer. Yo can choose to use vectors or raster images
     */
    layerMode?: 'wfs' | 'wms';
    /**
     * Strategy function for loading features on WFS requests
     */
    wfsStrategy?: string;
    /**
     * Click event to select features
     */
    evtType?: 'singleclick' | 'dblclick';
    /**
     * Initialize activated
     */
    active?: boolean;
    /**
     * Layers names
     */
    layers?: Array<string>;
    /**
     * Display the control map
     */
    showControl: boolean;
}
export { Options };
