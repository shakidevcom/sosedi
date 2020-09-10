// var DG = require('2gis-maps');
global.$ = global.jQuery = require('jquery');
global.maskeed_input = $.extend(require('jquery-mask-plugin'));




window.path_modal_plugin = $('meta[name="path_modal_plugin"]').attr('content');
window.latlng = [];
window.userLocation = JSON.parse($('meta[name="location"]').attr('content'));
window.sos_locations = JSON.parse($('meta[name="sos"]').attr('content'));
window.hash = $('meta[name="hash"]').attr('content');
window.set_point = false;
window.Geo = {
    map: null,
    init: function () {
        DG.then(function () {
            return DG.plugin([path_modal_plugin,"/js/src/plugin/Leaflet.Canvas-Marker-layer.js"]);
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
            const ciLayer = L.canvasMarkerLayer({}).addTo(Geo.map);
            ciLayer.addOnClickListener(function (e,data) {
                let meta = data[0].data.options.data;
                closeMenu("stats_menu");
                $(".sos_comment").text(meta.comment);
                $(".sos_phone").html("<a href='tel:data.phone'>"+meta.phone+"</a>");
                $(".sos_fio").text(meta.fio);
                $(".sos_menu").show();
                openMenu("sos_menu");
            });

            function setPopup(data, me = false) {
                let icon = L.icon({
                    iconUrl: '/images/sos.svg',
                    iconSize: [48, 48],
                    iconAnchor: [24, 24]
                });
                let icons = L.icon({
                    iconUrl: '/images/sos-icon-new.png',
                    iconSize: [48, 48],
                    iconAnchor: [24, 24]
                });

                let latlng = JSON.parse(data.latlng);

                if (typeof latlng.lat !== "undefined") {
                    if (me) {
                        if (typeof window.my_sos_marker !== "undefined") {
                            window.my_sos_marker.remove();
                        }
                        window.my_sos_marker = L.marker(latlng, {icon: icon,zIndexOffset: 1000}).on("click",function(){
                            closeMenu("stats_menu");
                            if(typeof data.show !== "undefined" && data.show == false){
                                $(".in_moderation").show();
                            }else{
                                $(".in_moderation").hide();
                            }
                            $(".sos_comment").text(data.comment);
                            $(".sos_phone").html("<a href='tel:"+data.phone+"'>"+data.phone+"</a>");
                            $(".sos_fio").text(data.fio);
                            $(".sos_menu").show();
                            openMenu("sos_menu");
                        }).addTo(Geo.map);
                    } else {
                        let marker = L.marker(latlng, {icon: icons,zIndexOffset: 1000,data:{
                            fio: data.fio,
                            phone: data.phone,
                            comment: data.comment,
                            }});
                        ciLayer.addLayer(marker);
                    }
                }
            }

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

            window.notification_control = L.control.window(map, {
                title: "Социальная помощь (для нуждающихся)",
                maxWidth: 400,
                padding: "16px",
                modal: true,
                position: "top"
            })
                .content('<form class="form" enctype="multipart/form-data">\n' +
                    '<div class="location_not_found" style="border: 1px dotted #000000;padding: 12px;width: 100%"><label style="color:red"><strong>Ваше местоположение не определено.</strong></label><br>\n' +
                    '<p>Чтобы выбрать свое местоположение, воспользуйтесь геолокацией (кнопка сверху справа) или нажмите на кнопку ниже и поставьте метку в нужное место. Также вы можете переносить маркер, зажимая его.</p>\n' +
                    '<button type="button" onclick="setMe(event)" style="border: 1px solid #000000!important;margin:0;color:#000000;text-align: center;width: 100%;padding:4px">Выбрать местоположение</button><br></div>\n' +
                    '<label><strong>ФИО:</strong></label>\n' +
                    '<input value="" type="text" name="fio" placeholder="Ваши ФИО" required>\n' +
                    '<label><strong>Телефон: </strong></label>\n' +
                    '<input type="text" name="phone" id="phone_number" autocomplete="off" required>\n' +
                    '<label><strong>Комментарии: </strong></label>\n' +
                    '<textarea placeholder="Опишите вашу проблему. Не забудьте оставить банковские реквизиты." rows="5" cols="5" name="comment"></textarea>\n' +
                    // '<label><strong>Фотографии: </strong></label>\n' +
                    // '<input type="file" name="files[]" multiple accept=".png,.jpg,.jpeg">\n' +
                    // '<div class="sos_files"></div>\n' +
                    '<input type="button" class="save_sos" value="Сохранить">\n' +
                    '</form>');

            $('[name="files"]').on("change", function () {
                $(".sos_files").html("");
                readURL(this);
            });

            function readURL(input) {
                if (input.files && input.files[0]) {
                    for (let file of input.files) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $(".sos_files").append("<img src=" + e.target.result + ">");
                        }
                        reader.readAsDataURL(file);
                    }

                }
            }

            $("textarea").on("click", function () {
                $(this).focus();
            });
            $("textarea").on("focus", function () {
                $(this).addClass("mobile-textarea");
                var $this = this;
                $(".modal").on("click", function (ev) {
                    if (!$(ev.target).hasClass('mobile-textarea')) {
                        $($this).focusout();
                        $($this).removeClass("mobile-textarea")
                    }
                })
            });
            $("textarea").on("focusout", function () {
                $(".modal").off("click");
                $(this).removeClass("mobile-textarea")
            });
            $(".save_sos").on("click", function (e) {
                e.preventDefault();
                let form = $(this).closest('form');
                let serialized_data = {};
                $.each(form.serializeArray(), function () {
                    serialized_data[this.name] = this.value;
                });
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
                    window.notification_control.hide();
                    setPopup(serialized_data, true);
                    Geo.map.fitBounds(L.latLngBounds([window.latlng]), {maxZoom: 15});
                }).fail(function( jqXHR, textStatus, errorThrown ) {
                    alert("Произошла ошибка");
                });
            });
            $('#phone_number').mask('+9(999)9999999', {placeholder: "+7(777)7777777"});

            window.notification_control.on("show", function () {
                $(".support").hide();
                if (typeof window.latlng.lat !== "undefined") {
                    if (typeof localStorage.sos !== "undefined" && localStorage.sos.length > 0) {
                        let data = JSON.parse(localStorage.sos);
                        $('[name="address"]').val(data.address);
                        $('[name="fio"]').val(data.fio);
                        $('[name="phone"]').val(data.phone);
                        $('[name="comment"]').val(data.comment);
                    }
                    $(".save_sos").removeAttr("disabled");
                    $(".save_sos").val("Сохранить");
                    $(".save_sos").css("background-color", "#4caf50");
                    $(".location_not_found").hide();
                } else {
                    $(".save_sos").val("Выберите местоположение");
                    $(".save_sos").css("background-color", "#000000");
                    $(".location_not_found").show();
                    $(".save_sos").attr("disabled", "disabled");
                }
            }).on("hide close", function () {
                $(".support").show();
            });
            L.NewNotificationControl = L.EditControl.extend({
                options: {
                    position: 'topleft',
                    callback: function (e) {
                        window.notification_control.show();
                    },
                    kind: 'Уведомления',
                    html: '<img src="/images/sos.png" style="width: 48px!important;height: 48px!important;max-width:initial">'
                }
            });
            Geo.map.addControl(new L.NewNotificationControl());
            // L.NewMenuControl = L.EditControl.extend({
            //     options: {
            //         position: 'bottomright',
            //         callback: function (e) {
            //             if ($(".cd-faq__items").hasClass("cd-faq__items--slide-in")) {
            //                 closeMenu();
            //             } else {
            //                 openMenu("stats_menu");
            //             }
            //         },
            //         kind: 'Меню',
            //         html: '<img src="/images/menu.svg" style="position:relative;bottom:15px;right:4px">'
            //     }
            // });
            // Geo.map.addControl(new L.NewMenuControl());
            for (let sos_l of sos_locations) {
                let check = false;
                if(typeof localStorage.sos !== "undefined"){
                    let data = JSON.parse(localStorage.sos);
                    check = data['id'] === sos_l['id'];
                }
                setPopup(sos_l, check);
            }
                window.navigator.geolocation.getCurrentPosition(function (pos) {
                    findMe({lat: pos.coords.latitude, lng: pos.coords.longitude});
                });

                Geo.map.on("click", function (ev) {
                    if (window.set_point) {
                        findMe(ev.latlng)
                    }
                });
        })
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
$(window).on("load", function () {
    openMenu("stats_menu");
    $("#map,.modal").on("click", function () {
        if ($(".cd-faq__close-panel").hasClass("cd-faq__close-panel--move-left")) {
            closeMenu()
        }
    });
});
window.setMe = function (e) {
    e.preventDefault();
    window.notification_control.hide();
    window.set_point = true;
}

