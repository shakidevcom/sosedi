global.$ = global.jQuery = require('jquery');
global.maskeed_input = $.extend(require('jquery-mask-plugin'));
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
});

window.userLocation = JSON.parse($('meta[name="location"]').attr('content'));
window.plan = $('meta[name="plan"]').attr('content');
window.information = JSON.parse($('meta[name="information"]').attr('content'));
window.editable_plugin = $('meta[name="editable_plugin"]').attr('content');
window.path_drag_plugin = $('meta[name="path_drag_plugin"]').attr('content');
window.path_modal_plugin = $('meta[name="path_modal_plugin"]').attr('content');
window.url_save_in_storage = $('meta[name="url_save_in_storage"]').attr('content');
window.path_print_plugin = $('meta[name="path_print_plugin"]').attr('content');
window.is_print = $('meta[name="is_print"]').attr('content') == "true" ? true : false;
window.zone_id = $('meta[name="id"]').attr('content');
window.enable_point = true;

function is_mobile() {
    return ((window.innerWidth <= 800) && (window.innerHeight <= 600));
}

class GeoObj {
    constructor() {
        this.layers = [];
        this.markers = [];
        this.informations = [];
        this.colors = [
            'rgb(230, 0, 0)',
            // '#0000ff',
            // '#ff00ff',
            // '#008000',
            // '#ffa500',
            // '#666666',
            // '#000000'
        ];
    }

    setInformation(index, information) {
        this.layers[index].information = information;
        this.saveInStorage();
        this.refresh();
    }

    getInformation(index) {
        return this.layers[index].information;
    }

    setLayers(layer, information = null, save = true) {
        if (typeof layer.feature !== "undefined") {
            layer.layer = layer.feature;
        }
        if (information === null) {
            layer.information = {
                name: "",
                price_distance: "",
                price_time: "",
                price_wait: "",
                min_price: "",
                min_distance: "",
                min_time: "",
            };
        } else {
            layer.information = information;
        }
        this.layers.push(layer);
        // this.refresh(save);
        return layer;
    }


    updateLayers(layer) {
        if (typeof layer.feature !== "undefined") {
            layer.layer = layer.feature;
        }
        for (const [index, _layer] of this.layers.entries()) {
            if (layer.layer._leaflet_id == _layer.layer._leaflet_id) {
                this.layers[index] = layer;
                this.layers[index].information = _layer.information;
            }
        }
        this.refresh();
    }


    getColor(index) {
        if (typeof this.colors[index] === "undefined") {
            index = this.colors.length - 1;
        }
        return this.colors[index];
    }

    removeLayer(id, save = true) {
        for (const [index, layer] of this.layers.entries()) {
            if (layer.layer._leaflet_id == id) {
                layer.layer.unbindTooltip();
                if (save) {
                    this.layers.splice(index, 1);
                }
                break;
            }
        }
        this.refresh(save);
    }

    showOnly(id) {
        this.clearLayer(id);
    }

    showAll() {
        this.clearLayer(0);
        this.layers = [];
        render(0);
    }

    sort(oldIndex, newIndex) {
        let cache = this.layers[oldIndex];
        this.layers.splice(oldIndex, 1);
        this.layers.splice(newIndex, 0, cache);
        this.refresh();
    }

    clearLayer(id) {
        var $this = this;
        var list = [];
        for (let [index, layer] of this.layers.entries()) {
            if (id != layer.layer._leaflet_id) {
                list.push(layer.layer._leaflet_id);
            } else {
                Geo.map.fitBounds(layer.layer.getBounds());
            }
        }
        return new Promise(function (resolve, reject) {
            Geo.map.eachLayer(function (layer) {
                if (list.includes(layer._leaflet_id)) {
                    Geo.map.removeLayer(layer);
                    $this.removeLayer(layer._leaflet_id, false);
                }
            });
            for (let l of list) {
                window.GeoObj.markers[l].remove();
            }
            resolve();
        });
    }


