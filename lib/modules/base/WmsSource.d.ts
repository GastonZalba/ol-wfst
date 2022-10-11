import TileWMS, { Options as TSOptions } from 'ol/source/TileWMS';
import { WmsGeoserverVendor } from '../../@types';
import { GeoServerAdvanced } from '../../Geoserver';
/**
 * Layer source to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @extends {ol/source/TieWMS~TileWMS}
 * @param options
 */
export default class WmsSource extends TileWMS {
    constructor(options: WmsSourceOptions);
}
/**
 * **_[interface]_** - Parameters to create a WmsSource
 *
 * @public
 */
export interface WmsSourceOptions extends Omit<TSOptions, 'params'> {
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
    geoserverVendor?: WmsGeoserverVendor;
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
//# sourceMappingURL=WmsSource.d.ts.map