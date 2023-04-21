import Map from 'ol/Map.js';
import { FeatureLike } from 'ol/Feature.js';
import WfsLayer from '../WfsLayer';
import WmsLayer from '../WmsLayer';
import { IWfstLayersList } from '../@types';
export declare enum Modes {
    Edit = "EDIT",
    Draw = "DRAW"
}
export declare function activateMode(m?: Modes): void;
export declare function getMode(): any;
export declare function setMap(m: Map): void;
export declare function getMap(): Map;
export declare function setActiveLayerToInsertEls(layer: WmsLayer | WfsLayer): void;
export declare function getActiveLayerToInsertEls(): WmsLayer | WfsLayer;
export declare function setMapLayers(data: any): void;
export declare function getStoredMapLayers(): IWfstLayersList;
export declare function getStoredLayer(layerName: string): WfsLayer | WmsLayer;
export declare function addFeatureToEditedList(feature: FeatureLike): void;
export declare function removeFeatureFromEditList(feature: FeatureLike): void;
export declare function isFeatureEdited(feature: FeatureLike): boolean;
//# sourceMappingURL=state.d.ts.map