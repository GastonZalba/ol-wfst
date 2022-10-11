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

import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import WfsSource from './modules/base/WfsSource';
import { LayerOptions } from './ol-wfst';
import { showLoading } from './modules/loading';
import { TransactionType } from './@enums';
import { WfsGeoserverVendor } from './@types';

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

    private geoserverProps_ = [
        'cql_filter',
        'filter',
        'orderBy',
        'maxFeatures',
        'startIndex',
        'featureid',
        'format_options',
        'propertyname',
        'strict'
    ];

    public beforeTransactFeature: (
        feature: Feature<Geometry>,
        transaction: TransactionType
    ) => Feature<Geometry>;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes 
           //| WfsLayerEventTypes 
            | BaseLayerObjectEventTypes 
            | 'change:source',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | WfsLayerEventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            BaseLayerEventTypes | WfsLayerEventTypes | BaseLayerObjectEventTypes | 'change:source',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | WfsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            BaseLayerEventTypes | WfsLayerEventTypes | BaseLayerObjectEventTypes | 'change:source',
            ObjectEvent,
            void
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, void> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | WfsLayerEventTypes
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

        const geoserverOptions = options.geoserverVendor as WfsGeoserverVendor;

        this.setCqlFilter(geoserverOptions.cql_filter, true);
        if (geoserverOptions.cql_filter) {
            source.urlParams.set('cql_filter', geoserverOptions.cql_filter);
        }

        this.setSortBy(geoserverOptions.sortBy, true);
        if (geoserverOptions.sortBy) {
            source.urlParams.set('sortBy', geoserverOptions.sortBy);
        }

        this.setFeatureId(geoserverOptions.featureid, true);
        if (geoserverOptions.featureid) {
            source.urlParams.set('featureid', geoserverOptions.featureid);
        }

        this.setFilter(geoserverOptions.filter, true);
        if (geoserverOptions.filter) {
            source.urlParams.set('filter', geoserverOptions.filter);
        }

        this.setFormatOptions(geoserverOptions.format_options, true);
        if (geoserverOptions.format_options) {
            source.urlParams.set('formatOptions', geoserverOptions.format_options);
        }

        this.setMaxFeatures(geoserverOptions.maxFeatures, true);
        if (geoserverOptions.maxFeatures) {
            source.urlParams.set('maxFeatures', String(geoserverOptions.maxFeatures));
        }

        this.setStartIndex(geoserverOptions.startIndex, true);
        if (geoserverOptions.startIndex) {
            source.urlParams.set('startIndex', String(geoserverOptions.startIndex));
        }

        this.setPropertyName(geoserverOptions.propertyname, true);
        if (geoserverOptions.propertyname) {
            source.urlParams.set('propertyname', geoserverOptions.propertyname);
        }

        this.setStrict(geoserverOptions.strict, true);
        if (geoserverOptions.strict !== undefined) {
            source.urlParams.set('strict', String(geoserverOptions.strict));
        }

        this.addEvents_();

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
     * @public
     * @param value
     * @param opt_silent
     */
    setStrict(value: boolean, opt_silent: boolean): void {
        this.set(WfsLayerProperty.STRICT, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getStrict(): boolean {
        return this.get(WfsLayerProperty.STRICT);
    }

    /**
     * @private
     */
    addEvents_(): void {
        this.on(['propertychange'], (evt: ObjectEvent) => {
            // If a geoserver property was modified, refresh the source
            if (this.geoserverProps_.includes(evt.key)) {
                const source = this.getSource();
                const value = evt.target.get(evt.key);
                if (value !== undefined) {
                    source.urlParams.set(evt.key, String(evt.target.get(evt.key)));
                } else {
                    source.urlParams.delete(evt.key);
                }
                source.refresh();
            }
        });
    }
}

export enum WfsLayerProperty {
    STRICT = 'strict'
}

export type WfsLayerEventTypes = 
| `change:${WfsLayerProperty.STRICT}`;
