import TileWMS, { Options as TSOptions } from 'ol/source/TileWMS';
import TileState from 'ol/TileState';
import { ImageTile } from 'ol';
import { ObjectEvent } from 'ol/Object';

import { Mixin } from 'ts-mixer';

import { WmsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';
import BaseSource from './BaseSource';
import { GeoServerAdvanced } from '../../Geoserver';

export default class WmsSource extends Mixin(TileWMS, BaseSource) {
    private geoserverProps_ = [
        'cql_filter',
        'filter',
        'orderBy',
        'maxFeatures',
        'startIndex',
        'featureid',
        'format_options',
        'propertyname',
        'buffer',
        'clip',
        'env'
    ];

    constructor(options: Options) {
        super({
            url: options.geoserverUrl,
            serverType: 'geoserver',
            params: {
                SERVICE: 'wms',
                TILED: true,
                LAYERS: options.name,
                EXCEPTIONS: 'application/json',
                ...(options.geoserverVendor && options.geoserverVendor)
            },
            tileLoadFunction: async (tile, src) => {
                const blobToJson = (blob: Blob): any => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                            resolve(JSON.parse(reader.result as string));
                        reader.readAsText(blob);
                    });
                };

                try {
                    const response = await fetch(src, {
                        headers: options.headers,
                        credentials: options.credentials
                    });

                    if (!response.ok) {
                        throw new Error('');
                    }

                    let data = await response.blob();

                    // Check if the response has an error
                    if (data.type == 'application/json') {
                        const parsedError = await blobToJson(data);
                        throw new Error(parseError(parsedError));
                    }

                    ((tile as ImageTile).getImage() as HTMLImageElement).src =
                        URL.createObjectURL(data);

                    tile.setState(TileState.LOADED);
                } catch (err) {
                    showError(I18N.errors.geoserver, err, options.name);
                    tile.setState(TileState.ERROR);
                }
            },
            ...options
        });

        this.addEvents_();
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setBuffer(value: string | number, opt_silent: boolean): void {
        this.set(WmsSourceProperty.BUFFER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getBuffer(): string | number {
        return this.get(WmsSourceProperty.BUFFER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setEnv(value: string, opt_silent: boolean): void {
        this.set(WmsSourceProperty.ENV, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getEnv(): string {
        return this.get(WmsSourceProperty.ENV);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setClip(value: string, opt_silent: boolean): void {
        this.set(WmsSourceProperty.CLIP, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getClip(): string {
        return this.get(WmsSourceProperty.CLIP);
    }

    /**
     * @private
     */
    addEvents_(): void {
        this.on(['propertychange'], (evt: ObjectEvent) => {
            console.log(evt.key);
            // If a geoserver property was modified, refresh the source
            if (this.geoserverProps_.includes(evt.key)) {
                this.updateParams({
                    [evt.key]: evt.target.get(evt.key)
                });
                this.refresh();
            }
        });
    }
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

export enum WmsSourceProperty {
    BUFFER = 'buffer',
    ENV = 'env',
    CLIP = 'clip'
}

export type WmsSourceEventTypes =
    | `change:${WmsSourceProperty.BUFFER}`
    | `change:${WmsSourceProperty.ENV}`
    | `change:${WmsSourceProperty.CLIP}`;
