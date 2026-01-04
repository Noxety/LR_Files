import echo from '@/echo';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface AuthUser {
    id: number;
    name: string;
}

interface Room {
    id: number;
    name: string;
}

interface Message {
    id: number | string;
    room_id: number;
    user_id: number;
    user_name: string | null;
    body: string;
    created_at: string;
}

interface PageProps {
    room: Room;
    authUser: AuthUser;
    messages: Message[];
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Chat Room', href: '/rooms/1' }];

export default function Room() {
    const page = usePage<PageProps>();
    const { room, authUser, messages: initialMessages } = page.props;
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const [body, setBody] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const container = containerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    };

    const scrollToBottomIfNear = () => {
        const container = containerRef.current;
        if (!container) return;
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceFromBottom < 200) setTimeout(scrollToBottom, 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    const lastMessageIdRef = useRef<number | null>(
        messages.length > 0 && typeof messages[messages.length - 1].id === 'number' ? messages[messages.length - 1].id : null,
    );

    const addMessages = (newMessages: Message[]) => {
        setMessages((prev) => {
            const all = [...prev, ...newMessages];
            const deduped: Message[] = [];
            const seen = new Set<number | string>();
            for (const m of all) {
                if (!seen.has(m.id)) {
                    seen.add(m.id);
                    deduped.push(m);
                }
            }
            return deduped;
        });
        scrollToBottomIfNear();
    };

    useEffect(() => {
        const channelName = `chat.room.${room.id}`;
        const channel = echo.private(channelName);

        const handleMessage = (e: any) => {
            const incoming: Message = e.message || e;
            if (!incoming?.id) return;
            lastMessageIdRef.current = typeof incoming.id === 'number' ? incoming.id : lastMessageIdRef.current;
            addMessages([incoming]);
        };

        channel.listen('.MessageSent', handleMessage);
        channel.listen('MessageSent', handleMessage);

        const polling = setInterval(async () => {
            try {
                const lastId = lastMessageIdRef.current || 0;
                const response = await axios.get(`/api/rooms/${room.id}/messages`, {
                    params: { after_id: lastId },
                });
                const newMessages: Message[] = response.data?.data || [];
                if (newMessages.length > 0) {
                    lastMessageIdRef.current =
                        typeof newMessages[newMessages.length - 1].id === 'number' ? newMessages[newMessages.length - 1].id : lastId;
                    addMessages(newMessages);
                }
            } catch {}
        }, 4000);

        return () => {
            channel.stopListening('.MessageSent');
            echo.leave(channelName);
            clearInterval(polling);
        };
    }, [room.id]);

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        const temp: Message = {
            id: `temp-${Date.now()}`,
            room_id: room.id,
            user_id: authUser.id,
            user_name: authUser.name,
            body,
            created_at: new Date().toISOString(),
        };

        addMessages([temp]);
        setBody('');

        try {
            const response = await axios.post('/chat/send', { room_id: room.id, body });
            if (response.data.success && response.data.message) {
                setMessages((prev) => prev.filter((m) => m.id !== temp.id).concat([response.data.message]));
            }
            setTimeout(scrollToBottom, 50);
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== temp.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Room" />
            <div className="flex h-full flex-col">
                <div ref={containerRef} className="mb-3 max-h-[650px] flex-1 space-y-3 overflow-auto rounded-lg border bg-transparent p-3 shadow-sm hide-scrollbar">
                    {messages.map((m) => (
                        <div
                            key={typeof m.id === 'number' ? `msg-${m.id}` : `temp-${m.id}-${m.created_at}`}
                            className={`flex flex-col ${m.user_id === authUser.id ? 'items-end' : 'items-start'} `}
                        >
                            <div className="mb-1 text-[10px]">{m.user_name}</div>
                            <div className="max-w-[70%] rounded-xl border px-4 py-2 text-sm break-words">{m.body}</div>
                            <div className="mt-1 text-[10px]">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <input
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="focus:ring-primary flex-1 rounded-full border bg-transparent px-4 py-2 focus:ring-1 focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="rounded-full border bg-primary hover:bg-primary/50 px-4 py-2 backdrop-blur-md transition">
                        Send
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
