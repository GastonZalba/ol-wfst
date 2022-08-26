import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { Control } from 'ol/control';

import myPragma from '../myPragma';
import { I18N } from './i18n';

export default class EditControlEl extends Control {
    constructor(feature: Feature<Geometry>) {
        super({
            element: (
                <div className="ol-wfst--changes-control">
                    <div className="ol-wfst--changes-control-el">
                        <div className="ol-wfst--changes-control-id">
                            <b>{I18N.labels.editMode}</b> -{' '}
                            <i>{String(feature.getId())}</i>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onclick={() => {
                            this.dispatchEvent({
                                type: 'cancel',
                                //@ts-expect-error
                                feature: feature
                            });
                        }}
                    >
                        {I18N.labels.cancel}
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onclick={() => {
                            this.dispatchEvent({
                                type: 'apply',
                                //@ts-expect-error
                                feature: feature
                            });
                        }}
                    >
                        {I18N.labels.apply}
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-danger-outline"
                        onclick={() => {
                            this.dispatchEvent({
                                type: 'delete',
                                //@ts-expect-error
                                feature: feature
                            });
                        }}
                    >
                        {I18N.labels.delete}
                    </button>
                </div>
            )
        });
    }
}
