<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class City extends \Illuminate\Database\Eloquent\Model
{

    /**
     * @var string
     */
    protected $table = 'cities';

    /**
     * @var array
     */
    protected $fillable = [
        'name',
        'geo_longitude',
        'geo_latitude',
        'geo_region_id',
    ];

    /**
     * @var array
     */
    protected $hidden = [
        'deleted_reason',
        'deleted_at',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'geo_longitude' => 'double',
        'geo_latitude' => 'double',
        'geo_region_id' => 'integer',
    ];

    /**
     * @var array
     */

    public $timestamps = false;
    /**
     * @var array
     */
    protected $rules = [
        'name' => 'required|max:80',
        'geo_longitude' => 'required',
        'geo_latitude' => 'required',
        'geo_region_id' => 'required',
    ];

    /**
     * @var array
     */
    protected $messages = [
        'geo_longitude' => 'долгота',
        'geo_latitude' => 'широта',
        'geo_region_id' => 'ID региона 2GIS',
    ];
}
