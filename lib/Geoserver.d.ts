import BaseObject, { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';
import { ProjectionLike } from 'ol/proj.js';
import Circle from 'ol/geom/Circle.js';
import Geometry from 'ol/geom/Geometry.js';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import WFS from 'ol/format/WFS.js';
import { State } from 'ol/source/Source.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { TransactionResponse } from 'ol/format/WFS.js';
import { TransactionType } from './@enums';
/**
 * @fires change:capabilities
 * @extends {ol/Object~BaseObject}
 * @param options
 */
export default class Geoserver extends BaseObject {
    protected _options: GeoserverOptions;
    protected _countRequests: number;
    protected _insertFeatures: Array<Feature<Geometry>>;
    protected _updateFeatures: Array<Feature<Geometry>>;
    protected _deleteFeatures: Array<Feature<Geometry>>;
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;
    protected state_: State;
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<GeoserverEventTypes | ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<GeoserverEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<GeoserverEventTypes | ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<GeoserverEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<GeoserverEventTypes | ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<GeoserverEventTypes | ObjectEventTypes | EventTypes, void>;
    constructor(options: GeoserverOptions);
    /**
     *
     * @returns
     * @public
     */
    getCapabilities(): XMLDocument;
    /**
     *
     * @param url
     * @param opt_silent
     * @public
     */
    setUrl(url: string, opt_silent?: boolean): void;
    /**
     *
     * @returns
     */
    getUrl(): string;
    /**
     *
     * @param headers
     * @param opt_silent
     * @returns
     * @public
     */
    setHeaders(headers?: HeadersInit, opt_silent?: boolean): void;
    /**
     *
     * @returns
     * @public
     */
    getHeaders(): HeadersInit;
    /**
     *
     * @param credentials
     * @param opt_silent
     * @public
     */
    setCredentials(credentials?: RequestCredentials, opt_silent?: boolean): void;
    /**
     *
     * @returns
     * @public
     */
    getCredentials(): RequestCredentials;
    /**
     *
     * @returns
     * @public
     */
    setAdvanced(advanced?: GeoServerAdvanced, opt_silent?: boolean): void;
    /**
     *
     * @returns
     * @public
     */
    getAdvanced(): GeoServerAdvanced;
    /**
     *
     * @returns
     * @public
     */
    hasTransaction(): boolean;
    /**
     *
     * @returns
     * @public
     */
    hasLockFeature(): boolean;
    /**
     *
     * @returns
     * @public
     */
    getUseLockFeature(): boolean;
    /**
     *
     * @returns
     * @public
     */
    setUseLockFeature(useLockFeature: boolean, opt_silent?: boolean): void;
    /**
     *
     * @returns
     * @public
     */
    isLoaded(): boolean;
    /**
     *
     * @returns
     */
    getState(): State;
    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @fires getcapabilities
     * @public
     */
    getAndUpdateCapabilities(): Promise<XMLDocument>;
    /**
     *
     * @private
     */
    _checkGeoserverCapabilities(): void;
    /**
     * Make the WFS Transactions
     *
     * @param transactionType
     * @param features
     * @param layerName
     * @private
     */
    transact(transactionType: TransactionType, features: Array<Feature<Geometry>> | Feature<Geometry>, layerName: string): Promise<TransactionResponse | false>;
    /**
     * @privatwe
     */
    _removeFeatures(features: Feature<Geometry>[]): void;
    /**
     *
     * @param feature
     * @param geom
     * @private
     */
    _transformCircleToPolygon(feature: Feature<Geometry>, geom: Circle): void;
    /**
     *
     * @param feature
     * @private
     * @param geom
     */
    _transformGeoemtryCollectionToGeometries(feature: Feature<Geometry>, geom: GeometryCollection): void;
    /**
     *
     * @param feature
     * @returns
     * @private
     */
    _cloneFeature(feature: Feature<Geometry>): Feature<Geometry>;
    /**
     * Lock a feature in the geoserver. Useful before editing a geometry,
     * to avoid changes from multiples suers
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @public
     */
    lockFeature(featureId: string | number, layerName: string, retry?: number): Promise<string>;
}
/**
 * **_[interface]_**
 * @public
 */
export interface GeoserverOptions {
    /**
     * Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests
     *
     */
    url: string;
    /**
     * Advanced options for geoserver requests
     *
     */
    advanced?: GeoServerAdvanced;
    /**
     * Http headers for GeoServer requests
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
     *
     */
    headers?: HeadersInit;
    /**
     * Credentials for fetch requests
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     *
     * Default is 'same-origin'
     */
    credentials?: RequestCredentials;
    /**
     * Use LockFeatue request on GeoServer when selecting features. Prevents a feature from being edited
     * through a persistent feature lock. This is not always supportedd by the GeoServer.
     * See https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
     */
    useLockFeature?: boolean;
}
/**
 * **_[interface]_**
 *
 *  * Default values:
 * ```javascript
 * {
 *   getCapabilitiesVersion: '1.3.0',
 *   getFeatureVersion: '1.0.0',
 *   describeFeatureTypeVersion: '1.1.0',
 *   lockFeatureVersion: '1.1.0',
 *   wfsTransactionVersion: '1.1.0',
 *   projection: 'EPSG:3857',
 *   lockFeatureParams: {
 *     expiry: 5,
 *     lockId: 'Geoserver',
 *     releaseAction: 'SOME'
 *   }
 * }
 * @public
 */
export interface GeoServerAdvanced {
    getCapabilitiesVersion?: string;
    getFeatureVersion?: string;
    lockFeatureVersion?: string;
    describeFeatureTypeVersion?: string;
    wfsTransactionVersion?: string;
    projection?: ProjectionLike;
    lockFeatureParams?: {
        expiry?: number | string;
        lockId?: string;
        releaseAction?: string;
    };
}
export declare enum GeoserverProperty {
    CAPABILITIES = "capabilities",
    URL = "url",
    HEADERS = "headers",
    CREDENTIALS = "credentials",
    ADVANCED = "advanced",
    HASTRASNACTION = "hasTransaction",
    HASLOCKFEATURE = "hasLockFeature",
    HASDESCRIBEFEATURETYPE = "hasDescribeFeatureType",
    USELOCKFEATURE = "useLockFeature",
    ISLOADED = "isLoaded"
}
export type GeoserverEventTypes = `change:${GeoserverProperty.CAPABILITIES}` | `change:${GeoserverProperty.URL}` | `change:${GeoserverProperty.HEADERS}` | `change:${GeoserverProperty.CREDENTIALS}` | `change:${GeoserverProperty.ADVANCED}` | `change:${GeoserverProperty.HASTRASNACTION}` | `change:${GeoserverProperty.HASLOCKFEATURE}` | `change:${GeoserverProperty.HASDESCRIBEFEATURETYPE}` | `change:${GeoserverProperty.USELOCKFEATURE}` | `change:${GeoserverProperty.ISLOADED}`;
//# sourceMappingURL=Geoserver.d.ts.map