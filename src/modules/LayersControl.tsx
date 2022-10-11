import { Observable } from 'ol';
import { SelectEvent } from 'ol/interaction/Select';

import { Options, WfsLayer, WmsLayer } from '../ol-wfst';
import myPragma from '../myPragma';

import uploadSvg from '../assets/images/upload.svg';
import drawSvg from '../assets/images/draw.svg';
import visibilityOn from '../assets/images/visibilityOn.svg';
import visibilityOff from '../assets/images/visibilityOff.svg';

import { GeometryType } from '../@enums';
import {
    getActiveLayerToInsertEls,
    getStoredMapLayers,
    setActiveLayerToInsertEls
} from './state';
import { I18N } from './i18n';
import Uploads from './Uploads';
import { BaseLayerProperty } from './base/BaseLayer';

/**
 * Removes in the DOM the class of the tools
 * @private
 */
export const resetStateButtons = (): void => {
    const activeBtn = document.querySelector(
        '.ol-wfst--tools-control-btn.wfst--active'
    );
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }
};

export const activateModeButtons = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-edit');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export const activateDrawButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export const visibleLayer = (bool = true) => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export default class LayersControl extends Observable {
    protected _uploads: Uploads;
    protected _uploadFormats: Options['uploadFormats'];

    constructor(uploads: Uploads, uploadFormats: Options['uploadFormats']) {
        super();

        this._uploads = uploads;
        this._uploadFormats = uploadFormats;
    }

    /**
     *
     * @param layer
     * @public
     */
    addLayerEl(layer: WfsLayer | WmsLayer) {
        const container = document.querySelector(
            '.wfst--tools-control--select-layers'
        );

        const layerName = layer.get(BaseLayerProperty.NAME) as string;
        const checked =
            layer === getActiveLayerToInsertEls() ? { checked: 'checked' } : {};

        const input = (
            <input
                value={layerName}
                id={`wfst--${layerName}`}
                type="radio"
                className="ol-wfst--tools-control-input"
                name="wfst--select-layer"
                {...checked}
                onchange={(evt) => this._layerChangeHandler(evt, layer)}
            />
        );

        const layerDom = (
            <div
                className={`wfst--layer-control 
                            ${layer.getVisible() ? 'ol-wfst--visible-on' : ''}
                            ${
                                layer === getActiveLayerToInsertEls()
                                    ? 'ol-wfst--selected-on'
                                    : ''
                            }`}
                data-layer={layerName}
            >
                <div className="ol-wfst--tools-control-visible">
                    <span
                        className="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-on"
                        title={I18N.labels.toggleVisibility}
                        onclick={(evt) => this._visibilityClickHandler(evt)}
                    >
                        <img src={visibilityOn} />
                    </span>
                    <span
                        className="ol-wfst--tools-control-visible-btn ol-wfst--visible-btn-off"
                        title={I18N.labels.toggleVisibility}
                        onclick={(evt) => this._visibilityClickHandler(evt)}
                    >
                        <img src={visibilityOff} />
                    </span>
                </div>
                <label htmlFor={`wfst--${layerName}`}>
                    {input}
                    <span
                        title={layer.getDescribeFeatureType()._parsed.geomType}
                    >
                        {layer.get(BaseLayerProperty.LABEL)}
                    </span>
                </label>
            </div>
        );

        container.appendChild(layerDom);

        if (layer === getActiveLayerToInsertEls()) {
            input.dispatchEvent(new Event('change'));
        }

        return layerDom;
    }

    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     * @private
     */
    _changeStateSelect(
        layer: WmsLayer | WfsLayer,
        geomDrawTypeSelected: GeometryType = null
    ): GeometryType {
        /**
         * Set the geometry type in the select according to the geometry of
         * the layer in the geoserver and disable what does not correspond.
         *
         * @param value
         * @param options
         * @private
         */
        const setSelectState = (
            value: GeometryType,
            options: Array<string> | 'all'
        ): void => {
            Array.from(selectDraw.options).forEach(
                (option: HTMLOptionElement) => {
                    option.selected = option.value === value ? true : false;
                    option.disabled =
                        options === 'all'
                            ? false
                            : options.includes(option.value)
                            ? false
                            : true;
                    option.title = option.disabled
                        ? I18N.labels.geomTypeNotSupported
                        : '';
                }
            );
        };

        const selectDraw = document.querySelector(
            '.wfst--tools-control--select-draw'
        ) as HTMLSelectElement;

        let drawType: GeometryType;

        if (selectDraw) {
            const geomLayer = layer.getDescribeFeatureType()._parsed.geomType;

            if (geomDrawTypeSelected) {
                drawType = selectDraw.value as GeometryType;
            } else {
                if (geomLayer === GeometryType.GeometryCollection) {
                    drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                    setSelectState(drawType, 'all');
                } else if (geomLayer === GeometryType.LinearRing) {
                    drawType = GeometryType.LineString; // Default drawing type for GeometryCollection
                    setSelectState(drawType, [
                        GeometryType.Circle,
                        GeometryType.LinearRing,
                        GeometryType.Polygon
                    ]);
                    selectDraw.value = drawType;
                } else {
                    drawType = geomLayer;
                    setSelectState(drawType, [geomLayer]);
                }
            }
        }

        return drawType;
    }

    _visibilityClickHandler(evt) {
        const btn = evt.currentTarget;
        const parentDiv = btn.closest('.wfst--layer-control') as HTMLElement;
        const layerName = parentDiv.dataset['layer'];
        parentDiv.classList.toggle('ol-wfst--visible-on');
        const layer = getStoredMapLayers()[layerName];
        if (parentDiv.classList.contains('ol-wfst--visible-on')) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
    }

    _layerChangeHandler(evt, layer) {
        const radioInput = evt.currentTarget;
        const parentDiv = radioInput.closest(
            '.wfst--layer-control'
        ) as HTMLElement;

        // Deselect DOM previous layer
        const selected = document.querySelector('.ol-wfst--selected-on');

        if (selected) selected.classList.remove('ol-wfst--selected-on');

        // Select this layer
        parentDiv.classList.add('ol-wfst--selected-on');
        setActiveLayerToInsertEls(layer);
        this._changeStateSelect(layer);
    }

    render(): HTMLElement {
        return (
            <>
                <div className="wfst--tools-control--head">
                    {this._uploads && (
                        <div>
                            <input
                                id="ol-wfst--upload"
                                type="file"
                                accept={this._uploadFormats}
                                onchange={(evt: InputEvent) =>
                                    this._uploads.process(evt)
                                }
                            />
                            <label
                                className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload"
                                htmlFor="ol-wfst--upload"
                                title={I18N.labels.uploadToLayer}
                            >
                                <img src={uploadSvg} />
                            </label>
                        </div>
                    )}
                    <div className="ol-wfst--tools-control-draw-cnt">
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw"
                            type="button"
                            title={I18N.labels.addElement}
                            onclick={() => {
                                this.dispatchEvent('drawMode');
                            }}
                        >
                            <img src={drawSvg} />
                        </button>
                        <select
                            title={I18N.labels.selectDrawType}
                            className="wfst--tools-control--select-draw"
                            onchange={(evt: SelectEvent) => {
                                const selectedValue = evt.target
                                    .value as GeometryType;
                                this._changeStateSelect(
                                    getActiveLayerToInsertEls(),
                                    selectedValue
                                );
                                this.dispatchEvent('changeGeom');
                            }}
                        >
                            {[
                                GeometryType.Point,
                                GeometryType.MultiPoint,
                                GeometryType.LineString,
                                GeometryType.MultiLineString,
                                GeometryType.Polygon,
                                GeometryType.MultiPolygon,
                                GeometryType.Circle
                            ].map((type) => {
                                // Show all options, but enable only the accepted ones
                                return <option value={type}>{type}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className="wfst--tools-control--select-layers"></div>
            </>
        );
    }
}
