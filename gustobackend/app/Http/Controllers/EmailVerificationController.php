<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        Mail::raw("Click here to verify your email: $verificationUrl", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Verify Your Email Address');
        });

        return response()->json(['message' => 'Verification link sent!']);
    }

    public function verify(Request $request, $id, $hash)
    {
        // FIX: t'akked mn signature (ila route ma-3ndhach middleware 'signed')
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Invalid or expired link'], 403);
        }

        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->email))) {
            return response()->json(['message' => 'Invalid verification link'], 403);
        }

        // FIX: frontend URL mn config machi hardcoded localhost
        $frontend = config('app.frontend_url');

        if ($user->hasVerifiedEmail()) {
            return redirect($frontend . '/login?verified=already');
        }

        $user->markEmailAsVerified();

        return redirect($frontend . '/login?verified=success');
    }
}
