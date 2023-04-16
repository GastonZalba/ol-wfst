import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
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

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
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
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;
    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
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
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
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
            | BaseLayerObjectEventTypes
            | 'sourceready'
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
    setCustomParam(
        paramName: string,
        value: string = null,
        refresh = true
    ): URLSearchParams {
        const source = this.getSource();

        source.updateParams({
            [paramName]: value
        });

        if (refresh) {
            this.refresh();
        }

        return source.getParams();
    }
}
