import TileWMS, { Options as TSOptions } from 'ol/source/TileWMS';
import { WmsGeoserverVendor } from '../../@types';
import BaseSource from './BaseSource';
import { GeoServerAdvanced } from '../../Geoserver';
declare const WmsSource_base: import("ts-mixer/dist/types/types").Class<any[], TileWMS & BaseSource, typeof TileWMS & typeof BaseSource, false>;
export default class WmsSource extends WmsSource_base {
    private geoserverProps_;
    constructor(options: Options);
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setBuffer(value: string | number, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getBuffer(): string | number;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setEnv(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getEnv(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setClip(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getClip(): string;
    /**
     * @private
     */
    addEvents_(): void;
}
export interface Options extends Omit<TSOptions, 'params'> {
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
export declare enum WmsSourceProperty {
    BUFFER = "buffer",
    ENV = "env",
    CLIP = "clip"
}
export declare type WmsSourceEventTypes = `change:${WmsSourceProperty.BUFFER}` | `change:${WmsSourceProperty.ENV}` | `change:${WmsSourceProperty.CLIP}`;
export {};
//# sourceMappingURL=WmsSource.d.ts.map