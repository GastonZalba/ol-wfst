import { Options } from './ol-wfst';

export const DEFAULT_LANGUAGE = 'en';

export const getDefaultOptions = (): Options => {
    return {
        layers: null,
        evtType: 'singleclick',
        active: true,
        showControl: true,
        fullscreen: true,
        language: DEFAULT_LANGUAGE,
        uploadFormats: '.geojson,.json,.kml',
        processUpload: null,
        showCqlFilters: false,
        modal: {}
    };
};
