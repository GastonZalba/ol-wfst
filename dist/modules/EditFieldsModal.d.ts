import Observable from 'ol/Observable.js';
import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import Modal from 'modal-vanilla';
import { Options } from '../ol-wfst';
/**
 * Shows a fields form in a modal window to allow changes in the properties of
 * one or several features. When editing multiple features, fields whose value
 * differs across the selection show the "multiple values" placeholder and only
 * the fields actually changed are applied to the whole selection.
 *
 * @param features
 * @private
 */
export declare class EditFieldsModal extends Observable {
    protected _options: Options;
    protected _modal: Modal;
    protected _features: Feature[];
    constructor(options: Options);
    show(features: Feature<Geometry> | Feature<Geometry>[]): void;
    private _dispatch;
}
//# sourceMappingURL=EditFieldsModal.d.ts.map