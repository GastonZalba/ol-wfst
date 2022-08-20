import { I18n } from '../ol-wfst';

let loadingDiv: HTMLDivElement;

export const initLoading = (i18n: I18n): HTMLDivElement => {
    loadingDiv = document.createElement('div');
    loadingDiv.className = 'ol-wfst--tools-control--loading';
    loadingDiv.innerHTML = i18n.labels.loading;
    return loadingDiv;
};

export const showLoading = (bool: boolean = true) => {
    if (bool) {
        loadingDiv.classList.add('ol-wfst--tools-control--loading-show');
    } else {
        loadingDiv.classList.remove('ol-wfst--tools-control--loading-show');
    }
};
