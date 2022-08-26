import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import VectorSource, { Options as VSOptions } from 'ol/source/Vector';
import { transformExtent } from 'ol/proj';
import { bbox } from 'ol/loadingstrategy';
import { ObjectEvent } from 'ol/Object';

import { GeoServerAdvanced } from '../../ol-wfst';
import BaseObject from './baseSource';
import { WfsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';

export default class WfsSource extends VectorSource {
    private cql_filter_: string;
    private sortBy_: string;
    private featureid_: string;
    private filter_: string;
    private format_options_: string;
    private maxFeatures_: string;
    private startIndex_: string;
    private propertyname_: string;

    private geoserverProps_ = [
        'cql_filter_',
        'filter_',
        'orderBy_',
        'maxFeatures_',
        'startIndex_',
        'featureid_',
        'formatOptions_',
        'propertyname_',
        'buffer_',
        'clip_',
        'env_'
    ];

    private urlParams_ = new URLSearchParams({
        SERVICE: 'wfs',
        REQUEST: 'GetFeature',
        OUTPUTFORMAT: 'application/json',
        EXCEPTIONS: 'application/json'
    });

    constructor(options: Options) {
        super({
            ...options,
            format: new GeoJSON(),
            loader: async (
                extent,
                resolution,
                projection,
                success,
                failure
            ) => {
                try {
                    // If bbox, add extent to the request
                    if (options.strategy == bbox) {
                        const extentGeoServer = transformExtent(
                            extent,
                            projection.getCode(),
                            options.geoServerAdvanced.projection
                        );
                        // https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
                        // request features using a bounding box with CRS maybe different from featureTypes native CRS
                        this.urlParams_.set(
                            'bbox',
                            extentGeoServer.toString() +
                                `,${options.geoServerAdvanced.projection}`
                        );
                    }

                    const cqlFilter = this.getCqlFilter();
                    if (cqlFilter) {
                        this.urlParams_.set('cql_filter', cqlFilter);
                    }

                    const sortBy = this.getSortBy();
                    if (sortBy) {
                        this.urlParams_.set('sortBy', sortBy);
                    }

                    const filter = this.getFilter();
                    if (filter) {
                        this.urlParams_.set('filter', filter);
                    }

                    const featureId = this.getFeatureId();
                    if (featureId) {
                        this.urlParams_.set('featureid', featureId);
                    }

                    const formatOptions = this.getFormatOptions();
                    if (formatOptions) {
                        this.urlParams_.set('formatOptions', formatOptions);
                    }

                    const maxFeatures = this.getMaxFeatures();
                    if (maxFeatures) {
                        this.urlParams_.set('maxFeatures', maxFeatures);
                    }

                    const startIndex = this.getStartIndex();
                    if (startIndex) {
                        this.urlParams_.set('startIndex', startIndex);
                    }

                    const propertyName = this.getPropertyName();
                    if (propertyName) {
                        this.urlParams_.set('propertyname', propertyName);
                    }

                    const url_fetch =
                        options.geoServerUrl + '?' + this.urlParams_.toString();

                    const response = await fetch(url_fetch, {
                        headers: options.headers,
                        credentials: options.credentials
                    });

                    if (!response.ok) {
                        throw new Error('');
                    }

                    const data = await response.json();

                    if (data.exceptions) {
                        throw new Error(parseError(data));
                    }

                    this.dispatchEvent({
                        type: 'getFeature',
                        // @ts-expect-error
                        layer: options.name,
                        data: data
                    });

                    const features = this.getFormat().readFeatures(data, {
                        featureProjection: projection.getCode(),
                        dataProjection: options.geoServerAdvanced.projection
                    });

                    features.forEach((feature: Feature<Geometry>) => {
                        feature.set(
                            '_layerName_',
                            options.name,
                            /* silent = */ true
                        );
                    });

                    this.addFeatures(features as Feature<Geometry>[]);

                    success(features as Feature<Geometry>[]);
                } catch (err) {
                    this.removeLoadedExtent(extent);

                    showError(I18N.errors.geoserver, err, options.name);

                    failure();
                }
            }
        });

        this.urlParams_.set(
            'version',
            options.geoServerAdvanced.getFeatureVersion
        );

        this.urlParams_.set('typename', options.name);

        this.urlParams_.set(
            'srsName',
            options.geoServerAdvanced.projection.toString()
        );

        const geoserverOptions = options.geoserverOptions;

        this.set('cql_filter_', geoserverOptions.cql_filter, true);

        this.set('sortBy_', geoserverOptions.sortBy, true);

        this.set('featureid_', geoserverOptions.featureid, true);

        this.set('filter_', geoserverOptions.filter, true);

        this.set('format_options_', geoserverOptions.format_options, true);

        this.set('maxFeatures_', geoserverOptions.maxFeatures, true);

        this.set('startIndex_', geoserverOptions.startIndex, true);

        this.set('propertyname_', geoserverOptions.propertyname, true);

        Object.assign(this, BaseObject);

        this.addEvents_();
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setCqlFilter(value, opt_silent: boolean) {
        this.set('cql_filter_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getCqlFilter(): string {
        return this.get('cql_filter_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setSortBy(value, opt_silent: boolean) {
        this.set('sortBy_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getSortBy(): string {
        return this.get('sortBy_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFeatureId(value, opt_silent: boolean) {
        this.set('featureid_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFeatureId(): string {
        return this.get('featureid_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFilter(value, opt_silent: boolean) {
        this.set('filter_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFilter(): string {
        return this.get('filter_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFormatOptions(value, opt_silent: boolean) {
        this.set('format_options_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFormatOptions(): string {
        return this.get('format_options_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setMaxFeatures(value, opt_silent: boolean) {
        this.set('maxFeatures_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getMaxFeatures(): string {
        return this.get('maxFeatures_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStartIndex(value, opt_silent: boolean) {
        this.set('startIndex_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getStartIndex(): string {
        return this.get('startIndex_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setPropertyName(value, opt_silent: boolean) {
        this.set('propertyname_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getPropertyName(): string {
        return this.get('propertyname_');
    }

    /**
     * @private
     */
    addEvents_(): void {
        this.on(['propertychange'], (evt: ObjectEvent) => {
            // If a geoserver property was modified, refresh the source
            if (this.geoserverProps_.includes(evt.key)) {
                this.refresh();
            }
        });
    }
}

export interface Options extends VSOptions {
    /**
     * Layer name in the GeoServer
     */
    name: string;

    /**
     * Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests
     */
    geoServerUrl: string;

    /**
     * Advanced options for geoserver requests
     */
    geoServerAdvanced?: GeoServerAdvanced;

    /**
     * Url headers for GeoServer requests. You can use it to add Authorization credentials
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
     */
    headers?: HeadersInit;

    /**
     * Credentials for fetch requests
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials?: RequestCredentials;

    /**
     * Strategy function for loading features. Only works if mode is "wfs"
     */
    wfsStrategy?: 'bbox' | 'all';

    /**
     *
     */
    geoserverOptions?: WfsGeoserverVendor;
}
