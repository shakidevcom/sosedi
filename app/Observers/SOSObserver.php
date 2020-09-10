<?php

namespace App\Observers;

use App\Models\SOS;
use Illuminate\Support\Str;
use Hash;
use Cookie;
use Cache;
class SOSObserver
{
    public function created(SOS $sos)
    {
        if(empty($sos->hash)){
            if($hash = Cookie::get('identificator')){

            }else{
                $hash = Hash::make(Str::random(40));
            }
            $sos->hash = $hash;
        }
    }

    public function updated(SOS $sos)
    {
        Cache::forget('map_merge');
    }
}
