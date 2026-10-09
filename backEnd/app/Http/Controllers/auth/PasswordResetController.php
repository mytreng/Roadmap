<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use App\Models\User;

class PasswordResetController extends Controller
{
    public function forgot(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);
        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent to your email.'], 200);
        } else {
            return response()->json(['message' => 'Unable to send password reset link.'], 404);
        }
    }
    public function reset(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                ])->save();

                event(new PasswordReset($user));
            }
        );
        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid or expired reset token.',
        ], 422);
    }
}
