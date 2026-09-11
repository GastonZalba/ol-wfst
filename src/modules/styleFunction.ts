// Ol
import {
    Geometry,
    GeometryCollection,
    LineString,
    MultiLineString,
    MultiPoint,
    MultiPolygon,
    Polygon
} from 'ol/geom.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import Feature, { FeatureLike } from 'ol/Feature.js';
import { Coordinate } from 'ol/coordinate.js';

import { GeometryType } from '../@enums';
import { getMode, Modes } from './state';

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
export const editVertexStyles = (
    highlighted = false,
    geometry?: (feature: FeatureLike) => Geometry
): Array<Style> => {
    const halo = highlighted ? 10 : 8;
    const haloColor = highlighted
        ? 'rgba(0, 0, 0, 0.40)'
        : 'rgba(0, 0, 0, 0.28)';

    const radius = highlighted ? 7 : 6;
    const border = highlighted ? '#4b5563' : '#b3b3b3';
    const borderWidth = highlighted ? 2 : 1.5;

    return [
        new Style({
            image: new CircleStyle({
                radius: halo,
                fill: new Fill({
                    color: haloColor
                })
            }),
            ...(geometry ? { geometry } : {})
        }),
        new Style({
            image: new CircleStyle({
                radius: radius,
                fill: new Fill({
                    color: '#ffffff'
                }),
                stroke: new Stroke({
                    width: borderWidth,
                    color: border
                })
            }),
            ...(geometry ? { geometry } : {})
        })
    ];
};

/**
 * Extract a `MultiPoint` with every vertex of the given feature geometry
 * (polygons and multi-line strings are flattened). Returns `undefined` when
 * the geometry has no coordinates.
 *
 * @param feature
 * @private
 */
export const getFeatureVertices = (
    feature: FeatureLike
): MultiPoint | undefined => {
    let geometry = feature.getGeometry();

    if (geometry instanceof GeometryCollection) {
        geometry = geometry.getGeometries()[0];
    }

    const coordinates = (geometry as LineString).getCoordinates();
    let flatCoordinates: Coordinate[] | number[] = null;

    if (geometry instanceof Polygon || geometry instanceof MultiLineString) {
        flatCoordinates = coordinates.flat(1);
    } else if (geometry instanceof MultiPolygon) {
        flatCoordinates = coordinates.flat(2);
    } else {
        flatCoordinates = coordinates;
    }

    if (!flatCoordinates || !flatCoordinates.length) {
        return;
    }

    return new MultiPoint(flatCoordinates as Coordinate[]);
};

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
export default function styleFunction(
    feature: Feature<Geometry>,
    hovered = false
): Array<Style> {
    let geometry = feature.getGeometry();
    let type = geometry.getType();

    if (geometry instanceof GeometryCollection) {
        geometry = geometry.getGeometries()[0];
        type = geometry.getType();
    }

    const haloStyle = (): Array<Style> => {
        return [
            new Style({
                image: new CircleStyle({
                    radius: 9,
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.9)'
                    }),
                    stroke: new Stroke({
                        color: '#ff0000',
                        width: 3
                    })
                }),
                stroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.9)',
                    width: 8
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.9)'
                })
            })
        ];
    };

    switch (type) {
        case GeometryType.Point:
        case GeometryType.MultiPoint:
            if (getMode() === Modes.Edit) {
                return editVertexStyles();
            } else {
                return [
                    ...(hovered ? haloStyle() : []),
                    new Style({
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                                color: '#ff0000'
                            })
                        })
                    }),
                    new Style({
                        image: new CircleStyle({
                            radius: 2,
                            fill: new Fill({
                                color: '#000000'
                            })
                        })
                    })
                ];
            }
        default:
            // If editing mode is active, show bigger vertex
            if (getMode() == Modes.Draw || getMode() == Modes.Edit) {
                return [
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba( 255, 0, 0, 1)',
                            width: 4
                        }),
                        fill: new Fill({
                            color: 'rgba(255, 0, 0, 0.7)'
                        })
                    }),
                    ...editVertexStyles(false, getFeatureVertices),
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba(255, 255, 255, 0.7)',
                            width: 2
                        })
                    })
                ];
            } else {
                return [
                    ...(hovered ? haloStyle() : []),
                    new Style({
                        image: new CircleStyle({
                            radius: 2,
                            fill: new Fill({
                                color: '#000000'
                            })
                        }),
                        geometry: (feature) => getFeatureVertices(feature)
                    }),
                    new Style({
                        stroke: new Stroke({
                            color: '#ff0000',
                            width: 4
                        }),
                        fill: new Fill({
                            color: 'rgba(255, 0, 0, 0.7)'
                        })
                    })
                ];
            }
    }
}

/**
 * Style used to highlight a feature after a query, drawn on a dedicated
 * highlight layer so the source layers keep their own rendering.
 *
 * @param feature
 * @private
 */
export function queryStyleFunction(_feature: Feature<Geometry>): Array<Style> {
    return [
        new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: 'rgba(0, 170, 255, 0.4)'
                }),
                stroke: new Stroke({
                    color: '#0066cc',
                    width: 2
                })
            }),
            stroke: new Stroke({
                color: '#00aaff',
                width: 4
            }),
            fill: new Fill({
                color: 'rgba(0, 170, 255, 0.3)'
            })
        })
    ];
}
