import Overlay from 'ol/Overlay.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import { Coordinate } from 'ol/coordinate.js';
export type ExtendLineSide = 'start' | 'end';
export default class ExtendLineOverlay extends Overlay {
    feature: Feature<Geometry>;
    side: ExtendLineSide;
    component: number;
    constructor(feature: Feature<Geometry>, coordinate: Coordinate, side: ExtendLineSide, component: number, onClick: (side: ExtendLineSide) => void);
}
//# sourceMappingURL=ExtendLineOverlay.d.ts.map