import TileLayer from 'ol/layer/Tile';
import { Geometry } from 'ol/geom';
import { Feature, MapBrowserEvent } from 'ol';
import { GeoJSON } from 'ol/format';
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
import { showLoading } from './modules/loading';
import { TransactionType } from './@enums';
import { showError } from './modules/errors';
import { I18N } from './modules/i18n';
import { getMap } from './modules/state';
import { Mixin } from 'ts-mixer';
import { WmsGeoserverVendor } from './@types';

/**
 * Layer to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Tile~TileLayer}
 * @param options
 */
export default class WmsLayer extends Mixin(BaseLayer, TileLayer<WmsSource>) {
    private _loadingCount = 0;
    private _loadedCount = 0;

    public beforeTransactFeature: (
        feature: Feature<Geometry>,
        transaction: TransactionType
    ) => Feature<Geometry>;

    // Formats
    private _formatGeoJSON: GeoJSON;

    private geoserverProps_ = [
        'cql_filter',
        'filter',
        'orderBy',
        'maxFeatures',
        'startIndex',
        'featureid',
        'format_options',
        'propertyname',
        'buffer',
        'clip',
        'env'
    ];

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;
    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            void
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, void> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | WmsLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
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

        this._formatGeoJSON = new GeoJSON();

        const geoserver = options.geoserver;

        const source = new WmsSource({
            name: options.name,
            geoserverUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            geoserverVendor: options.geoserverVendor as WmsGeoserverVendor
        });

        this._loadingCount = 0;
        this._loadedCount = 0;

        source.on('tileloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                showLoading();
            }
        });

        source.on(['tileloadend', 'tileloaderror'], () => {
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

        this.addEvents_();

    }

    /**
     * Get the features on the click area
     * @param evt
     * @returns
     * @private
     */
    async _getFeaturesByClickEvent(
        evt: MapBrowserEvent<UIEvent>
    ): Promise<Feature<Geometry>[]> {
        const coordinate = evt.coordinate;

        const view = getMap().getView();

        // Si la vista es lejana, disminumos el buffer
        // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
        // y mejorar la sensibilidad en IOS
        const buffer = view.getZoom() > 10 ? 10 : 5;

        const source = this.getSource();

        // Fallback to support a bad name
        // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
        const fallbackOl5 =
            'getFeatureInfoUrl' in source
                ? 'getFeatureInfoUrl'
                : 'getGetFeatureInfoUrl';

        const url = source[fallbackOl5](
            coordinate,
            view.getResolution(),
            view.getProjection().getCode(),
            {
                INFO_FORMAT: 'application/json',
                BUFFER: buffer, // Buffer es el "hit tolerance" para capas ráster
                FEATURE_COUNT: 1,
                EXCEPTIONS: 'application/json'
            }
        );

        const geoserver = this.getGeoserver();

        try {
            const response = await fetch(url, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });

            if (!response.ok) {
                throw new Error(
                    `${I18N.errors.getFeatures} ${response.status}`
                );
            }

            const data = await response.json();
            const features = this._formatGeoJSON.readFeatures(data);

            return features;
        } catch (err) {
            showError(err.message, err);
        }
    }

    /**
     * @public
     */
    refresh() {
        const source = this.getSource();

        // Refrescamos el wms
        source.refresh();

        // Force refresh the tiles
        const params = source.getParams();
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }

    
    /**
     * @public
     * @param value
     * @param opt_silent
     */
     setBuffer(value: string | number, opt_silent: boolean): void {
        this.set(WmsLayerProperty.BUFFER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getBuffer(): string | number {
        return this.get(WmsLayerProperty.BUFFER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setEnv(value: string, opt_silent: boolean): void {
        this.set(WmsLayerProperty.ENV, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getEnv(): string {
        return this.get(WmsLayerProperty.ENV);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setClip(value: string, opt_silent: boolean): void {
        this.set(WmsLayerProperty.CLIP, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getClip(): string {
        return this.get(WmsLayerProperty.CLIP);
    }

    /**
     * @private
     */
    addEvents_(): void {
        this.on(['propertychange'], (evt: ObjectEvent) => {
            // If a geoserver property was modified, refresh the source
            if (this.geoserverProps_.includes(evt.key)) {
                this.getSource().updateParams({
                    [evt.key]: evt.target.get(evt.key)
                });
                this.refresh();
            }
        });
    }
}

export enum WmsLayerProperty {
    BUFFER = 'buffer',
    ENV = 'env',
    CLIP = 'clip'
}

export type WmsLayerEventTypes =
    | `change:${WmsLayerProperty.BUFFER}`
    | `change:${WmsLayerProperty.ENV}`
    | `change:${WmsLayerProperty.CLIP}`;