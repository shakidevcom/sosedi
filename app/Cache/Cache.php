<?php
/**
 * Created by PhpStorm.
 * User: shakidevcom
 * Date: 8/30/19
 * Time: 1:04 AM
 */

namespace App\Cache;
use Carbon\Carbon;

class Cache
{
    const CACHE_REAL_TIME = 3;
    const CACHE_FAST_TIME = 7;
    const CACHE_DEFAULT_TIME = 14;
    const CACHE_TIME_EASY = 24;
    const CACHE_TIME_MEDIUM = 34;
    const CACHE_TIME_HARD = 60;
    const CACHE_TIME_OVER = 120;
    const CACHE_TIME_FIVE_MIN = 300;
    const CACHE_TIME_TEN_MIN = 600;
    const CACHE_TIME_HALF_HOUR = 3000;
    const CACHE_TIME_1_HOUR = 6000;
    const CACHE_TIME_MAX_MIN = 86400;
    const CACHE_TIME_MONTH = 2592000;
    const CACHE_TIME_3_MONTH = 7776000;
    const CACHE_TIME_6_MONTH = 15552000;


    public static function getLocation()
    {
        return session()->get('location.id');
    }


    public static function cacheTimeDefault()
    {
        return self::setTime(self::CACHE_DEFAULT_TIME);
    }

    public static function setTime($time)
    {
        return Carbon::now()->copy()->addSeconds($time);
    }
}