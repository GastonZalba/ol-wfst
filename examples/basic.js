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

    var edit = new Wfst(map,
        {
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
            geoServerUrl: 'http://localhost:8080/geoserver/dipsohdev/ows',
            minZoom: 12,
            upload: true,
            beforeInsertFeature: function (feature) {
                feature.set('registroid', 12345, true);
                return feature;
            }

        }
    );

})();