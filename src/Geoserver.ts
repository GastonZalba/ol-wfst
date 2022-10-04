// Ol
import BaseObject, { ObjectEvent } from 'ol/Object';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType';

import { ProjectionLike } from 'ol/proj';
import { Circle, Geometry, GeometryCollection } from 'ol/geom';
import { Feature } from 'ol';
import { GeoJSON, KML, WFS } from 'ol/format';
import { State } from 'ol/source/Source';
import { fromCircle } from 'ol/geom/Polygon';
import BaseEvent from 'ol/events/Event';

import { showLoading } from './modules/loading';
import { showError } from './modules/errors';
import {
    getMap,
    getStoredLayer,
    removeFeatureFromEditList
} from './modules/state';
import { getEditLayer } from './modules/editLayer';
import { deepObjectAssign } from './modules/helpers';
import { I18N } from './modules/i18n';
import { GeometryType, Transact } from './@enums';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { EventsKey } from 'ol/events';

// https://docs.geoserver.org/latest/en/user/services/wfs/axis_order.html
// Axis ordering: latitude/longitude
const DEFAULT_GEOSERVER_SRS = 'EPSG:3857';

export class GeoserverEvent extends BaseEvent {
    public data: XMLDocument;

    constructor(options: { type: 'getCapabilities'; data: XMLDocument }) {
        super(options.type);
        this.data = options.data;
    }
}

type GeoserverEventTypes = 'change:capabilities';

/**
 * @fires getCapabilities
 * @extends {ol/Object}
 * @param options
 */
export default class Geoserver extends BaseObject {
    protected _options: GeoserverOptions;

    protected _countRequests: number;
    protected _insertFeatures: Array<Feature<Geometry>>;
    protected _updateFeatures: Array<Feature<Geometry>>;
    protected _deleteFeatures: Array<Feature<Geometry>>;

    // Formats
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;

    protected state_: State;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        OnSignature<GeoserverEventTypes, GeoserverEvent, EventsKey> &
        CombinedOnSignature<
            GeoserverEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            GeoserverEventTypes | ObjectEventTypes,
            ObjectEvent,
            EventsKey
        > &
        CombinedOnSignature<
            GeoserverEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<GeoserverEventTypes | ObjectEventTypes, ObjectEvent, void> &
        CombinedOnSignature<
            GeoserverEventTypes | ObjectEventTypes | EventTypes,
            void
        >;

    constructor(options: GeoserverOptions) {
        super();

        const defaults = {
            url: null,
            advanced: {
                getCapabilitiesVersion: '1.3.0',
                getFeatureVersion: '1.0.0',
                describeFeatureTypeVersion: '1.1.0',
                lockFeatureVersion: '1.1.0',
                wfsTransactionVersion: '1.1.0',
                projection: DEFAULT_GEOSERVER_SRS,
                lockFeatureParams: {
                    expiry: 5, // minutes
                    LockId: 'GeoServer',
                    releaseAction: 'SOME'
                }
            },
            headers: {},
            credentials: 'same-origin',
            useLockFeature: true
        };

        this._options = deepObjectAssign(defaults, options);

        this.setAdvanced(this._options.advanced);
        this.setHeaders(this._options.headers);
        this.setCredentials(this._options.credentials);
        this.setUrl(this._options.url);
        this.setUseLockFeature(this._options.useLockFeature);

        this._countRequests = 0;

        this._insertFeatures = [];
        this._updateFeatures = [];
        this._deleteFeatures = [];

        // Formats
        this._formatWFS = new WFS();

        this._formatGeoJSON = new GeoJSON();
        this._formatKml = new KML({
            extractStyles: false,
            showPointNames: false
        });
        this._xs = new XMLSerializer();

        this.syncCapabilities();

        this.on('change:capabilities', () => {
            this._checkGeoserverCapabilities();
        });
    }

    /**
     *
     * @returns
     * @public
     */
    getCapabilities(): XMLDocument {
        return this.get('capabilities');
    }

    /**
     *
     * @param url
     * @param opt_silent
     * @public
     */
    setUrl(url: string, opt_silent = false): void {
        this.set('url_', url, opt_silent);
    }

    /**
     *
     * @returns
     */
    getUrl(): string {
        return this.get('url_');
    }

    /**
     *
     * @param headers
     * @param opt_silent
     * @returns
     * @public
     */
    setHeaders(headers: HeadersInit = {}, opt_silent = false): void {
        return this.set('headers_', headers, opt_silent);
    }

    /**
     *
     * @returns
     * @public
     */
    getHeaders(): HeadersInit {
        return this.get('headers_');
    }

    /**
     *
     * @param credentials
     * @param opt_silent
     * @public
     */
    setCredentials(credentials = '', opt_silent = false): void {
        this.set('credentials_', credentials, opt_silent);
    }

