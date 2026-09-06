import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import TileLayer from 'ol/layer/Tile.js';
import Geometry from 'ol/geom/Geometry.js';
import Polygon from 'ol/geom/Polygon.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import BaseEvent from 'ol/events/Event.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import { EventsKey } from 'ol/events.js';
import { LayerRenderEventTypes } from 'ol/render/EventType.js';
import { BaseLayerObjectEventTypes } from 'ol/layer/Base.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';

import { Mixin } from 'ts-mixer';

import WmsSource from './modules/base/WmsSource';
import BaseLayer, { BaseLayerEventTypes } from './modules/base/BaseLayer';
import { LayerOptions } from './ol-wfst';
import { showLoading } from './modules/loading';
import { showError } from './modules/errors';
import { I18N } from './modules/i18n';
import { getMap } from './modules/state';
import { WmsGeoserverVendor } from './@types';

/**
 * Layer to retrieve WMS information from geoservers
 * https://docs.geoserver.org/stable/en/user/services/wms/reference.html
 *
 * @fires layerRendered
 * @extends {ol/layer/Tile~TileLayer}
 * @param options
 */
export default class WmsLayer extends Mixin(BaseLayer, TileLayer<WmsSource>) {
    private _loadingCount = 0;
    private _loadedCount = 0;

    public beforeTransactFeature: LayerOptions['beforeTransactFeature'];
    public beforeShowFieldsModal: LayerOptions['beforeShowFieldsModal'];

    // Formats
    private _formatGeoJSON: GeoJSON;

    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;
    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            EventsKey
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, EventsKey> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError',
            ObjectEvent,
            void
        > &
        OnSignature<LayerRenderEventTypes, RenderEvent, void> &
        CombinedOnSignature<
            | EventTypes
            | BaseLayerEventTypes
            | BaseLayerObjectEventTypes
            | 'sourceready'
            | 'change:source'
            | 'change:preload'
            | 'change:useInterimTilesOnError'
            | LayerRenderEventTypes,
            void
        >;

    constructor(options: LayerOptions) {
        super({
            name: options.name,
            label: options.label || options.name,
            minZoom: options.minZoom,
            ...options
        });

        if (options.beforeTransactFeature) {
            this.beforeTransactFeature = options.beforeTransactFeature;
        }

        if (options.beforeShowFieldsModal) {
            this.beforeShowFieldsModal = options.beforeShowFieldsModal;
        }

        this._formatGeoJSON = new GeoJSON();

        const geoserver = options.geoserver;

        const source = new WmsSource({
            name: options.name,
            headers: geoserver.getHeaders(),
            credentials: geoserver.getCredentials(),
            geoserverUrl: geoserver.getUrl(),
            geoServerAdvanced: geoserver.getAdvanced(),
            geoserverVendor: options.geoserverVendor as WmsGeoserverVendor
        });

        this._loadingCount = 0;
        this._loadedCount = 0;

        source.on('tileloadstart', () => {
            this._loadingCount++;
            if (this._loadingCount === 1 && this.isVisibleByZoom()) {
                showLoading();
            }
        });

        source.on(['tileloadend', 'tileloaderror'], () => {
            this._loadedCount++;
            if (this._loadingCount === this._loadedCount) {
                this._loadingCount = 0;
                this._loadedCount = 0;
                setTimeout(() => {
                    this.dispatchEvent('layerRendered');
                }, 300);
            }
        });

        this.setSource(source);
    }

