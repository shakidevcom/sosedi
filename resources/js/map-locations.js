// var DG = require('2gis-maps');
global.$ = global.jQuery = require('jquery');

window.set_point = false;
window.Geo = {
    map: null,
    init: function () {
        DG.then(function () {
            return DG.plugin(["/js/src/plugin/Leaflet.Canvas-Marker-layer.js"]);
        }).then(function () {
            Geo.map = DG.map('map', {
                preferCanvas: true,
                center: [
                    51.1800995, 71.4459763
                ],
                zoom: 12,
                zoomControl: false,
                fullscreenControl: false
            });

            window.ciLayer = L.canvasMarkerLayer({}).addTo(Geo.map);
        }).then(function () {
            let iconRed = L.icon({
                iconUrl: '/images/pinRed.png',
                iconSize: [28, 40],
                iconAnchor: [14, 20]
            });
            let iconGreen = L.icon({
                iconUrl: '/images/pinGreen.png',
                iconSize: [28, 40],
                iconAnchor: [14, 20]
            });
            let iconYellow = L.icon({
                iconUrl: '/images/pinYellow.png',
                iconSize: [28, 40],
                iconAnchor: [14, 20]
            });
            for (let location of window.locations) {
                if(typeof location.Latitude === "undefined"){
                    continue;
                }
                let icon = iconGreen;
                if(location.Signal < -80 && location.Signal > -95){
                    icon = iconYellow;
                }
                if(location.Signal < -95){
                    icon = iconRed;
                }
                L.marker([location.Latitude,location.Longitude], {icon: icon}).bindTooltip("Network: "+location.Network+"<br>"+"Signal: "+location.Signal+"<br>"+"Operator: "+location.Operator,
                    {permanent: false, direction: "auto"}
                ).addTo(Geo.map);
                // window.ciLayer.addLayer(marker);

            }
        })
    },
}


Geo.init();