    /**
     *
     * @returns
     * @public
     */
    getCredentials() {
        return this.get('credentials_');
    }

    /**
     *
     * @returns
     * @public
     */
    setAdvanced(advanced: GeoServerAdvanced = {}, opt_silent = false): void {
        this.set('advanced_', advanced, opt_silent);
    }

    /**
     *
     * @returns
     * @public
     */
    getAdvanced(): GeoServerAdvanced {
        return this.get('advanced_');
    }

    /**
     *
     * @returns
     * @public
     */
    hasTransaction(): boolean {
        return this.get('hasTransaction_');
    }

    /**
     *
     * @returns
     * @public
     */
    hasLockFeature(): boolean {
        return this.get('hasLockFeature_');
    }

    /**
     *
     * @returns
     * @public
     */
    getUseLockFeature(): boolean {
        return this.get('useLockFeature_');
    }

    /**
     *
     * @returns
     * @public
     */
    setUseLockFeature(useLockFeature: boolean, opt_silent = false): void {
        this.set('useLockFeature_', useLockFeature, opt_silent);
    }

    /**
     *
     * @returns
     * @public
     */
    isLoaded(): boolean {
        return this.get('isLoaded_');
    }

    /**
     *
     * @returns
     */
    getState() {
        return this.state_;
    }

    /**
     * Get the capabilities from the GeoServer and check
     * all the available operations.
     *
     * @fires getcapabilities
     * @public
     */
    async syncCapabilities(): Promise<XMLDocument> {
        try {
            const params = new URLSearchParams({
                service: 'wfs',
                version: this.getAdvanced().getCapabilitiesVersion,
                request: 'GetCapabilities',
                exceptions: 'application/json'
            });

            const url_fetch = this.getUrl() + '?' + params.toString();

            const response = await fetch(url_fetch, {
                headers: this.getHeaders(),
                credentials: this.getCredentials()
            });

            if (!response.ok) {
                throw new Error('');
            }

            const data = await response.text();
            const capabilities = new window.DOMParser().parseFromString(
                data,
                'text/xml'
            );

            this.set('capabilities', capabilities);

            this.state_ = capabilities ? 'ready' : 'error';

            super.dispatchEvent(
                new GeoserverEvent({
                    type: 'getCapabilities',
                    data: capabilities
                })
            );

            return capabilities;
        } catch (err) {
            console.error(err);
            const msg =
                typeof err === 'string' ? err : I18N.errors.capabilities;
            showError(msg, err);
        }
    }

    /**
     *
     * @private
     */
    _checkGeoserverCapabilities() {
        // Available operations in the geoserver
        const operations: HTMLCollectionOf<Element> =
            this.getCapabilities().getElementsByTagName('ows:Operation');

        Array.from(operations).forEach((operation) => {
            if (operation.getAttribute('name') === 'Transaction') {
                this.set('hasTransaction_', true);
            } else if (operation.getAttribute('name') === 'LockFeature') {
                this.set('hasLockFeature_', true);
            } else if (
                operation.getAttribute('name') === 'DescribeFeatureType'
            ) {
                this.set('hasDescribeFeatureType_', true);
            }
        });

        if (!this.hasTransaction()) {
            throw I18N.errors.wfst;
        }
    }

