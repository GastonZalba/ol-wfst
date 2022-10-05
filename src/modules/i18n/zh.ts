import { I18n } from '../../ol-wfst';

export const zh: I18n = {
    labels: {
        select: '选择',
        addElement: '切换绘图类型',
        editElement: '编辑元素',
        save: '保存',
        delete: '删除',
        cancel: '取消',
        apply: '确认并应用改变',
        upload: '上传',
        editMode: '编辑模式',
        confirmDelete: '确认删除元素?',
        geomTypeNotSupported: '图层不支持该几何',
        editFields: '编辑区域',
        editGeom: '编辑几何',
        selectDrawType: '几何类型',
        uploadToLayer: '通过文件上传图层',
        uploadFeatures: '上传元素到图层',
        validFeatures: '合法的几何类型',
        invalidFeatures: '不合法',
        loading: '加载中...',
        toggleVisibility: '切换图层透明度',
        close: '关闭'
    },
    errors: {
        capabilities: '无法加载GeoServer服务所支持的能力.',
        wfst: 'GeoServer不支持事务',
        layer: '无法从图层获得数据',
        layerNotFound: 'Layer not found',
        layerNotVisible: 'Layer is not visible',
        noValidGeometry: '不支持的几何类型无法加载到图层',
        geoserver: '无法从GeoServer获取数据',
        badFormat: '不支持的格式',
        badFile: '读取文件数据出错',
        lockFeature: '无法锁定GeoServer上的元素.',
        transaction: 'GeoServer处理事务出错.',
        getFeatures: '从GeoServer获取元素出错.'
    }
};
