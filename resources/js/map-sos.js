import 'bootstrap';
global.$ = global.jQuery = require('jquery');
global.maskeed_input = $.extend(require('jquery-mask-plugin'));
window.path_modal_plugin = $('meta[name="path_modal_plugin"]').attr('content');
window.latlng = [];
window.userLocation = JSON.parse($('meta[name="location"]').attr('content'));
window.hash = $('meta[name="hash"]').attr('content');
window.set_point = false;
window.Geo = {
    map: null,
    init: function () {
        DG.then(function () {
            return DG.plugin([path_modal_plugin, "/js/src/plugin/Leaflet.Canvas-Marker-layer.js"]);
        }).then(function () {
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
            window.openMenu = function (name) {
                document.getElementById(name).classList.add("cd-faq__items--slide-in");
                document.getElementById("close").classList.add("cd-faq__close-panel--move-left");
                document.getElementById("overlay_menu").classList.add("cd-faq__items--slide-in");
            }
            window.closeMenu = function () {
                document.getElementById("stats_menu").classList.remove("cd-faq__items--slide-in");
                $("#sos_menu").css("transform", "translateZ(0) translateX(100%)");
                $("#close").css("right", "-40px");
                document.getElementById("close").classList.remove("cd-faq__close-panel--move-left");
                document.getElementById("overlay_menu").classList.remove("cd-faq__items--slide-in");
            }
        }).then(function () {
            window.ciLayer = L.canvasMarkerLayer({}).addTo(Geo.map);
            window.ciLayer.addOnClickListener(function (e, data) {
                if (typeof data[0].data.options.data !== "undefined") {
                    let meta = data[0].data.options.data;
                    $(".sos_comment").text(meta.comment);
                    $(".sos_phone").html("<a href='tel:"+meta.phone+"'>"+meta.phone+"</a>");
                    $(".sos_fio").text(meta.fio);
                    $(".sos_id").val(meta.id);
                    $("#locationModal").modal('show');
                }
            });
        }).then(function () {

            $('[name=phone]').mask('+9(999)9999999', {placeholder: "+7(777)7777777"});

            $("#SOSModal").on("shown.bs.modal", function () {
                if (typeof window.latlng.lat !== "undefined") {
                    if (typeof localStorage.sos !== "undefined" && localStorage.sos.length > 0) {
                        let data = JSON.parse(localStorage.sos);
                        $('[name="email"]').val(data.email);
                        $('[name="fio"]').val(data.fio);
                        $('[name="phone"]').val(data.phone);
                        $('[name="comment"]').val(data.comment);
                    }
                    $(".save_sos").removeAttr("disabled");
                    $(".location_not_found").hide();
                } else {
                    $(".location_not_found").show();
                    $(".save_sos").attr("disabled", "disabled");
                }
            });
            $.get('/api/information').done(function (json) {
                var icon_sos = L.icon({
                    iconUrl: '/images/sos-icon-new.png',
                    iconSize: [48, 48],
                    iconAnchor: [24, 24]
                });

                function setSos(data) {
                    let latlng = JSON.parse(data.latlng);
                    if (typeof latlng.lat !== "undefined") {
                        let sos_marker = L.marker(latlng, {
                            icon: icon_sos, data: {
                                fio: data.fio,
                                phone: data.phone,
                                comment: data.comment,
                                id: data.id,
                            }
                        });
                        window.ciLayer.addLayer(sos_marker);
                    }
                }

                for (let sos of json.sos) {
                    setSos(sos);
                }
            })
        }).then(function () {
            $("#map,.modal").on("click", function () {
                let selector = $(".cd-faq__close-panel");
                if (selector.hasClass("cd-faq__close-panel--move-left") || $("#sos_menu").css("transform") === "matrix(1, 0, 0, 1, 0, 0)") {
                    window.closeMenu()
                }
            });
            $("#close").on("click", function (e) {
                e.preventDefault();
                window.closeMenu();
            });


            $(".save_sos").on("click", function (e) {
                e.preventDefault();
                let form = $(this).closest('form');
                let serialized_data = {};
                $.each(form.serializeArray(), function () {
                    serialized_data[this.name] = this.value;
                });

                if (serialized_data['fio'].length < 4 || serialized_data['comment'].length < 4 || serialized_data['phone'].length < 4) {
                    alert("Заполните все поля");
                    return;
                }

                serialized_data['latlng'] = JSON.stringify(window.latlng);
                if (typeof localStorage.sos !== "undefined" && localStorage.sos.length > 0) {
                    let data = JSON.parse(localStorage.sos);
                    serialized_data['id'] = data.id;
                    serialized_data['hash'] = data.hash;
                } else {
                    serialized_data['hash'] = window.hash;
                }

                $.get("/save_sos", serialized_data).done(function (data) {
                    localStorage.sos = JSON.stringify(data);
                    $("#SOSModal").modal('hide')
                    Geo.map.fitBounds(L.latLngBounds([window.latlng]), {maxZoom: 15});
                    alert("Ваша заявка отправлена на модерацию!");
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Произошла ошибка");
                });
            });

            window.navigator.geolocation.getCurrentPosition(function (pos) {
                findMe({lat: pos.coords.latitude, lng: pos.coords.longitude});
            });

            Geo.map.on("click", function (ev) {
                if (window.set_point) {
                    findMe(ev.latlng)
                }
            });
        });
    },
}

function findMe(latlng) {
    window.latlng = latlng;
    if (typeof window.my_marker !== "undefined") {
        window.my_marker.remove();
    }
    let icon = L.icon({
        iconUrl: '/images/me.png',
        iconSize: [36, 36],
        popupAnchor: [0, -18]
    });
    window.my_marker = L.marker(latlng, {
        icon: icon,
        draggable: true,
        zIndexOffset: 99999999
    }).on('dragend', function (ev) {
        var newLatLng = new L.LatLng(ev.target.getLatLng().lat, ev.target.getLatLng().lng);
        window.my_marker.setLatLng(newLatLng);
        window.latlng = ev.target.getLatLng();
    }).addTo(Geo.map);
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
window.setMe = function (e) {
    e.preventDefault();
    $("#SOSModal").modal('hide')
    window.set_point = true;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

$(".i_helped").on("click",function () {
    let comment = $("[name=helped_comment]").val();
    let phone = $("[name=helped_phone]").val();
    let sos_id = $(".sos_id").val();
    var $this = $(this);
    $.get('/i_helped',{comment:comment,sos_id:sos_id,phone:phone}).done(function() {
        alert("Ваша заявка успешно отправлена!");
        $this.attr('disabled','disabled');
        $("[name=helped_comment]").val("");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert("Произошла ошибка");
    });
});
