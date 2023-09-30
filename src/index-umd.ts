import Wfst from './ol-wfst';
import WfsLayer from './WfsLayer';
import WmsLayer from './WmsLayer';
import Geoserver from './Geoserver';

const utils = {
    WfsLayer,
    WmsLayer,
    Geoserver
};

Object.assign(Wfst, utils);
export default Wfst;
