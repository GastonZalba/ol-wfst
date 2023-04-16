import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { Control } from 'ol/control';
import { VectorSourceEvent } from 'ol/source/Vector';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import BaseEvent from 'ol/events/Event';
import { EventsKey } from 'ol/events';
import { ObjectEvent } from 'ol/Object';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType';
type ChangesEventTypes = 'cancel' | 'apply' | 'delete';
export default class EditControlChangesEl extends Control {
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, void>;
    constructor(feature: Feature<Geometry>);
}
export {};
//# sourceMappingURL=EditControlChanges.d.ts.map