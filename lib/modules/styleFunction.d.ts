import { Geometry, MultiPoint } from 'ol/geom.js';
import { Style } from 'ol/style.js';
import Feature, { FeatureLike } from 'ol/Feature.js';
/**
 * Modern vertex handle mimicking the round "extend line" buttons shown at
 * line endpoints: a soft halo for depth and a white disc with a subtle
 * border. When `highlighted` is `true` (e.g. hovering a vertex with the
 * Modify interaction) the handle gets bigger with a stronger halo and a
 * darker border.
 *
 * @param highlighted Whether to render the bigger/highlighted state
 * @param geometry Style geometry function to position the handles
 * @private
 */
export declare const editVertexStyles: (highlighted?: boolean, geometry?: (feature: FeatureLike) => Geometry) => Array<Style>;
/**
 * Extract a `MultiPoint` with every vertex of the given feature geometry
 * (polygons and multi-line strings are flattened). Returns `undefined` when
 * the geometry has no coordinates.
 *
 * @param feature
 * @private
 */
export declare const getFeatureVertices: (feature: FeatureLike) => MultiPoint | undefined;
/**
 * Master style that handles two modes on the Edit Layer:
 * - one is the basic, showing only the vertices
 * - and the other when modify is active, showing bigger vertices
 *
 * When `hovered` is `true`, a white/red halo is prepended to highlight the
 * feature, indicating it can be selected on click.
 *
 * @param feature
 * @param hovered
 * @private
 */
export default function styleFunction(feature: Feature<Geometry>, hovered?: boolean): Array<Style>;
/**
 * Style used to highlight a feature after a query, drawn on a dedicated
 * highlight layer so the source layers keep their own rendering.
 *
 * @param feature
 * @private
 */
export declare function queryStyleFunction(_feature: Feature<Geometry>): Array<Style>;
//# sourceMappingURL=styleFunction.d.ts.map