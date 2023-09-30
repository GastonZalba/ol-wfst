import { Options } from '../ol-wfst';
import { IGeoserverDescribeFeatureType } from '../@types';
export declare const initModal: (opts: Options['modal']) => void;
export declare const parseError: (geoserverResponse: IGeoserverDescribeFeatureType) => string;
/**
 * Show modal with errors
 *
 * @param msg
 * @private
 */
export declare const showError: (msg: string, originalError?: Error, layerName?: string) => void;
//# sourceMappingURL=errors.d.ts.map