// Ol
import {
    Geometry,
    GeometryCollection,
    LineString,
    MultiLineString,
    MultiPoint,
    MultiPolygon,
    Polygon
} from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Coordinate } from 'ol/coordinate';

import { GeometryType } from '../@enums';
import { getMode, Modes } from './state';

/**
 * Master style that handles two modes on the Edit Layer:
 * - one is the basic, showing only the vertices
 * - and the other when modify is active, showing bigger vertices
 *
 * @param feature
 * @private
 */
export default function styleFunction(
    feature: Feature<Geometry>
): Array<Style> {
    const getVertexs = (feature: FeatureLike) => {
        let geometry = feature.getGeometry();

        if (geometry instanceof GeometryCollection) {
            geometry = geometry.getGeometries()[0];
        }

        const coordinates = (geometry as LineString).getCoordinates();
        let flatCoordinates: Coordinate[] | number[] = null;

        if (
            geometry instanceof Polygon ||
            geometry instanceof MultiLineString
        ) {
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

    let geometry = feature.getGeometry();
    let type = geometry.getType();

    if (geometry instanceof GeometryCollection) {
        geometry = geometry.getGeometries()[0];
        type = geometry.getType();
    }

    switch (type) {
        case GeometryType.Point:
        case GeometryType.MultiPoint:
            if (getMode() === Modes.Edit) {
                return [
                    new Style({
                        image: new CircleStyle({
                            radius: 6,
                            fill: new Fill({
                                color: '#000000'
                            })
                        })
                    }),
                    new Style({
                        image: new CircleStyle({
                            radius: 4,
                            fill: new Fill({
                                color: '#ff0000'
                            })
                        })
                    })
                ];
            } else {
                return [
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
                    new Style({
                        image: new CircleStyle({
                            radius: 4,
                            fill: new Fill({
                                color: '#ff0000'
                            }),
                            stroke: new Stroke({
                                width: 2,
                                color: 'rgba(5, 5, 5, 0.9)'
                            })
                        }),
                        geometry: (feature) => getVertexs(feature)
                    }),
                    new Style({
                        stroke: new Stroke({
                            color: 'rgba(255, 255, 255, 0.7)',
                            width: 2
                        })
                    })
                ];
            } else {
                return [
                    new Style({
                        image: new CircleStyle({
                            radius: 2,
                            fill: new Fill({
                                color: '#000000'
                            })
                        }),
                        geometry: (feature) => getVertexs(feature)
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
