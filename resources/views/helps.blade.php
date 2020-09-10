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
                            <th>#</th>
                            <th>Комментарии</th>
                            <th>Время создания</th>
                            </thead>
                            <tbody>
                            @foreach($helps ?? [] as $sos)
                                <tr>
                                    <td>{{ $loop->index+1 }}</td>
                                    <td>{{ $sos->comment }}</td>
                                    <td>{{ $sos->created_at }}</td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
