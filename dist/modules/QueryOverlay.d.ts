import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import { Coordinate } from 'ol/coordinate.js';
/**
 * Popup overlay that shows the attributes of a queried feature and its
 * layer label. The geometry is highlighted separately on a dedicated layer.
 *
 * @extends {ol/Overlay~Overlay}
 * @param feature
 * @param coordinate
 * @param layer
 * @private
 */
export default class QueryOverlay extends Overlay {
    constructor(feature: Feature<Geometry>, coordinate: Coordinate, layer: {
        getDescribeFeatureType: () => any;
        get: (key: string) => any;
    });
}
//# sourceMappingURL=QueryOverlay.d.ts.map