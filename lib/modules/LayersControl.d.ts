import Observable from 'ol/Observable.js';
import { Options, WfsLayer, WmsLayer } from '../ol-wfst';
import { GeometryType } from '../@enums';
import Uploads from './Uploads';
/**
 * Removes in the DOM the class of the tools
 * @private
 */
export declare const resetStateButtons: () => void;
export declare const activateModeButtons: () => void;
export declare const activateDrawButton: () => void;
export default class LayersControl extends Observable {
    protected _uploads: Uploads;
    protected _uploadFormats: Options['uploadFormats'];
    constructor(uploads: Uploads, uploadFormats: Options['uploadFormats']);
    /**
     *
     * @param layer
     * @public
     */
    addLayerEl(layer: WfsLayer | WmsLayer): HTMLElement;
    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     * @private
     */
    _changeStateSelect(layer: WmsLayer | WfsLayer, geomDrawTypeSelected?: GeometryType): GeometryType;
    _visibilityClickHandler(evt: any): void;
    _layerChangeHandler(evt: any, layer: any): void;
    render(): HTMLElement;
}
//# sourceMappingURL=LayersControl.d.ts.map