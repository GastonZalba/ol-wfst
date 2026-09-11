import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import TileLayer from 'ol/layer/Tile.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { LayerRenderEventTypes } from 'ol/render/EventType.js';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';
import WmsSource from './modules/base/WmsSource';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import { LayerOptions } from './ol-wfst';
declare const WmsLayer_base: import("ts-mixer/dist/types/types").Class<any[], BaseLayer & TileLayer<WmsSource>, typeof BaseLayer & {
    new (options?: import("ol/layer/BaseTile").Options<WmsSource>): TileLayer<WmsSource>;
}>;
/**
 * Layer to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Tile~TileLayer}
 * @param options
 */
export default class WmsLayer extends WmsLayer_base {
    private _loadingCount;
    private _loadedCount;
    beforeTransactFeature: LayerOptions['beforeTransactFeature'];
    beforeShowFieldsModal: LayerOptions['beforeShowFieldsModal'];
    private _formatGeoJSON;
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, void> & OnSignature<LayerRenderEventTypes, RenderEvent, void> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'sourceready' | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, void>;
    constructor(options: LayerOptions);
    /**
     * Get the features on the click area
     * @param evt
     * @returns
     * @private
     */
    _getFeaturesByClickEvent(evt: MapBrowserEvent<PointerEvent>): Promise<Feature<Geometry>[]>;
    /**
     * Request the WFS features that intersect the given geometry, selecting
     * them with a WFS GetFeature + CQL INTERSECTS filter. Used to select
     * features from a WMS layer with a box or a freehand lasso.
     *
     * @param geometry Geometry in the map view projection
     * @returns
     * @private
     */
    _getFeaturesInGeometry(geometry: Geometry): Promise<Feature<Geometry>[]>;
    /**
     * Resolve the layer native SRS so spatial filters are evaluated in the
     * correct projection. It reads the DefaultCRS from the WFS capabilities,
     * falling back to the geoserver advanced projection option and finally to
     * the map view projection.
     *
     * @returns
     * @private
     */
    private _getNativeSrs;
    /**
     * Fetch and parse the features from a request url, replacing the
     * low resolution geometries (GetFeatureInfo) with the full resolution
     * ones requested by FEATUREID when possible.
     *
     * @param url
     * @returns
     * @private
     */
    private _requestFeatures;
    private _parseFeaturesFromResponse;
    /**
     * Return the full accuracy geometries to replace the features from GetFeatureInfo
     * @param featuresId
     * @returns
     */
    private _getFullResGeometryById;
    /**
     * @public
     */
    refresh(): void;
    /**
     * Use this to update Geoserver Wfs Vendors (https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html)
     * and other arguements (https://docs.geoserver.org/stable/en/user/services/wfs/reference.html)
     * in all the getFeature requests.
     *
     * Example: you can use this to set a cql_filter, limit the numbers of features, etc.
     *
     * @public
     * @param paramName
     * @param value
     * @param refresh
     */
    setCustomParam(paramName: string, value?: string, refresh?: boolean): URLSearchParams;
}
export {};
//# sourceMappingURL=WmsLayer.d.ts.map