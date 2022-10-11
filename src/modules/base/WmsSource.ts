import TileWMS, { Options as TSOptions } from 'ol/source/TileWMS';
import TileState from 'ol/TileState';
import { ImageTile } from 'ol';
import { ObjectEvent } from 'ol/Object';

import { WmsGeoserverVendor } from '../../@types';
import { parseError, showError } from '../errors';
import { I18N } from '../i18n';
import { GeoServerAdvanced } from '../../Geoserver';

/**
 * Layer source to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @extends {ol/source/TieWMS~TileWMS}
 * @param options
 */
export default class WmsSource extends TileWMS {

    constructor(options: WmsSourceOptions) {
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

    }

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



