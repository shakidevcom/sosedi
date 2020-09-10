@extends('layouts.app')

@section('content')
    <div class="">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">Панель управления</div>

                    <div class="card-body">
                        <table class="table table-responsive">
                            <thead>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th>Комментарии</th>
                            <th>Отобразить</th>
                            <th>Время создания</th>
                            <th>Действия</th>
                            </thead>
                            <tbody>
                            @foreach($sos_locations as $sos)
                                <tr>
                                    <td>{{ $sos->fio }}</td>
                                    <td>{{ $sos->phone }}</td>
                                    <td>{{ $sos->comment }}</td>
                                    <td>{{ $sos->show ? "Да" : "Нет" }}</td>
                                    <td>{{ $sos->created_at }}</td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            @if($sos->show)
                                                <a href="{{ route('decline',$sos->id) }}"
                                                   class="btn btn-warning">Скрыть</a>
                                            @else
                                                <a href="{{ route('approve',$sos->id) }}" class="btn btn-success">Отобразить</a>
                                            @endif
                                            <a href="{{ route('delete',$sos->id) }}" class="btn btn-danger">Удалить</a>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <iframe src="/admin_soss" frameborder="0" width="100%" height="500px"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
