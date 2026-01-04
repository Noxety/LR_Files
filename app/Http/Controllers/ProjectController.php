<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $projects = Project::with(['creator', 'assignee', 'tasks'])->latest()->paginate(10);
        } else {
            $projects = Project::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->with(['creator', 'assignee', 'tasks'])
                ->latest()
                ->paginate(10);
        }

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'userRole' => $user->role,
        ]);
    }

    public function create()
    {
        $users = User::where('role', '!=', 'learner')->get(['id', 'name', 'role']);
        
        return Inertia::render('Projects/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:planning,in_progress,review,completed,on_hold',
            'priority' => 'required|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $project = Project::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('projects.show', $project)->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load(['creator', 'assignee', 'tasks.assignee', 'tasks.creator']);
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'userRole' => auth()->user()->role,
        ]);
    }

    public function edit(Project $project)
    {
        $users = User::where('role', '!=', 'learner')->get(['id', 'name', 'role']);
        
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:planning,in_progress,review,completed,on_hold',
            'priority' => 'required|in:low,medium,high,urgent',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        if ($validated['status'] === 'completed' && !$project->completed_date) {
            $validated['completed_date'] = now();
        }

        $project->update($validated);

        return redirect()->route('projects.show', $project)->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        
        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
