<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\cobaget;

class StoreController extends Controller
{
    public function store(Request $req)
    {
        $data = new cobaget();

        $data->temperature = $req->temperature;
        $data->humidity = $req->humidity;
        $data->sum = $req->sum;

        $state = $data->save();

        if (!$state) {
            return response()->json([
                'status' => 400,
                'error' => 'Something Wrong!'
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Data Saved'
            ]);
        }
    }

    public function get_sensor()
    {
        // Ambil 10 entri terbaru, diurutkan berdasarkan yang paling baru
        $sensorData = Store::orderBy('created_at', 'desc')->take(10)->get();

        // Konversi ke format JSON
        $jsonData = $sensorData->toJson();

        // Kirim sebagai respons JSON
        return response()->json(['sensorData' => $jsonData]);
    }

    public function get()
    {
        $data = cobaget::all();

        $jsonData = $data->toJson();

        return response()->json(['sensorData' => $jsonData]);
    }

    public function getEstimasi()
    {
        $data = cobaget::all();
        return response()->json(['sensorData' => $data]);
    }
}
