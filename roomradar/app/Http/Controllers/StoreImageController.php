<?php

namespace App\Http\Controllers;

use App\Models\StoreImage;
use Illuminate\Http\Request;

class StoreImageController extends Controller
{
    public function store(Request $request)
    {
        // Validasi request, pastikan bahwa file yang dikirim adalah gambar
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        // Nama file gambar unik dengan timestamp
        $imageName = time() . '.' . $request->image->extension();

        // Simpan data ke database
        $data = new StoreImage();
        $data->name = $imageName;

        $state = $data->save();

        if ($state) {
            // Pindahkan file gambar ke folder 'photos' dalam direktori 'public' setelah data tersimpan di database
            $request->image->move(public_path('photos'), $imageName);

            // Beri respons bahwa gambar berhasil disimpan
            return response()->json([
                'status' => 200,
                'message' => 'Image and data saved successfully',
                'image_path' => 'photos/' . $imageName,
                'name' => $imageName,
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'error' => 'Something went wrong while saving data to the database',
            ]);
        }
    }

    public function get_image($filename)
    {
        $path = public_path('photos/' . $filename);

        if (file_exists($path)) {
            return response()->file($path);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'File not found.',
            ], 404);
        }
    }

    public function get()
    {
        $data = StoreImage::all();

        $jsonData = $data->toJson();

        return response()->json(['listFoto' => $jsonData]);
    }
}