    refresh(save = true) {

        var $this = this;
        let index = 0;
        $(".zone_buttons").html("");
        for (let marker in this.markers) {
            this.markers[marker].remove();
        }

        for (const [_index, layer] of this.layers.entries()) {
            layer.layer.unbindTooltip();

            if (typeof layer.modal !== "undefined") {
                try {
                    if (layer.modal !== undefined) {
                        layer.modal.close();
                        layer.modal = undefined;
                    }
                } catch (e) {
                    console.log("im here:" + e)
                }
            }
            layer.layer.removeEventListener("click");
            layer.layer.removeEventListener("editable:vertex:click");

            let color = this.getColor(index);

            let start_draw_coordinate = [];
            if (typeof layer.layer._latlng !== "undefined") {
                start_draw_coordinate = [layer.layer._latlng.lat, layer.layer._latlng.lng];
            } else {
                start_draw_coordinate = [layer.layer._latlngs[0][0].lat, layer.layer._latlngs[0][0].lng];
            }
            layer.layer.setStyle({color: color});
            let icon = L.icon({
                iconUrl: '/images/map-point.png',
                iconSize: [32, 32], // size of the icon
                popupAnchor: [0, -15]
            });

            if (typeof layer.information.name !== "undefined" && layer.information.name.length > 0) {
                var zone_name = "Зараженных: " + layer.information.name;
            } else {
                var zone_name = "Зараженных: 1";
            }
            var marker = L.marker(start_draw_coordinate, {icon: icon}).bindTooltip(zone_name,
                {permanent: true, direction: "auto"}
            ).openTooltip();
            marker.addTo(Geo.map);
            this.markers[layer.layer._leaflet_id] = marker;
            layer.layer.on("click", function (e) {
                Geo.map.fitBounds(layer.layer.getBounds());
            });
            marker.on("click", function (e) {
                Geo.map.fitBounds(layer.layer.getBounds());
            });
            layer.layer.on("click", function (e) {
                if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey)) {
                    return;
                }

                var infected = 1;
                if (layer.information.name > 0) {
                    infected = layer.information.name;
                }

                layer.modal = L.control.window(map, {
                    title: 'Редактирование ' + zone_name,
                    maxWidth: 400,
                    modal: true
                })
                    .content('<form class="form" data-id="' + _index + '">\n' +
                        '        <label>Количество</label>\n' +
                        '        <input min="0" value="' + infected + '" type="text" name="name" placeholder="Количество">\n' +
                        '\n' +
                        '        <input type="button" class="save_info" value="Отправить">\n' +
                        '</form>')
                    .show();
                $(".save_info").on("click", function () {
                    let form = $(this).closest('form');
                    let serialized_data = {};
                    $.each(form.serializeArray(), function () {
                        serialized_data[this.name] = this.value;
                    });
                    window.GeoObj.setInformation(parseInt(form.attr('data-id')), serialized_data);
                    $(this).val("Сохранено");
                    let $this = this;
                    setTimeout(function () {
                        $($this).val("Отправить");
                    }, 3000);
                });
            });
            layer.layer.on('click', L.DomEvent.stop).on('click', deleteShape, layer.layer);
            index++;
        }
        if (save) {
            this.saveInStorage();
        }
    }

    saveInStorage() {
        $.post(window.url_save_in_storage, {plan: window.plan, information: this.getLayers()});
    }

    getInStorage() {
        return window.information;
    }

}

// Map API
window.MapAPI = {
    key: 'shaki',
    pathes: {
        geoSearch: '/map-place?q=',
        calculateDirections: '/api/v1/map-road?waypoints=',
        build(path) {
            var params = '?key=' + MapAPI.key + '&region_id=' + userLocation.geo_region_id + '&';

            return path.replace('?', params);
        }
    }
}

window.Geo = {
    objs: {},
    route: null,
    map: null,
    init: function () {
        // Create Map
        DG.then(function () {
            return DG.plugin([editable_plugin, path_modal_plugin]);
        }).then(function () {
            Geo.markers = DG.featureGroup();

            Geo.map = DG.map('map', {
                center: [
                    userLocation.lat, userLocation.lon
                ],
                zoom: 10,
                editable: true,
                zoomControl: false,
                fullscreenControl: false
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
                    link.title = 'Создать новый ' + this.options.kind;
                    link.innerHTML = this.options.html;
                    L.DomEvent.on(link, 'click', L.DomEvent.stop)
                        .on(link, 'click', function () {
                            window.LAYER = this.options.callback.call(map.editTools);
                        }, this);

                    return container;
                }

            });

            L.NewCircleControl = L.EditControl.extend({
                options: {
                    position: 'topleft',
                    callback: Geo.map.editTools.startCircle,
                    kind: 'круг',
                    html: '⬤'
                }
            });

            Geo.map.on("click", function (e) {
                if (!window.enable_point) {
                    return;
                }
                let editor;
                let field;
                let layer;
                field = L.circle([e.latlng.lat, e.latlng.lng], {radius: 150}).addTo(Geo.map);

                editor = field.enableEdit();
                layer = window.GeoObj.setLayers(editor, null, true);
                window.GeoObj.refresh(true);
                field.on('dblclick', L.DomEvent.stop).on('dblclick', field.toggleEdit);
            })

            Geo.map.on('layeradd', function (e) {
                if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
                if (e.layer instanceof L.Path) e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
            });

            Geo.map.on("editable:drawing:commit", function (e) {
                window.GeoObj.setLayers(e);
            });

            Geo.map.on("editable:vertex:dragend", function (e) {
                window.enable_point = true;
                window.GeoObj.updateLayers(e);
            });

            Geo.map.on("editable:vertex:dragstart", function (e) {
                window.enable_point = false;
            });


            Geo.map.on("editable:dragend", function (e) {
                window.GeoObj.updateLayers(e);
            });

            Geo.map.on("editable:vertex:click", function (e) {
                e.cancel();
                return;
            });

            window.render = async function (id = 0) {
                let json = window.GeoObj.getInStorage();
                console.log(json);
                if (json.length > 0) {
                    for (let [index, info] of json.entries()) {
                        let editor;
                        let field;
                        let layer;
                        field = L.circle(info.latlng, {radius: info.radius}).addTo(Geo.map);
                        editor = field.enableEdit();
                        layer = window.GeoObj.setLayers(editor, info.information, false);
                        field.on('dblclick', L.DomEvent.stop).on('dblclick', field.toggleEdit);
                    }
                    window.GeoObj.refresh(false);
                }
            }
            render(0);
            $(".leaflet-tooltip").css("display", "none");

        })
        ;

    },

}

var deleteShape = function (e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
        e.target.remove();
        window.GeoObj.removeLayer(e.target._leaflet_id);
        window.GeoObj.refresh();
    }
};
window.GeoObj = new GeoObj();

Geo.init();
