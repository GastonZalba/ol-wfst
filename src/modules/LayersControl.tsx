import Observable from 'ol/Observable.js';

import WfsLayer from '../WfsLayer.js';
import WmsLayer from '../WmsLayer.js';

import uploadSvg from '../assets/images/upload.svg';
import drawSvg from '../assets/images/draw.svg';
import selectSvg from '../assets/images/select.svg';
import selectBoxSvg from '../assets/images/selectBox.svg';
import selectFreehandSvg from '../assets/images/selectFreehand.svg';
import infoSvg from '../assets/images/info.svg';
import visibilityOnSvg from '../assets/images/visibilityOn.svg';
import visibilityOffSvg from '../assets/images/visibilityOff.svg';
import moreVertSvg from '../assets/images/more_vert.svg';

import { GeometryType } from '../@enums';
import {
    getActiveLayerToInsertEls,
    getStoredMapLayers,
    setActiveLayerToInsertEls,
    SelectionMode
} from './state';
import { I18N } from './i18n';
import Uploads from './Uploads';
import { BaseLayerProperty } from './base/BaseLayer';
import FilterCqlModal from './FilterCqlModal';
import { parseCql } from './cql';
import type { Condition } from './cql';
import { showError } from './errors';
import TinyPopupMenu from 'tiny-popup-menu';

import type { Options } from '../ol-wfst';
import type Wfst from '../ol-wfst';

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
    deactivateQueryButton();
};

export const activateQueryButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export const deactivateQueryButton = (): void => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-query');
    if (btn) {
        btn.classList.remove('wfst--active');
    }
};

export const activateDrawButton = () => {
    const btn = document.querySelector('.ol-wfst--tools-control-btn-draw');
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export const activateSelectModeButton = (mode: SelectionMode) => {
    const activeBtn = document.querySelector(
        '.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active'
    );
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }

    deactivateQueryButton();

    const btnMap = {
        [SelectionMode.Single]: '.ol-wfst--tools-control-btn-select',
        [SelectionMode.Box]: '.ol-wfst--tools-control-btn-select-box',
        [SelectionMode.Freehand]: '.ol-wfst--tools-control-btn-select-freehand'
    };

    const btn = document.querySelector(btnMap[mode]);
    if (btn) {
        btn.classList.add('wfst--active');
    }
};

export const deactivateSelectModeButton = (): void => {
    const activeBtn = document.querySelector(
        '.ol-wfst--tools-control-btn-select.wfst--active, .ol-wfst--tools-control-btn-select-box.wfst--active, .ol-wfst--tools-control-btn-select-freehand.wfst--active'
    );
    if (activeBtn) {
        activeBtn.classList.remove('wfst--active');
    }

    deactivateQueryButton();
};

export default class LayersControl extends Observable {
    protected _uploads: Uploads;
    protected _uploadFormats: Options['uploadFormats'];
    protected _options: Options;
    protected _wfst: Wfst;
    protected _activeCqlByLayer: Record<string, string | null> = {};
    protected _activeConditionsByLayer: Record<string, Condition[]> = {};
    protected _filterModal: FilterCqlModal | null = null;
    protected _filterMenu: TinyPopupMenu;
    protected _cqlWatched = new WeakSet<WfsLayer | WmsLayer>();

    constructor(
        wfst: Wfst | any,
        uploads: Uploads,
        uploadFormats: Options['uploadFormats'],
        options: Options
    ) {
        super();

        this._wfst = wfst;
        this._uploads = uploads;
        this._uploadFormats = uploadFormats;
        this._options = options;
        this._filterMenu = new TinyPopupMenu({ stopClick: true });
    }

