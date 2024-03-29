// Ol
import {
    Geometry,
    LineString,
    MultiLineString,
    MultiPoint,
    MultiPolygon,
    Point,
    Polygon
} from 'ol/geom.js';
import Feature from 'ol/Feature.js';
import Observable from 'ol/Observable.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import WFS from 'ol/format/WFS.js';
import { VectorSourceEvent } from 'ol/source/Vector.js';
import { BaseLayerProperty } from './base/BaseLayer.js';

// External
import Modal from 'modal-vanilla';

import { Options } from '../ol-wfst';
import { showError } from './errors';
import { resetStateButtons } from './LayersControl';
import { getEditLayer } from './editLayer';
import { getActiveLayerToInsertEls, getMap } from './state';
import { GeometryType } from '../@enums';
import { I18N } from './i18n';

export default class Uploads extends Observable {
    protected _options: Options;

    // Formats
    protected _formatWFS: WFS;
    protected _formatGeoJSON: GeoJSON;
    protected _formatKml: KML;
    protected _xs: XMLSerializer;

    protected _processUpload: Options['processUpload'];

    constructor(options: Options) {
        super();

        this._options = options;

        this._processUpload = options.processUpload;

        // Formats
        this._formatWFS = new WFS();

        this._formatGeoJSON = new GeoJSON();
        this._formatKml = new KML({
            extractStyles: false,
            showPointNames: false
        });
        this._xs = new XMLSerializer();
    }

    /**
     * Parse and check geometry of uploaded files
     *
     * @param evt
     * @public
     */
    async process(evt: Event): Promise<void> {
        const map = getMap();
        const view = map.getView();

        const file = (evt.target as HTMLInputElement).files[0];

        let features: Array<Feature<Geometry>>;

        if (!file) {
            return;
        }

        const extension = file.name.split('.').pop().toLowerCase();

        try {
            // If the user uses a custom fucntion...
            if (this._processUpload) {
                features = this._processUpload(file);
            }

            // If the user functions return features, we dont process anything more
            if (!features) {
                const string = await this._fileReader(file);

                if (extension === 'geojson' || extension === 'json') {
                    features = this._formatGeoJSON.readFeatures(string, {
                        featureProjection: view.getProjection().getCode()
                    });
                } else if (extension === 'kml') {
                    features = this._formatKml.readFeatures(string, {
                        featureProjection: view.getProjection().getCode()
                    });
                } else {
                    showError(I18N.errors.badFormat);
                }
            }

            let invalidFeaturesCount = 0;
            let validFeaturesCount = 0;

            const featuresToInsert: Array<Feature<Geometry>> = [];

            for (let feature of features) {
                // If the geometry doesn't correspond to the layer, try to fixit.
                // If we can't, don't use it
                if (!this._checkGeometry(feature)) {
                    feature = this._fixGeometry(feature);
                }

                if (feature) {
                    featuresToInsert.push(feature);
                    validFeaturesCount++;
                } else {
                    invalidFeaturesCount++;
                    continue;
                }
            }

            if (!validFeaturesCount) {
                showError(I18N.errors.noValidGeometry);
            } else {
                resetStateButtons();

                this.dispatchEvent(
                    new VectorSourceEvent(
                        'loadedFeatures',
                        null,
                        featuresToInsert
                    )
                );

                const content = `
            ${I18N.labels.validFeatures}: ${validFeaturesCount}<br>
            ${
                invalidFeaturesCount
                    ? `${I18N.labels.invalidFeatures}: ${invalidFeaturesCount}`
                    : ''
            }`;

                this._initModal(content, featuresToInsert);
            }

            // Reset the input to allow another onChange trigger
            (evt.target as HTMLInputElement).value = null;
        } catch (err) {
            showError(I18N.errors.badFile, err);
        }
    }

    /**
     * Read data file
     * @param file
     * @public
     */
    async _fileReader(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('load', async (e) => {
                const fileData = e.target.result;
                resolve(fileData as string);
            });

            reader.addEventListener('error', (err) => {
                console.error('Error' + err);
                reject();
            });
            reader.readAsText(file);
        });
    }

    /**
     * Attemp to change the geometry feature to the layer
     * @param feature
     * @private
     */
    _fixGeometry(feature: Feature<Geometry>): Feature<Geometry> {
        // Geometry of the layer
        const geomTypeLayer =
            getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
                .geomType;
        const geomTypeFeature = feature.getGeometry().getType();
        let geom: Geometry;

        switch (geomTypeFeature) {
            case GeometryType.Point: {
                if (geomTypeLayer === GeometryType.MultiPoint) {
                    const coords = (
                        feature.getGeometry() as Point
                    ).getCoordinates();
                    geom = new MultiPoint([coords]);
                }
                break;
            }

            case GeometryType.LineString:
                if (geomTypeLayer === GeometryType.MultiLineString) {
                    const coords = (
                        feature.getGeometry() as LineString
                    ).getCoordinates();
                    geom = new MultiLineString([coords]);
                }
                break;

            case GeometryType.Polygon:
                if (geomTypeLayer === GeometryType.MultiPolygon) {
                    const coords = (
                        feature.getGeometry() as Polygon
                    ).getCoordinates();
                    geom = new MultiPolygon([coords]);
                }
                break;
            default:
                geom = null;
        }

        if (!geom) {
            return null;
        }

        feature.setGeometry(geom);
        return feature;
    }

    /**
     * Check if the feature has the same geometry as the target layer
     * @param feature
     * @private
     */
    _checkGeometry(feature: Feature<Geometry>): boolean {
        // Geometry of the layer
        const geomTypeLayer =
            getActiveLayerToInsertEls().getDescribeFeatureType()._parsed
                .geomType;
        const geomTypeFeature = feature.getGeometry().getType();

        // This geom accepts every type of geometry
        if (geomTypeLayer === GeometryType.GeometryCollection) {
            return true;
        }

        return geomTypeFeature === geomTypeLayer;
    }

    /**
     * Confirm modal before transact to the GeoServer the features in the file
     *
     * @param content
     * @param featuresToInsert
     * @private
     */
    _initModal(
        content: string,
        featuresToInsert: Array<Feature<Geometry>>
    ): void {
        const footer = `
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
            ${I18N.labels.cancel}
        </button>
        <button type="button" class="btn btn-sm btn-primary" data-action="save" data-dismiss="modal">
            ${I18N.labels.upload}
        </button>
    `;

        const modal = new Modal({
            ...this._options.modal,
            header: true,
            headerClose: false,
            title:
                I18N.labels.uploadFeatures +
                ' ' +
                getActiveLayerToInsertEls().get(BaseLayerProperty.NAME),
            content: content,
            backdrop: 'static', // Prevent close on click outside the modal
            footer: footer
        }).show();

        modal.on('dismiss', (modal, event) => {
            // On saving changes
            if (event.target.dataset.action === 'save') {
                this.dispatchEvent(
                    new VectorSourceEvent(
                        'addedFeatures',
                        null,
                        featuresToInsert
                    )
                );
            } else {
                // On cancel button
                getEditLayer().getSource().clear();
            }
        });
    }
}
