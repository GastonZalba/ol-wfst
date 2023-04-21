import { getCenter } from 'ol/extent.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import Overlay from 'ol/Overlay.js';
import { Coordinate } from 'ol/coordinate.js';

// Images
import editFieldsSvg from '../assets/images/editFields.svg';
import editGeomSvg from '../assets/images/editGeom.svg';
import { I18N } from './i18n';

import myPragma from '../myPragma';

export default class EditOverlay extends Overlay {
    constructor(feature: Feature<Geometry>, coordinate: Coordinate = null) {
        super({
            id: feature.getId(),
            position:
                coordinate || getCenter(feature.getGeometry().getExtent()),
            positioning: 'center-center',
            offset: [0, -40],
            stopEvent: true,
            element: (
                <div>
                    <div
                        className="ol-wfst--edit-button-cnt"
                        onClick={() => {
                            this.dispatchEvent('editFields');
                        }}
                    >
                        <button
                            className="ol-wfst--edit-button"
                            type="button"
                            title={I18N.labels.editFields}
                        >
                            <img
                                src={editFieldsSvg as string}
                                alt={I18N.labels.editFields}
                            />
                        </button>
                    </div>
                    <div
                        className="ol-wfst--edit-button-cnt"
                        onClick={() => {
                            this.dispatchEvent('editGeom');
                        }}
                    >
                        <button
                            class="ol-wfst--edit-button"
                            type="button"
                            title={I18N.labels.editGeom}
                        >
                            <img
                                src={editGeomSvg as string}
                                alt={I18N.labels.editGeom}
                            />
                        </button>
                    </div>
                </div>
            )
        });
    }
}
