(function () {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            })
        ],
        target: 'map',
        view: new ol.View({
            center: [-57.11345, -36.28140],
            //center: [-6765571,-4349511],
            zoom: 15,
            projection: 'EPSG:4326'
        }),
    });

    var edit = new Wfst(map,
        {
            layers: ['vuelos'],
            layerMode: 'wfs',
            wfsStrategy: 'bbox',
            urlWfs: 'http://localhost:8080/geoserver/dipsohdev/wfs',
            urlWms: 'http://localhost:8080/geoserver/dipsohdev/wms',
            editMode: 'button'
        }
    );

})();