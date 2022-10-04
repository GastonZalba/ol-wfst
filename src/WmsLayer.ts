import TileLayer from 'ol/layer/Tile';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { GeoJSON } from 'ol/format';
import BaseEvent from 'ol/events/Event';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import { LayerRenderEventTypes } from 'ol/render/EventType';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';

import Geoserver from './Geoserver';
import WmsSource from './modules/Modes/WmsSource';
import baseLayer, { BaseLayerEventTypes } from './modules/Modes/baseLayer';
import { LayerParams } from './ol-wfst';
import { showLoading } from './modules/loading';
import { Transact } from './@enums';
import { IDescribeFeatureType } from './@types';
import { showError } from './modules/errors';
import { I18N } from './modules/i18n';
import { getMap } from './modules/state';

/**
 * Layer to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @fires layerLoaded
 * @fires tileloadstart
 * @fires tileloadend
 * @fires tileloaderror
 * @extends {ol/layer/Vector}
 * @param options
 */
export default class WmsLayer extends TileLayer<WmsSource> {
    private _loadingCount = 0;
    private _loadedCount = 0;

    // Formats
    private _formatGeoJSON: GeoJSON;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
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
            | BaseLayerObjectEventTypes
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;

    constructor(options: LayerParams) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            ...options
        });

        Object.assign(this, baseLayer);

        this._formatGeoJSON = new GeoJSON();

        const geoserver = options.geoserver;

        const source = new WmsSource({
            name: options.name,
            geoServerUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            geoServerVendor: options.geoServerVendor
        });

        this._loadingCount = 0;
        this._loadedCount = 0;

        source.on('tileloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisible()) {
                showLoading();
            }
        });

        source.on(['tileloadend', 'tileloaderror'], () => {
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
            ['tileloadstart', 'tileloadend', 'tileloaderror'],
            (evt: BaseEvent) => {
                super.dispatchEvent(evt);
            }
        );

        this.setSource(source);
    }

    /**
     *
     * @param evt
     * @returns
     */
    async getFeatures(evt) {
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
    getDescribeFeatureType() {
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
        /**
         * Replaced by baseLayer
         */
        return null;
    }

    /**
     *
     * @param mode
     * @param features
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
