import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Geometry from 'ol/geom/Geometry.js';
import VectorSource, { Options as VSOptions } from 'ol/source/Vector.js';
import { transformExtent } from 'ol/proj.js';
import { bbox } from 'ol/loadingstrategy.js';

import { WfsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';
import { GeoServerAdvanced } from '../../Geoserver';

/**
 * Layer source to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @extends {ol/source/Vector~VectorSource}
 * @param options
 */
export default class WfsSource extends VectorSource {
    public urlParams = new URLSearchParams({
        SERVICE: 'wfs',
        REQUEST: 'GetFeature',
        OUTPUTFORMAT: 'application/json',
        EXCEPTIONS: 'application/json'
    });

    constructor(options: WfsSourceOptions) {
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
                        this.urlParams.set(
                            'bbox',
                            extentGeoServer.toString() +
                                `,${options.geoServerAdvanced.projection}`
                        );
                    }

                    const url_fetch =
                        options.geoserverUrl + '?' + this.urlParams.toString();

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

        this.urlParams.set(
            'version',
            options.geoServerAdvanced.getFeatureVersion
        );

        this.urlParams.set('typename', options.name);

        this.urlParams.set(
            'srsName',
            options.geoServerAdvanced.projection.toString()
        );
    }
}

/**
 * **_[interface]_** - Parameters to create a WfsSource
 *
 * @public
 */
export interface WfsSourceOptions extends VSOptions {
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