    /**
     * Make the WFS Transactions
     *
     * @param action
     * @param features
     * @param layerName
     * @private
     */
    async transact(
        action: Transact,
        features: Array<Feature<Geometry>> | Feature<Geometry>,
        layerName: string
    ): Promise<boolean> {
        features = Array.isArray(features) ? features : [features];

        const clonedFeatures = [];

        for (const feature of features) {
            let clone = this._cloneFeature(feature);
            const cloneGeom = clone.getGeometry();

            // Ugly fix to support GeometryCollection on GML
            // See https://github.com/openlayers/openlayers/issues/4220
            if (cloneGeom instanceof GeometryCollection) {
                this._transformGeoemtryCollectionToGeometries(
                    clone,
                    cloneGeom as GeometryCollection
                );
            } else if (cloneGeom instanceof Circle) {
                // Geoserver has no Support to Circles
                this._transformCircleToPolygon(clone, cloneGeom as Circle);
            }

            if (action === Transact.Insert) {
                // Filters
                if (this._options.beforeInsertFeature) {
                    clone = this._options.beforeInsertFeature(clone);
                }
            }

            if (clone) {
                clonedFeatures.push(clone);
            }
        }

        if (!clonedFeatures.length) {
            showError(I18N.errors.noValidGeometry);
            return false;
        }

        switch (action) {
            case Transact.Insert:
                this._insertFeatures = [
                    ...this._insertFeatures,
                    ...clonedFeatures
                ];
                break;
            case Transact.Update:
                this._updateFeatures = [
                    ...this._updateFeatures,
                    ...clonedFeatures
                ];
                break;
            case Transact.Delete:
                this._deleteFeatures = [
                    ...this._deleteFeatures,
                    ...clonedFeatures
                ];
                break;
            default:
                break;
        }

        this._countRequests++;
        const numberRequest = this._countRequests;

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    // Prevent fire multiples times
                    if (numberRequest !== this._countRequests) {
                        return;
                    }

                    let srs = getMap().getView().getProjection().getCode();

                    // Force latitude/longitude order on transactions
                    // EPSG:4326 is longitude/latitude (assumption) and is not managed correctly by GML3
                    srs =
                        srs === 'EPSG:4326'
                            ? 'urn:x-ogc:def:crs:EPSG:4326'
                            : srs;

                    const geoLayer =
                        getStoredLayer(layerName).getDescribeFeatureType();

                    if (!geoLayer) {
                        throw new Error(I18N.errors.layerNotFound);
                    }

                    const options = {
                        featureNS: geoLayer.namespace,
                        featureType: layerName,
                        srsName: srs,
                        featurePrefix: null,
                        nativeElements: null,
                        version: this.getAdvanced().wfsTransactionVersion
                    };

                    const transaction = this._formatWFS.writeTransaction(
                        this._insertFeatures,
                        this._updateFeatures,
                        this._deleteFeatures,
                        options
                    );

                    let payload = this._xs.serializeToString(transaction);
                    const geomType = geoLayer.geomType;
                    const geomField = geoLayer.geomField;

                    // Ugly fix to support GeometryCollection on GML
                    // See https://github.com/openlayers/openlayers/issues/4220
                    if (geomType === GeometryType.GeometryCollection) {
                        if (action === Transact.Insert) {
                            payload = payload.replace(
                                /<geometry>/g,
                                `<geometry><MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`
                            );
                            payload = payload.replace(
                                /<\/geometry>/g,
                                `</geometryMember></MultiGeometry></geometry>`
                            );
                        } else if (action === Transact.Update) {
                            const gmemberIn = `<MultiGeometry xmlns="http://www.opengis.net/gml" srsName="${srs}"><geometryMember>`;
                            const gmemberOut = `</geometryMember></MultiGeometry>`;

                            payload = payload.replace(
                                /(.*)(<Name>geometry<\/Name><Value>)(.*?)(<\/Value>)(.*)/g,
                                `$1$2${gmemberIn}$3${gmemberOut}$4$5`
                            );
                        }
                    }

                    // Fixes geometry name, weird bug with GML:
                    // The property for the geometry column is always named "geometry"
                    if (action === Transact.Insert) {
                        payload = payload.replace(
                            /<(\/?)\bgeometry\b>/g,
                            `<$1${geomField}>`
                        );
                    } else {
                        payload = payload.replace(
                            /<Name>geometry<\/Name>/g,
                            `<Name>${geomField}</Name>`
                        );
                    }

                    // This has to be te same used before
                    if (
                        this.hasLockFeature &&
                        this.getUseLockFeature() &&
                        action !== Transact.Insert
                    ) {
                        payload = payload.replace(
                            `</Transaction>`,
                            `<LockId>${this._options.advanced.lockFeatureParams.LockId}</LockId></Transaction>`
                        );
                    }

                    const headers = {
                        'Content-Type': 'text/xml',
                        ...this.getHeaders()
                    };

                    const response = await fetch(this.getUrl(), {
                        method: 'POST',
                        body: payload,
                        headers: headers,
                        credentials: this._options.credentials
                    });

                    if (!response.ok) {
                        throw new Error(
                            I18N.errors.transaction + ' ' + response.status
                        );
                    }

                    const parseResponse =
                        this._formatWFS.readTransactionResponse(response);

                    if (!Object.keys(parseResponse).length) {
                        const responseStr = await response.text();
                        const findError = String(responseStr).match(
                            /<ows:ExceptionText>([\s\S]*?)<\/ows:ExceptionText>/
                        );

                        if (findError) {
                            throw new Error(findError[1]);
                        }
                    }

                    if (action !== Transact.Delete) {
                        for (const feature of features as Array<
                            Feature<Geometry>
                        >) {
                            getEditLayer().getSource().removeFeature(feature);
                        }
                    }

                    const wlayer = getStoredLayer(layerName);
                    0;

                    wlayer.refresh();

                    showLoading(false);

                    this._insertFeatures = [];
                    this._updateFeatures = [];
                    this._deleteFeatures = [];

                    this._countRequests = 0;

                    resolve(true);
                } catch (err) {
                    showError(err.message, err);
                    showLoading(false);
                    this._countRequests = 0;
                    reject();
                }
            }, 0);
        });
    }

    /**
     *
     * @param feature
     * @param geom
     * @private
     */
    _transformCircleToPolygon(feature: Feature<Geometry>, geom: Circle) {
        const geomConverted = fromCircle(geom);
        feature.setGeometry(geomConverted);
    }

    /**
     *
     * @param feature
     * @private
     * @param geom
     */
    _transformGeoemtryCollectionToGeometries(
        feature: Feature<Geometry>,
        geom: GeometryCollection
    ) {
        let geomConverted = geom.getGeometries()[0];

        if (geomConverted instanceof Circle) {
            geomConverted = fromCircle(geomConverted);
        }

        feature.setGeometry(geomConverted);
    }

    /**
     *
     * @param feature
     * @returns
     * @private
     */
    _cloneFeature(feature: Feature<Geometry>): Feature<Geometry> {
        removeFeatureFromEditList(feature);

        const featureProperties = feature.getProperties();

        delete featureProperties.boundedBy;
        delete featureProperties._layerName_;

        const clone = new Feature(featureProperties);
        clone.setId(feature.getId());

        return clone;
    }

    /**
     * Lock a feature in the geoserver before edit
     *
     * @param featureId
     * @param layerName
     * @param retry
     * @public
     */
    async lockFeature(
        featureId: string | number,
        layerName: string,
        retry = 0
    ): Promise<string> {
        const params = new URLSearchParams({
            service: 'wfs',
            version: this.getAdvanced().lockFeatureVersion,
            request: 'LockFeature',
            typeName: layerName,
            expiry: String(this._options.advanced.lockFeatureParams.expiry),
            LockId: this._options.advanced.lockFeatureParams.LockId,
            releaseAction:
                this._options.advanced.lockFeatureParams.releaseAction,
            exceptions: 'application/json',
            featureid: `${featureId}`
        });

        const url_fetch = this.getUrl() + '?' + params.toString();

        try {
            const response = await fetch(url_fetch, {
                headers: this._options.headers,
                credentials: this._options.credentials
            });

            if (!response.ok) {
                throw new Error(I18N.errors.lockFeature);
            }

            const data = await response.text();

            try {
                // First, check if is a JSON (with errors)
                const dataParsed = JSON.parse(data);

                if ('exceptions' in dataParsed) {
                    const exceptions = dataParsed.exceptions;
                    if (exceptions[0].code === 'CannotLockAllFeatures') {
                        // Maybe the Feature is already blocked, ant thats trigger error, so, we try one locking more time again
                        if (!retry) {
                            this.lockFeature(featureId, layerName, 1);
                        } else {
                            showError(I18N.errors.lockFeature, exceptions);
                        }
                    } else {
                        showError(exceptions[0].text, exceptions);
                    }
                }
            } catch (err) {
                /*
             
                let dataDoc = (new window.DOMParser()).parseFromString(data, 'text/xml');
             
                let lockId = dataDoc.getElementsByTagName('wfs:LockId');
             
                let featuresLocked: HTMLCollectionOf<Element> = dataDoc.getElementsByTagName('ogc:FeatureId');
             
                for (let featureLocked of featuresLocked as any) {
             
                    console.log(featureLocked.getAttribute('fid'));
             
                }
             
                */
            }

            return data;
        } catch (err) {
            showError(err.message, err);
        }
    }
}

