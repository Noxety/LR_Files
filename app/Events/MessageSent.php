<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\InteractsWithSockets;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets;

    public Message $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        // Use public channel - simpler and more reliable
        return new Channel('chat.room.' . $this->message->room_id);
    }

    public function broadcastAs()
    {
        return 'MessageSent';
    }

    public function broadcastWith()
    {
        // Ensure user relationship is loaded
        if (!$this->message->relationLoaded('user')) {
            $this->message->load('user');
        }

        return [
            'message' => [
                'id' => $this->message->id,
                'room_id' => $this->message->room_id,
                'user_id' => $this->message->user_id,
                'user_name' => $this->message->user->name ?? null,
                'body' => $this->message->body,
                'created_at' => $this->message->created_at->toDateTimeString(),
            ],
        ];
    }
}
