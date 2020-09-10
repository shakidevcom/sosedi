<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Help;
use App\Models\SOS;
use Cache;
use App\Cache\Cache as MCache;
use Cookie;
use Carbon\Carbon;

class SOSController extends Controller
{

    public function index()
    {
        return view('index');
    }

    public function setLocale($locale)
    {
        if (!in_array($locale, ['ru', 'kz'])) {
            abort(400);
        }

        \App::setLocale($locale);
        session()->put('locale', $locale);
        return back();
    }

    public function sos()
    {
        if (empty(Cookie::get('identificator'))) {
            $hash = \Hash::make(\Str::random(60));
            Cookie::queue("identificator", $hash, 99999999999);
        } else {
            $hash = Cookie::get('identificator');
        }
//        if ($hash != '$2y$10$ZNZOK4ssdachQl3mmqZWveCgoQCukZ5v1R27vQoMQp.F47gJL0qji') {
//            abort(403, "Технические работы");
//        }
        $location = $this->getLocation();
        $stats_contents = Cache::get('stats_contents');
        return view('map-covid-sos', compact('location', 'hash', 'stats_contents'));
    }

    public function getLocation()
    {
        $location = [];
        $cache = geoip()->getLocation()->toArray();
        $location['lat'] = $cache['lat'];
        $location['lon'] = $cache['lon'];
        $location['geo_region_id'] = 67;
        if ($cache['country'] !== "Kazakhstan") {
            $location = Cache::remember("location", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function () {
                return City::find(1)->toArray();
            });
        }
        return json_encode($location);
    }

    public function save_sos()
    {
        if (!request()->has('latlng')) {
            abort(403);
        }
        if (request()->has('hash')) {
            if ($sos = SOS::where('hash', request()->hash)->orWhere(function ($query) {
                $query->where('phone', request()->phone);
            })->first()) {
                if (!$sos->show || Carbon::parse($sos->updated_at)->lt(Carbon::parse("2020-05-10 05:40:54"))) {
                    $sos->update(request()->all());
                }
                if (!is_null($sos)) {
                    return $sos->makeVisible('hash');
                }
                return request()->all();
            }
        }
        $phone = request()->phone;
        $ip = $this->getUserIP();
        request()->request->add([
            'ip' => $ip
        ]);
        if (!is_null(SOS::where('phone', $phone)->first())) {
            abort(403, 'Карта уже существует');
        }
        $sos = SOS::create(
            request()->all()
        )->makeVisible('hash');
        return $sos;
    }

    public function getUserIP()
    {
        if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
            $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
            $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
        }
        $client = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote = $_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        } else {
            $ip = $remote;
        }

        return $ip;
    }

    public function helped()
    {
        if (request()->has('sos_id')) {
            $help = Help::create(
                request()->all()
            );
        }
        return 'success';
    }
}
