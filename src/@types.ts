export interface BaseVendor {
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
 */
export type WfsVendor = BaseVendor;

/**
 * **_[interface]_** - WMS geoserver options
 * https://docs.geoserver.org/latest/en/user/services/wms/vendor.html
 * @public
 */
export interface WmsVendor extends BaseVendor {
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
 * **_[interface]_** - Geoserver response on DescribeFeature request
 * @protected
 */
export interface DescribeFeatureType {
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
}
