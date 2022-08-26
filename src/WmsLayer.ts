import TileLayer from 'ol/layer/Tile';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';

import { GeoServerAdvanced, LayerParams } from './ol-wfst';
import { showLoading } from './modules/loading';
import WmsSource from './modules/Modes/WmsSource';
import baseLayer from './modules/Modes/baseLayer';
import { Transact } from './@enums';
import Geoserver from './Geoserver';
import { IDescribeFeatureType } from './@types';
import { showError } from './modules/errors';
import { I18N } from './modules/i18n';
import { getMap } from './modules/state';
import { GeoJSON } from 'ol/format';

export default class WmsLayer extends TileLayer<WmsSource> {
    private _geoServerUrl: string;
    private _geoServerAdvanced: GeoServerAdvanced;
    // Formats
    private _formatGeoJSON: GeoJSON;

    constructor(options: LayerParams) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            visible: true,
            zIndex: 1,
            ...options
        });

        Object.assign(this, baseLayer);

        this._formatGeoJSON = new GeoJSON();

        const source = new WmsSource({
            name: options.name,
            geoServerUrl: this._geoServerUrl,
            geoServerAdvanced: this._geoServerAdvanced,
            geoServerVendor: options.geoServerVendor
        });

        let loading = 0;
        let loaded = 0;

        source.on('tileloadstart', () => {
            loading++;
            showLoading();
        });

        source.on(['tileloadend', 'tileloaderror'], () => {
            loaded++;
            setTimeout(() => {
                if (loading === loaded) {
                    this.dispatchEvent('layerLoaded');
                }
            }, 300);
        });

        source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], (evt) => {
            //@ts-expect-error
            super.dispatchEvent(evt);
        });

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
        return this.get('geoserver_');
    }

    /**
     *
     * @returns
     * @public
     */
    getDescribeFeatureType() {
        return this.get('describeFeatureType_');
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
}
