import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

import Geoserver from '../../Geoserver';
import {
    IGeoserverDescribeFeatureType,
    IDescribeFeatureTypeParsed
} from '../../@types';
import { GeometryType, TransactionType } from '../../@enums';
import { I18N } from '../i18n';
import { getMap } from '../state';

export default {
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     */
    async _getAndUpdateDescribeFeatureType(): Promise<IDescribeFeatureTypeParsed> {
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

            const data: IGeoserverDescribeFeatureType = await response.json();

            if (!data) {
                throw new Error('');
            }

            this.set('describeFeatureType', data);

            return this._parseDescribeFeatureType(data);
        } catch (err) {
            console.error(err);
            throw new Error(`${I18N.errors.layer} "${layerLabel}"`);
        }
    },

    _parseDescribeFeatureType(
        data: IGeoserverDescribeFeatureType
    ): IDescribeFeatureTypeParsed {
        const targetNamespace = data.targetNamespace;
        const properties = data.featureTypes[0].properties;

        // Find the geometry field
        const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);

        return {
            namespace: targetNamespace,
            properties: properties,
            geomType: geom.localType as GeometryType,
            geomField: geom.name
        };
    },

    getParsedDescribeFeatureType(): IDescribeFeatureTypeParsed {
        return this._parseDescribeFeatureType(this.getDescribeFeatureType());
    },

    _init(): void {
        if (this.getGeoserver().isLoaded()) {
            this._getAndUpdateDescribeFeatureType();
        } else {
            this.getGeoserver().on('getCapabilities', () => {
                this._getAndUpdateDescribeFeatureType();
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
        mode: TransactionType,
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ) {
        const geoserver = this.getGeoserver() as Geoserver;
        geoserver.transact(mode, features, this.get('name'));
    },

    async insertFeatures(
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ) {
        this.transactFeatures(TransactionType.Insert, features);
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
