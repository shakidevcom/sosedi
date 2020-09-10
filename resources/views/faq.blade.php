<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script>document.getElementsByTagName("html")[0].className += " js";</script>
    <title>Вопросы и ответы</title>
</head>
<body>
<header class="cd-header flex flex-column flex-center">
    <div class="text-component text-center">
        <h1>Вопросы и ответы</h1>
        <p>👈 <a class="cd-article-link" href="/">Карта</a></p>
    </div>
</header>
<section class="cd-faq js-cd-faq container max-width-md margin-top-lg margin-bottom-lg">
    <ul class="cd-faq__categories">
        <li><a class="cd-faq__category cd-faq__category-selected truncate" href="#map">Карта</a></li>
        <li><a class="cd-faq__category truncate" href="#donats">Донаты</a></li>
        <li><a class="cd-faq__category truncate" href="#contacts">Контакты</a></li>
    </ul>
    <div class="cd-faq__items">
        <ul id="map" class="cd-faq__group">
            <li class="cd-faq__title"><h2>Карта</h2></li>
            <li class="cd-faq__item">
                <a class="cd-faq__trigger" href="#0"><span>Что означает синяя зона на карте?</span></a>
                <div class="cd-faq__content">
                    <div class="text-component">
                        <p>Место регистрации гражданина, контактировавшего с зараженным. Сам гражданин может находиться
                            на домашнем либо стационарном карантине.</p>
                    </div>
                </div>
            </li>
            <li class="cd-faq__item">
                <a class="cd-faq__trigger" href="#0"><span>Что означает красная зона на карте?</span></a>
                <div class="cd-faq__content">
                    <div class="text-component">
                        <p>Здание, в котором проживает заражённый коронавирусом, было оцеплено</p>
                    </div>
                </div>
            </li>
            <li class="cd-faq__item">
                <a class="cd-faq__trigger" href="#0"><span>Как я могу быть полезен?</span></a>
                <div class="cd-faq__content">
                    <div class="text-component">
                        <p>Уведомлять меня о новых случаях заражения и меньше контактировать с людьми во время карантина :)</p>
                    </div>
                </div>
            </li>
        </ul>
        <ul id="donats" class="cd-faq__group">
            <li class="cd-faq__title"><h2>Донаты</h2></li>
            <li class="cd-faq__item">
                <a class="cd-faq__trigger" href="#0"><span>Как я могу пожертвовать деньги?</span></a>
                <div class="cd-faq__content">
                    <div class="text-component">
                        <p><a href="https://www.donationalerts.com/r/shakidevcom">Ссылка на донат</a></p>
                    </div>
                </div>
            </li>
        </ul>
        <ul id="contacts" class="cd-faq__group">
            <li class="cd-faq__title"><h2>Контакты</h2></li>
            <li class="cd-faq__item">
                <a class="cd-faq__trigger" href="#0"><span>Телеграм</span></a>
                <div class="cd-faq__content">
                    <div class="text-component">
                        <p><a href="https://t.me/shakidev">Telegram</a></p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <a href="#0" class="cd-faq__close-panel text-replace">Закрыть</a>
    <div class="cd-faq__overlay" aria-hidden="true"></div>
</section>
<script src="{{ asset('/assets/js/util.js') }}"></script>
<script src="{{ asset('/assets/js/main.js') }}"></script>
</body>
</html>