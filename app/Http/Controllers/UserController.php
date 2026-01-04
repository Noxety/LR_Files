<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $users = User::latest()->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required',
            'bio' => 'nullable|string',
        ]);

        User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $user->load(['projects', 'tasks']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if ($request->has('active') && $request->keys() === ['active']) {
            $request->validate([
                'active' => 'required|in:active,inactive',
            ]);

            $user->active = $request->input('active');
            $user->save();

            return redirect()->route('users.index')->with('success', 'User created successfully.');
        }

        // $validated = $request->validate([
        //     'name' => 'required|string|max:255',
        //     'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        //     'role' => 'required|in:learner,teacher,admin',
        //     'bio' => 'nullable|string',
        // ]);

        // if ($request->filled('password')) {
        //     $request->validate([
        //         'password' => 'required|string|min:8|confirmed',
        //     ]);
        //     $validated['password'] = Hash::make($request->password);
        // }

        // $user->update($validated);

        return redirect()->route('users.show', $user)->with('success', 'User updated successfully.');
    }


    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
