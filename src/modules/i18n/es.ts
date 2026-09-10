import { I18n } from '../../ol-wfst';

export const es: I18n = {
    labels: {
        select: 'Seleccionar',
        selectBox: 'Seleccionar elementos dibujando una caja',
        selectFreehand: 'Seleccionar elementos dibujando a mano alzada',
        query: 'Consultar información del elemento',
        featureInfo: 'Información del elemento',
        addElement: 'Modo dibujo',
        editElement: 'Editar elemento',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        apply: 'Aplicar cambios',
        upload: 'Subir',
        editMode: 'Modo Edición',
        confirmDelete: '¿Estás seguro de borrar el elemento?',
        confirmDeleteElements: '¿Borrar los {} elementos?',
        geomTypeNotSupported: 'Geometría no compatible con la capa',
        editFields: 'Editar campos',
        editGeom: 'Editar geometría',
        continueLine: 'Continuar dibujando desde aquí',
        selectDrawType: 'Tipo de geometría para dibujar',
        uploadToLayer: 'Subir archivo a la capa seleccionada',
        uploadFeatures: 'Subida de elementos a la capa',
        validFeatures: 'Válidas',
        invalidFeatures: 'Invalidas',
        loading: 'Cargando...',
        toggleVisibility: 'Cambiar visibilidad de la capa',
        fullscreen: 'Pantalla completa',
        close: 'Cerrar',
        multipleValues: 'Valores múltiples',
        editElements: 'Editar elementos ({})',
        multipleEditNotice:
            'Edición múltiple activada. Los cambios se aplicarán a los {} elementos seleccionados.',
        geoserverLayers: 'Capas de GeoServer'
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
