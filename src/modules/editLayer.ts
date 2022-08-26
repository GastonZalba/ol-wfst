import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

let editLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 100
});

export const getEditLayer = (): VectorLayer<VectorSource> => {
    return editLayer;
};
