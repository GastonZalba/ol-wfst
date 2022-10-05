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

import { Mixin } from 'ts-mixer';

import BaseLayer, { BaseLayerEventTypes } from './modules/Modes/BaseLayer';
import WfsSource from './modules/Modes/WfsSource';
import { LayerOptions } from './ol-wfst';
import { showLoading } from './modules/loading';
import { TransactionType } from './@enums';

/**
 * Layer to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Vector~VectorLayer}
 * @param options
 */
export default class WfsLayer extends Mixin(BaseLayer, VectorLayer<WfsSource>) {
    private _loadingCount = 0;
    private _loadedCount = 0;

    public beforeTransactFeature: (
        feature: Feature<Geometry>,
        transaction: TransactionType
    ) => Feature<Geometry>;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            BaseLayerEventTypes | BaseLayerObjectEventTypes | 'change:source',
            ObjectEvent,
            void
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, void> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | LayerRenderEventTypes,
            void
        >;

    constructor(options: LayerOptions) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            ...options
        });

        if (options.beforeTransactFeature) {
            this.beforeTransactFeature = options.beforeTransactFeature;
        }

        const geoserver = options.geoserver;

        const source = new WfsSource({
            name: options.name,
            geoserverUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            ...(options.strategy && { strategy: options.strategy }),
            geoserverVendor: options.geoserverVendor
        });

        this._loadingCount = 0;
        this._loadedCount = 0;

        source.on('featuresloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                showLoading();
            }
        });

        source.on(['featuresloadend', 'featuresloaderror'], () => {
            this._loadedCount++;
            if (this._loadingCount === this._loadedCount) {
                this._loadingCount = 0;
                this._loadedCount = 0;
                setTimeout(() => {
                    this.dispatchEvent('layerRendered');
                }, 300);
            }
        });

        this.setSource(source);
    }

    /**
     * @public
     */
    refresh() {
        const source = this.getSource();
        // Refrescamos el wms
        source.refresh();
    }
}
