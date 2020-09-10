<?php

namespace App\Http\Controllers;

use App\Models\SOS;
use App\Notifications\SMSNotification;
use App\Services\Telegram;
use Illuminate\Http\Request;
use App\Models\City;
use Cache;
use App\Cache\Cache as MCache;
use Cookie;

class HomyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function locations(){
//        if(request()->key != "js*s12@nc@!s9dsab"){
//            abort(403);
//        }
        $locations = json_encode(Cache::get('location_map') ?? []);
        return view('map-locations',['locations' => $locations]);
    }

    public function saveLocation(){
        if(request()->has('Network')){
            $locations = Cache::get('location_map') ?? [];
            $locations[] = request()->all();
            Cache::forever("location_map",$locations);
            return response()->json(['status' => "success","data" => request()->all()]);
        }else{
            return response()->json(['status' => "error","data" => request()->all()]);
        }
    }

    public function getLocation()
    {
        $location = [];
        $cache = geoip()->getLocation()->toArray();
        $location['lat'] = $cache['lat'];
        $location['lon'] = $cache['lon'];
        $location['geo_region_id'] = 67;
        iF ($cache['country'] !== "Kazakhstan") {
            $location = Cache::remember("location", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function () {
                return City::find(1)->toArray();
            });
        }
        return json_encode($location);
    }

    public function sos()
    {
        $location = $this->getLocation();
        $stats = Cache::get('covid_stats') ?? [];
        $stats_table = Cache::get('covid_stats_table') ?? [];
        $contacted = Cache::get('contacted') ?? 0;
        return view('map-covid-sos', compact('location', 'stats_table', 'stats', 'contacted'));
    }

    public function admin()
    {
        if(request()->key == "js*s12@nc-s9dsab"){

        }else{
            abort(403);
        }
        $arrContextOptions=array(
            "ssl"=>array(
                "verify_peer"=>false,
                "verify_peer_name"=>false,
            ),
        );
        $soss = [];
        $sos = SOS::all();
        foreach ($sos as $ss){
            $latlng = json_decode($ss->latlng,true);
            $req = Cache::remember("longitude={$latlng['lng']}&latitude={$latlng['lat']}", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function () use($latlng,$arrContextOptions){
                return json_decode(file_get_contents("http://crm.amotors.kz/api/v1/region?longitude={$latlng['lng']}&latitude={$latlng['lat']}&passanger_id=19", false, stream_context_create($arrContextOptions)));
            });
            if($req->geo_region_id == 68){
                $soss[] = $ss;
            }
        }
        $sos_locations = $soss;
        return view('homy', compact('sos_locations'));
    }

    public function admin_sos()
    {
        if (empty(Cookie::get('identificator'))) {
            $hash = \Hash::make(\Str::random(60));
            Cookie::queue("identificator", $hash, 99999999999);
        } else {
            $hash = Cookie::get('identificator');
        }
        $location = $this->getLocation();
        $arrContextOptions=array(
            "ssl"=>array(
                "verify_peer"=>false,
                "verify_peer_name"=>false,
            ),
        );
        $soss = [];
        $sos = SOS::all();
        foreach ($sos as $ss){
            $latlng = json_decode($ss->latlng,true);
            $req = Cache::remember("longitude={$latlng['lng']}&latitude={$latlng['lat']}", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function () use($latlng,$arrContextOptions){
                return json_decode(file_get_contents("http://crm.amotors.kz/api/v1/region?longitude={$latlng['lng']}&latitude={$latlng['lat']}&passanger_id=19", false, stream_context_create($arrContextOptions)));
            });
            if($req->geo_region_id == 68){
                $soss[] = $ss;
            }
        }
        $sos = collect($soss);
            $stats = Cache::get('covid_stats') ?? [];
        $stats_table = Cache::get('covid_stats_table') ?? [];
        $contacted = Cache::get('contacted') ?? 0;
        return view('map-covid-sos-admin', compact('location', 'stats_table', 'stats', 'contacted', 'sos', 'hash'));
    }

    public function approve($id)
    {
        $sos = SOS::find($id);
        $sos->update(['show' => true]);
        return back();
    }

    public function decline($id)
    {
        $sos = SOS::find($id);
        $sos->update(['show' => false]);
        return back();
    }

    public function delete($id)
    {
        $sos = SOS::find($id)->delete();
        return back();
    }

    public function convertTable(&$result, $table, $row)
    {
        foreach ($table as $data) {
            list($city, $count) = explode("–", $data->text());
            $city = trimming($city);
            $count = trimming($count);
            $result[$city][$row] = (int)$count;
            if ($row === "infected") {
                $result[$city]["recovered"] = 0;
                $result[$city]["deaths"] = 0;
            }
        }
    }
    
    public function publish()
    {
        $information = Cache::get("map_covid");
        $location = [];
        $cache = geoip()->getLocation()->toArray();
        $location['lat'] = $cache['lat'];
        $location['lon'] = $cache['lon'];
        $location['geo_region_id'] = 67;
        iF ($cache['country'] !== "Kazakhstan") {
            $location = Cache::remember("location", MCache::setTime(MCache::CACHE_TIME_6_MONTH), function () {
                return City::find(1)->toArray();
            });
        }
        $stats = Cache::get('covid_stats') ?? [];
        $stats_table = Cache::get('covid_stats_table') ?? [];
        $stats_world = Cache::get('covid_world_stats_table') ?? [];
        return view('map-covid-publish', compact('location', 'information', 'stats', 'stats_table','stats_world'));
    }


    public function mapzone_storage()
    {
        $default_radius = 100;
        $kef = 1.2;
        $info = json_decode(request()->information, true);
        foreach ($info as &$i) {
            if ($i['information']['name'] > 1) {
                $i['radius'] = $default_radius * (($kef + $i['information']['name'] / 10) + 0.5);
            } else {
                $i['radius'] = $default_radius;
            }
            $newinfo = [];
            $newinfo['information']['name'] = $i['information']['name'];
            if (!isset($i['information']['source'])) {
                $i['information']['source'] = "Неизвестсно";
            }
            if (strpos($i['information']['source'], "http") !== false) {
                if (strpos($i['information']['source'], "href") == false) {

                    $match = [];
                    preg_match('/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im', $i['information']['source'], $match);
                    $url = isset($match[1]) ? $match[1] : $match[0];
                    $source = "<a href='" . $i['information']['source'] . "' style='z-index:99999999999999'>" . $url . "</a>";
                } else {
                    $source = $i['information']['source'];
                }
            } else {
                $source = $i['information']['source'];
            }
            $newinfo['information']['source'] = $source;
            $newinfo['radius'] = $i['radius'];
            $newinfo['latlng'] = $i['latlng'];
            $newinfo['status'] = 1;
            $i = $newinfo;
        }
        $info = json_encode($info);
        Cache::forever("map_covid", $info);
        Cache::forget('map_merge');
        return response()->json(['status' => 'success']);
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
//        SMSNotification::send($phone, "Код подтверждения: {$code}");

        return view('home');
    }
}
