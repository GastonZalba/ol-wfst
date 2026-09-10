import Overlay from 'ol/Overlay.js';
import Geometry from 'ol/geom/Geometry.js';
import Feature from 'ol/Feature.js';
import { Coordinate } from 'ol/coordinate.js';

// Images
import addLineSvg from '../assets/images/addLine.svg';
import { I18N } from './i18n';

export type ExtendLineSide = 'start' | 'end';

export default class ExtendLineOverlay extends Overlay {
    feature: Feature<Geometry>;
    side: ExtendLineSide;
    component: number;

    constructor(
        feature: Feature<Geometry>,
        coordinate: Coordinate,
        side: ExtendLineSide,
        component = 0,
        onClick: (side: ExtendLineSide) => void
    ) {
        super({
            position: coordinate,
            positioning: 'center-center',
            stopEvent: true,
            element: (
                <div className="ol-wfst--extend-button-cnt">
                    <button
                        className="ol-wfst--extend-button"
                        type="button"
                        title={I18N.labels.continueLine}
                        onClick={() => {
                            onClick(side);
                        }}
                    >
                        {addLineSvg()}
                    </button>
                </div>
            )
        });

        this.feature = feature;
        this.side = side;
        this.component = component;
    }
}
