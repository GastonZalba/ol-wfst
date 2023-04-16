import { I18n } from '../../ol-wfst';

export const es: I18n = {
    labels: {
        select: 'Seleccionar',
        addElement: 'Modo dibujo',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        upload: 'Subir',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        geomTypeNotSupported: 'Geometría no compatible con la capa',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        selectDrawType: 'Tipo de geometría para dibujar',
        uploadToLayer: 'Subir archivo a la capa seleccionada',
        uploadFeatures: 'Subida de elementos a la capa',
        validFeatures: 'Válidas',
        invalidFeatures: 'Invalidas',
        loading: 'Cargando...',
        toggleVisibility: 'Cambiar visibilidad de la capa',
        close: 'Cerrar'
    },
    errors: {
        capabilities: 'No se pudieron obtener las Capabilidades del GeoServer',
        wfst: 'El GeoServer no tiene soporte a Transacciones',
        layer: 'No se pudieron obtener datos de la capa',
        layerNotFound: 'Capa no encontrada',
        layerNotVisible: 'La capa no está visible',
        noValidGeometry:
            'No se encontraron geometrías válidas para agregar a esta capa',
        geoserver: 'No se pudieron obtener datos desde el GeoServer',
        badFormat: 'Formato no soportado',
        badFile: 'Error al leer elementos del archivo',
        lockFeature: 'No se pudieron bloquear elementos en el GeoServer',
        transaction: 'Error al hacer transacción con el GeoServer',
        getFeatures: 'Error al obtener elemento desde el GeoServer'
    }
};
