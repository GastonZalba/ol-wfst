import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { TransactionResponse } from 'ol/format/WFS';
import Layer from 'ol/layer/Base';
import Geoserver from '../../Geoserver';
import { IGeoserverDescribeFeatureType } from '../../@types';
import { TransactionType } from '../../@enums';
/**
 * Base class from which all layer types are derived.
 */
export default class BaseLayer extends Layer {
    /**
     * @private
     */
    _init(): void;
    /**
     * Request and store data layers obtained by DescribeFeatureType
     *
     * @public
     */
    getAndUpdateDescribeFeatureType(): Promise<void>;
    /**
     * @public
     * @returns
     */
    isVisibleByZoom(): boolean;
    /**
     *
     * @param mode
     * @param features
     * @public
     */
    transactFeatures(mode: TransactionType, features: Array<Feature<Geometry>> | Feature<Geometry>): Promise<TransactionResponse | false>;
    insertFeatures(features: Array<Feature<Geometry>> | Feature<Geometry>): Promise<TransactionResponse | false>;
    /**
     * @public
     * @param featureId
     * @returns
     */
    maybeLockFeature(featureId: string | number): Promise<string>;
    /**
     *
     * @returns
     * @public
     */
    getGeoserver(): Geoserver;
    /**
     *
     * @returns
     * @public
     */
    getDescribeFeatureType(): IGeoserverDescribeFeatureType;
}
export declare enum BaseLayerProperty {
    NAME = "name",
    LABEL = "label",
    DESCRIBEFEATURETYPE = "describeFeatureType",
    ISVISIBLE = "isVisible",
    GEOSERVER = "geoserver"
}
export declare type BaseLayerEventTypes = 'layerRendered' | `change:${BaseLayerProperty.DESCRIBEFEATURETYPE}` | `change:${BaseLayerProperty.ISVISIBLE}`;
//# sourceMappingURL=BaseLayer.d.ts.map