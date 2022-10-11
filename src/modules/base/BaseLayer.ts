import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { TransactionResponse } from 'ol/format/WFS';

import Geoserver from '../../Geoserver';
import { IGeoserverDescribeFeatureType } from '../../@types';
import { GeometryType, TransactionType } from '../../@enums';
import { I18N } from '../i18n';
import { getMap } from '../state';
import Layer from 'ol/layer/Base';

/**
 * Base class from which all layer types are derived.
 */
export default class BaseLayer extends Layer {
    /**
     * @private
     */
    _init(): void {
        const geoserver = this.getGeoserver() as Geoserver;

        if (geoserver.isLoaded()) {
            this.getAndUpdateDescribeFeatureType();
        } else {
            geoserver.on('change:capabilities', () => {
                this.getAndUpdateDescribeFeatureType();
            });
        }
    }

    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     */
    async getAndUpdateDescribeFeatureType(): Promise<void> {
        const layerName = this.get(BaseLayerProperty.NAME);
        const layerLabel = this.get(BaseLayerProperty.LABEL);

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

            const targetNamespace = data.targetNamespace;
            const properties = data.featureTypes[0].properties;

            // Find the geometry field
            const geom = properties.find((el) => el.type.indexOf('gml:') >= 0);

            data._parsed = {
                namespace: targetNamespace,
                properties: properties,
                geomType: geom.localType as GeometryType,
                geomField: geom.name
            };

            this.set(BaseLayerProperty.DESCRIBEFEATURETYPE, data);
        } catch (err) {
            console.error(err);
            throw new Error(`${I18N.errors.layer} "${layerLabel}"`);
        }
    }

    /**
     * @public
     * @returns
     */
    isVisibleByZoom(): boolean {
        return getMap().getView().getZoom() > this.getMinZoom();
    }

    /**
     *
     * @param mode
     * @param features
     * @public
     */
    async transactFeatures(
        mode: TransactionType,
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ): Promise<TransactionResponse | false> {
        const geoserver = this.getGeoserver() as Geoserver;
        return geoserver.transact(
            mode,
            features,
            this.get(BaseLayerProperty.NAME)
        );
    }

    async insertFeatures(
        features: Array<Feature<Geometry>> | Feature<Geometry>
    ): Promise<TransactionResponse | false> {
        return this.transactFeatures(TransactionType.Insert, features);
    }

    /**
     * @public
     * @param featureId
     * @returns
     */
    async maybeLockFeature(featureId: string | number): Promise<string> {
        const geoserver = this.getGeoserver() as Geoserver;

        if (geoserver.getUseLockFeature() && geoserver.hasLockFeature()) {
            return await geoserver.lockFeature(
                featureId,
                this.get(BaseLayerProperty.NAME)
            );
        }
        return null;
    }

    /**
     *
     * @returns
     * @public
     */
    getGeoserver(): Geoserver {
        return this.get(BaseLayerProperty.GEOSERVER);
    }

    /**
     *
     * @returns
     * @public
     */
    getDescribeFeatureType(): IGeoserverDescribeFeatureType {
        return this.get(BaseLayerProperty.DESCRIBEFEATURETYPE);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
     setCqlFilter(value: string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.CQLFILTER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getCqlFilter(): string {
        return this.get(BaseLayerProperty.CQLFILTER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setSortBy(value: string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.SORTBY, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getSortBy(): string {
        return this.get(BaseLayerProperty.SORTBY);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFeatureId(value: string, opt_silent: boolean) {
        this.set(BaseLayerProperty.FEATUREID, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFeatureId(): string {
        return this.get(BaseLayerProperty.FEATUREID);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFilter(value: string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.FILTER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFilter(): string {
        return this.get(BaseLayerProperty.FILTER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFormatOptions(value: string, opt_silent: boolean) {
        this.set(BaseLayerProperty.FORMATOPTIONS, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFormatOptions(): string {
        return this.get(BaseLayerProperty.FORMATOPTIONS);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setMaxFeatures(value: number | string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.MAXFEATURES, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getMaxFeatures(): number | string {
        return this.get(BaseLayerProperty.MAXFEATURES);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStartIndex(value: number | string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.STARTINDEX, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getStartIndex(): number | string {
        return this.get(BaseLayerProperty.STARTINDEX);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setPropertyName(value: string, opt_silent: boolean): void {
        this.set(BaseLayerProperty.PROPERTYNAME, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getPropertyName(): string {
        return this.get(BaseLayerProperty.PROPERTYNAME);
    }
}

export enum BaseLayerProperty {
    NAME = 'name',
    LABEL = 'label',
    DESCRIBEFEATURETYPE = 'describeFeatureType',
    ISVISIBLE = 'isVisible',
    GEOSERVER = 'geoserver',
    CQLFILTER = 'cql_filter',
    SORTBY = 'sortBy',
    FEATUREID = 'featureid',
    FILTER = 'filter',
    FORMATOPTIONS = 'format_options',
    MAXFEATURES = 'maxFeatures',
    STARTINDEX = 'startIndex',
    PROPERTYNAME = 'propertyname'
}

export type BaseLayerEventTypes =
    | 'layerRendered'
    | `change:${BaseLayerProperty.DESCRIBEFEATURETYPE}`
    | `change:${BaseLayerProperty.ISVISIBLE}`
    | `change:${BaseLayerProperty.CQLFILTER}`
    | `change:${BaseLayerProperty.SORTBY}`
    | `change:${BaseLayerProperty.FEATUREID}`
    | `change:${BaseLayerProperty.FILTER}`
    | `change:${BaseLayerProperty.FORMATOPTIONS}`
    | `change:${BaseLayerProperty.MAXFEATURES}`
    | `change:${BaseLayerProperty.STARTINDEX}`
    | `change:${BaseLayerProperty.PROPERTYNAME}`;    

    

