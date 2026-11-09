<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $email = strtolower(trim($request->email));
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        // FIX: nfs response ila user kayn awla la (bach ma-ykchfch chkoun 3ndo compte)
        if (!$user) {
            return response()->json(['message' => 'Reset link sent!']);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // FIX: frontend URL mn config
        $resetUrl = config('app.frontend_url') . "/reset-password?token=$token&email=" . urlencode($email);

        try {
            Mail::raw("Click to reset password: $resetUrl", function ($message) use ($user) {
                $message->to($user->email)->subject('Reset Password');
            });
        } catch (\Throwable $e) {
            // FIX: ma-nrj3ouch $e->getMessage() l client (kichkef config dyal mail)
            Log::error('Password reset mail failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Reset link generated, but email delivery is not configured on this server.',
            ], 200);
        }

        return response()->json(['message' => 'Reset link sent!']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $email = strtolower(trim($request->email));
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        // FIX: f Carbon 3 diffInMinutes kay-rj3 9ima negative -> token ma-kan-sali abadan
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Token expired'], 400);
        }

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // FIX: n7ydo les tokens l-9dam (ila kan chi wa7d sre9 l-compte)
        $user->tokens()->delete();

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json(['message' => 'Password reset successfully!']);
    }
}
