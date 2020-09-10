<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Sd extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('s_o_s_s', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->boolean('show')->default(false);
            $table->string('fio')->nullable();
            $table->text('comment')->nullable();
            $table->string('phone')->nullable();
            $table->string('latlng')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sds', function (Blueprint $table) {
            //
        });
    }
}
