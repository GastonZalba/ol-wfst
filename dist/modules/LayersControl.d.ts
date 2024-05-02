import Observable from 'ol/Observable.js';
import { Options, WfsLayer, WmsLayer } from '../ol-wfst';
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
    private _changeStateSelect;
    private _visibilityClickHandler;
    /**
     * Called when a layer is selected in the widget
     * @param evt
     * @param layer
     */
    private _layerChangeHandler;
    render(): HTMLElement;
}
//# sourceMappingURL=LayersControl.d.ts.map