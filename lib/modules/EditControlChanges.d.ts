import Feature from 'ol/Feature.js';
import Geometry from 'ol/geom/Geometry.js';
import Control from 'ol/control/Control.js';
import { VectorSourceEvent } from 'ol/source/Vector.js';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable.js';
import BaseEvent from 'ol/events/Event.js';
import { EventsKey } from 'ol/events.js';
import { ObjectEvent } from 'ol/Object.js';
import { Types as ObjectEventTypes } from 'ol/ObjectEventType.js';
type ChangesEventTypes = 'cancel' | 'apply' | 'delete';
export default class EditControlChangesEl extends Control {
    on: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    once: OnSignature<EventTypes, BaseEvent, EventsKey> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, EventsKey> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, EventsKey>;
    un: OnSignature<EventTypes, BaseEvent, void> & OnSignature<ChangesEventTypes, VectorSourceEvent, EventsKey> & OnSignature<ObjectEventTypes, ObjectEvent, void> & CombinedOnSignature<ChangesEventTypes | ObjectEventTypes | EventTypes, void>;
    constructor(feature: Feature<Geometry>);
}
export {};
//# sourceMappingURL=EditControlChanges.d.ts.map