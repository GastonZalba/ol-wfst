import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';

let editLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 100
});

export const getEditLayer = (): VectorLayer<VectorSource> => {
    return editLayer;
};
