import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import BaseEvent from 'ol/events/Event';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import { LayerRenderEventTypes } from 'ol/render/EventType';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import WfsSource from './modules/base/WfsSource';
import { LayerOptions } from './ol-wfst';
import { TransactionType } from './@enums';
declare const WfsLayer_base: import("ts-mixer/dist/types/types").Class<any[], BaseLayer & VectorLayer<WfsSource>, typeof BaseLayer & {
    new (options?: import("ol/layer/BaseVector").Options<WfsSource>): VectorLayer<WfsSource>;
}, false>;
/**
 * Layer to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Vector~VectorLayer}
 * @param options
 */
export default class WfsLayer extends WfsLayer_base {
    private _loadingCount;
    private _loadedCount;
    beforeTransactFeature: (feature: Feature<Geometry>, transaction: TransactionType) => Feature<Geometry>;
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | LayerRenderEventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | LayerRenderEventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source', ObjectEvent, void> & OnSignature<LayerRenderEventTypes, RenderEvent, void> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | LayerRenderEventTypes, void>;
    constructor(options: LayerOptions);
    /**
     * @public
     */
    refresh(): void;
    /**
     * Use this to update Geoserver Wms Vendors (https://docs.geoserver.org/latest/en/user/services/wms/vendor.html)
     * and other arguements (https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getmap)
     * in all the getMap requests.
     *
     * Example: you can use this to change the style of the WMS, add a custom sld, set a cql_filter, etc.
     *
     * @public
     * @param paramName
     * @param value Use `undefined` or `null` to remove the param
     * @param refresh
     */
    setCustomParam(paramName: string, value?: string, refresh?: boolean): URLSearchParams;
}
export {};
//# sourceMappingURL=WfsLayer.d.ts.map