    /**
     * Get the features on the click area
     * @param evt
     * @returns
     * @private
     */
    async _getFeaturesByClickEvent(
        evt: MapBrowserEvent<PointerEvent>
    ): Promise<Feature<Geometry>[]> {
        const coordinate = evt.coordinate;

        const view = getMap().getView();

        // Si la vista es lejana, disminumos el buffer
        // Si es cercana, lo aumentamos, por ejemplo, para podeer clickear los vectores
        // y mejorar la sensibilidad en IOS
        const buffer = view.getZoom() > 10 ? 10 : 5;

        const source = this.getSource();

        // Fallback to support a bad name
        // https://openlayers.org/en/v5.3.0/apidoc/module-ol_source_ImageWMS-ImageWMS.html#getGetFeatureInfoUrl
        const fallbackOl5 =
            'getFeatureInfoUrl' in source
                ? 'getFeatureInfoUrl'
                : 'getGetFeatureInfoUrl';

        const url = source[fallbackOl5](
            coordinate,
            view.getResolution(),
            view.getProjection().getCode(),
            {
                INFO_FORMAT: 'application/json',
                BUFFER: buffer,
                FEATURE_COUNT: 1,
                EXCEPTIONS: 'application/json'
            }
        );

        return this._requestFeatures(url);
    }

    /**
     * Request the WFS features that intersect the given geometry, selecting
     * them with a WFS GetFeature + CQL INTERSECTS filter. Used to select
     * features from a WMS layer with a box or a freehand lasso.
     *
     * @param geometry Geometry in the map view projection
     * @returns
     * @private
     */
    async _getFeaturesInGeometry(
        geometry: Geometry
    ): Promise<Feature<Geometry>[]> {
        // Make sure the DescribeFeatureType is loaded to get the geometry
        // field, waiting for it if the layer is still initializing
        if (!this.getDescribeFeatureType()) {
            await this.getAndUpdateDescribeFeatureType();
        }

        const geomField = this.getDescribeFeatureType()?._parsed?.geomField;

        if (!geomField) {
            showError(`${I18N.errors.layer} "${this.get('name')}"`);
            return [];
        }

        const viewProj = getMap().getView().getProjection().getCode();
        const nativeSrs = this._getNativeSrs();

        // Work on a copy transformed to the layer native projection so the
        // server evaluates the INTERSECTS filter against the proper SRID
        const polygon = geometry.clone() as Polygon;
        if (nativeSrs !== viewProj) {
            try {
                polygon.transform(viewProj, nativeSrs);
            } catch (err) {
                console.error(err);
            }
        }

        const ring = polygon.getCoordinates()[0] || [];
        const ringWkt = ring.map(([x, y]) => `${x} ${y}`).join(', ');

        // Force the filter geometry CRS with the EWKT SRID prefix so the
        // server evaluates the INTERSECTS against the layer projection
        // instead of its native storage SRS
        const sridMatch =
            nativeSrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i) ??
            nativeSrs.match(/(\d+)$/);

        const cql = sridMatch
            ? `INTERSECTS(${geomField}, SRID=${sridMatch[1]};POLYGON((${ringWkt})))`
            : `INTERSECTS(${geomField}, POLYGON((${ringWkt})))`;

        const queryParams = new URLSearchParams({
            SERVICE: 'wfs',
            VERSION: '2.0.0',
            REQUEST: 'GetFeature',
            TYPENAME: this.get('name'),
            OUTPUTFORMAT: 'application/json',
            SRSNAME: viewProj,
            CQL_FILTER: cql
        });

        const url =
            this.getSource().getUrls()[0] + '?' + queryParams.toString();

