<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
        try {
            // Jib l-user mn Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // T'akked wach l-email ja mzyan
            if (!$googleUser->email) {
                return "Error: Ma jach l-email mn Google!";
            }

            // Sajjel l-user f Database (awla jibou ila deja m-sajjel)
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'email' => $googleUser->email,
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    'password' => bcrypt('Aymane@1234'),
                    'role' => $googleUser->email === 'aymanelasri100@gmail.com' ? 'admin' : 'customer'
                ]);
            } else {
                $user->update([
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                ]);
            }

            // Dir Login
            Auth::login($user);

            // Créer token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Sifto l-Dashboard ila admin, wla l-reservation ila customer
            if ($user->role === 'admin') {
                return redirect('http://localhost:3001/?user=' . urlencode(json_encode($user)) . '&token=' . $token);
            } else {
                return redirect('http://localhost:3000/?token=' . $token . '&user=' . urlencode(json_encode($user)));
            }

        } catch (Exception $e) {

            dd($e);
        }
    }
}
