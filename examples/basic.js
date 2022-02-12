(function () {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            })
        ],
        target: 'map',
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [-57.11345, -36.28140], // EPSG:4326
            zoom: 13,
            //projection: 'EPSG:3857',
            //center: [-6451546, -4153545]
        })
    });

    var password = 123456;
    var username = 'username';

    var wfst = new Wfst({
        geoServerUrl: 'http://localhost:8080/geoserver/dipsoh/ows',
        geoServerAdvanced: {
            getCapabilitiesVersion: '1.3.0',
            getFeatureVersion: '1.0.0',
            describeFeatureTypeVersion: '1.1.0',
            lockFeatureVersion: '1.1.0',
            wfsTransactionVersion: '1.1.0',
            projection: 'EPSG:3857'
        },
        // Maybe you wanna add this on a proxy, at the backend
        headers: { 'Authorization': 'Basic ' + btoa(username + ":" + password) },
        layers: [
            {
                name: 'fotos_edit',
                label: 'Fotos',
                mode: 'wfs',
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#000000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: [255, 0, 0],
                            width: 2
                        })
                    })
                }),
                zIndex: 2
            },
            {
                name: 'vuelos_edit',
                label: 'Vuelos',
                mode: 'wfs',
                zIndex: 1
            }
        ],
        language: 'en',
        minZoom: 12,
        showUpload: true,
        beforeInsertFeature: function (feature) {
            feature.set('customProperty', 'customValue', true);
            return feature;
        }

    });

    // Events
    wfst.on(['getCapabilities', 'getFeaturesLoaded'], function (evt) {
        console.log(evt.type, evt.data);
    });

    wfst.on(['describeFeatureType', 'getFeature'], function (evt) {
        console.log(evt.type, evt.layer, evt.data);
    });

    wfst.on(['modifystart', 'modifyend', 'drawstart', 'drawend'], function (evt) {
        console.log(evt.type, evt);
    });

    map.addControl(wfst);

})();