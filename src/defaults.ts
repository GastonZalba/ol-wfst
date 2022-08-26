import { I18N } from './modules/i18n';
import { Options } from './ol-wfst';

export const DEFAULT_LANGUAGE = 'en';

export const getDefaultOptions = (): Options => {
    return {
        layers: null,
        evtType: 'singleclick',
        active: true,
        showControl: true,
        minZoom: 9,
        language: DEFAULT_LANGUAGE,
        uploadFormats: '.geojson,.json,.kml',
        processUpload: null,
        modal: {
            animateClass: 'fade',
            animateInClass: 'show',
            transition: 300,
            backdropTransition: 150,
            templates: {
                dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
                headerClose: `<button type="button" class="btn-close" data-dismiss="modal" aria-label="${I18N.labels.close}"><span aria-hidden="true">×</span></button>`
            }
        }
    };
};
