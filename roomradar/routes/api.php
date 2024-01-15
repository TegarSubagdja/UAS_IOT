<?php

use App\Http\Controllers\FavoriteMovieController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreImageController;
use App\Http\Controllers\StoreVisitorController;
use App\Models\StoreImage;
use App\Models\StoreVisitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Sensor DHT
Route::post('store', [StoreController::class, 'store']);
Route::get('get_sensor', [StoreController::class, 'get_sensor']);

// Management photo
Route::post('img', [StoreImageController::class, 'store']);
Route::get('img', [StoreImageController::class, 'get']);
Route::get('img/{filename}', [StoreImageController::class, 'get_image']);

//cobaget
Route::get('get', [StoreController::class, 'get']);
Route::get('getEstimasi', [StoreController::class, 'getEstimasi']);

// Manegement pengunjung
Route::get('count', [StoreVisitorController::class, 'getAll']);
Route::get('average', [StoreVisitorController::class, 'getAverage']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
