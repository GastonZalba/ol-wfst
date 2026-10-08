import Observable from 'ol/Observable.js';
import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import Modal from 'modal-vanilla';
import { getStoredLayer } from './state';
import { Options } from '../ol-wfst';
import { IProperty } from '../@types';
/**
 * Shows a fields form in a modal window to allow changes in the properties of
 * one or several features. When editing multiple features, a "table mode"
 * button renders one feature per row, spreadsheet-style, so each feature can be
 * edited separately (like an Excel sheet). Otherwise a single form is shown
 * where fields whose value differs across the selection show the "multiple
 * values" placeholder and only the fields actually changed are applied to the
 * whole selection.
 *
 * @param features
 * @private
 */
export declare class EditFieldsModal extends Observable {
    protected _options: Options;
    protected _modal: Modal;
    protected _features: Feature[];
    protected _tableMode: boolean;
    protected _fieldList: IProperty[];
    protected _layer: ReturnType<typeof getStoredLayer>;
    constructor(options: Options);
    show(features: Feature<Geometry> | Feature<Geometry>[]): void;
    protected _renderBody(): void;
    protected _toggleTable(): void;
    protected _renderForm(): HTMLElement;
    protected _renderTable(): HTMLElement;
    protected _inputType(typeXsd: string): string;
    private _saveForm;
    private _saveTable;
    private _dispatch;
}
//# sourceMappingURL=EditFieldsModal.d.ts.map