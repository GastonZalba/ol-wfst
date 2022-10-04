import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { all, bbox } from 'ol/loadingstrategy';
import VectorLayer from 'ol/layer/Vector';
import BaseEvent from 'ol/events/Event';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import { LayerRenderEventTypes } from 'ol/render/EventType';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';

import baseLayer, { BaseLayerEventTypes } from './modules/Modes/baseLayer';
import WfsSource from './modules/Modes/WfsSource';
import Geoserver from './Geoserver';
import { LayerParams } from './ol-wfst';
import { showLoading } from './modules/loading';
import { Transact } from './@enums';
import { IDescribeFeatureType } from './@types';

/**
 * Layer to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @fires layerLoaded
 * @fires featuresloadstart
 * @fires featuresloadend
 * @fires featuresloaderror
 * @extends {ol/layer/Vector}
 * @param options
 */
export default class WfsLayer extends VectorLayer<WfsSource> {
    private _loadingCount = 0;
    private _loadedCount = 0;

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

    constructor(options: LayerParams) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            ...options
        });

        this.on('layerLoaded', () => '');
        Object.assign(this, baseLayer);

        // Use bbox as default if not strategy is defined
        const strategy = options.wfsStrategy || 'bbox';
        const geoserver = options.geoserver;

        const source = new WfsSource({
            name: options.name,
            geoServerUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            strategy: strategy === 'bbox' ? bbox : all,
            geoServerVendor: options.geoServerVendor
        });

        this._loadingCount = 0;
        this._loadedCount = 0;

        source.on('featuresloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisible()) {
                showLoading();
            }
        });

        source.on(['featuresloadend', 'featuresloaderror'], () => {
            this._loadedCount++;
            if (this._loadingCount === this._loadedCount) {
                this._loadingCount = 0;
                this._loadedCount = 0;
                setTimeout(() => {
                    this.dispatchEvent('layerLoaded');
                }, 300);
            }
        });

        source.on(
            ['featuresloadstart', 'featuresloadend', 'featuresloaderror'],
            (evt: BaseEvent) => {
                this.dispatchEvent(evt);
            }
        );

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

    /**
     *
     * @returns
     * @public
     */
    getGeoserver(): Geoserver {
        return this.get('geoserver');
    }

    /**
     *
     * @returns
     * @public
     */
    getDescribeFeatureType(): IDescribeFeatureType {
        return this.get('describeFeatureType');
    }

    /**
     * @public
     */
    init(): void {
        /** Replaced by baseLayer */
    }

    /**
     * @private
     */
    async syncDescribeFeatureType(): Promise<IDescribeFeatureType> {
        /** Replaced by baseLayer */ return null;
    }

    /**
     * @private
     */
    async transactFeatures(
        mode: Transact, // eslint-disable-line @typescript-eslint/no-unused-vars
        features: Array<Feature<Geometry>> | Feature<Geometry> // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<any> {
        /**
         * Replaced by baseLayer
         */
    }

    /**
     *
     * @param features
     * @public
     */
    async insertFeatures(
        features: Array<Feature<Geometry>> | Feature<Geometry> // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        /**
         * Replaced by baseLayer
         */
    }
    /**
     *
     * @param featureId
     * @public
     */
    async maybeLockFeature(
        featureId: string | number // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<string> {
        /**
         * Replaced by baseLayer
         */
        return null;
    }

    /**
     *
     * @returns
     * @public
     */
    isVisible(): boolean {
        /**
         * Replaced by baseLayer
         */
        return null;
    }
}
