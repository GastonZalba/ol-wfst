import { i18n } from '../../ol-wfst';

export const en: i18n = {
    labels: {
        select: 'Select',
        addElement: 'Add feature',
        editElement: 'Edit feature',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        apply: 'Apply changes',
        editMode: 'Edit Mode',
        confirmDelete: 'Are you sure to delete the feature?',
        editFields: 'Edit fields',
        editGeom: 'Edit geometry',
        uploadToLayer: 'Upload file to selected layer'
    },
    errors: {
        capabilities: 'GeoServer Capabilities could not be downloaded.',
        wfst: 'The GeoServer does not support Transactions',
        layer: 'Could not get data from layer',
        geoserver: 'Could not get data from the GeoServer',
        badFormat: 'Unsupported format',
        badFile: 'Error reading items from file',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer. HTTP status:',
        transaction: 'Error when doing Transaction with GeoServer. HTTP status:',
        getFeatures: 'Error getting elements from GeoServer. HTTP status:'
    }
};