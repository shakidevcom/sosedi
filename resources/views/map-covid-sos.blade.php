<!doctype html>
<html lang="ru">
<head>
    <title>Карта распространения и статистика COVID-19, SARS-CoV-2</title>
    <meta name="location" content="{{ $location ?? "{}" }}">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="map.css">
    <link rel="stylesheet" href="fonts/fonts.css">
    <meta name="path_modal_plugin" content="{{ asset('js/plugins/L.Control.Window.js') }}">
    <meta name="hash" content="{{ $hash }}">
</head>
<body>
<div id="map"></div>

<div class="container-fluid d-flex justify-content-between">
    <button type="button" class="btn btn-olx" data-toggle="modal" data-target="#SOSModal" style="position: fixed; top:0; left:1rem;width: 62px; height: 62px">
        <p class="mb-0">SOS</p>
    </button>

        <!-- Modal -->
        <div class="modal fade" id="SOSModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header d-flex flex-column ">
                        <button type="button" class="close pt-0 pr-2" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div class="d-flex justify-content-center w-100"><p class="text-center mb-0 modal-title">{{ __('map.form.title') }}</p></div>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="formGroupExampleInput">{{ __('map.form.name') }}:</label>
                                <input type="text" name="fio" class="form-control" placeholder="{{ __('map.name_hold') }}">
                            </div>
                            <div class="form-group">
                                <label for="formGroupExampleInput">{{ __('map.form.phone') }}:</label>
                                <input type="text" name="phone" class="form-control"  placeholder="+7(777)7777777">
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlInput1">{{ __('map.email') }}:</label>
                                <input type="email" name="email" class="form-control" placeholder="{{ __('map.email_hold') }}">
                            </div>
                        <div class="about-location-container">
                            <p class="mb-0 about-location-title">{{ __('map.form.location') }}:</p>
                            <p class="mb-0 about-location-text location_not_found">
                                <b>{{ __('map.form.location_not_found') }}.</b>
                                {{ __('map.form.location_description') }}
                            </p>
                            <p class="mb-0 text-center"><button class="take-location-btn" onclick="setMe(event)">{{ __('map.form.choose_place') }}</button></p>
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1" class="label-title">{!! __('map.form.list_of_needs_items') !!}</label>
                            <textarea name="comment" class="form-control" id="exampleFormControlTextarea1"></textarea>
                        </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                                <label class="form-check-label" for="defaultCheck1">
                                    Cогласен на обработку введенных данных
                                </label>
                            </div>
                        <div class="public-btn-container">
                            <p class="mb-0 text-center"><button class="public-btn save_sos">{{ __('map.form.add') }}</button></p>
                        </div>
                            <div class="mt-3">
                                <p class="text-center mb-0 px-2">
                                    Важно! Заявка размещается на одну неделю или до тех пор, пока вам не будет оказана помощь. Одна заявка от одного номера может быть размещена не более, чем двух раз. Это сделано в целях безопасности.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade pr-0" id="locationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl mr-0 my-0 information-modal">
                <div class="modal-content">
                    <div class="modal-header d-flex align-items-center">
                        <div class="d-flex justify-content-start w-100"><p class="mb-0 modal-title">{{ __('map.information') }}</p></div>
                        <button type="button" class="close location-close pt-2 pr-3" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="mb-4">
                            <div class="information-container">
                                <div class="information-text">
                                    <p class="mb-0">{{ __('map.name') }}: <span class="sos_fio"></span></p>
                                </div>
                                <div class="information-text">
                                    <p class="mb-0">{{ __('map.phone') }}: <span class="sos_phone"></span></p>
                                </div>
                                <div class="information-text border-0">
                                    <p class="mb-0">{{ __('map.list_of_needs_items') }}: <br> <span class="sos_comment"></span></p>
                                </div>
                            </div>
                        </form>
                        <div class="form-group">
                            <label class="label-title">{{ __('map.phone') }}:</label>
                            <input class="form-control" name="helped_phone" placeholder="+7(747)777-77-77">
                        </div>
                        <div class="form-group">
                            <label class="label-title">{{ __('map.your_comments') }}:</label>
                            <textarea class="form-control" placeholder="{{ __('map.delivery_products') }}" name="helped_comment"></textarea>
                        </div>
                        <div class="public-btn-container">
                            <input type="hidden" class="sos_id" value="">
                            <p class="mb-0"><button class="public-btn i_helped">{{ __('map.im_helped') }}</button></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <div class="support">
        <div class="support__logos">
            <a href="/"><img src="/images/arrow.svg" alt="" class="img"></a>
            <a href="{{ route('set_locale','kz') }}" class="headline-lang-link">{!! app()->getLocale() === "kz" ? '<u>ҚАЗ</u>' : 'ҚАЗ' !!}</a>
            <a href="{{ route('set_locale','ru') }}" class="headline-lang-link ">{!! app()->getLocale() === "ru" ? '<u>РУС</u>' : 'РУС' !!}</a>
        </div>
    </div>
