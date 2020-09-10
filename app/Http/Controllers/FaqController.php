<?php

namespace App\Http\Controllers;

use App\Notifications\SMSNotification;
use Illuminate\Http\Request;
use App\Models\City;
use Cache;
class FaqController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function index(){
        return view('faq');
    }

    public function stats(){
        return view('stats');
    }

}
