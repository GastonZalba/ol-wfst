import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Geometry from 'ol/geom/Geometry';
import VectorSource, { Options as VSOptions } from 'ol/source/Vector';
import { transformExtent } from 'ol/proj';
import { bbox } from 'ol/loadingstrategy';
import { ObjectEvent } from 'ol/Object';

import { Mixin } from 'ts-mixer';

import { WfsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';
import { GeoServerAdvanced } from '../../Geoserver';
import BaseSource from './BaseSource';

export default class WfsSource extends Mixin(VectorSource, BaseSource) {
    private geoserverProps_ = [
        'cql_filter',
        'filter',
        'orderBy',
        'maxFeatures',
        'startIndex',
        'featureid',
        'format_options',
        'propertyname',
        'strict'
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
                        this.urlParams_.set('maxFeatures', String(maxFeatures));
                    }

                    const startIndex = this.getStartIndex();
                    if (startIndex) {
                        this.urlParams_.set('startIndex', String(startIndex));
                    }

                    const propertyName = this.getPropertyName();
                    if (propertyName) {
                        this.urlParams_.set('propertyname', propertyName);
                    }

                    const strict = this.getStrict();
                    if (strict !== undefined) {
                        this.urlParams_.set('strict', String(strict));
                    }

                    const url_fetch =
                        options.geoserverUrl + '?' + this.urlParams_.toString();

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

        const geoserverOptions = options.geoserverVendor;

        this.setCqlFilter(geoserverOptions.cql_filter, true);

        this.setSortBy(geoserverOptions.sortBy, true);

        this.setFeatureId(geoserverOptions.featureid, true);

        this.setFilter(geoserverOptions.filter, true);

        this.setFormatOptions(geoserverOptions.format_options, true);

        this.setMaxFeatures(geoserverOptions.maxFeatures, true);

        this.setStartIndex(geoserverOptions.startIndex, true);

        this.setPropertyName(geoserverOptions.propertyname, true);

        this.setStrict(geoserverOptions.strict, true);

        this.addEvents_();
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStrict(value: boolean, opt_silent: boolean): void {
        this.set(WfsSourceProperty.STRICT, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getStrict(): boolean {
        return this.get(WfsSourceProperty.STRICT);
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
    geoserverUrl: string;

    /**
     * Advanced options for geoserver requests
     */
    geoServerAdvanced?: GeoServerAdvanced;

    /**
     *
     */
    geoserverVendor?: WfsGeoserverVendor;

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
}

export enum WfsSourceProperty {
    STRICT = 'strict'
}

export type WfsSourceEventTypes = `change:${WfsSourceProperty.STRICT}`;