    /**
     *
     * @param layer
     * @public
     */
    addLayerEl(layer: WfsLayer | WmsLayer): HTMLElement {
        const container = document.querySelector(
            '.wfst--tools-control--select-layers-list'
        );

        const layerName = layer.get(BaseLayerProperty.NAME) as string;
        const checked =
            layer === getActiveLayerToInsertEls() ? { checked: true } : {};

        const input = (
            <input
                value={layerName}
                id={`wfst--${layerName}`}
                type="radio"
                className="ol-wfst--tools-control-input"
                name="wfst--select-layer"
                {...checked}
                onChange={(evt: Event) => this._layerChangeHandler(evt, layer)}
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
                <label htmlFor={`wfst--${layerName}`}>
                    <div className="ol-wfst--layer-control-visible ">
                        <span
                            className="ol-wfst--layer-control-visible -btn ol-wfst--visible-btn-on"
                            title={I18N.labels.toggleVisibility}
                            onClick={(evt: MouseEvent) =>
                                this._visibilityClickHandler(evt)
                            }
                        >
                            {visibilityOnSvg()}
                        </span>
                        <span
                            className="ol-wfst--layer-control-visible -btn ol-wfst--visible-btn-off"
                            title={I18N.labels.toggleVisibility}
                            onClick={(evt: MouseEvent) =>
                                this._visibilityClickHandler(evt)
                            }
                        >
                            {visibilityOffSvg()}
                        </span>
                    </div>
                    {input}
                    <span
                        title={`${
                            layer instanceof WfsLayer ? 'WFS' : 'WMS'
                        } - ${layer.getDescribeFeatureType()._parsed.geomType}`}
                    >
                        {layer.get(BaseLayerProperty.LABEL)}
                    </span>
                </label>
            </div>
        );

        // Add filter button if enabled
        const key = this._layerKey(layer);
        this._subscribeCql(layer, key);

        const isWfs = layer instanceof WfsLayer;
        const isWms = layer instanceof WmsLayer;
        const hasType = !!(
            layer.get('typeName') || layer.get(BaseLayerProperty.NAME)
        );

        if (this._options.showCqlFilters && hasType && (isWfs || isWms)) {
            const filterBtn = (
                <button
                    className={`ol-wfst--layer-filter-btn${this._activeCqlByLayer[key] ? ' ol-wfst--layer-filtered' : ''}`}
                    type="button"
                    title={I18N.labels.filter || 'Filter'}
                    onClick={(evt: MouseEvent) => {
                        this._filterMenu.open({
                            event: evt,
                            menuItems: this._getFilterMenuItems(layer, key)
                        });
                    }}
                >
                    {moreVertSvg()}
                </button>
            );
            layerDom.appendChild(filterBtn);
        }

        container.appendChild(layerDom);

        if (layer === getActiveLayerToInsertEls()) {
            input.dispatchEvent(new Event('change'));
        }

        return layerDom;
    }

    /**
     * Key used to keep the filter state of a layer
     * @private
     */
    private _layerKey(layer: WfsLayer | WmsLayer): string {
        const wk = layer.get('workspace') as string;
        const ln = layer.get(BaseLayerProperty.NAME) as string;
        return wk ? `${wk}:${ln}` : String(ln);
    }

    /**
     * CQL filter really applied to the request of the layer
     * @private
     */
    private _readLayerCql(layer: WfsLayer | WmsLayer): string | null {
        const anyLayer = layer as any;
        if (typeof anyLayer.getCqlFilter === 'function') {
            return anyLayer.getCqlFilter() ?? null;
        }
        return null;
    }

    /**
     * Keeps the filter state in sync when it changes from the outside,
     * through `setCqlFilter` or `setCustomParam`
     * @private
     */
    private _subscribeCql(layer: WfsLayer | WmsLayer, key: string) {
        if (this._cqlWatched.has(layer)) return;
        this._cqlWatched.add(layer);
        layer.on('cqlFilterChanged', () => this._syncLayerCql(layer, key));
        this._syncLayerCql(layer, key);
    }

    /**
     * @private
     */
    private _syncLayerCql(layer: WfsLayer | WmsLayer, key: string) {
        const live = this._readLayerCql(layer);
        if (live === (this._activeCqlByLayer[key] ?? null)) return;

        this._activeCqlByLayer[key] = live;
        // The stored conditions no longer describe the applied filter
        delete this._activeConditionsByLayer[key];
        this._updateFilterButtonState(layer, key);
    }

    private _getFilterMenuItems(
        layer: WfsLayer | WmsLayer,
        key: string
    ): Array<any> {
        const items: Array<any> = [
            {
                content: I18N.labels.filter || 'Filter',
                callback: () => this._openFilterModal(layer, key)
            }
        ];
        if (this._activeCqlByLayer[key]) {
            items.push('-');
            items.push({
                content: I18N.labels.clearFilter || 'Clear filter',
                callback: () => this._clearFilter(layer, key)
            });
        }
        return items;
    }

    private async _openFilterModal(layer: WfsLayer | WmsLayer, key: string) {
        try {
            if (
                !(layer as any).getDescribeFeatureType ||
                !(layer as any).getDescribeFeatureType()
            ) {
                if (
                    typeof (layer as any).getAndUpdateDescribeFeatureType ===
                    'function'
                ) {
                    await (layer as any).getAndUpdateDescribeFeatureType();
                }
            }
            const result = (layer as any).getDescribeFeatureType
                ? (layer as any).getDescribeFeatureType()
                : null;
            const fields =
                result?._parsed?.properties ||
                (result as any)?.featureTypes?.[0]?.properties ||
                [];

            // Pick up filters set from the outside code
            this._syncLayerCql(layer, key);
            const live = this._readLayerCql(layer);
            let conditions = live ? this._activeConditionsByLayer[key] : null;
            let uneditable = false;

            if (live && !conditions) {
                const parsed = parseCql(live, fields);
                if (parsed) {
                    conditions = parsed;
                    this._activeConditionsByLayer[key] = parsed;
                } else {
                    uneditable = true;
                }
            }

            this._filterModal = new FilterCqlModal({
                options: this._options,
                layer,
                fields,
                initialConditions: conditions,
                uneditable,
                onApply: (cql: string | null, conditions: Condition[]) => {
                    this._applyFilter(layer, key, cql, conditions);
                    this._filterModal = null;
                },
                onClose: () => {
                    this._filterModal = null;
                }
            });
        } catch (err: any) {
            showError((I18N.errors as any).geoserver || 'Error', err);
        }
    }

