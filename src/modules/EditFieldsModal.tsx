// Ol
import Observable from 'ol/Observable.js';
import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import { VectorSourceEvent } from 'ol/source/Vector.js';

// External
import Modal from 'modal-vanilla';

import { addFeatureToEditedList, getStoredLayer } from './state';
import { Options } from '../ol-wfst';
import { I18N } from './i18n';

import myPragma from '../myPragma';

/**
 * Shows a fields form in a modal window to allow changes in the properties of the feature.
 *
 * @param feature
 * @private
 */
export class EditFieldsModal extends Observable {
    protected _options: Options;
    protected _modal: Modal;
    protected _feature: Feature;

    constructor(options: Options) {
        super();

        this._options = options;

        this._modal = new Modal({
            ...this._options.modal,
            header: true,
            headerClose: true,
            title: '',
            content: <div></div>,
            footer: `
                <button
                    type="button"
                    class="btn btn-sm btn-link btn-third"
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

                Array.from(formElements).forEach((el) => {
                    const value = el.value;
                    const field = el.name;
                    this._feature.set(field, value, /*isSilent = */ true);
                });

                this._feature.changed();

                addFeatureToEditedList(this._feature);

                this.dispatchEvent(
                    new VectorSourceEvent('save', this._feature)
                );
            } else if (event.target.dataset.action === 'delete') {
                this.dispatchEvent(
                    new VectorSourceEvent('delete', this._feature)
                );
            }
        });
    }

    show(feature: Feature<Geometry>) {
        this._feature = feature;

        const modalTitle = `${I18N.labels.editElement} ${feature.getId()} `;

        const featProperties = feature.getProperties();
        const layerName = feature.get('_layerName_');

        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const dataSchema = layer.getDescribeFeatureType()._parsed.properties;

        this._modal._html.body.innerHTML = '';
        this._modal._html.body.append(
            <form autocomplete="false">
                {Object.keys(featProperties).flatMap((key) => {
                    // If the feature field exists in the geoserver and is not added by openlayers
                    const field = dataSchema.find((data) => data.name === key);

                    if (!field) return [];

                    const typeXsd = field.type;
                    const value = featProperties[key];

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
                            placeholder="NULL"
                            className="ol-wfst--input-field-input"
                            type={type}
                            name={key}
                            value={value || null}
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
        this._modal._html.header.innerHTML = modalTitle;
        this._modal.show();
    }
}
