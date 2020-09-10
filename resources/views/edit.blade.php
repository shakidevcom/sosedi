@extends('layouts.app')

@section('content')
    <div class="">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header"><a href="/help_share">Панель управления</a></div>

                    <div class="card-body">
                        <form method="post" action="{{ route('sos.update',$sos->id) }}">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="inputEmail4">ФИО</label>
                                    <input type="text" class="form-control" id="inputEmail4" name="fio" value="{{ $sos->fio }}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="inputPassword4">Password</label>
                                    <input type="text" class="form-control"  name="phone" placeholder="Phone" value="{{ $sos->phone }}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="inputPassword4">Карта</label>
                                    <input type="text" class="form-control"  name="debit_card" placeholder="Phone" value="{{ $sos->debit_card }}">
                                </div>
                                <div class="form-group col-md-8">
                                    <label for="inputCity">Комментарии</label>
                                    <textarea class="form-control" name="comment" id="" cols="30" rows="10">{{ $sos->comment }}</textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheck" name="show" {{ $sos->show ? 'checked' : '' }}>
                                    <label class="form-check-label" for="gridCheck">
                                        Показать
                                    </label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Изменить</button>
                        </form>
                    </div>
                    <div>
                        <iframe src="/admin_sos" frameborder="0" width="100%" height="500px"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
