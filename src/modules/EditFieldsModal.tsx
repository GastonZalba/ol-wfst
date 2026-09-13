// Ol
import Observable from 'ol/Observable.js';
import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import { VectorSourceEvent } from 'ol/source/Vector.js';

// External
import Modal from 'modal-vanilla';

import { addFeatureToEditedList, getStoredLayer } from './state';
import { Options } from '../ol-wfst';
import { I18N, I18N_ } from './i18n';
import { IProperty } from '../@types';

// Images
import tableSvg from '../assets/images/table.svg';
import formSvg from '../assets/images/form.svg';

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
export class EditFieldsModal extends Observable {
    protected _options: Options;
    protected _modal: Modal;
    protected _features: Feature[];
    protected _tableMode: boolean;
    protected _fieldList: IProperty[];
    protected _layer: ReturnType<typeof getStoredLayer>;

    constructor(options: Options) {
        super();

        this._options = options;
        this._tableMode = false;
        this._fieldList = [];

        this._modal = new Modal({
            ...this._options.modal,
            header: true,
            headerClose: true,
            title: '',
            content: '<div></div>',
            footer: `
                <button
                    type="button"
                    class="btn btn-sm btn-third"
                    data-action="delete"
                    data-dismiss="modal"
                >
                    ${I18N.labels.delete}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    data-dismiss="modal"
                >
                    ${I18N.labels.cancel}
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    data-action="save"
                    data-dismiss="modal"
                >
                    ${I18N.labels.save}
                </button>
            `
        });

        this._modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                if (this._tableMode) {
                    this._saveTable(modal);
                } else {
                    this._saveForm(modal);
                }

                this._dispatch('save', this._features);
            } else if (event.target.dataset.action === 'delete') {
                this._dispatch('delete', this._features);
            }
        });
    }

    show(features: Feature<Geometry> | Feature<Geometry>[]) {
        this._features = Array.isArray(features) ? features : [features];

        // Keep the form (current behavior) as default entry view
        this._tableMode = false;

        const multiple = this._features.length > 1;

        const modalTitle = multiple
            ? I18N_('editElements', this._features.length)
            : `${I18N.labels.editElement} ${this._features[0].getId()} `;

        const layerName = this._features[0].get('_layerName_');

        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const describeFeatureType = layer.getDescribeFeatureType()._parsed;

        this._fieldList = describeFeatureType.properties.filter(
            (field) => field.name !== describeFeatureType.geomField
        );

        this._layer = layer;

        this._modal._html.dialog.classList.remove('ol-wfst--edit-table-modal');

        this._renderBody();
        this._modal._html.header.innerHTML = modalTitle;
        this._modal.show();
    }

    protected _renderBody(): void {
        const multiple = this._features.length > 1;

        this._modal._html.body.innerHTML = '';
        this._modal._html.body.append(
            <div>
                {multiple && (
                    <div className="ol-wfst--edit-modal-notice">
                        <span className="ol-wfst--edit-modal-notice-txt">
                            {I18N_('multipleEditNotice', this._features.length)}
                        </span>
                        <button
                            type="button"
                            className="ol-wfst--edit-modal-toolbar-btn"
                            title={
                                this._tableMode
                                    ? I18N.labels.formMode
                                    : I18N.labels.tableMode
                            }
                            onClick={() => this._toggleTable()}
                        >
                            {this._tableMode ? formSvg() : tableSvg()}
                        </button>
                    </div>
                )}
                {this._tableMode ? this._renderTable() : this._renderForm()}
            </div>
        );
    }

    protected _toggleTable(): void {
        this._tableMode = !this._tableMode;
        this._modal._html.dialog.classList.toggle(
            'ol-wfst--edit-table-modal',
            this._tableMode
        );
        this._renderBody();
    }

    protected _renderForm(): HTMLElement {
        const multiple = this._features.length > 1;

        return (
            <form autocomplete="false">
                {this._fieldList.flatMap((field) => {
                    const key = field.name;

                    const values = this._features.map((feature) =>
                        feature.get(key)
                    );
                    const uniqueValues = Array.from(
                        new Set(values.map((value) => String(value ?? '')))
                    );
                    const hasMultipleValues =
                        multiple && uniqueValues.length > 1;

                    const value = hasMultipleValues
                        ? null
                        : uniqueValues[0] || null;

                    const type = this._inputType(field.type);

                    let input: HTMLElement = (
                        <input
                            placeholder={
                                hasMultipleValues
                                    ? I18N.labels.multipleValues
                                    : 'NULL'
                            }
                            className={
                                'ol-wfst--input-field-input' +
                                (hasMultipleValues
                                    ? ' ol-wfst--input-multiple'
                                    : '')
                            }
                            type={type}
                            name={key}
                            value={value}
                            data-multiple={hasMultipleValues ? 'true' : null}
                        />
                    );

                    if (this._layer.beforeShowFieldsModal) {
                        const hookInput = this._layer.beforeShowFieldsModal(
                            field,
                            value,
                            input
                        );

                        if (!hookInput) {
                            return [];
                        }

                        if (typeof hookInput === 'string') {
                            input = new DOMParser().parseFromString(
                                hookInput,
                                'text/html'
                            ).body.childNodes[0] as HTMLElement;
                        } else {
                            input = hookInput;
                        }
                    }

                    if (hasMultipleValues) {
                        input.dataset.multiple = 'true';
                        input.classList.add('ol-wfst--input-multiple');
                    }

                    return (
                        <div className="ol-wfst--input-field-container">
                            <label
                                className="ol-wfst--input-field-label"
                                htmlFor={key}
                            >
                                {key}
                            </label>
                            {input}
                        </div>
                    );
                })}
            </form>
        );
    }

    protected _renderTable(): HTMLElement {
        return (
            <form autocomplete="false">
                <div className="ol-wfst--edit-table-wrap">
                    <table className="ol-wfst--edit-table">
                        <thead>
                            <tr>
                                <th>{I18N.labels.feature}</th>
                                <th>{I18N.labels.geometry}</th>
                                {this._fieldList.map((field) => (
                                    <th>{field.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this._features.map((feature, idx) => (
                                <tr>
                                    <td className="ol-wfst--edit-table-fid">
                                        {String(feature.getId() ?? idx + 1)}
                                    </td>
                                    <td className="ol-wfst--edit-table-geom">
                                        {feature.getGeometry()?.getType() ??
                                            '-'}
                                    </td>
                                    {this._fieldList.map((field) => {
                                        const key = field.name;
                                        const type = this._inputType(
                                            field.type
                                        );
                                        const value = feature.get(key) ?? '';

                                        let input: HTMLElement = (
                                            <input
                                                type={type}
                                                name={key}
                                                className="ol-wfst--input-field-input"
                                                data-feat-idx={String(idx)}
                                                value={String(value)}
                                            />
                                        );

                                        if (this._layer.beforeShowFieldsModal) {
                                            const hookInput =
                                                this._layer.beforeShowFieldsModal(
                                                    field,
                                                    value,
                                                    input
                                                );

                                            if (!hookInput) {
                                                return <td />;
                                            }

                                            if (typeof hookInput === 'string') {
                                                input =
                                                    new DOMParser().parseFromString(
                                                        hookInput,
                                                        'text/html'
                                                    ).body
                                                        .childNodes[0] as HTMLElement;
                                            } else {
                                                input = hookInput;
                                            }

                                            input.setAttribute('name', key);
                                            input.setAttribute(
                                                'data-feat-idx',
                                                String(idx)
                                            );
                                            input.classList.add(
                                                'ol-wfst--input-field-input'
                                            );
                                        }

                                        return <td>{input}</td>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
        );
    }

    protected _inputType(typeXsd: string): string {
        switch (typeXsd) {
            case 'xsd:double':
            case 'xsd:number':
            case 'xsd:int':
                return 'number';
            case 'xsd:date':
                return 'date';
            case 'xsd:date-time':
                return 'datetime';
            case 'xsd:string':
            default:
                return 'text';
        }
    }

    private _saveForm(modal: Modal): void {
        const formElements = modal.el.querySelector('form')
            .elements as HTMLFormElement[];

        const multipleFields = new Set(
            Array.from(formElements)
                .filter((el) => el.dataset.multiple === 'true')
                .map((el) => el.name)
        );

        Array.from(formElements).forEach((el) => {
            const value = el.value;
            const field = el.name;

            // Do not overwrite untouched fields that had
            // multiple values in the selection
            if (multipleFields.has(field) && value === '') {
                return;
            }

            this._features.forEach((feature) => {
                if (feature.get(field) !== value) {
                    feature.set(field, value, /* isSilent = */ true);
                }
            });
        });

        this._features.forEach((feature) => {
            feature.changed();
            addFeatureToEditedList(feature);
        });
    }

    private _saveTable(modal: Modal): void {
        const inputList = Array.from(
            modal.el.querySelectorAll('form input[data-feat-idx]')
        ) as HTMLInputElement[];

        const grouped = new Map<number, HTMLInputElement[]>();

        inputList.forEach((input) => {
            const idx = Number(input.dataset.featIdx);

            if (!grouped.has(idx)) {
                grouped.set(idx, []);
            }

            grouped.get(idx).push(input);
        });

        grouped.forEach((inputs, idx) => {
            const feature = this._features[idx];

            if (!feature) {
                return;
            }

            inputs.forEach((input) => {
                const field = input.name;
                const value = input.value;

                if (feature.get(field) !== value) {
                    feature.set(field, value, /* isSilent = */ true);
                }
            });
        });

        this._features.forEach((feature) => {
            feature.changed();
            addFeatureToEditedList(feature);
        });
    }

    private _dispatch(
        type: 'save' | 'delete',
        features: Feature<Geometry>[]
    ): void {
        const evt = new VectorSourceEvent(type, features[0]);
        (evt as any).features = features;
        this.dispatchEvent(evt);
    }
}
