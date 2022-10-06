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
import BaseLayer, { BaseLayerEventTypes } from './modules/Modes/BaseLayer';
import WfsSource from './modules/Modes/WfsSource';
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
}
export {};
//# sourceMappingURL=WfsLayer.d.ts.map