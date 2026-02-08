<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Login b email - sift verification code
    public function sendVerificationCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Ila user ma kaynch, créer user jdid
            $user = User::create([
                'email' => $request->email,
                'name' => explode('@', $request->email)[0],
                'password' => bcrypt(rand(100000, 999999))
            ]);
        }

        // Créer code 6 ar9am
        $code = rand(100000, 999999);

        // Sauvegarder f database
        $user->verification_code = $code;
        $user->verification_code_expires_at = now()->addMinutes(10);
        $user->save();

        // Sift email
        Mail::raw("Your verification code is: $code", function($message) use ($user) {
            $message->to($user->email)
                    ->subject('Verification Code');
        });

        return response()->json(['message' => 'Code msift l email dyalk']);
    }

    // Verify code o dir login
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->verification_code != $request->code) {
            return response()->json(['message' => 'Code ghalat'], 401);
        }

        if (now()->gt($user->verification_code_expires_at)) {
            return response()->json(['message' => 'Code sat'], 401);
        }

        // Msa7 code
        $user->verification_code = null;
        $user->verification_code_expires_at = null;
        $user->save();

        // Dir login
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Créer code 6 ar9am
        $code = rand(100000, 999999);

        // Sauvegarder f database
        $user->verification_code = $code;
        $user->verification_code_expires_at = now()->addMinutes(10);
        $user->save();

        // Sift email
        Mail::raw("Your verification code is: $code", function($message) use ($user) {
            $message->to($user->email)
                    ->subject('Verification Code');
        });

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

        // T'akked mn email o password
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email or password error'], 401);
        }

        $user = Auth::user();

        // Ila admin, ma siftch verification code
        if ($user->role === 'admin') {
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ]);
        }

        // Créer code 6 ar9am
        $code = rand(100000, 999999);

        // Sauvegarder f database
        $user->verification_code = $code;
        $user->verification_code_expires_at = now()->addMinutes(10);
        $user->save();

        // Sift email
        Mail::raw("Your verification code is: $code", function($message) use ($user) {
            $message->to($user->email)
                    ->subject('Verification Code');
        });

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

        $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|string'
        ]);

        $user->update($request->only(['email', 'role']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function createUser(Request $request)
    {
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

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
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
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }
}
