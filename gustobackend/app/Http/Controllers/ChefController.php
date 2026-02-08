<?php

namespace App\Http\Controllers;

use App\Models\Chef;
use Illuminate\Http\Request;

class ChefController extends Controller
{
    public function index()
    {
        $chefs = Chef::all();
        return response()->json($chefs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'rating' => 'required|numeric|min:0|max:5',
            'status' => 'required|in:active,break,off',
            'orders_today' => 'integer|min:0',
            'image' => 'nullable|string'
        ]);

        $chef = Chef::create($request->all());
        return response()->json($chef, 201);
    }

    public function update(Request $request, $id)
    {
        $chef = Chef::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'specialty' => 'sometimes|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'status' => 'sometimes|in:active,break,off',
            'orders_today' => 'sometimes|integer|min:0',
            'image' => 'sometimes|nullable|string'
        ]);

        $chef->update($request->all());
        return response()->json($chef);
    }

    public function destroy($id)
    {
        $chef = Chef::findOrFail($id);
        $chef->delete();
        return response()->json(['message' => 'Chef deleted successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = 'chef_' . time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('restaurants'), $fileName);
            
            return response()->json([
                'path' => '/restaurants/' . $fileName
            ]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}