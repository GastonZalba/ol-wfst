import BaseObject from 'ol/Object';
export default class BaseSource extends BaseObject {
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setCqlFilter(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getCqlFilter(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setSortBy(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getSortBy(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFeatureId(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getFeatureId(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFilter(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getFilter(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFormatOptions(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getFormatOptions(): string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setMaxFeatures(value: number | string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getMaxFeatures(): number | string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStartIndex(value: number | string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getStartIndex(): number | string;
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setPropertyName(value: string, opt_silent: boolean): void;
    /**
     * @public
     * @returns
     */
    getPropertyName(): string;
}
export declare enum BaseSourceProperty {
    CQLFILTER = "cql_filter",
    SORTBY = "sortBy",
    FEATUREID = "featureid",
    FILTER = "filter",
    FORMATOPTIONS = "format_options",
    MAXFEATURES = "maxFeatures",
    STARTINDEX = "startIndex",
    PROPERTYNAME = "propertyname"
}
export declare type BaseSourceEventTypes = `change:${BaseSourceProperty.CQLFILTER}` | `change:${BaseSourceProperty.SORTBY}` | `change:${BaseSourceProperty.FEATUREID}` | `change:${BaseSourceProperty.FILTER}` | `change:${BaseSourceProperty.FORMATOPTIONS}` | `change:${BaseSourceProperty.MAXFEATURES}` | `change:${BaseSourceProperty.STARTINDEX}` | `change:${BaseSourceProperty.PROPERTYNAME}`;
//# sourceMappingURL=BaseSource.d.ts.map