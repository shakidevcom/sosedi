<?php

namespace App\Notifications;

use Mobizon\MobizonApi;
use App\Formatters\PhoneFormatter;


class SMSNotification
{

    const ALPHANAME = 'COVID';


    /**
     * Send SMS message using Mobizon API
     *
     * @param string $phone
     * @param string $message
     *
     * @return bool
     */
    public static function send(string $phone, string $message): bool
    {
        $api = new MobizonApi([
            'apiKey' => 'kz392b86f21de35cf36a64598d7f213b7c309f215560ff223124ee74880a1c6e862059',
            'apiServer' => 'api.mobizon.kz',
        ]);

        return (bool)$api->call('message', 'sendSMSMessage', [
            'recipient' => (new PhoneFormatter($phone))->format(),
            'text' => $message,
//            'from' => SMSNotification::ALPHANAME,
        ]);
    }

}
