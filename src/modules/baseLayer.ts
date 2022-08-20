import { DescribeFeatureType } from '../@types';

export default {
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     * @fires describeFeatureType
     * @fires allDescribeFeatureTypeLoaded
     */
    async getGeoserverLayersData(): Promise<any> {
        const layerName = this.get('name');
        const layerLabel = this.get('label');

        try {
            const params = new URLSearchParams({
                service: 'wfs',
                version: this._geoServerAdvanced.describeFeatureTypeVersion,
                request: 'DescribeFeatureType',
                typeName: layerName,
                outputFormat: 'application/json',
                exceptions: 'application/json'
            });

            const url_fetch = this._geoServerUrl + '?' + params.toString();

            const response = await fetch(url_fetch, {
                headers: this._options.headers,
                credentials: this._options.credentials
            });

            if (!response.ok) {
                throw new Error('');
            }

            const data: DescribeFeatureType = await response.json();

            if (!data) {
                throw new Error('');
            }

            this.dispatchEvent({
                type: 'describeFeatureType',
                layer: layerName,
                data: data
            });

            const targetNamespace = data.targetNamespace;
            const properties = data.featureTypes[0].properties;

            // Find the geometry field
            const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);

            return {
                namespace: targetNamespace,
                properties: properties,
                geomType: geom.localType,
                geomField: geom.name
            };
        } catch (err) {
            throw new Error(`${this._i18n.errors.layer} "${layerLabel}"`);
        }
    }
};
