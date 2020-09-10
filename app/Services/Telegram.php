<?php namespace App\Services;
class Telegram{
    protected $token;
    protected $chat_id;
    public function __construct($chat_id = "@shakidevcom")
    {
        $this->token = '1149453294:AAFGqYHZeOiiXx7jglXWBS-Atw75SbtbOLc';
        $this->chat_id = $chat_id;
    }

    public function sendMessage($text){
        $method = '/sendMessage';
        $curlOptions = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30,
            CURLOPT_AUTOREFERER => true,
            CURLOPT_HEADER => false,
            CURLOPT_POSTFIELDS => ['text' => $text,'chat_id' => $this->chat_id, 'parse_mode' => 'html']
        ];
        $url = 'https://api.telegram.org/bot';
        $url .= $this->token;
        $url .= $method;
        $curl = curl_init($url);
        curl_setopt_array($curl, $curlOptions);
        curl_exec($curl);
        curl_close($curl);
    }
}

