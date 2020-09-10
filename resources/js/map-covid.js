global.$ = global.jQuery = require('jquery');
window.userLocation = JSON.parse($('meta[name="location"]').attr('content'));
window.Geo = {
    map: null,
    init: function () {
        DG.then(function () {
            Geo.map = DG.map('map', {
                preferCanvas: true,
                center: [
                    userLocation.lat, userLocation.lon
                ],
                zoom: 12,
                editable: true,
                zoomControl: false,
                fullscreenControl: false
            });
            DG.control.location({
                drawCircle: true,
                follow: false,
                stopFollowingOnDrag: true,
                watch: false,
                position: 'topright'
            }).addTo(Geo.map);
            Geo.map.on('locationfound', function (ev) {
                Geo.map.stopLocate();
                findMe(ev.latlng);
            });
        }).then(function () {
            L.EditControl = L.Control.extend({
                options: {
                    position: 'topleft',
                    callback: null,
                    kind: '',
                    html: '',
                    is_zone: false,
                },
                onAdd: function (map) {
                    var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                        link = L.DomUtil.create('a', '', container);
                    link.href = '#';
                    link.title = this.options.kind;
                    link.innerHTML = this.options.html;
                    L.DomEvent.on(link, 'click', L.DomEvent.stop)
                        .on(link, 'click', function () {
                            window.LAYER = this.options.callback.call(map.editTools);
                        }, this);
                    return container;
                }
            });

            L.NewMenuControl = L.EditControl.extend({
                options: {
                    position: 'bottomright',
                    callback: function (e) {
                        if($(".cd-faq__items").hasClass("cd-faq__items--slide-in")){
                            closeStats();
                        }else{
                            openStats();
                        }
                    },
                    kind: 'Меню',
                    html: '<img src="/images/menu.svg" style="position:relative;bottom:15px;right:4px">'
                }
            });
            Geo.map.addControl(new L.NewMenuControl());

            $.get('/api/information').done(function (json) {
                json = JSON.parse(json);
                if (json.length > 0) {
                    let icon = L.icon({
                        iconUrl: '/images/map-point.png',
                        iconSize: [32, 32], // size of the icon
                        popupAnchor: [0, -15]
                    });
                    let default_zone = "Зараженный";
                    for (let info of json) {
                        let count = default_zone;
                        let marker;
                        if (info.status === 1) {
                            L.circle(info.latlng, {radius: info.radius, color: 'rgb(230, 0, 0)'}).addTo(Geo.map);
                            if (typeof info.information.source !== "undefined" && info.information.source.length > 0) {
                                count += "<br> Источник: " + info.information.source
                            }
                            marker = L.marker(info.latlng, {icon: icon}).bindTooltip(count,
                                {permanent: false, direction: "auto"}
                            );
                        } else {
                            marker = new L.CircleMarker(info.latlng, {
                                stroke: true,
                                radius: 5
                            }).bindTooltip("Место регистрации гражданина,<br>контактировавшего с зараженным<br> Источник: <a href='https://egov.kz/cms/ru/articles/covid-map'>egov.kz</a>",
                                {permanent: false, direction: "auto"}
                            ).removeEventListener("mousemove mouseover mouseout");
                        }
                        marker.addTo(Geo.map);
                    }
                }
            }).then(function () {
                window.navigator.geolocation.getCurrentPosition(function (pos) {
                    findMe([pos.coords.latitude, pos.coords.longitude]);
                })
            });
        })
    },
}

function findMe(latlng) {
    if (typeof window.my_marker !== "undefined") {
        window.my_marker.remove();
    }
    let icon = L.icon({
        iconUrl: '/images/me.png',
        iconSize: [32, 32],
        popupAnchor: [0, -15]
    });
    window.my_marker = L.marker(latlng, {icon: icon}).addTo(Geo.map);
    Geo.map.fitBounds(L.latLngBounds([latlng]), {maxZoom: 15});
}

Geo.init();

var $tabs = $(".js-covid-tab");
var $contents = $(".js-covid-content");
$tabs.on("click", function () {
    $tabs.removeClass("active");
    $contents.removeClass("active");
    $(this).addClass("active");
    $contents.filter(":eq(" + $(this).index() + ")").addClass("active")
})
$(window).on("load", function () {
    openStats();
    $("#map").on("click", function () {
        if($(".cd-faq__close-panel").hasClass("cd-faq__close-panel--move-left")){
            closeStats()
        }
    });
});
$("#close").on("click", function (e) {
    e.preventDefault();
    closeStats();
});
function openStats() {
    $(".cd-faq__close-panel").addClass("cd-faq__close-panel--move-left");
    $(".cd-faq__overlay").addClass("cd-faq__items--slide-in");
    $(".cd-faq__items").addClass("cd-faq__items--slide-in");
}
function closeStats() {
    $(".cd-faq__close-panel--move-left").removeClass("cd-faq__close-panel--move-left");
    $(".cd-faq__overlay--is-visible").removeClass("cd-faq__overlay--is-visible");
    $(".cd-faq__items--slide-in").removeClass("cd-faq__items--slide-in");
}