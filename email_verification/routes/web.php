<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Mail\SendEmail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// register user
route::resource('register', RegisterController::class);

// login validation
route::post('validate-Login', [LoginController::class, 'validateLogin']);
route::get('logout', [LoginController::class, 'logout']);
route::get('dashboard', [LoginController::class, 'dashboard'])->middleware('isLoggedIn');
route::get('edit-user', [LoginController::class, 'editUser'])->middleware('isLoggedIn');
route::post('edit-user', [LoginController::class, 'update']);

// email validation
route::get('verify/{email}/{verifyToken}', [RegisterController::class, 'sendEmailDone'])->name('verify');
