import VectorLayer from 'ol/layer/Vector.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { LayerRenderEventTypes } from 'ol/render/EventType.js';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import WfsSource from './modules/base/WfsSource';
import { LayerOptions } from './ol-wfst';
declare const WfsLayer_base: import("ts-mixer/dist/types/types").Class<any[], BaseLayer & VectorLayer<WfsSource>, typeof BaseLayer & {
    new (options?: import("ol/layer/BaseVector").Options<WfsSource>): VectorLayer<WfsSource>;
}>;
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
    beforeTransactFeature: LayerOptions['beforeTransactFeature'];
    beforeShowFieldsModal: LayerOptions['beforeShowFieldsModal'];
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready' | LayerRenderEventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready', ObjectEvent, EventsKey> & OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready' | LayerRenderEventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready', ObjectEvent, void> & OnSignature<LayerRenderEventTypes, RenderEvent, void> & CombinedOnSignature<EventTypes | BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source' | 'sourceready' | LayerRenderEventTypes, void>;
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