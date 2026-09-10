import { getCenter } from 'ol/extent.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import { Coordinate } from 'ol/coordinate.js';

import { I18N } from './i18n';
import { BaseLayerProperty } from './base/BaseLayer';

const QUERY_OVERLAY_ID = 'ol-wfst--query-overlay';

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
    constructor(
        feature: Feature<Geometry>,
        coordinate: Coordinate,
        layer: { getDescribeFeatureType: () => any; get: (key: string) => any }
    ) {
        const describeFeatureType = layer.getDescribeFeatureType();
        const parsed = describeFeatureType?._parsed;
        const fields = parsed?.properties || [];
        const geomField = parsed?.geomField;

        const rows = fields
            .filter((field: { name: string }) => field.name !== geomField)
            .map((field: { name: string }) => {
                let value = feature.get(field.name);

                if (value === undefined || value === null) {
                    value = '';
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                return (
                    <div className="ol-wfst--query-popup-row">
                        <span className="ol-wfst--query-popup-key">
                            {field.name}
                        </span>
                        <span className="ol-wfst--query-popup-value">
                            {String(value)}
                        </span>
                    </div>
                );
            });

        super({
            id: QUERY_OVERLAY_ID,
            position:
                coordinate || getCenter(feature.getGeometry().getExtent()),
            positioning: 'bottom-center',
            offset: [0, -14],
            stopEvent: true,
            autoPan: true,
            element: (
                <div className="ol-wfst--query-popup">
                    <div className="ol-wfst--query-popup-head">
                        <div className="ol-wfst--query-popup-title">
                            {I18N.labels.featureInfo}
                        </div>
                        <button
                            className="ol-wfst--query-popup-close"
                            type="button"
                            title={I18N.labels.close}
                            onClick={() => {
                                this.dispatchEvent('close');
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div className="ol-wfst--query-popup-subtitle">
                        <b>{layer.get(BaseLayerProperty.LABEL)}</b>
                        <i>{String(feature.getId())}</i>
                    </div>
                    <div className="ol-wfst--query-popup-body">{rows}</div>
                </div>
            )
        });
    }
}
