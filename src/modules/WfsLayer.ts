import { all, bbox } from 'ol/loadingstrategy';
import VectorLayer from 'ol/layer/Vector';

import baseLayer from './baseLayer';
import WfsSource from './WfsSource';
import { GeoServerAdvanced, I18n, LayerParams } from '../ol-wfst';
import { showLoading } from './loading';

export default class WfsLayer extends VectorLayer<WfsSource> {
    private _geoServerUrl: string;
    private _geoServerAdvanced: GeoServerAdvanced;

    /**
     *
     * @param options
     * @param i18n
     * @fires layerLoaded
     */
    constructor(options: LayerParams, i18n: I18n) {
        super({
            name: options.name,
            label: options.label || options.name,
            // @ts-expect-error
            type: '_wfs_',
            minZoom: options.minZoom,
            visible: true,
            zIndex: 2,
            ...options
        });

        Object.assign(this, baseLayer);

        this._geoServerUrl = options.geoServerUrl;
        this._geoServerAdvanced = options.geoServerAdvanced;

        const layerName = options.name;

        // Use bbox as default if not strategy is defined
        const strategy = options.wfsStrategy || 'bbox';

        const optionsWithFallback = {
            ...(options.cqlFilter && {
                cql_filter: options.cqlFilter
            }),
            ...(options.vendorOptions || {})
        };

        const source = new WfsSource(
            {
                name: layerName,
                geoServerUrl: this._geoServerUrl,
                geoServerAdvanced: this._geoServerAdvanced,
                strategy: strategy === 'bbox' ? bbox : all,
                geoserverOptions: optionsWithFallback
            },
            i18n
        );

        let loading = 0;
        let loaded = 0;

        source.on('featuresloadstart', () => {
            loading++;
            showLoading();
        });

        source.on(['featuresloadend', 'featuresloaderror'], () => {
            loaded++;
            setTimeout(() => {
                if (loading === loaded) {
                    this.dispatchEvent('layerLoaded');
                }
            }, 300);
        });

        source.on(
            [
                'featuresloadstart',
                'featuresloadend',
                'featuresloaderror',
                'getFeature'
            ],
            (evt) => {
                this.dispatchEvent(evt);
            }
        );

        this.setSource(source);
    }

    async getGeoserverLayersData(): Promise<any> {
        /**
         * Replaced by baseLayer
         */
    }
}
