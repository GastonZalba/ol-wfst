import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { all, bbox } from 'ol/loadingstrategy';
import VectorLayer from 'ol/layer/Vector';

import baseLayer from './modules/Modes/baseLayer';
import WfsSource from './modules/Modes/WfsSource';
import { LayerParams } from './ol-wfst';
import { showLoading } from './modules/loading';
import { Transact } from './@enums';
import Geoserver from './Geoserver';
import { IDescribeFeatureType } from './@types';

export default class WfsLayer extends VectorLayer<WfsSource> {
    /**
     *
     * @param options
     * @param i18n
     * @fires layerLoaded
     */
    constructor(options: LayerParams) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            visible: true,
            zIndex: 2,
            ...options
        });

        Object.assign(this, baseLayer);

        const layerName = options.name;

        // Use bbox as default if not strategy is defined
        const strategy = options.wfsStrategy || 'bbox';
        const geoserver = this.getGeoserver() as Geoserver;

        const source = new WfsSource({
            name: layerName,
            geoServerUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            strategy: strategy === 'bbox' ? bbox : all,
            geoserverOptions: options.geoServerVendor
        });

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
                //@ts-expect-error
                'getFeature'
            ],
            (evt) => {
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
