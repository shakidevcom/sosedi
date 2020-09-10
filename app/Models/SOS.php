<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SOS extends Model
{
    protected $fillable = ['address', 'fio', 'latlng', 'phone', 'comment', 'show', 'hash', 'debit_card', 'ip', 'blocked', 'category'];

    public static $en = false;
    protected $casts = [
        'show' => 'boolean',
        'blocked' => 'boolean',
    ];

    protected $hidden = [
        'hash', 'created_at', 'updated_at', 'ip', 'blocked', 'address', 'show', 'category','debit_card'
    ];

    public function setFioAttribute($value)
    {
        $this->attributes['fio'] = htmlspecialchars($value);
    }

    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = htmlspecialchars($value);
    }

    public function setCommentAttribute($value)
    {
        $this->attributes['comment'] = htmlspecialchars($value);
    }

    public function getCommentAttribute($comment)
    {
        if(request()->path() !== "help_share") {
            if (Carbon::parse($this->updated_at)->lt(Carbon::parse("2020-05-10 04:43:54"))) {
                $comment = "Текст будет доступно после правильного оформления автором. Если вы являетесь автором, пожалуйста, отправьте заявку повторно, указав только необходимые продукты.";
            }
        }
        return $comment;
    }

    public function helps(){
        return $this->hasMany(Help::class,'sos_id');
    }

    public function countHelps(){
        return $this->helps()->count();
    }
}
