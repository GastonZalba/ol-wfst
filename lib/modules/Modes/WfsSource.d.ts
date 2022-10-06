import Geometry from 'ol/geom/Geometry';
import VectorSource, { Options as VSOptions } from 'ol/source/Vector';
import { WfsGeoserverVendor } from '../../@types';
import { GeoServerAdvanced } from '../../Geoserver';
import BaseSource from './BaseSource';
declare const WfsSource_base: import("ts-mixer/dist/types/types").Class<any[], VectorSource<Geometry> & BaseSource, (new (options?: VSOptions<Geometry>) => VectorSource<Geometry>) & typeof BaseSource, false>;
export default class WfsSource extends WfsSource_base {
    private geoserverProps_;
    private urlParams_;
    constructor(options: Options);
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStrict(value: boolean, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getStrict(): boolean;
    /**
     * @private
     */
    addEvents_(): void;
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
export declare enum WfsSourceProperty {
    STRICT = "strict"
}
export declare type WfsSourceEventTypes = `change:${WfsSourceProperty.STRICT}`;
export {};
//# sourceMappingURL=WfsSource.d.ts.map