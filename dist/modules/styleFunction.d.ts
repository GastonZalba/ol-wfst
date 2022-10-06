import { Geometry } from 'ol/geom';
import { Style } from 'ol/style';
import { Feature } from 'ol';
/**
 * Master style that handles two modes on the Edit Layer:
 * - one is the basic, showing only the vertices
 * - and the other when modify is active, showing bigger vertices
 *
 * @param feature
 * @private
 */
export default function styleFunction(feature: Feature<Geometry>): Array<Style>;
//# sourceMappingURL=styleFunction.d.ts.map