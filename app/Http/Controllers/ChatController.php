<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function show($roomId)
    {
        $room = Room::findOrFail($roomId);

        $messages = $room->messages()
            ->with('user') // include user name
            ->latest()
            ->take(50)
            ->get()
            ->reverse() // oldest first
            ->values(); // important: converts collection keys to 0,1,2...

        return Inertia::render('Chat/Room', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
            ],
            'authUser' => [
                'id' => auth()->id(),
                'name' => auth()->user()->name,
            ],
            'messages' => $messages->map(fn($m) => [
                'id' => $m->id,
                'room_id' => $m->room_id,
                'user_id' => $m->user_id,
                'user_name' => $m->user->name ?? null,
                'body' => $m->body,
                'created_at' => $m->created_at->toDateTimeString(),
            ])->toArray(), // convert to plain array
        ]);
    }


    public function messages(Request $request, $roomId)
    {
        $limit = (int) $request->query('limit', 20);
        $before = $request->query('before');

        $query = Message::where('room_id', $roomId);

        if ($before) {
            $messages = $query->where('id', '<', $before)
                ->orderBy('id', 'desc')
                ->limit($limit)
                ->get();
        } else {
            $messages = $query->orderBy('id', 'desc')
                ->limit($limit)
                ->get();
        }
        $messages = $messages->reverse()->values();

        $oldest = $messages->first();
        $more = false;
        $nextBefore = null;
        if ($oldest) {
            $more = Message::where('room_id', $roomId)
                ->where('id', '<', $oldest->id)
                ->exists();
            $nextBefore = $oldest->id;
        }

        $payload = $messages->map(function ($m) {
            return [
                'id' => $m->id,
                'room_id' => $m->room_id,
                'user_id' => $m->user_id,
                'user_name' => $m->user->name ?? null,
                'body' => $m->body,
                'created_at' => $m->created_at->toDateTimeString(),
            ];
        });

        return response()->json([
            'data' => $payload,
            'meta' => [
                'more' => $more,
                'next_before' => $nextBefore,
                'limit' => $limit,
            ],
        ]);
    }
    public function send(Request $request)
    {
        $request->validate(['room_id' => 'required|int', 'body' => 'required|string']);
        $message = Message::create([
            'room_id' => $request->room_id,
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        // Load user relationship before broadcasting
        $message->load('user');

        // Broadcast the message
        try {
            // Use broadcast() instead of toOthers() to ensure it reaches all clients
            // For public channels, we want everyone to receive it
            $broadcastResult = broadcast(new MessageSent($message));
            
            Log::info('Message broadcasted', [
                'message_id' => $message->id, 
                'room_id' => $message->room_id,
                'channel' => 'chat.room.' . $message->room_id,
                'event' => 'MessageSent',
                'broadcast_result' => $broadcastResult ? 'success' : 'failed'
            ]);
        } catch (\Exception $e) {
            Log::error('Broadcast failed', [
                'error' => $e->getMessage(), 
                'message_id' => $message->id,
                'trace' => $e->getTraceAsString()
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'room_id' => $message->room_id,
                'user_id' => $message->user_id,
                'user_name' => $message->user->name ?? null,
                'body' => $message->body,
                'created_at' => $message->created_at->toDateTimeString(),
            ],
        ]);
    }
}
