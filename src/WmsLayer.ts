import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import TileLayer from 'ol/layer/Tile.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { LayerRenderEventTypes } from 'ol/render/EventType.js';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';

import { Mixin } from 'ts-mixer';

import WmsSource from './modules/base/WmsSource';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import { LayerOptions } from './ol-wfst';
import { showLoading } from './modules/loading';
import { showError } from './modules/errors';
import { I18N } from './modules/i18n';
import { getMap } from './modules/state';
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

    public beforeTransactFeature: LayerOptions['beforeTransactFeature'];
    public beforeShowFieldsModal: LayerOptions['beforeShowFieldsModal'];

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

        if (options.beforeShowFieldsModal) {
            this.beforeShowFieldsModal = options.beforeShowFieldsModal;
        }

        this._formatGeoJSON = new GeoJSON();

        const geoserver = options.geoserver;

        const source = new WmsSource({
            name: options.name,
            headers: geoserver.getHeaders(),
            credentials: geoserver.getCredentials(),
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
        evt: MapBrowserEvent<MouseEvent>
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
                BUFFER: buffer,
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
            let features = this._parseFeaturesFromResponse(data);

            const featuresId = features.map((f) => f.getId());

            const fullResList = await this._getFullResGeometryById(featuresId);

            if (fullResList) {
                features = fullResList;
            }

            return features;
        } catch (err) {
            showError(err.message, err);
        }
    }

    private _parseFeaturesFromResponse(data: string): Feature<Geometry>[] {
        return this._formatGeoJSON.readFeatures(data);
    }

    /**
     * Return the full accuracy geometry to replace the feature from GetFEatureInfo
     * @param featuresId
     * @returns
     */
    private _getFullResGeometryById = async (
        featuresId: Array<string | number>
    ): Promise<Feature<Geometry>[] | false> => {
        const queryParams = new URLSearchParams({
            SERVICE: 'wfs',
            VERSION: '2.0.0',
            INFO_FORMAT: 'application/json',
            REQUEST: 'GetFeature',
            TYPENAME: this.get('name'),
            MAXFEATURES: '1',
            OUTPUTFORMAT: 'application/json',
            SRSNAME: getMap().getView().getProjection().getCode(),
            FEATUREID: String(featuresId)
        });

        const url =
            this.getSource().getUrls()[0] + '?' + queryParams.toString();

        try {
            const geoserver = this.getGeoserver();

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
            return this._parseFeaturesFromResponse(data);
        } catch (err) {
            console.error(err);
            return false;
        }
    };

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
