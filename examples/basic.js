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

    var geoserver = new Wfst.Geoserver({
        url: 'http://localhost:8080/geoserver/dipsohdev/ows',
        advanced: {
            getCapabilitiesVersion: '1.3.0',
            getFeatureVersion: '1.0.0',
            describeFeatureTypeVersion: '1.1.0',
            lockFeatureVersion: '1.1.0',
            wfsTransactionVersion: '1.1.0',
            projection: 'EPSG:3857'
        },
        // Maybe you wanna add this on a proxy, at the backend
        headers: { 'Authorization': 'Basic ' + btoa(username + ":" + password) }
    });

    var layerPhotos = new Wfst.WmsLayer({
        name: 'fotos_edit',
        label: 'Fotos',
        geoserver: geoserver,
        // style: new ol.style.Style({
        //     image: new ol.style.Circle({
        //         radius: 7,
        //         fill: new ol.style.Fill({
        //             color: '#000000'
        //         }),
        //         stroke: new ol.style.Stroke({
        //             color: [255, 0, 0],
        //             width: 2
        //         })
        //     })
        // }),
        minZoom: 12,
        zIndex: 2,
        geoserverVendor: {
            maxFeatures: 500
        },
        beforeTransactFeature: function (feature, transactionType) {
            if (transactionType === 'insert') {
                // Add a custom value o perform an action before insert features
                feature.set('customProperty', 'customValue', true);
            }
            return feature;
        }
    });

    var layerFlyPaths = new Wfst.WfsLayer({
        name: 'vuelos_edit',
        label: 'Vuelos',
        geoserver: geoserver,
        minZoom: 12,
        zIndex: 1,
        strategy: ol.loadingstrategy.bbox,
        geoserverVendor: {
            // cql_filter: 'id = 5', // Use this to test errors
            maxFeatures: 500
        },
        beforeTransactFeature: function (feature, transactionType) {
            if (transactionType === 'insert') {
                // Add a custom value o perform an action before insert features
                feature.set('customProperty', 'customValue', true);
            }
            return feature;
        }
    })

    var wfst = new Wfst({
        layers: [
            layerPhotos,
            layerFlyPaths
        ],
        language: 'en',
        showUpload: true
    });

    // Events
    geoserver.on(['change:capabilities'], function (evt) {
        console.log(geoserver.getCapabilities());
    });

    wfst.on(['describeFeatureType'], function (evt) {
        console.log(evt.type, evt.layer, evt.data);
    });

    wfst.on(['modifystart', 'modifyend', 'drawstart', 'drawend', 'load'], function (evt) {
        console.log(evt.type, evt);
    });

    wfst.on('describeFeatureType', ({ layer, data }) => {

        const searchOther = () => {
            const source = layer.getSource();
            if (select.value && input.value) {
                source.setCqlFilter(`${select.value} = ${input.value}`);
            } else {
                source.setCqlFilter(null);
            }
        }

        const container = document.createElement('div');
        container.style = 'margin:25px 0;'
        container.innerHTML = `<div>Filter features by layer: ${layer.get('name')}</div>`;

        const input = document.createElement('input')
        input.type = 'text';

        const select = document.createElement('select');

        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Filter';
        button.onclick = searchOther;

        try {
            data._parsed.properties.forEach(prop => {
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
        const inserted = await layerPhotos.insertFeatures([feat]);

        if (inserted) {
            alert(`Feature inserted at ${coords.join(',')}`);
        } else {
            alert('Feature not inserted');
        }

        feature_to_copy = null;
    };

    document.getElementById('testButtons').append(addButton);

})();