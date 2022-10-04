const baseSource = {
    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setCqlFilter(value: string, opt_silent: boolean): void {
        this.set('cql_filter_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getCqlFilter(): string {
        return this.get('cql_filter_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setSortBy(value: string, opt_silent: boolean): void {
        this.set('sortBy_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getSortBy(): string {
        return this.get('sortBy_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFeatureId(value, opt_silent: boolean) {
        this.set('featureid_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getFeatureId(): string {
        return this.get('featureid_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFilter(value, opt_silent: boolean): void {
        this.set('filter_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getFilter(): string {
        return this.get('filter_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setFormatOptions(value, opt_silent: boolean) {
        this.set('format_options_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getFormatOptions(): string {
        return this.get('format_options_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setMaxFeatures(value, opt_silent: boolean): void {
        this.set('maxFeatures_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getMaxFeatures(): string {
        return this.get('maxFeatures_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setStartIndex(value, opt_silent: boolean): void {
        this.set('startIndex_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getStartIndex(): string {
        return this.get('startIndex_');
    },

    /**
     * @public
     * @param value
     * @param opt_silent
     */
    setPropertyName(value: string, opt_silent: boolean): void {
        this.set('propertyname_', value, opt_silent);
    },

    /**
     * @public
     * @returns
     */
    getPropertyName(): string {
        return this.get('propertyname_');
    }
};

export default baseSource;
export type TBaseSource = typeof baseSource;