function getPopup(form) {
    let fio = typeof form['fio'] !== "undefined" ? form['fio'] : "";
    let phone = typeof form['phone'] !== "undefined" ? form['phone'] : "";
    let address = typeof form['address'] !== "undefined" ? form['address'] : "";
    let comment = typeof form['comment'] !== "undefined" ? form['comment'] : "";
    var popup = L.popup()
        .setContent("<div class='popup_panel'><div><b>Адрес:</b> " + address + "</div><div><b>ФИО:</b> " + fio + "</div><div><b>Телефон:</b> " + phone + "</div><div><b>Комментарии:</b> " + comment + "</div></div>");
    return popup;
}

$("#close").on("click", function (e) {
    e.preventDefault();
    closeMenu();
});

function openMenu(name) {
    $(".cd-faq__close-panel").addClass("cd-faq__close-panel--move-left");
    $(".cd-faq__overlay").addClass("cd-faq__items--slide-in");
    $("." + name).addClass("cd-faq__items--slide-in");
}

function closeMenu() {
    $(".cd-faq__items--slide-in").removeClass("cd-faq__items--slide-in");
    $(".cd-faq__close-panel--move-left").removeClass("cd-faq__close-panel--move-left");
    $(".cd-faq__overlay--is-visible").removeClass("cd-faq__overlay--is-visible");
}