<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\Auth\SocialLoginController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PhotoController;
use App\Http\Middleware\AdminOnly;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/offline', function () {
    return view('offline');
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('auth/google', [SocialLoginController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [SocialLoginController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['auth'])->get('/api/rooms/{roomId}/messages', [ChatController::class, 'messages'])->name('chat.messages');
    Route::get('/rooms/{roomId}', [ChatController::class, 'show'])
        ->name('rooms.show');
    Route::post('/chat/send', [ChatController::class, 'send'])->name('chat.send');
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'userRole' => Auth::user()->role,
        ]);
    })->name('dashboard');

    Route::resource('projects', ProjectController::class);
    Route::resource('tasks', TaskController::class);
    Route::post('/upload-chunk', [PhotoController::class, 'store'])->name('upload.chunk');
    Route::middleware([AdminOnly::class])->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::get('admin/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
