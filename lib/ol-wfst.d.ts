import { Feature, PluggableMap, View, Overlay } from 'ol';
import { WFS } from 'ol/format';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { EventsKey } from 'ol/events';
import { Style } from 'ol/style';
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
    protected evtType: string;
    protected wfsStrategy: string;
    protected urlGeoserverWms: string;
    protected urlGeoserverWfs: string;
    protected _editedFeatures: Set<string>;
    protected _layers: Array<VectorLayer | TileLayer>;
    protected _layersData: LayerData;
    protected _editLayer: VectorLayer;
    protected interactionWfsSelect: Select;
    protected interactionSelect: Select;
    protected interactionModify: Modify;
    protected interactionSnap: Snap;
    protected interactionDraw: Draw;
    protected _keyClickWms: EventsKey | EventsKey[];
    protected _keyRemove: EventsKey;
    protected _keySelect: EventsKey;
    protected insertFeatures: Array<Feature>;
    protected updateFeatures: Array<Feature>;
    protected deleteFeatures: Array<Feature>;
    protected _countRequests: number;
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _xs: XMLSerializer;
    protected modal: typeof Modal;
    protected _editFeature: Feature;
    constructor(map: PluggableMap, opt_options?: Options);
    init(layers: Array<string>): Promise<void>;
    /**
     * Layer to store temporary all the elements to edit
     */
    createEditLayer(): void;
    /**
     * Add already created layers to the map
     * @param layers
     */
    addLayers(layers: Array<VectorLayer | TileLayer>): void;
    /**
     *
     * @param layers
     */
    getLayersData(layers: Array<string>): Promise<void>;
    /**
     *
     * @param layers
     */
    createLayers(layers: Array<string>): void;
    showError(msg: string): void;
    transactWFS(mode: string, feature: Feature): Promise<void>;
    /**
     *
     */
    addLayerModeInteractions(): void;
    addFeatureToEditedList(feature: Feature): void;
    isFeatureEdited(feature: Feature): boolean;
    addInteractions(): void;
    addDrawInteraction(layerName: string): void;
    selectFeatureHandler(): void;
    removeFeatureHandler(): void;
    addHandlers(): void;
    styleFunction(feature: Feature): Array<Style>;
    deleteElement(feature: Feature): void;
    addKeyboardEvents(): void;
    addFeatureToEdit(feature: Feature, layerName?: any): void;
    activateDrawMode(bool?: boolean): void;
    activateEditMode(bool?: boolean): void;
    initModal(feature: Feature): void;
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
    urlWfs?: string;
    urlWms?: string;
    layerMode?: string;
    evtType?: string;
    wfsStrategy?: string;
    active?: boolean;
    layers?: Array<string>;
    showError?: Function;
}
export { Options };
