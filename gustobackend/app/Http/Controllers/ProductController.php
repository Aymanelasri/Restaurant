<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|string',
            'available' => 'boolean'
        ]);

        // FIX: validated() machi all()
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image' => 'sometimes|string',
            'available' => 'sometimes|boolean'
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = 'product_' . Str::uuid() . '.' . $image->extension();
            $image->move(public_path('restaurants'), $fileName);

            return response()->json([
                'path' => '/restaurants/' . $fileName
            ]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
