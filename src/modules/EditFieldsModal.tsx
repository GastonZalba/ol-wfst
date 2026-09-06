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

/**
 * Shows a fields form in a modal window to allow changes in the properties of
 * one or several features. When editing multiple features, fields whose value
 * differs across the selection show the "multiple values" placeholder and only
 * the fields actually changed are applied to the whole selection.
 *
 * @param features
 * @private
 */
export class EditFieldsModal extends Observable {
    protected _options: Options;
    protected _modal: Modal;
    protected _features: Feature[];

    constructor(options: Options) {
        super();

        this._options = options;

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

                this._dispatch('save', this._features);
            } else if (event.target.dataset.action === 'delete') {
                this._dispatch('delete', this._features);
            }
        });
    }

    show(features: Feature<Geometry> | Feature<Geometry>[]) {
        this._features = Array.isArray(features) ? features : [features];

        const multiple = this._features.length > 1;

        const modalTitle = multiple
            ? I18N_('editElements', this._features.length)
            : `${I18N.labels.editElement} ${this._features[0].getId()} `;

        const layerName = this._features[0].get('_layerName_');

        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const describeFeatureType = layer.getDescribeFeatureType()._parsed;

        const fieldList = describeFeatureType.properties.filter(
            (field) => field.name !== describeFeatureType.geomField
        );

        this._modal._html.body.innerHTML = '';
        this._modal._html.body.append(
            <div>
                {multiple && (
                    <div className="ol-wfst--edit-modal-notice">
                        {I18N_('multipleEditNotice', this._features.length)}
                    </div>
                )}
                <form autocomplete="false">
                    {fieldList.flatMap((field) => {
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

                        const typeXsd = field.type;

                        let type: string;

                        switch (typeXsd) {
                            case 'xsd:double':
                            case 'xsd:number':
                            case 'xsd:int':
                                type = 'number';
                                break;
                            case 'xsd:date':
                                type = 'date';
                                break;
                            case 'xsd:date-time':
                                type = 'datetime';
                                break;
                            case 'xsd:string':
                            default:
                                type = 'text';
                        }

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
                                data-multiple={
                                    hasMultipleValues ? 'true' : null
                                }
                            />
                        );

                        if (layer.beforeShowFieldsModal) {
                            const hookInput = layer.beforeShowFieldsModal(
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
            </div>
        );
        this._modal._html.header.innerHTML = modalTitle;
        this._modal.show();
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
