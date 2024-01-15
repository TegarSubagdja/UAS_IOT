<?php

namespace App\Http\Controllers;

use App\Models\StoreVisitor;
use Illuminate\Http\Request;

class StoreVisitorController extends Controller
{

    public function getAll() {
        // Ambil 10 entri terbaru, diurutkan berdasarkan yang paling baru
        $sensorData = StoreVisitor::orderBy('created_at', 'desc')->take(10)->get();

        // Konversi ke format JSON
        $jsonData = $sensorData->toJson();

        // Kirim sebagai respons JSON
        return response()->json(['JumlahOrang' => $jsonData]);
    }
    public function getAverage()
    {
        // Ambil tahun sekarang dan tahun sebelumnya
        $currentYear = now()->year;
        $lastYear = $currentYear - 1;

        // dd($currentYear, $lastYear);

        // Hitung rata-rata jumlah orang untuk setiap bulan pada tahun sekarang
        $currentYearAverages = StoreVisitor::selectRaw('MONTH(created_at) as month, AVG(jumlah) as average')
            ->whereYear('created_at', $currentYear)
            ->groupByRaw('MONTH(created_at)')
            ->get();

        // Hitung rata-rata jumlah orang untuk setiap bulan pada tahun sebelumnya
        $lastYearAverages = StoreVisitor::selectRaw('MONTH(created_at) as month, AVG(jumlah) as average')
            ->whereYear('created_at', $lastYear)
            ->groupByRaw('MONTH(created_at)')
            ->get();

        return response()->json([
            'currentYearAverages' => $currentYearAverages,
            'lastYearAverages' => $lastYearAverages,
        ]);
    }
}
