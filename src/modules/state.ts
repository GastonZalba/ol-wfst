import Map from 'ol/Map.js';
import { FeatureLike } from 'ol/Feature.js';

import WfsLayer from '../WfsLayer';
import WmsLayer from '../WmsLayer';
import { IWfstLayersList } from '../@types';

let map: Map;
let layerToInsertElements: WfsLayer | WmsLayer = null;
let mode = null;

export enum Modes {
    Edit = 'EDIT',
    Draw = 'DRAW'
}

export function activateMode(m: Modes = null) {
    mode = m;
}

export function getMode() {
    return mode;
}

const editedFeatures: Set<string> = new Set();
const mapLayers: IWfstLayersList = {};

export function setMap(m: Map) {
    map = m;
}

export function getMap(): Map {
    return map;
}

export function setActiveLayerToInsertEls(layer: WmsLayer | WfsLayer) {
    layerToInsertElements = layer;
}

export function getActiveLayerToInsertEls(): WmsLayer | WfsLayer {
    return layerToInsertElements;
}

export function setMapLayers(data) {
    Object.assign(mapLayers, data);
}

export function getStoredMapLayers(): IWfstLayersList {
    return mapLayers;
}

export function getStoredLayer(layerName: string): WfsLayer | WmsLayer {
    return getStoredMapLayers()[layerName];
}

export function addFeatureToEditedList(feature: FeatureLike): void {
    editedFeatures.add(String(feature.getId()));
}

export function removeFeatureFromEditList(feature: FeatureLike): void {
    editedFeatures.delete(String(feature.getId()));
}

export function isFeatureEdited(feature: FeatureLike): boolean {
    return editedFeatures.has(String(feature.getId()));
}
