<?php
/**
 * Created by PhpStorm.
 * User: shakidevcom
 * Date: 4/16/20
 * Time: 3:22 AM
 */

namespace App\Services;


class GetContact
{


    protected $number;
    protected $time;
    private $aes_key = '8c93b9b782b120af99ea274f745d2f4b43d89aa8794ccba97c190c8fccbaXXXX';
    private $token = 'hagoje90c9d2e59aaa7c31cdb71a643f8346af863a423d90c3cceb6XXXX';
    private $key = '2Wq7)qkX~cp7)H|n_tc&o+:G_USN3/-uIi~>M+c ;Oq]E{t9)RC_5|lhAA_Qq%_4';
    private $private_key = 2615678;

    public function __construct($number)
    {
        $this->time = time();
        $this->number = $number;
    }

    public function decrypt($key, $garble)
    {

        return openssl_decrypt(
            base64_decode($garble),
            "aes-256-ecb",
            $key,
            OPENSSL_RAW_DATA
        );

    }

    public function Send_Post($post_url, $post_data, $signature)
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $post_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        if ($post_data != "") {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "X-App-Version: 4.9.1",
            "X-Token: " . $this->token,
            "X-Os: android 5.0",
            "X-Client-Device-Id: 14130e29cebe9c39",
            "Content-Type: application/json; charset=utf-8",
            "Accept-Encoding: deflate",
            "X-Req-Timestamp: " . $this->time,
            "X-Req-Signature: " . $signature,
            "X-Encrypted: 1"));

        curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        $data = curl_exec($ch);
        curl_close($ch);

        return $data;
    }

    public function GetByPhone($phone)
    {


        $req = '{"countryCode":"RU","source":"search","token":"' . $this->token . '","phoneNumber":"' . $phone . '"}';

        $string = ($this->time . '-' . $req);

        $signature = base64_encode(hash_hmac('sha256', $string, $this->key, true));

        $crypt_data = base64_encode($this->encrypt(hex2bin($this->aes_key), $req));

        $zprs = $this->Send_Post("https://pbssrv-centralevents.com/v2.5/search", '{"data":"' . $crypt_data . '"}', $signature);

        $zprs = json_decode($zprs);

        $time = time();

        return $zprs->data;

    }

    public function encrypt($key, $garble)
    {

        $method = 'AES-256-ECB';
        $ivSize = openssl_cipher_iv_length($method);
        $iv = openssl_random_pseudo_bytes($ivSize);

        return openssl_encrypt(
            $garble,
            "aes-256-ecb",
            $key,
            OPENSSL_RAW_DATA
        );

    }

    public function GetByPhoneTags($phone)
    {
        $req = '{"countryCode":"RU","source":"details","token":"' . $this->token . '","phoneNumber":"' . $phone . '"}';
        $string = ($this->time . '-' . $req);
        $signature = base64_encode(hash_hmac('sha256', $string, $this->key, true));
        $crypt_data = base64_encode($this->encrypt(hex2bin($this->aes_key), $req));
        $zprs = Send_Post("https://pbssrv-centralevents.com/v2.5/number-detail", '{"data":"' . $crypt_data . '"}', $signature);
        $zprs = json_decode($zprs);
        return $zprs->data;
    }

    public function handle(){
        dd($this->GetByPhone($this->number));

        $ass = (json_decode($this->decrypt(hex2bin($this->aes_key), $this->GetByPhone($this->number))));
        $as = (json_decode($this->decrypt(hex2bin($this->aes_key), $this->GetByPhoneTags($this->number))));
        return compact('as','ass');
    }

}