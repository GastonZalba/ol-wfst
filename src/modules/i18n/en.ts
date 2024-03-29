import { I18n } from '../../ol-wfst';

export const en: I18n = {
    labels: {
        select: 'Select',
        addElement: 'Toggle Draw mode',
        editElement: 'Edit feature',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        apply: 'Apply changes',
        upload: 'Upload',
        editMode: 'Edit Mode',
        confirmDelete: 'Are you sure to delete the feature?',
        geomTypeNotSupported: 'Geometry not supported by layer',
        editFields: 'Edit fields',
        editGeom: 'Edit geometry',
        selectDrawType: 'Geometry type to draw',
        uploadToLayer: 'Upload file to selected layer',
        uploadFeatures: 'Uploaded features to layer',
        validFeatures: 'Valid geometries',
        invalidFeatures: 'Invalid',
        loading: 'Loading...',
        toggleVisibility: 'Toggle layer visibility',
        close: 'Close'
    },
    errors: {
        capabilities: 'GeoServer Capabilities could not be downloaded.',
        wfst: 'The GeoServer does not support Transactions',
        layer: 'Could not get data from layer',
        layerNotFound: 'Layer not found',
        layerNotVisible: 'Layer is not visible',
        noValidGeometry: 'No valid geometries found to add to this layer',
        geoserver: 'Failed to get data from GeoServer',
        badFormat: 'Unsupported format',
        badFile: 'Error reading items from file',
        lockFeature: 'Could not lock items on the GeoServer',
        transaction: 'Error when doing Transaction with GeoServer',
        getFeatures: 'Error getting elements from GeoServer'
    }
};