/**
 * **_[interface]_**
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
        // 5 (minutes) by default
        expiry?: number | string;

        // 'Geoserver' by default
        LockId?: string;

        // 'SOME' by default
        releaseAction?: string;
    };
}

/**
 * **_[interface]_**
 * @public
 */
export interface GeoserverOptions {
    /**
     * Url for OWS services. This endpoint will recive the WFS, WFST and WMS requests
     *
     * This sets the attribute globally.
     * To use different parameters between different layers, set it within each layer.
     */
    url: string;

    /**
     * Advanced options for geoserver requests
     *
     * This sets the attribute globally.
     * To use different parameters between different layers, set it within each layer.
     */
    advanced?: GeoServerAdvanced;

    /**
     * Url headers for GeoServer requests
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
     *
     * This sets the attribute globally.
     * To use different parameters between different layers, set it within each layer.
     */
    headers?: HeadersInit;

    /**
     * Credentials for fetch requests
     * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     *
     * This sets the attribute globally.
     * Default is 'same-origin'
     */
    credentials?: RequestCredentials;

    /**
     * Use LockFeatue request on GeoServer when selecting features. Prevents a feature from being edited
     * through a persistent feature lock. This is not always supportedd by the GeoServer.
     * See https://docs.geoserver.org/stable/en/user/services/wfs/reference.html
     */
    useLockFeature?: boolean;

    /**
     * Triggered before inserting new features to the Geoserver.
     * Use this to insert custom properties, modify the feature, etc.
     */
    beforeInsertFeature?(feature: Feature<Geometry>): Feature<Geometry>;
}
