import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

import Geoserver from '../../Geoserver';
import { DescribeFeatureType, IDescribeFeatureType } from '../../@types';
import { Transact } from '../../@enums';
import { I18N } from '../i18n';
import { getMap } from '../state';

export default {
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     */
    async syncDescribeFeatureType(): Promise<IDescribeFeatureType> {
        const layerName = this.get('name');
        const layerLabel = this.get('label');

        try {
            const geoserver = this.getGeoserver() as Geoserver;

            const params = new URLSearchParams({
                service: 'wfs',
                version: geoserver.getAdvanced().describeFeatureTypeVersion,
                request: 'DescribeFeatureType',
                typeName: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });

            const url_fetch = geoserver.getUrl() + '?' + params.toString();

            const response = await fetch(url_fetch, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });

            if (!response.ok) {
                throw new Error('');
            }

            const data: DescribeFeatureType = await response.json();

            if (!data) {
                throw new Error('');
            }

            const targetNamespace = data.targetNamespace;
            const properties = data.featureTypes[0].properties;

            // Find the geometry field
            const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);

            const dft = {
                namespace: targetNamespace,
                properties: properties,
                geomType: geom.localType,
                geomField: geom.name
            };

            this.set('describeFeatureType', dft);

            return dft;
        } catch (err) {
            console.error(err);
            throw new Error(`${I18N.errors.layer} "${layerLabel}"`);
        }
    },

    init(): void {
        if (this.getGeoserver().isLoaded()) {
            this.syncDescribeFeatureType();
        } else {
            this.getGeoserver().on('getCapabilities', () => {
                this.syncDescribeFeatureType();
            });
        }
    },

    isVisible(): boolean {
        return getMap().getView().getZoom() > this.getMinZoom();
    },

    /**
     *
     * @param mode
     * @param features
     * @public
     */
    async transactFeatures(
        mode: Transact,
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ) {
        const geoserver = this.getGeoserver() as Geoserver;
        geoserver.transact(mode, features, this.get('name'));
    },

    async insertFeatures(
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ) {
        this.transactFeatures(Transact.Insert, features);
    },

    async maybeLockFeature(featureId: string | number): Promise<string> {
        const geoserver = this.getGeoserver() as Geoserver;

        if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
            return await geoserver.lockFeature(featureId, this.get('name'));
        }
        return null;
    }
};

export type BaseLayerEventTypes =
    | 'layerLoaded'
    | 'change:describeFeatureType'
    | 'change:isVisible';
