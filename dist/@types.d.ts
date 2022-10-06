import { GeometryType } from './@enums';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
/**
 * @public
 */
export interface BaseGeoserverVendor {
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#cql-filter
     */
    cql_filter?: string;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#sortBy
     */
    sortBy?: string;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#featureid
     */
    featureid?: string;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#filter
     */
    filter?: string;
    /**
     * WMS: https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#format-options
     * WFS: https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html#format-options
     */
    format_options?: string;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#maxfeatures-and-startindex
     */
    maxFeatures?: string | number;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#maxfeatures-and-startindex
     */
    startIndex?: string | number;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#propertyname
     */
    propertyname?: string;
}
/**
 * **_[interface]_** - WFS geoserver options
 * https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html
 * @public
 *
 */
export interface WfsGeoserverVendor extends BaseGeoserverVendor {
    /**
     * https://docs.geoserver.org/latest/en/user/services/wfs/vendor.html#xml-request-validation
     */
    strict?: boolean;
}
/**
 * **_[interface]_** - WMS geoserver options
 * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html
 * @public
 */
export interface WmsGeoserverVendor extends BaseGeoserverVendor {
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#buffer
     */
    buffer?: string | number;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#env
     */
    env?: string;
    /**
     * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html#clip
     */
    clip?: string;
}
/**
 * **_[interface]_** - Geoserver original response on DescribeFeature request
 * @public
 */
export interface IGeoserverDescribeFeatureType {
    elementFormDefault: string;
    targetNamespace: string;
    targetPrefix: string;
    featureTypes: Array<{
        typeName: string;
        properties: Array<{
            name: string;
            nillable: boolean;
            maxOccurs: number;
            minOccurs: number;
            type: string;
            localType: string;
        }>;
    }>;
    /**
     * DescribeFeature request parsed
     */
    _parsed: {
        namespace: string;
        properties: any;
        geomType: GeometryType;
        geomField: string;
    };
}
/**
 * **_[interface]_**
 * @private
 */
export interface IWfstLayersList {
    [key: string]: WfsLayer | WmsLayer;
}
/**
 * **_[interface]_**
 * @private
 */
export interface IGeoserverOptions {
    hasTransaction?: boolean;
    hasLockFeature?: boolean;
    useLockFeature?: boolean;
}
/**
 * **_[interface]_** - Custom Language specified when creating a WFST instance
 * @public
 */
export interface I18n {
    /** Labels section */
    labels?: {
        select?: string;
        addElement?: string;
        editElement?: string;
        save?: string;
        delete?: string;
        cancel?: string;
        apply?: string;
        upload?: string;
        editMode?: string;
        confirmDelete?: string;
        geomTypeNotSupported?: string;
        editFields?: string;
        editGeom?: string;
        selectDrawType?: string;
        uploadToLayer?: string;
        uploadFeatures?: string;
        validFeatures?: string;
        invalidFeatures?: string;
        loading?: string;
        toggleVisibility?: string;
        close?: string;
    };
    /** Errors section */
    errors?: {
        capabilities?: string;
        wfst?: string;
        layer?: string;
        layerNotFound?: string;
        layerNotVisible?: string;
        noValidGeometry?: string;
        geoserver?: string;
        badFormat?: string;
        badFile?: string;
        lockFeature?: string;
        transaction?: string;
        getFeatures?: string;
    };
}
//# sourceMappingURL=@types.d.ts.map