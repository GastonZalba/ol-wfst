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
import WmsSource from './modules/Modes/WmsSource';
import BaseLayer, { BaseLayerEventTypes } from './modules/Modes/BaseLayer';
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
    getFeaturesByClickEvent(evt: MapBrowserEvent<UIEvent>): Promise<Feature<Geometry>[]>;
    /**
     * @public
     */
    refresh(): void;
}
export {};
//# sourceMappingURL=WmsLayer.d.ts.map