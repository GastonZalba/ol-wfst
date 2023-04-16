// External
import Modal from 'modal-vanilla';

import { Options } from '../ol-wfst';
import { ExceptionGeoserver, IGeoserverDescribeFeatureType } from '../@types';
let options = {};

// Store layerNames that has errors
const isError = new Set();

export const initModal = (opts: Options['modal']) => {
    options = opts;
};

export const parseError = (
    geoserverResponse: IGeoserverDescribeFeatureType
) => {
    if ('exceptions' in geoserverResponse) {
        return (geoserverResponse.exceptions as ExceptionGeoserver[])
            .map((e) => e.text)
            .join(',');
    } else {
        return '';
    }
};

/**
 * Show modal with errors
 *
 * @param msg
 * @private
 */
export const showError = (
    msg: string,
    originalError: Error = null,
    layerName = ''
): void => {
    // Prevent multiples modals error in the same layer
    if (isError.has(layerName)) {
        return;
    }

    isError.add(layerName);

    let err_msg = `<b>Error: ${msg}</b>`;
    if (originalError && originalError.message !== msg) {
        err_msg += `. ${originalError.message}`;
    }

    const al = Modal.alert(err_msg, options);

    al.show();

    al.on('hidden', () => {
        isError.delete(layerName);
    });
};
