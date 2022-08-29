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

                    // @ts-expect-error
                    const cqlFilter = this.getCqlFilter();
                    if (cqlFilter) {
                        this.urlParams_.set('cql_filter', cqlFilter);
                    }

                    // @ts-expect-error
                    const sortBy = this.getSortBy();
                    if (sortBy) {
                        this.urlParams_.set('sortBy', sortBy);
                    }

                    // @ts-expect-error
                    const filter = this.getFilter();
                    if (filter) {
                        this.urlParams_.set('filter', filter);
                    }

                    // @ts-expect-error
                    const featureId = this.getFeatureId();
                    if (featureId) {
                        this.urlParams_.set('featureid', featureId);
                    }

                    // @ts-expect-error
                    const formatOptions = this.getFormatOptions();
                    if (formatOptions) {
                        this.urlParams_.set('formatOptions', formatOptions);
                    }

                    // @ts-expect-error
                    const maxFeatures = this.getMaxFeatures();
                    if (maxFeatures) {
                        this.urlParams_.set('maxFeatures', maxFeatures);
                    }

                    // @ts-expect-error
                    const startIndex = this.getStartIndex();
                    if (startIndex) {
                        this.urlParams_.set('startIndex', startIndex);
                    }

                    // @ts-expect-error
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

        const geoserverOptions = options.geoServerVendor;

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
     *
     */
    geoServerVendor?: WfsGeoserverVendor;

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
}