</body>
<style>
    .dg-location__pin{display:none;opacity:0;}
    .support {
        position: absolute;
        width: 150px;
        height: 55px;
        left: 23px;
        bottom: 10px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802), 0 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725), 0 12.5216px 10.0172px rgba(0, 0, 0, 0.035), 0 22.3363px 17.869px rgba(0, 0, 0, 0.0417275),
        0 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198), 0 100px 80px rgba(0, 0, 0, 0.07);
        border-radius: 5px;
        display: flex;
        align-items: center;
    }
    .support__title {
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 12px;
        line-height: 14px;
        flex: 2;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .support__logos {
        flex: 2;
        display: flex;
        padding: 0 10px;
        justify-content: space-around;
        align-items: center;
    }
    .support .img {
        width: 28px;
        height: 28px;
    }

    @media only screen and (max-width: 600px) {
        .support {
            width: 145px;
            height: 45px;
        }
        .support .support__title {
            display: none;
        }
        .support .img {
            width: 28px;
            height: 28px;
        }
    }


    body, html {
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    #map {
        width: 100%;
        height: 100%;
    }

    .leaflet-control-window-wrapper{
        display: none;
        opacity: 0;
        -webkit-overflow-scrolling: touch;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .visible {
        display: block;
        opacity: 1;
    }

    .leaflet-control-window{
        position: absolute;
        z-index: 2000;
        border-radius: 2px;
        margin: 8px;

        /** BOX SHADOW **/
        -webkit-box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.75);
        box-shadow: 2px 2px 10px 0px rgba(0,0,0,0.75);
    }

    .control-window{
        background-color: #ffffff;
        color: #353535;
        font: 14px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
    }


    .leaflet-control-window .titlebar{
        min-height: 38px;
        cursor: grab;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        padding: 10px 45px 10px 10px;
    }

    .leaflet-control-window .close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        border-radius: 100%;
        font: 16px/14px Tahoma, Verdana, sans-serif;
        cursor: pointer;
        z-index:30;

        background-color: rgba(0, 0, 0, 0.40);
        transition-property: background;
        transition-duration: 0.2s;
        transition-timing-function: linear;


        color: #e4e4e4;
        font-size: 22pt;
        text-align: center;
        line-height: 0.9em;
    }

    .leaflet-control-window .close:hover {
        background-color: rgba(0, 0, 0, 0.65);
    }

    .leaflet-control-window .content{
        padding: 8px;
        margin-top: -10px;
        z-index:29;
        overflow: auto;
    }

    .leaflet-control-window .promptButtons{
        text-align: right;
        padding: 16px;
    }

    .leaflet-control-window button{
        position: relative;
        display: inline-block;
        background-color: transparent;
        color: inherit;

        opacity: 0.5;
        transition-property: opacity;
        transition-duration: 0.2s;
        transition-timing-function: linear;

        cursor:pointer;
        font-size: medium;
        font-weight: bold;
        text-decoration:none;
        text-align: center;
        vertical-align: middle;
        border: 0;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        padding: 8px;
        margin: 12px 8px 0 8px;
    }

    .leaflet-control-window button:focus {
        outline:0;
    }

    .leaflet-control-window button:hover {
        opacity: 1;
    }
    .disabled{
        opacity: .5;
        pointer-events:none;
    }

    .leaflet-div-icon{
        background:deepskyblue!important;
        border: 0!important;
        padding: 2px;
        text-align:center;
        border-radius: 10px;
    }

    .dg-control-round__icon_name_locate:active:after,.no-touch .dg-control-round__icon_name_locate:after,.dg-control-round__icon_name_locate:after{
        background-image: url("img/tracker.png")!important;
    }
    .dg-control-round__icon_name_locate{
        padding: 1rem;
        right: 2rem;
        font-size: 14px;
        line-height: 17px;
        color: #002F34;
        background-color: #fff;
        border: 2px solid #002F34;
        border-radius: 100%;
    }
    .dg-control-round__icon_state_active{
        background-color: #23E5DB!important;
    }
    .dg-control-round__icon{
        background-image: none;
    }
    .dg-control-round{
        background-color:transparent;
        box-shadow: none;
    }
</style>
<script src="//maps.api.2gis.ru/2.0/loader.js?pkg=full"></script>
<script src="{{ mix('/js/map-sos.js') }}?v=1.8"></script>
</html>
