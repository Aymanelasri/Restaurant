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
        // FIX: kan bla validation (rating 999, comment HTML/script...)
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
            'user_name' => 'required|string|max:100',
        ]);

        $review = Review::create([
            'rating' => $validated['rating'],
            'comment' => strip_tags($validated['comment']),
            'user_name' => strip_tags($validated['user_name']),
            'status' => 'pending'
        ]);

        return response()->json($review, 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // FIX: status khass ykoun mn liste (bddl l-valeurs ila kano mkhtalfin 3endek)
        $validated = $request->validate([
            'status' => 'required|string|in:pending,approved,rejected'
        ]);

        $review->update(['status' => $validated['status']]);
        return response()->json($review);
    }
}
