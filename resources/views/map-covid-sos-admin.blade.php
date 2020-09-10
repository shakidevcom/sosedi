<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Карта зон риска SARS-CoV-2</title>
    <meta name="description" content="Карта коронавируса, covid-19, карта зон риска">
    <meta name="location" content="{{ $location ?? "{}" }}">
    <link rel="stylesheet" href="{{ asset('/css/app.min.css') }}?v=2.3">
    <link rel="stylesheet" href="{{ asset('/css/covid.min.css') }}?v=2.7">
    <script>document.getElementsByTagName("html")[0].className += " js";</script>
    <link rel="stylesheet" href="{{ asset('assets/css/style2.css') }}?v=1.6">
    <meta name="path_modal_plugin" content="{{ asset('js/plugins/L.Control.Window.js') }}">
    <meta name="sos" content="{{ $sos->toJson() }}">
    <meta name="hash" content="{{ $hash }}">
</head>
<body>
<div id="map"></div>
<div class="cd-faq__items sos_menu" style="display: none">
    <div id="contacts" class="cd-faq__group cd-faq__group--selected">
        <div class="cd-faq__title" style="display: inline-flex">
            <h2 style="display: inline-flex">Социальная помощь</h2>
            <h2 style="display: inline-flex;padding-left:15px"><a href="/faq">FAQ</a></h2>
        </div>
        <div class="r-covid-19 js-covid inited" style="display: block;">
            <div><label style="font-weight:bold;">ФИО: </label> <span class="sos_fio"></span></div>
            <hr>
            <div><label style="font-weight:bold;">Телефон: </label> <span class="sos_phone"></span></div>
            <hr>
            <div><label style="font-weight:bold;">Комментарии:</label> <span class="sos_comment"></span></div>
            <div class="in_moderation">
                <hr>
                <p style="text-align:center;font-weight: bold"><strong>Заявка на модерации!</strong></p></div>
        </div>
    </div>
</div>
<a href="#" class="cd-faq__close-panel text-replace" id="close">Закрыть</a>
<div class="cd-faq__overlay" aria-hidden="true"></div>
<div class="support">
    <div class="support__title">При поддержке:</div>
    <div class="support__logos">
        <a href="https://t.me/certkznews" target="_blank"><img src="{{ asset('/images/tsarka.svg') }}?v=1.1" alt=""
                                                               class="img"></a>
        <a href="https://wtotem.com/" target="_blank"><img src="{{ asset('/images/totem.svg') }}?v=1.1" alt=""
                                                           class="img"></a>
        <a href="https://t.me/shakidevcom" target="_blank"><img src="{{ asset('/images/telegram.svg') }}" alt=""
                                                                class="img"
                                                                style="width: 25px!important;height: 25px!important;"></a>
        <a href="https://t.me/nehabar" target="_blank"><img src="{{ asset('/images/nehabar.png') }}" alt="" class="img"
                                                            style="margin-left:6px;width: 26px!important;height: 26px!important;"></a>
    </div>
</div>
<script src="//maps.api.2gis.ru/2.0/loader.js?pkg=full"></script>
{{--<script src="{{ asset('/js/src/_full.js') }}"></script>--}}
{{--<script src="{{ asset('/js/src/_standalone.js') }}"></script>--}}
{{--<script src="//lipatoff.github.io/leaflet-canvas-markers/leaflet-canvas-markers.js"></script>--}}
<script src="{{ mix('/js/map-sos-admin.js') }}?v=1.7"></script>
</body>
<style>
    table {
        font-size: 13px !important;
    }

    table thead tr {
        background: #eee;
    }

    .table-prediction {
        font-size: 14px !important;
    }

    textarea {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .control-window {
        padding: 16px;
    }

    @media screen and (max-width: 600px) {
        .mobile-textarea {
            z-index: 99999999999;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    .sos_files{
        display: flex;
    }
    .sos_files img{
        display: inline-flex;
        width: 64px;
    }
    hr{
        margin-top: 1rem;margin-bottom: 1rem;border: 0;border-top: 1px solid rgba(0,0,0,0.1);
    }
    .in_moderation{
        display: none;
    }
</style>
</html>