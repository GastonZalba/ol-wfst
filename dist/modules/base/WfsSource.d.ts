import VectorSource, { Options as VSOptions } from 'ol/source/Vector.js';
import { WfsGeoserverVendor } from '../../@types';
import { GeoServerAdvanced } from '../../Geoserver';
/**
 * Layer source to retrieve WFS features from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
 *
 * @extends {ol/source/Vector~VectorSource}
 * @param options
 */
export default class WfsSource extends VectorSource {
    urlParams: URLSearchParams;
    constructor(options: WfsSourceOptions);
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
//# sourceMappingURL=WfsSource.d.ts.map