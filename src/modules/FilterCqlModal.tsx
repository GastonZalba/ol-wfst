import { I18N, I18N_ } from './i18n';
import Modal from 'modal-vanilla';

import { showError } from './errors';
import type { Options } from '../ol-wfst';
import {
    buildCql,
    getFieldType,
    getOperators,
    isGeometryField,
    type Condition,
    type FilterField
} from './cql';

export type { Condition, FilterField };

export interface FilterCqlModalProps {
    options: Options;
    layer: any;
    fields: FilterField[];
    initialConditions?: Condition[] | null;
    uneditable?: boolean;
    onApply: (cql: string | null, conditions: Condition[]) => void;
    onClose: () => void;
}

export default class FilterCqlModal {
    private _modal: Modal;
    private _modalContent: HTMLElement;
    private _options: Options;
    private _fields: FilterField[];
    private _onApply: (cql: string | null, conditions: Condition[]) => void;
    private _onClose: () => void;
    private _conditions: Condition[] = [];
    private _uneditable = false;

    constructor(props: FilterCqlModalProps) {
        this._options = props.options;
        this._fields = props.fields.filter((f) => !isGeometryField(f));
        this._onApply = props.onApply;
        this._onClose = props.onClose;
        this._uneditable = !!props.uneditable;

        this._conditions =
            !this._uneditable && props.initialConditions
                ? props.initialConditions.map((cond) => ({
                      field: cond.field,
                      operator: cond.operator,
                      value1: cond.value1,
                      value2: cond.value2,
                      logic: cond.logic
                  }))
                : this._uneditable
                  ? []
                  : [{ field: '', operator: '=', value1: '', value2: '' }];

        this._modal = new Modal({
            ...this._options.modal,
            title: I18N_('filterElements', props.layer.get('label')),
            content: '<div></div>',
            footer: (
                <div>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-dismiss="modal"
                    >
                        {I18N.labels.cancel}
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        data-action="save"
                        data-dismiss="modal"
                    >
                        {I18N.labels.apply}
                    </button>
                </div>
            ).innerHTML
        });

        this._modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                this._apply();
            }

