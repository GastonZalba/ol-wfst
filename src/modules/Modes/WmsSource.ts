import TileWMS, { Options as TSOptions } from 'ol/source/TileWMS';
import TileState from 'ol/TileState';
import { ImageTile } from 'ol';
import { ObjectEvent } from 'ol/Object';

import { WmsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';
import baseSource, { TBaseSource } from './baseSource';
import { GeoServerAdvanced } from '../../Geoserver';

export default class WmsSource extends TileWMS implements TBaseSource {
    public setCqlFilter!: () => void;
    public getCqlFilter!: () => string;
    public setSortBy!: () => void;
    public getSortBy!: () => string;
    public setFeatureId!: () => void;
    public getFeatureId!: () => string;
    public setFilter!: () => void;
    public getFilter!: () => string;
    public setFormatOptions!: () => void;
    public getFormatOptions!: () => string;
    public setMaxFeatures!: () => void;
    public getMaxFeatures!: () => string;
    public setStartIndex!: () => void;
    public getStartIndex!: () => string;
    public setPropertyName!: () => void;
    public getPropertyName!: () => string;

    private geoserverProps_ = [
        'cql_filter_',
        'filter_',
        'orderBy_',
        'maxFeatures_',
        'startIndex_',
        'featureid_',
        'formatOptions_',
        'propertyname_'
    ];

    constructor(options: Options) {
        super({
            url: options.geoServerUrl,
            serverType: 'geoserver',
            params: {
                SERVICE: 'wms',
                TILED: true,
                LAYERS: options.name,
                EXCEPTIONS: 'application/json',
                ...options.geoServerVendor
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

        Object.assign(this, baseSource);

        this.addEvents_();
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setBuffer(value: string | number, opt_silent: boolean): void {
        this.set('buffer_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getBuffer(): string | number {
        return this.get('buffer_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setEnv(value: string, opt_silent: boolean): void {
        this.set('env_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getEnv(): string {
        return this.get('env_');
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setClip(value: string, opt_silent: boolean): void {
        this.set('clip_', value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getClip(): string {
        return this.get('clip_');
    }

    /**
     * @private
     */
    addEvents_(): void {
        this.on(['propertychange'], (evt: ObjectEvent) => {
            // If a geoserver property was modified, refresh the source
            if (this.geoserverProps_.includes(evt.key)) {
                this.updateParams({
                    [evt.key.slice(0, -1)]: evt.target.get(evt.key)
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
    geoServerUrl: string;

    /**
     * Advanced options for geoserver requests
     */
    geoServerAdvanced?: GeoServerAdvanced;

    /**
     *
     */
    geoServerVendor?: WmsGeoserverVendor;

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
