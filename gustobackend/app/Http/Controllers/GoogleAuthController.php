<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class GoogleAuthController extends Controller
{
    // 1. Sift l-user l Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // 2. L-blassa fin kiy-rj3 l-user
    public function handleGoogleCallback()
    {
        $frontend = config('app.frontend_url');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            if (!$googleUser->email) {
                return redirect($frontend . '/login?error=no_email');
            }

            $normalizedEmail = strtolower($googleUser->email);
            $user = User::where('email', $normalizedEmail)->first();

            if (!$user) {
                $user = User::create([
                    'email' => $normalizedEmail,
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    // FIX: password random (kan hardcoded 'Asad@1234' -> ay wa7d ydkhl)
                    'password' => Hash::make(Str::random(40)),
                    // FIX: admin email mn config/.env
                    'role' => $normalizedEmail === strtolower((string) config('app.admin_email')) ? 'admin' : 'customer'
                ]);
            } else {
                $user->update([
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Nfs format l-9dim (user JSON + token) walakin b champs safe bark
            $safeUser = $user->only(['id', 'name', 'email', 'role']);

            return redirect($frontend . '/dashboard?user=' . urlencode(json_encode($safeUser)) . '&token=' . $token);

        } catch (Exception $e) {
            // FIX: dd($e) kay-kchef kol chi f production
            Log::error('Google auth failed: ' . $e->getMessage());
            return redirect($frontend . '/login?error=google_failed');
        }
    }
}
