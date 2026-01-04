<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $tasks = Task::with(['project', 'assignee', 'creator'])->latest()->paginate(10);
        } else {
            $tasks = Task::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->with(['project', 'assignee', 'creator'])
                ->latest()
                ->paginate(10);
        }

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'userRole' => $user->role,
        ]);
    }

    public function create()
    {
        $projects = Project::all(['id', 'title']);
        $users = User::where('role', '!=', 'learner')->get(['id', 'name', 'role']);
        
        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,review,completed',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task = Task::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('tasks.show', $task)->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        $task->load(['project', 'assignee', 'creator']);
        
        return Inertia::render('Tasks/Show', [
            'task' => $task,
            'userRole' => auth()->user()->role,
        ]);
    }

    public function edit(Task $task)
    {
        $projects = Project::all(['id', 'title']);
        $users = User::where('role', '!=', 'learner')->get(['id', 'name', 'role']);
        
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,review,completed',
            'priority' => 'required|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'estimated_hours' => 'nullable|integer|min:1',
            'actual_hours' => 'nullable|integer|min:1',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.show', $task)->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
