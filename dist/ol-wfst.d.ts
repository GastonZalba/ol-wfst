import 'ol/ol.css';
import './css/custom.css';
import './css/bootstrap.css';
import './css/bootstrap-theme.css';
/**
 * **_[interface]_** - Wfst Options specified when creating a Wfst instance
 *
 * Default values:
 * ```javascript
 * {

 * }
 * ```
 */
interface Options {
    urlWfs?: string;
    urlWms?: string;
    layerMode?: string;
    evtType?: string;
    wfsStrategy?: string;
    active?: boolean;
    layers?: Array<string>;
    showError?: Function;
}
export { Options };
