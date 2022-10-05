import BaseObject from 'ol/Object';

export default class BaseSource extends BaseObject {
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setCqlFilter(value: string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.CQLFILTER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getCqlFilter(): string {
        return this.get(BaseSourceProperty.CQLFILTER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setSortBy(value: string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.SORTBY, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getSortBy(): string {
        return this.get(BaseSourceProperty.SORTBY);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFeatureId(value: string, opt_silent: boolean) {
        this.set(BaseSourceProperty.FEATUREID, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFeatureId(): string {
        return this.get(BaseSourceProperty.FEATUREID);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFilter(value: string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.FILTER, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFilter(): string {
        return this.get(BaseSourceProperty.FILTER);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFormatOptions(value: string, opt_silent: boolean) {
        this.set(BaseSourceProperty.FORMATOPTIONS, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getFormatOptions(): string {
        return this.get(BaseSourceProperty.FORMATOPTIONS);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setMaxFeatures(value: number | string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.MAXFEATURES, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getMaxFeatures(): number | string {
        return this.get(BaseSourceProperty.MAXFEATURES);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStartIndex(value: number | string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.STARTINDEX, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getStartIndex(): number | string {
        return this.get(BaseSourceProperty.STARTINDEX);
    }

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setPropertyName(value: string, opt_silent: boolean): void {
        this.set(BaseSourceProperty.PROPERTYNAME, value, opt_silent);
    }

    /**
     * @public
     * @returns
     */
    getPropertyName(): string {
        return this.get(BaseSourceProperty.PROPERTYNAME);
    }
}

export enum BaseSourceProperty {
    CQLFILTER = 'cql_filter',
    SORTBY = 'sortBy',
    FEATUREID = 'featureid',
    FILTER = 'filter',
    FORMATOPTIONS = 'format_options',
    MAXFEATURES = 'maxFeatures',
    STARTINDEX = 'startIndex',
    PROPERTYNAME = 'propertyname'
}

export type BaseSourceEventTypes =
    | `change:${BaseSourceProperty.CQLFILTER}`
    | `change:${BaseSourceProperty.SORTBY}`
    | `change:${BaseSourceProperty.FEATUREID}`
    | `change:${BaseSourceProperty.FILTER}`
    | `change:${BaseSourceProperty.FORMATOPTIONS}`
    | `change:${BaseSourceProperty.MAXFEATURES}`
    | `change:${BaseSourceProperty.STARTINDEX}`
    | `change:${BaseSourceProperty.PROPERTYNAME}`;