            this._onClose();
        });

        this._modal.on('show', () => {
            this._modalContent = this._renderContent();
            this._modal._html.body.innerHTML = '';
            this._modal._html.body.append(this._modalContent);
        });
        this._modal.show();
    }

    private _renderContent(): HTMLElement {
        const fields = this._fields;
        const container = (
            <div className="ol-wfst--filter-modal ol-wfst--filter-form">
                {this._uneditable && (
                    <div className="ol-wfst--filter-warning">
                        {I18N.labels.filterNotEditable ||
                            'This filter cannot be edited here. Adding a condition will replace it.'}
                    </div>
                )}
                {fields.length === 0 ? (
                    <div className="ol-wfst--filter-no-fields">
                        {I18N.labels.noFieldsFound || 'No fields found'}
                    </div>
                ) : (
                    this._renderConditions(fields)
                )}
            </div>
        );

        return container;
    }

    private _renderConditions(fields: FilterField[]): HTMLElement {
        return (
            <div className="ol-wfst--filter-conditions">
                {this._conditions.map((cond, index) =>
                    this._renderRow(cond, fields, index)
                )}
                <button
                    type="button"
                    className="btn btn-sm btn-link ol-wfst--filter-add"
                    onClick={() => {
                        this._conditions.push({
                            field: '',
                            operator: '=',
                            value1: '',
                            value2: '',
                            logic: 'AND'
                        });
                        this._refreshConditions(fields);
                    }}
                >
                    {I18N.labels.addCondition || 'Add condition'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-action="clear"
                    data-dismiss="modal"
                    onClick={() => this._onApply(null, [])}
                >
                    {I18N.labels.clearFilter}
                </button>
            </div>
        );
    }

    private _renderRow(
        cond: Condition,
        fields: FilterField[],
        index: number
    ): HTMLElement {
        const field = fields.find((f) => f.name === cond.field);
        const type = field ? getFieldType(field) : 'text';
        const inputType =
            type === 'number'
                ? 'number'
                : type === 'date'
                  ? 'date'
                  : type === 'datetime'
                    ? 'datetime-local'
                    : 'text';

        return (
            <div className="ol-wfst--filter-row">
                {index > 0 && (
                    <select
                        className="ol-wfst--filter-logic"
                        onChange={(evt: Event) => {
                            cond.logic =
                                (evt.target as HTMLSelectElement).value === 'OR'
                                    ? 'OR'
                                    : 'AND';
                        }}
                    >
                        <option
                            value="AND"
                            selected={cond.logic !== 'OR' ? true : null}
                        >
                            {I18N.labels.and || 'AND'}
                        </option>
                        <option
                            value="OR"
                            selected={cond.logic === 'OR' ? true : null}
                        >
                            {I18N.labels.or || 'OR'}
                        </option>
                    </select>
                )}
                <select
                    className="ol-wfst--filter-field"
                    onChange={(evt: Event) => {
                        cond.field = (evt.target as HTMLSelectElement).value;
                        const newField = fields.find(
                            (f) => f.name === cond.field
                        );
                        const newOps = getOperators(
                            newField ? getFieldType(newField) : 'text'
                        );
                        if (!newOps.includes(cond.operator)) {
                            cond.operator = newOps[0];
                        }
                        this._refreshConditions(fields);
                    }}
                >
                    <option value="" selected={cond.field ? null : true}>
                        {I18N.labels.selectField || 'Select field'}
                    </option>
                    {fields.map((f) => (
                        <option
                            value={f.name}
                            selected={cond.field === f.name ? true : null}
                        >
                            {f.name}
                        </option>
                    ))}
                </select>
                <select
                    className="ol-wfst--filter-operator"
                    onChange={(evt: Event) => {
                        cond.operator = (evt.target as HTMLSelectElement).value;
                        this._refreshConditions(fields);
                    }}
                >
                    {getOperators(type).map((o) => (
                        <option
                            value={o}
                            selected={cond.operator === o ? true : null}
                        >
                            {o}
                        </option>
                    ))}
                </select>
                <input
                    className="ol-wfst--filter-value1"
                    type={inputType}
                    step={inputType === 'datetime-local' ? '1' : null}
                    placeholder={I18N.labels.enterValue || 'Enter value'}
                    value={cond.value1}
                    onInput={(evt: Event) => {
                        cond.value1 = (evt.target as HTMLInputElement).value;
                    }}
                />
                {cond.operator === 'BETWEEN' && (
                    <input
                        className="ol-wfst--filter-value2"
                        type={inputType}
                        step={inputType === 'datetime-local' ? '1' : null}
                        placeholder={I18N.labels.enterValue || 'Enter value'}
                        value={cond.value2}
                        onInput={(evt: Event) => {
                            cond.value2 = (
                                evt.target as HTMLInputElement
                            ).value;
                        }}
                    />
                )}
            </div>
        );
    }

    private _refreshConditions(fields: FilterField[]) {
        const oldList = this._modalContent.querySelector(
            '.ol-wfst--filter-conditions'
        );
        const newList = this._renderConditions(fields);
        if (oldList) {
            oldList.replaceWith(newList);
        } else {
            this._modalContent.insertBefore(
                newList,
                this._modalContent.firstChild
            );
        }
    }

    /**
     * A condition without field or without the value its operator needs
     * would be dropped from the filter or would generate an invalid one
     * @private
     */
    private _invalidCondition(): string | null {
        for (const cond of this._conditions) {
            if (!cond.field) {
                return I18N.labels.selectField || 'Select field';
            }
            const withoutValue =
                cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL';
            if (
                !withoutValue &&
                (!cond.value1 || (cond.operator === 'BETWEEN' && !cond.value2))
            ) {
                return I18N.labels.enterValue || 'Enter value';
            }
        }
        return null;
    }

    private _apply() {
        const invalid = this._invalidCondition();
        if (invalid) {
            showError(invalid, null, 'filter');
            return;
        }

        const cql = buildCql(this._conditions, this._fields);

        // The current filter could not be represented, do not wipe it out
        if (this._uneditable && !cql) {
            this._modal.hide();
            return;
        }

        this._onApply(cql, this._conditions);
        this._modal.hide();
    }

    destroy() {
        if (this._modal) {
            this._modal.hide();
        }
    }
}
