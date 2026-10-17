import VectorLayer from 'ol/layer/Vector.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { LayerRenderEventTypes } from 'ol/render/EventType.js';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';

import { Mixin } from 'ts-mixer';

import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import WfsSource from './modules/base/WfsSource';
import { LayerOptions } from './ol-wfst';
import { showLoading } from './modules/loading';
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

    public beforeTransactFeature: LayerOptions['beforeTransactFeature'];
    public beforeShowFieldsModal: LayerOptions['beforeShowFieldsModal'];

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged',
            ObjectEvent,
            void
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, void> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'sourceready'
            | 'cqlFilterChanged'
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
            headers: geoserver.getHeaders(),
            credentials: geoserver.getCredentials(),
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

        Object.keys(geoserverOptions).forEach((param) => {
            source.urlParams.set(param, geoserverOptions[param]);
        });
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
     * Set CQL filter for this WFS layer
     *
     * @public
     * @param cql Use `null` to remove it
     * @fires cqlFilterChanged
     */
    setCqlFilter(cql: string | null) {
        if (!this._writeCql(cql)) return;
        this.refresh();
        this.dispatchEvent('cqlFilterChanged');
    }

    /**
     * Reads back the CQL filter applied to the request, case insensitive
     *
     * @public
     */
    getCqlFilter(): string | null {
        const source = this.getSource() as any;
        if (source && typeof source.getCqlFilter === 'function') {
            return source.getCqlFilter();
        }
        if (!source || !source.urlParams) return null;
        for (const key of source.urlParams.keys()) {
            if (key.toLowerCase() === 'cql_filter') {
                return source.urlParams.get(key);
            }
        }
        return null;
    }

    /**
     * Writes the CQL filter making sure only one `cql_filter` key reaches
     * the server, no matter which case the caller used
     *
     * @private
     * @returns `false` when there is no source yet
     */
    private _writeCql(value: string | null): boolean {
        const source = this.getSource() as any;
        if (!source) return false;

        if (typeof source.setCqlFilter === 'function') {
            source.setCqlFilter(value, false);
            return true;
        }

        if (!source.urlParams) return false;
        const keys = Array.from(source.urlParams.keys() as string[]).filter(
            (key) => key.toLowerCase() === 'cql_filter'
        );
        keys.forEach((key) => source.urlParams.delete(key));
        if (value) {
            source.urlParams.set('CQL_FILTER', value);
        }
        return true;
    }

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
     * @fires cqlFilterChanged when the param is a cql filter
     */
    setCustomParam(
        paramName: string,
        value: string = null,
        refresh = true
    ): URLSearchParams {
        const source = this.getSource();

        // Keep a single cql_filter key on the request
        if (paramName.toLowerCase() === 'cql_filter') {
            this._writeCql(value ?? null);
            if (refresh) {
                this.refresh();
            }
            this.dispatchEvent('cqlFilterChanged');
            return source.urlParams;
        }

        if (value === undefined || value === null) {
            source.urlParams.delete(paramName);
        } else {
            source.urlParams.set(paramName, value);
        }

        if (refresh) {
            this.refresh();
        }

        return source.urlParams;
    }
}