    private _applyFilter(
        layer: WfsLayer | WmsLayer,
        key: string,
        cql: string | null,
        conditions: Condition[] = []
    ) {
        this._activeCqlByLayer[key] = cql;
        if (cql) {
            this._activeConditionsByLayer[key] = conditions;
        } else {
            delete this._activeConditionsByLayer[key];
        }
        if (layer instanceof WfsLayer) {
            layer.setCqlFilter(cql);
        } else if (layer instanceof WmsLayer) {
            layer.setCqlFilter(cql);
        }
        this._updateFilterButtonState(layer, key);
        this.dispatchEvent('filterChanged');
    }

    private _clearFilter(layer: WfsLayer | WmsLayer, key: string) {
        this._applyFilter(layer, key, null);
    }

    private _updateFilterButtonState(layer: WfsLayer | WmsLayer, key: string) {
        const layerName = layer.get(BaseLayerProperty.NAME);
        const list = document.querySelector(
            '.wfst--tools-control--select-layers-list'
        );
        if (!list) return;
        const item = list.querySelector(
            `.wfst--layer-control[data-layer="${layerName}"]`
        );
        const btn = item?.querySelector('.ol-wfst--layer-filter-btn');
        if (btn) {
            btn.classList.toggle(
                'ol-wfst--layer-filtered',
                !!this._activeCqlByLayer[key]
            );
        }
    }

    /**
     * Update geom Types availibles to select for this layer
     *
     * @param layerName
     * @param geomDrawTypeSelected
     * @private
     */
    private _changeStateSelect(
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

    private _visibilityClickHandler(evt: MouseEvent) {
        const btn = evt.currentTarget as HTMLElement;
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

    /**
     * Called when a layer is selected in the widget
     * @param evt
     * @param layer
     */
    private _layerChangeHandler(evt: Event, layer: WfsLayer | WmsLayer) {
        const selected = document.querySelector('.ol-wfst--selected-on');
        const parentDiv = (evt.currentTarget as HTMLElement).closest(
            '.wfst--layer-control'
        ) as HTMLElement;

        // Deselect DOM previous layer
        if (selected) {
            selected.classList.remove('ol-wfst--selected-on');
        }
        if (parentDiv) {
            parentDiv.classList.add('ol-wfst--selected-on');
        }

        setActiveLayerToInsertEls(layer);
        this._changeStateSelect(layer);

        this.dispatchEvent('changeLayer');
    }

    render(): HTMLElement {
        return (
            <>
                <div className="wfst--tools-control--head">
                    <div className="ol-wfst--tools-control-select-cnt">
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select wfst--active"
                            type="button"
                            title={I18N.labels.select}
                            onClick={() => {
                                this.dispatchEvent('selectModeSingle');
                            }}
                        >
                            {selectSvg()}
                        </button>
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-box"
                            type="button"
                            title={I18N.labels.selectBox}
                            onClick={() => {
                                this.dispatchEvent('selectModeBox');
                            }}
                        >
                            {selectBoxSvg()}
                        </button>
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-select-freehand"
                            type="button"
                            title={I18N.labels.selectFreehand}
                            onClick={() => {
                                this.dispatchEvent('selectModeFreehand');
                            }}
                        >
                            {selectFreehandSvg()}
                        </button>
                    </div>
                    <div className="ol-wfst--tools-control-query-cnt">
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-query"
                            type="button"
                            title={I18N.labels.query}
                            onClick={() => {
                                this.dispatchEvent('queryMode');
                            }}
                        >
                            {infoSvg()}
                        </button>
                    </div>
                    <div className="ol-wfst--tools-control-draw-cnt">
                        <button
                            className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-draw"
                            type="button"
                            title={I18N.labels.addElement}
                            onClick={() => {
                                this.dispatchEvent('drawMode');
                            }}
                        >
                            {drawSvg()}
                        </button>
                        <select
                            title={I18N.labels.selectDrawType}
                            className="wfst--tools-control--select-draw"
                            onChange={(evt: Event) => {
                                const selectedValue = (
                                    evt.target as HTMLSelectElement
                                ).value as GeometryType;
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
                    {this._uploads && (
                        <div>
                            <input
                                id="ol-wfst--upload"
                                type="file"
                                accept={this._uploadFormats}
                                onChange={(evt) => this._uploads.process(evt)}
                            />
                            <label
                                className="ol-wfst--tools-control-btn ol-wfst--tools-control-btn-upload"
                                htmlFor="ol-wfst--upload"
                                title={I18N.labels.uploadToLayer}
                            >
                                {uploadSvg()}
                            </label>
                        </div>
                    )}
                </div>
                <div className="wfst--tools-control--select-layers">
                    <div className="wfst--tools-control--select-layers-title">
                        {I18N.labels.geoserverLayers}
                    </div>
                    <div className="wfst--tools-control--select-layers-list"></div>
                </div>
            </>
        );
    }
}
