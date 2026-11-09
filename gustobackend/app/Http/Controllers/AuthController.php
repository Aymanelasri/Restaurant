<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected function normalizeEmail($email)
    {
        return strtolower(trim((string) $email));
    }

    // FIX: code kiتgenera b random_int (secure) o kiتsift f blassa wa7da (ma-t3awdch l-code 3 merrat)
    protected function issueVerificationCode(User $user): void
    {
        $code = (string) random_int(100000, 999999);

        $user->verification_code = $code;
        $user->verification_code_expires_at = now()->addMinutes(10);
        $user->save();

        Mail::raw("Your verification code is: $code", function ($message) use ($user) {
            $message->to($user->email)->subject('Verification Code');
        });
    }

    // Login b email - sift verification code
    public function sendVerificationCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $email = $this->normalizeEmail($request->email);
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user) {
            $user = User::create([
                'email' => $email,
                'name' => explode('@', $email)[0],
                'password' => Hash::make(Str::random(40)),
                'role' => 'customer',
            ]);
        }

        $this->issueVerificationCode($user);

        return response()->json(['message' => 'Code msift l email dyalk']);
    }

    // Verify code o dir login
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $email = $this->normalizeEmail($request->email);
        $limiterKey = 'verify-code:' . $email . '|' . $request->ip();

        // FIX: brute-force protection (code fih ghir 1,000,000 possibilité)
        if (RateLimiter::tooManyAttempts($limiterKey, 5)) {
            return response()->json(['message' => 'Bzaf dyal les tentatives, 3awed morra morra'], 429);
        }

        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (
            !$user
            || !$user->verification_code
            || !hash_equals((string) $user->verification_code, (string) $request->code)
        ) {
            RateLimiter::hit($limiterKey, 600);
            return response()->json(['message' => 'Code ghalat'], 401);
        }

        // FIX: ila expires_at null ma-ykhdemch l-code
        if (!$user->verification_code_expires_at || now()->gt($user->verification_code_expires_at)) {
            RateLimiter::hit($limiterKey, 600);
            return response()->json(['message' => 'Code sat'], 401);
        }

        RateLimiter::clear($limiterKey);

        $user->verification_code = null;
        $user->verification_code_expires_at = null;
        $user->save();

        // FIX: Auth::login (session) tshad f API stateless -> ghir token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function register(Request $request)
    {
        // FIX: normalize l-email 9bel unique validation
        $request->merge(['email' => $this->normalizeEmail($request->email)]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        $this->issueVerificationCode($user);

        return response()->json([
            'message' => 'Account created! Code msift l email dyalk',
            'requires_verification' => true
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $email = $this->normalizeEmail($request->email);
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        // FIX: Hash::check bla session (Auth::attempt kiتطلب session)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email or password error'], 401);
        }

        $userRole = $user->role ?? 'user';

        if ($userRole === 'admin') {
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ]);
        }

        $this->issueVerificationCode($user);

        return response()->json([
            'message' => 'Code msift l email dyalk',
            'requires_verification' => true
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->has('email')) {
            $request->merge(['email' => $this->normalizeEmail($request->email)]);
        }

        $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $id,
            // FIX: role khass ykoun mn les valeurs l-ma3rofa
            'role' => 'sometimes|string|in:admin,staff,customer'
        ]);

        $user->update($request->only(['email', 'role']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function createUser(Request $request)
    {
        $request->merge(['email' => $this->normalizeEmail($request->email)]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|string|in:admin,staff,customer'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'customer'
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    public function deleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // FIX: admin ma-ymken-louch ymsa7 7sabou
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Ma-tqdarch tms7 7sabek'], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            // FIX: 422 machi 401 (401 kitخلli frontend ydir logout)
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
