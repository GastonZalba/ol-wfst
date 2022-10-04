import Wfst from '../src/ol-wfst';
import WfsLayer from '../src/WfsLayer';
import WmsLayer from '../src/WmsLayer';
import Geoserver from '../src/Geoserver';

const utils = {
    WfsLayer,
    WmsLayer,
    Geoserver
};

Object.assign(Wfst, utils);
export default Wfst;
