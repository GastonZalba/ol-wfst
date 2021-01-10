import { i18n } from '../../ol-wfst';

export const es: i18n = {
    labels: {
        select: 'Seleccionar',
        addElement: 'Añadir elemento',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        uploadToLayer: 'Subir archivo a la capa seleccionada'
    },
    errors: {
        capabilities: 'No se pudieron obtener las Capabilidades del GeoServer',
        wfst: 'El GeoServer no tiene soporte a Transacciones',
        layer: 'No se pudieron obtener datos de la capa',
        geoserver: 'No se pudieron obtener datos desde el GeoServer',
        badFormat: 'Formato no soportado',
        badFile: 'Error al leer elementos del archivo',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer.',
        transaction: 'Error al hacer transacción con el GeoServer. HTTP status:',
        getFeatures: 'Error al obtener elemento desde el GeoServer. HTTP status:'
    }
};