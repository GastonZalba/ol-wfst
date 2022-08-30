// Ol
import { Feature, Observable } from 'ol';
import { Geometry } from 'ol/geom';

// External
import Modal from 'modal-vanilla';

import { addFeatureToEditedList, getStoredLayer } from './state';
import { Options } from '../ol-wfst';
import { I18N } from './i18n';

/**
 * Shows a fields form in a modal window to allow changes in the properties of the feature.
 *
 * @param feature
 * @private
 */
export class EditFieldsModal extends Observable {
    protected _options: Options['modal'];
    protected _modal: Modal;
    protected _feature: Feature;

    constructor(options: Options['modal']) {
        super();

        this._options = options;

        const footer = `
            <button type="button" class="btn btn-sm btn-link btn-third" data-action="delete" data-dismiss="modal">
                ${I18N.labels.delete}
            </button>
            <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                ${I18N.labels.cancel}
            </button>
            <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
                ${I18N.labels.save}
            </button>
        `;

        this._modal = new Modal({
            ...this._options,
            header: true,
            headerClose: true,
            title: '',
            content: '<div></div>',
            footer: footer
        });

        this._modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                const inputs = modal.el.querySelectorAll('input');

                inputs.forEach((el: HTMLInputElement) => {
                    const value = el.value;
                    const field = el.name;
                    this._feature.set(field, value, /*isSilent = */ true);
                });

                this._feature.changed();

                addFeatureToEditedList(this._feature);

                this.dispatchEvent({
                    type: 'save',
                    // @ts-expect-error
                    feature: this._feature
                });
            } else if (event.target.dataset.action === 'delete') {
                this.dispatchEvent({
                    type: 'delete',
                    // @ts-expect-error
                    feature: this._feature
                });
            }
        });
    }

    show(feature: Feature<Geometry>) {
        this._feature = feature;

        const title = `${I18N.labels.editElement} ${feature.getId()} `;

        const properties = feature.getProperties();
        const layerName = feature.get('_layerName_');

        // Data schema from the geoserver
        const layer = getStoredLayer(layerName);
        const dataSchema = layer.getDescribeFeatureType().properties;

        let content = '<form autocomplete="false">';
        Object.keys(properties).forEach((key) => {
            // If the feature field exists in the geoserver and is not added by openlayers
            const field = dataSchema.find((data) => data.name === key);

            if (field) {
                const typeXsd = field.type;
                let type;

                switch (typeXsd) {
                    case 'xsd:string':
                        type = 'text';
                        break;
                    case 'xsd:number':
                    case 'xsd:int':
                        type = 'number';
                        break;
                    case 'xsd:date-time':
                        type = 'datetime';
                        break;
                    default:
                        type = 'text';
                }

                if (type) {
                    content += `
                <div class="ol-wfst--input-field-container">
                    <label class="ol-wfst--input-field-label" for="${key}">${key}</label>
                    <input placeholder="NULL" class="ol-wfst--input-field-input" type="${type}" name="${key}" value="${
                        properties[key] || ''
                    }">
                </div>`;
                }
            }
        });

        content += '</form>';

        this._modal._html.body.innerHTML = content;
        this._modal._html.header.innerHTML = title;
        this._modal.show();
    }
}
