import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import Control from 'ol/control/Control.js';
import { VectorSourceEvent } from 'ol/source/Vector.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import BaseEvent from 'ol/events/Event.js';
import { EventsKey } from 'ol/events.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';

import { I18N, I18N_ } from './i18n';

type ChangesEventTypes = 'cancel' | 'apply' | 'delete';

export default class EditControlChangesEl extends Control {
    declare on: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            ChangesEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare once: OnSignature<EventTypes, BaseEvent, EventsKey> &
        OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> &
        CombinedOnSignature<
            ChangesEventTypes | ObjectEventTypes | EventTypes,
            EventsKey
        >;

    declare un: OnSignature<EventTypes, BaseEvent, void> &
        OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> &
        OnSignature<ObjectEventTypes, ObjectEvent, void> &
        CombinedOnSignature<
            ChangesEventTypes | ObjectEventTypes | EventTypes,
            void
        >;

    constructor(features: Feature<Geometry>[]) {
        super({
            element: (
                <div className="ol-wfst--changes-control">
                    <div className="ol-wfst--changes-control-el">
                        <div className="ol-wfst--changes-control-id">
                            <b>{I18N.labels.editMode}</b> -{' '}
                            <i>
                                {features.length > 1
                                    ? I18N_('editElements', features.length)
                                    : String(features[0].getId())}
                            </i>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                                this._dispatch('cancel', features);
                            }}
                        >
                            {I18N.labels.cancel}
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                                this._dispatch('apply', features);
                            }}
                        >
                            {I18N.labels.apply}
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-danger-outline"
                            onClick={() => {
                                this._dispatch('delete', features);
                            }}
                        >
                            {I18N.labels.delete}
                        </button>
                    </div>
                </div>
            )
        });
    }

    private _dispatch(
        type: ChangesEventTypes,
        features: Feature<Geometry>[]
    ): void {
        const evt = new VectorSourceEvent(type, features[0]);
        (evt as any).features = features;
        this.dispatchEvent(evt);
    }
}
