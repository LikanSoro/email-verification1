<?php

namespace App\Http\Controllers;

use App\Mail\SendEmail;
use App\Mail\verifyEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegisterController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validation($request);
        $user = User::create([
            'username' => $request->input('username'),
            'first_name' => $request->input('firstName'),
            'last_name' => $request->input('lastName'),
            'phone_number' => $request->input('phone_number'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
            'verify_token' => Str::random(40),
        ]);
        Mail::to($user->email)->send(new SendEmail($user));
        return redirect('/')->with('status', 'A verification link has been sent to your registered email ID. Please verify to login.');
    }

    // registration validation
    public function validation($request)
    {
        return $this->validate($request, [
            'username' => 'required|unique:users|max:255',
            'email' => 'required|unique:users|max:255',
            'phone_number' => 'required|unique:users',
            'password' => 'required|confirmed|max:255'
        ]);
    }

    // Update user after verification link click
    public function sendEmailDone($email, $verifyToken)
    {
        $user = User::where(['email' => $email, 'verify_token' => $verifyToken])->first();
        if ($user) {
            User::where(['email' => $email, 'verify_token' => $verifyToken])->update(['status' => 1, 'verify_token' => NULL]);
            return redirect('/')->with('status', 'Verified. You may proceed to login');
        } else {
            return redirect('/')->with('status', 'User not found');
        }
    }
}
