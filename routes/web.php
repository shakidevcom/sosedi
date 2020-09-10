<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', 'CovidController@mapzone');
Route::get('/', 'SOSController@index');

Route::get('/set_locale/{locale}', 'SOSController@setLocale')->name('set_locale');
Route::get('/map', 'SOSController@sos');
Route::get('/faq', 'FaqController@index');
Route::get('/help_share', 'HomeController@admin');
Route::get('/help_share/{id}/edit', 'HomeController@edit')->name('sos.edit');
Route::post('/help_share/{id}/update', 'HomeController@update')->name('sos.update');
Route::get('/admin_sos', 'HomeController@admin_sos');
Route::get('/admin/{id}/delete', 'HomeController@delete')->name('delete');
Route::get('/admin/{id}/approve', 'HomeController@approve')->name('approve');
Route::get('/admin/{id}/decline', 'HomeController@decline')->name('decline');
Route::get('/admin/{id}/block', 'HomeController@block')->name('block');
Route::get('/admin/{id}/unblock', 'HomeController@unblock')->name('unblock');
Route::get('/admin/{id}/helps', 'HomeController@helps')->name('helps');
Route::get('/save_sos', 'SOSController@save_sos');
Route::get('/i_helped', 'SOSController@helped');
Route::get('/api/information', 'CovidController@information');

Auth::routes(['register' => true]);
