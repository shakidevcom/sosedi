<!doctype html>
<html lang="ru">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

    <link rel="stylesheet" href="fonts/fonts.css">
    <link rel="stylesheet" href="index.css">
    <link rel="stylesheet" href="index-mob.css">
    <title>OLX - Sosedi</title>
  </head>
  <body>
    <div class="container-fluid headline-back p-0">
      <div class="container headline-text-container">
        <p class="d-none headline-mob-text text-center">
            {!! __('main.description') !!}
        </p>
        <p class="headline-text text-center mb-0 {{ app()->getLocale() === "kz" ? 'kaz-headline-px' : 'px-5' }}">
            {!! __('main.description_2') !!}
        </p>
        <p class="headline-lang-text text-center mb-0"> <a href="{{ route('set_locale','kz') }}" class="headline-lang-link">{!! app()->getLocale() === "kz" ? '<u>ҚАЗ</u>' : 'ҚАЗ' !!}</a> | <a href="{{ route('set_locale','ru') }}" class="headline-lang-link ">{!! app()->getLocale() === "ru" ? '<u>РУС</u>' : 'РУС' !!}</a> </p>
      </div>
    </div>

    <div class="container-fluid body-back-color">
      <div class="container">
        <div class="about-text-container d-flex">
          <div class="w-50 about-text-left-container">
            <p class="text-right mb-0 about-text-left">
                {!! __('main.desc_1') !!}
            </p>
          </div>
          <div class="w-50 about-text-right-container">
            <p class="text-left mb-0 about-text-right">
              <b>{!! __('main.important') !!}</b>: {!! __('main.desc_2') !!}
            </p>
          </div>
        </div>

        <div class="d-flex choose-section-container">
          <div class="w-50 left-section-container section-container-active d-flex justify-content-center" id="leftButton-container">
            <button class="left-section-button" onclick="leftButton();">{!! __('main.get_help') !!}</button>
          </div>
          <div class="w-50 right-section-container d-flex justify-content-center" id="rightButton-container">
            <button class="right-section-button" onclick="rightButton();">{!! __('main.help') !!}</button>
          </div>
        </div>

        <div class="shafl-container-1" id="shafl-container-1">
          <div>
            <div class="d-none mob-body-logo">
              <img src="img/mob-logo.png" alt="mob-logo-img">
            </div>
            <p class="text-center mb-3 shafl-title-text">{!! __('main.take_help_instr') !!} </p>
          </div>
          <div class="d-flex cards-container justify-content-between">
            <div class="card-container">
                <p class="text-center card-title">1</p>
                <p class="text-center mb-0 card-text">{!! __('main.take_help.block_1') !!}</p>
                <p class="text-center mb-0 card-img"><img src="img/card1-1.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title">2</p>
              <p class="text-center mb-0 card-text">{!! __('main.take_help.block_2') !!}</b></p>
              <p class="text-center mb-0 card-img"><img src="img/card1-2.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title">3</p>
              <p class="text-center mb-0 card-text">{!! __('main.take_help.block_3') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card1-3.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title">4</p>
              <p class="text-center mb-0 card-text">{!! __('main.take_help.block_4') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card1-4.png" alt=""></p>
            </div>
          </div>

          <div class="shafl-btn-container d-flex justify-content-center">
            <a href="/map" class="button-link">{!! __('main.ready_to_get') !!}</a>
          </div>
        </div>

        <div class="shafl-container-2" id="shafl-container-2">
          <div>
            <div class="d-none mob-body-logo">
              <img src="img/mob-logo.png" alt="mob-logo-img">
            </div>
            <p class="text-center mb-3 shafl-title-text">{!! __('main.for_help_instr') !!}</p>
          </div>
          <div class="d-flex cards-container justify-content-between">
            <div class="card-container">
                <p class="text-center card-title mb-2">1</p>
                <p class="text-center mb-0 card-text">{!! __('main.for_help.block_1') !!}</p>
                <p class="text-center mb-0 card-img"><img src="img/card2-1.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title mb-2">2</p>
              <p class="text-center mb-0 card-text">{!! __('main.for_help.block_2') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card2-2.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title">3</p>
              <p class="text-center mb-0 card-text">{!! __('main.for_help.block_3') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card2-3.png" alt=""></p>
            </div>
            <div class="card-container">
              <p class="text-center card-title">4</p>
              <p class="text-center mb-0 card-text">{!! __('main.for_help.block_4') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card2-4.png" alt=""></p>
            </div>
            <div class="card-container mt-0">
              <p class="text-center card-title mb-0">5</p>
              <p class="text-center mb-0 card-text mb-1">{!! __('main.for_help.block_5') !!}</p>
              <p class="text-center mb-0 card-img"><img src="img/card2-5.png" alt=""></p>
            </div>
          </div>

          <div class="shafl-btn-container d-flex justify-content-center">
            <a href="/map" class="button-link">{!! __('main.wanna_help') !!}</a>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid p-0 safety-law-container-background">
      <div class="safety-law-container">
          <div class="d-flex justify-content-center">
            <p class="safety-law-title">{!! __('main.footer_desc') !!}</p>
          </div>

          <div id="accordion">
            <div class="card border-0">
              <div class="card-header" id="headingOne">
                <p class="mb-0 text-center">
                  <button class="btn btn-link border-0 p-0 collapsed btn-block" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" onclick="accordionButton();" id="accordionButton">
                    <p class="mb-0 d-flex align-items-center safety-button-mob justify-content-center"><img src="img/down-arrow.png" class="mr-4 down-arrow-desc" alt="">{!! __('main.safety_regulations.title') !!}
                    </p>
                    <img src="img/down-arrow-mob.png" alt="" class="down-arrow-mob" id="down-arrow-mob">
                  </button>
                </p>
              </div>

              <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="card-body accordion-body-container p-0">
                  <div class="container accordion-body">
                    <p class="mb-0 pt-3 text-center accordion-body-title">
                        {!! __('main.safety_regulations.we_believe') !!}
                    </p>
                    <div class="d-flex justify-content-between flex-wrap accordion-safety-cards-container">
                        <div class="d-flex align-items-center safety-card-container">
                            <div class="safety-card-img d-flex justify-content-center align-items-center">
                                <img src="img/safety-card-1.png" alt="safety-card img">
                            </div>
                            <p class="mb-0 safety-card-text">{!! __('main.safety_regulations.block_6') !!}</p>
                        </div>


                      <div class="d-flex align-items-center safety-card-container">
                        <div class="safety-card-img d-flex justify-content-center align-items-center">
                          <img src="img/safety-card-3.png" alt="safety-card img">
                        </div>
                        <p class="mb-0 safety-card-text">{!! __('main.safety_regulations.block_2') !!}</p>
                      </div>
                      <div class="d-flex align-items-center safety-card-container">
                        <div class="safety-card-img d-flex justify-content-center align-items-center">
                          <img src="img/safety-card-2.png" alt="safety-card img">
                        </div>
                        <p class="mb-0 safety-card-text">{!! __('main.safety_regulations.block_3') !!}</p>
                      </div>
                      <div class="d-flex align-items-center safety-card-container">
                        <div class="safety-card-img d-flex align-items-center justify-content-center">
                          <img src="img/safety-card-4.png" alt="safety-card img">
                        </div>
                        <p class="mb-0 safety-card-text">{!! __('main.safety_regulations.block_4') !!}</p>
                      </div>
                      <div class="d-flex align-items-center safety-card-container">
                        <div class="safety-card-img d-flex align-items-center justify-content-center">
                          <img src="img/safety-card-5.png" alt="safety-card img">
                        </div>
                        <p class="mb-0 safety-card-text">{!! __('main.safety_regulations.block_5') !!}</p>
                      </div>
                    </div>
                    <p class="mb-0 text-center accordion-body-text">
                        {!! __('main.safety_regulations.footer_desc') !!}
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <footer class="footer-background">
      <div class="d-flex justify-content-center">
        <a href="https://www.olx.kz/" class="footer-logo-link"><img src="img/logo.png" alt="footer-logo" class="footer-logo-img"></a>
      </div>
    </footer>
    <div class="footer-law-text">
        <p class="mb-0 text-center p-1">Важно! OLX не проверяет информацию о пользователях.</p>
    </div>

    <script type="text/javascript">
      function rightButton() {
        document.getElementById("shafl-container-2").style.display = "block";
        document.getElementById("shafl-container-1").style.display = "none";
        document.getElementById("rightButton-container").classList.add('section-container-active');
        document.getElementById("leftButton-container").classList.remove('section-container-active');
      }

      function leftButton() {
        document.getElementById("shafl-container-2").style.display = "none";
        document.getElementById("shafl-container-1").style.display = "block";
        document.getElementById("rightButton-container").classList.remove('section-container-active');
        document.getElementById("leftButton-container").classList.add('section-container-active');
      }

      function accordionButton() {
        if(document.getElementById('accordionButton').classList.contains('collapsed') == true) {
          document.getElementById("down-arrow-mob").style.transform = "rotate(180deg)";
        } else {
          document.getElementById("down-arrow-mob").style.transform = "rotate(0deg)";
        };
      }
    </script>
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  </body>
</html>