        // The server returns the features in the map view projection (same as
        // the full resolution request), so no further transformation is needed
        return this._requestFeatures(url);
    }

    /**
     * Resolve the layer native SRS so spatial filters are evaluated in the
     * correct projection. It reads the DefaultCRS from the WFS capabilities,
     * falling back to the geoserver advanced projection option and finally to
     * the map view projection.
     *
     * @returns
     * @private
     */
    private _getNativeSrs(): string {
        const geoserver = this.getGeoserver();

        const viewProj = getMap().getView().getProjection().getCode();

        const layerName = String(this.get('name') || '');
        const layerLocalName = layerName.split(':').pop();

        const featureTypeList =
            geoserver.getParsedCapabilities()?.FeatureTypeList;

        const featureType = Array.isArray(featureTypeList)
            ? featureTypeList.find((ft: any) => {
                  const featureTypeName = String(ft?.Name || '');
                  return (
                      featureTypeName === layerName ||
                      featureTypeName === layerLocalName ||
                      featureTypeName.split(':').pop() === layerLocalName
                  );
              })
            : undefined;

        const defaultCrs = featureType?.DefaultCRS
            ? String(featureType.DefaultCRS)
            : '';

        const epsgMatch = defaultCrs.match(/(?:EPSG\s*::?\s*|EPSG\/0\/)(\d+)/i);

        if (epsgMatch) {
            return `EPSG:${epsgMatch[1]}`;
        }

        const advanced = geoserver.getAdvanced().projection;
        if (advanced) {
            return String(advanced);
        }

        return viewProj;
    }

    /**
     * Fetch and parse the features from a request url, replacing the
     * low resolution geometries (GetFeatureInfo) with the full resolution
     * ones requested by FEATUREID when possible.
     *
     * @param url
     * @returns
     * @private
     */
    private async _requestFeatures(
        url: string
    ): Promise<Feature<Geometry>[] | undefined> {
        const geoserver = this.getGeoserver();

        try {
            const response = await fetch(url, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });

            if (!response.ok) {
                throw new Error(
                    `${I18N.errors.getFeatures} ${response.status}`
                );
            }

            const data = await response.json();
            let features = this._parseFeaturesFromResponse(data);

            const featuresId = features.map((f) => f.getId());

            if (!featuresId.length) {
                return [];
            }

            const fullResList = await this._getFullResGeometryById(featuresId);

            if (fullResList) {
                features = fullResList;
            }

            return features;
        } catch (err) {
            showError(err.message, err);
        }
    }

    private _parseFeaturesFromResponse(data: string): Feature<Geometry>[] {
        return this._formatGeoJSON.readFeatures(data);
    }

    /**
     * Return the full accuracy geometries to replace the features from GetFeatureInfo
     * @param featuresId
     * @returns
     */
    private _getFullResGeometryById = async (
        featuresId: Array<string | number>
    ): Promise<Feature<Geometry>[] | false> => {
        const queryParams = new URLSearchParams({
            SERVICE: 'wfs',
            VERSION: '2.0.0',
            INFO_FORMAT: 'application/json',
            REQUEST: 'GetFeature',
            TYPENAME: this.get('name'),
            MAXFEATURES: String(featuresId.length),
            OUTPUTFORMAT: 'application/json',
            SRSNAME: getMap().getView().getProjection().getCode(),
            FEATUREID: featuresId.join(',')
        });

        const url =
            this.getSource().getUrls()[0] + '?' + queryParams.toString();

        try {
            const geoserver = this.getGeoserver();

            const response = await fetch(url, {
                headers: geoserver.getHeaders(),
                credentials: geoserver.getCredentials()
            });

            if (!response.ok) {
                throw new Error(
                    `${I18N.errors.getFeatures} ${response.status}`
                );
            }
            const data = await response.json();

            const fullById: { [key: string]: Feature<Geometry> } = {};
            this._parseFeaturesFromResponse(data).forEach((feature) => {
                fullById[String(feature.getId())] = feature;
            });

            return featuresId.map((id) => fullById[String(id)]).filter(Boolean);
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    /**
     * @public
     */
    refresh() {
        const source = this.getSource();

        // Refrescamos el wms
        source.refresh();

        // Force refresh the tiles
        const params = source.getParams();
        params.t = new Date().getMilliseconds();
        source.updateParams(params);
    }

    /**
     * Use this to update Geoserver Wfs Vendors (https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html)
     * and other arguements (https://docs.geoserver.org/stable/en/user/services/wfs/reference.html)
     * in all the getFeature requests.
     *
     * Example: you can use this to set a cql_filter, limit the numbers of features, etc.
     *
     * @public
     * @param paramName
     * @param value
     * @param refresh
     */
    setCustomParam(
        paramName: string,
        value: string = null,
        refresh = true
    ): URLSearchParams {
        const source = this.getSource();

        source.updateParams({
            [paramName]: value
        });

        if (refresh) {
            this.refresh();
        }

        return source.getParams();
    }
}
