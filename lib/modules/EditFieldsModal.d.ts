import { Feature, Observable } from 'ol';
import { Geometry } from 'ol/geom';
import Modal from 'modal-vanilla';
import { Options } from '../ol-wfst';
/**
 * Shows a fields form in a modal window to allow changes in the properties of the feature.
 *
 * @param feature
 * @private
 */
export declare class EditFieldsModal extends Observable {
    protected _options: Options['modal'];
    protected _modal: Modal;
    protected _feature: Feature;
    constructor(options: Options['modal']);
    show(feature: Feature<Geometry>): void;
}
//# sourceMappingURL=EditFieldsModal.d.ts.map