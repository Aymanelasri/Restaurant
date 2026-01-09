<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::orderBy('created_at', 'desc')->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $review = Review::create([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'user_name' => $request->user_name,
            'status' => 'pending'
        ]);

        return response()->json($review, 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);
        return response()->json($review);
    }
}