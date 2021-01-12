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
        controls: []
    });

    var password = 123456;
    var username = 'dphimagen';
    
    var edit = new Wfst(map,
        {
            geoServerUrl: 'http://localhost:8080/geoserver/dipsohdev/ows',
            headers: { 'Authorization': 'Basic ' + btoa(username + ":" + password) },
            layers: [
                {
                    name: 'vuelos'
                },
                {
                    name: 'fotos'
                },
                {
                    name: 'mapeos'
                }
            ],
            layerMode: 'wfs',
            wfsStrategy: 'bbox',
            minZoom: 12,
            upload: true,
            beforeInsertFeature: function (feature) {
                feature.set('registroid', 12345, true);
                return feature;
            }

        }
    );

})();