import TileLayer from 'ol/layer/Tile';

import { GeoServerAdvanced, I18n, LayerParams } from '../ol-wfst';
import baseLayer from './baseLayer';
import { showLoading } from './loading';
import WmsSource from './WmsSource';

export default class WmsLayer extends TileLayer<WmsSource> {
    private _geoServerUrl: string;
    private _geoServerAdvanced: GeoServerAdvanced;

    constructor(options: LayerParams, i18n: I18n) {
        super({
            name: options.name,
            label: options.label || options.name,
            // @ts-expect-error
            type: '_wms_',
            minZoom: options.minZoom,
            visible: true,
            zIndex: 1,
            ...options
        });

        this._geoServerUrl = options.geoServerUrl;
        this._geoServerAdvanced = options.geoServerAdvanced;

        Object.assign(this, baseLayer);

        const optionsWithFallback = {
            ...(options.cqlFilter && {
                cql_filter: options.cqlFilter
            }),
            ...(options.tilesBuffer && {
                buffer: options.tilesBuffer
            }),
            ...(options.vendorOptions || {})
        };

        const source = new WmsSource(
            {
                name: options.name,
                geoServerUrl: this._geoServerUrl,
                geoServerAdvanced: this._geoServerAdvanced,
                geoServerVendor: optionsWithFallback
            },
            i18n
        );

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
            super.dispatchEvent(evt);
        });

        this.setSource(source);
    }

    async getGeoserverLayersData(): Promise<any> {
        /**
         * Replaced by baseLayer
         */
    }
}
