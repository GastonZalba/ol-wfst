import TileLayer from 'ol/layer/Tile';
import { Geometry } from 'ol/geom';
import { Feature, MapBrowserEvent } from 'ol';
import BaseEvent from 'ol/events/Event';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import { LayerRenderEventTypes } from 'ol/render/EventType';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';
import WmsSource from './modules/base/WmsSource';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import { LayerOptions } from './ol-wfst';
import { TransactionType } from './@enums';
declare const WmsLayer_base: import("ts-mixer/dist/types/types").Class<any[], BaseLayer & TileLayer<WmsSource>, typeof BaseLayer & {
    new (options?: import("ol/layer/BaseTile").Options<WmsSource>): TileLayer<WmsSource>;
}, false>;
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
    beforeTransactFeature: (feature: Feature<Geometry>, transaction: TransactionType) => Feature<Geometry>;
    private _formatGeoJSON;
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError', ObjectEvent, void> & OnSignature<LayerRenderEventTypes, RenderEvent, void> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'change:preload' | 'change:useInterimTilesOnError' | LayerRenderEventTypes, void>;
    constructor(options: LayerOptions);
    /**
     * Get the features on the click area
     * @param evt
     * @returns
     * @private
     */
    _getFeaturesByClickEvent(evt: MapBrowserEvent<UIEvent>): Promise<Feature<Geometry>[]>;
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