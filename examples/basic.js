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
            //center: [-6451546,-4153545],
            zoom: 15,
            projection: 'EPSG:4326'
        }),
        controls: []
    });

    var password = 123456;
    var username = 'username';

    var wfst = new Wfst(map,
        {
            geoServerUrl: 'http://localhost:8080/geoserver/myworkspace/ows',
            headers: { 'Authorization': 'Basic ' + btoa(username + ":" + password) },
            layers: [
                {
                    name: 'myPointsLayer',
                    label: 'Photos'
                },
                {
                    name: 'myMultiGeometryLayer',
                    label: 'Other elements'
                }
            ],
            layerMode: 'wfs',
            wfsStrategy: 'bbox',
            language: 'en',
            minZoom: 12,
            showUpload: true,
            beforeInsertFeature: function (feature) {
                feature.set('customProperty', 'customValue', true);
                return feature;
            }

        }
    );

})();