import { I18N } from './i18n';

let loadingDiv: HTMLDivElement;

export const initLoading = (): HTMLDivElement => {
    loadingDiv = document.createElement('div');
    loadingDiv.className = 'ol-wfst--tools-control--loading';
    loadingDiv.setAttribute('role', 'progressbar');
    loadingDiv.setAttribute('aria-label', I18N.labels.loading);
    return loadingDiv;
};

export const showLoading = (bool: boolean = true) => {
    if (bool) {
        loadingDiv.classList.add('ol-wfst--tools-control--loading-show');
    } else {
        loadingDiv.classList.remove('ol-wfst--tools-control--loading-show');
    }
};
