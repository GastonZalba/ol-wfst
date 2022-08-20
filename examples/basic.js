(function () {

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
            })
        ],
        target: 'map',
        view: new ol.View({
            // projection: 'EPSG:4326',
            // center: [-57.11345, -36.28140], // EPSG:4326
            zoom: 12,
            projection: 'EPSG:3857',
            center: [-6451546, -4153545]
        })
    });

    var password = 123456;
    var username = 'username';

    var wfst = new Wfst({
        geoServerUrl: 'http://localhost:8080/geoserver/dipsohdev/ows',
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
                name: 'vuelos_edit',
                label: 'Vuelos',
                mode: 'wfs',
                zIndex: 1,
                wfsStrategy: 'bbox',
                cqlFilter: 'registroid < 500', // Use this to test errors
                geoServerVendor: {
                    // cql_filter: 'id = 5', // Use this to test errors
                    maxFeatures: 500
                },
            },
            {
                name: 'fotos_edit',
                label: 'Fotos',
                mode: 'wms',
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
                zIndex: 2,
                geoServerVendor: {
                    maxFeatures: 500
                },
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
    wfst.on(['getCapabilities'], function (evt) {
        console.log(evt.type, evt.data);
    });

    wfst.on(['describeFeatureType', 'getFeature'], function (evt) {
        console.log(evt.type, evt.layer, evt.data);
    });

    wfst.on(['modifystart', 'modifyend', 'drawstart', 'drawend', 'load', 'visible'], function (evt) {
        console.log(evt.type, evt);
    });

    wfst.on('describeFeatureType', (evt) => {

        const layername = evt.layer;

        const searchOther = () => {
            const layer = wfst.getLayers(layername);
            const source = layer.getSource();
            if (select.value && input.value) {
                source.setCqlFilter(`${select.value} = ${input.value}`);
            } else {
                source.setCqlFilter(null);
            }
        }

        const container = document.createElement('div');
        container.style = 'margin:25px 0;'
        container.innerHTML = `<div>Filter features by layer: ${evt.layer}</div>`;

        const input = document.createElement('input')
        input.type = 'text';

        const select = document.createElement('select');

        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Filter';
        button.onclick = searchOther;

        try {

            evt.data.featureTypes[0].properties.forEach(prop => {
                const opt = document.createElement('option');
                opt.value = prop.name;
                opt.innerHTML = prop.name;
                select.appendChild(opt);
            });

        } catch (err) {
            console.error(err);
        }

        container.append(input, select, button);
        document.getElementById('testButtons').append(container);

    });

    map.addControl(wfst);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.innerHTML = 'Add random point';

    const randNumber = () => {
        return Math.floor(Math.random() * 90 + 10)
    }
    addButton.onclick = async () => {
        const coords = [`-57.11${randNumber()}`, `-36.28${randNumber()}`];

        const feat = new ol.Feature({
            geometry: new ol.geom.MultiPoint([coords])
        });
        const inserted = await wfst.insertFeaturesTo('fotos_edit', [feat]);

        if (inserted) {
            alert(`Feature inserted at ${coords.join(',')}`);
        } else {
            alert('Feature not inserted');
        }

        feature_to_copy = null;
    };

    document.getElementById('testButtons').append(addButton);

})();