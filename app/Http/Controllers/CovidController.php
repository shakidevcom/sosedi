<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\SOS;
use Cache;
use App\Cache\Cache as MCache;

class CovidController extends Controller
{

    public function getLocation(){
        $location = [];
        $cache = geoip()->getLocation()->toArray();
        $location['lat'] = $cache['lat'];
        $location['lon'] = $cache['lon'];
        $location['geo_region_id'] = 67;
        iF($cache['country'] !== "Kazakhstan"){
            $location = Cache::remember("location", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function (){
                return City::find(1)->toArray();
            });
        }
        return json_encode($location);
    }

    public function mapzone()
    {
//        if(request()->ip() != "185.100.227.202"){
//            abort(403,"Технические работы");
//        }
        $location = $this->getLocation();
        $stats = Cache::get('covid_stats') ?? [];
        $stats_table = Cache::get('covid_stats_table') ?? [];
        $contacted = Cache::get('contacted') ?? 0;
        return view('map-covid', compact('location','stats_table','stats','contacted'));
    }

    public function information(){
        return Cache::remember("map_merge", MCache::setTime(MCache::CACHE_TIME_TEN_MIN), function (){
            $sos = SOS::where('show', true)->where('blocked',false)->get();
            return compact('sos');
        });
    }

    public function add()
    {
        $information = Cache::get("map_covid_add");
        $location = $this->getLocation();
        return view('map-covid-add', compact('location', 'information'));
    }

    public function add_storage()
    {
        $default_radius = 100;
        $kef = 1.2;
        $info = json_decode(request()->information,true);
        foreach ($info as &$i){
            if($i['information']['name'] > 1){
                $i['radius'] = $default_radius * (($kef+$i['information']['name']/10)+0.5);
            }else{
                $i['radius'] = $default_radius;
            }
            $newinfo = [];
            $newinfo['information']['name'] = $i['information']['name'];
            $newinfo['radius'] = $i['radius'];
            $newinfo['latlng'] = $i['latlng'];
            $newinfo['status'] = 1;
            $i = $newinfo;
        }

        $info = json_encode($info);
        Cache::forever("map_covid_add", $info);
        return response()->json(['status' => 'success']);
    }

}
