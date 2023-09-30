import { Geometry } from 'ol/geom.js';
import Feature from 'ol/Feature.js';
import Observable from 'ol/Observable.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import WFS from 'ol/format/WFS.js';
import { Options } from '../ol-wfst';
export default class Uploads extends Observable {
    protected _options: Options;
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;
    protected _processUpload: Options['processUpload'];
    constructor(options: Options);
    /**
     * Parse and check geometry of uploaded files
     *
     * @param evt
     * @public
     */
    process(evt: Event): Promise<void>;
    /**
     * Read data file
     * @param file
     * @public
     */
    _fileReader(file: File): Promise<string>;
    /**
     * Attemp to change the geometry feature to the layer
     * @param feature
     * @private
     */
    _fixGeometry(feature: Feature<Geometry>): Feature<Geometry>;
    /**
     * Check if the feature has the same geometry as the target layer
     * @param feature
     * @private
     */
    _checkGeometry(feature: Feature<Geometry>): boolean;
    /**
     * Confirm modal before transact to the GeoServer the features in the file
     *
     * @param content
     * @param featuresToInsert
     * @private
     */
    _initModal(content: string, featuresToInsert: Array<Feature<Geometry>>): void;
}
//# sourceMappingURL=Uploads.d.ts.map