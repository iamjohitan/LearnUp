import { useEffect, useRef, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

type Message = {
  groupId: string;
  userId: string;
  message: string;
  userName?: string;
  timestamp: string;
};

interface GroupsChatProps {
  groupId?: string;
}

export default function GroupsChat({ groupId: propGroupId }: GroupsChatProps) {
  const params = useParams<{ groupId: string }>();
  const groupId = propGroupId || params.groupId;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '');

  useEffect(() => {
    if (!groupId) return;
    let mounted = true;

    axiosClient.get<Message[]>(`/monitorias/${groupId}/chat`)
      .then(res => {
        if (!mounted) return;
        setMessages(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching chat history:', err);
      });

    const token = localStorage.getItem('accessToken') || undefined;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket conectado', socket.id);
      socket.emit('joinGroup', { groupId });
    });

    // backend emite 'message' (y en caso de otra impl. puede usar 'newMessage')
    socket.on('message', (m: Message) => setMessages(prev => [...prev, m]));
    socket.on('newMessage', (m: Message) => setMessages(prev => [...prev, m]));

    socket.on('connect_error', (err: any) => console.error('Socket connect_error', err));

    return () => {
      mounted = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId, SOCKET_URL]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userId = localStorage.getItem('userId') || '';
    const payload: Message = { groupId, content: newMessage.trim(), userId, timestamp: new Date().toISOString() };
    // Emitir por socket
    socketRef.current?.emit('message', payload);
    setNewMessage('');
  };

  if (!groupId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">No se especificó groupId. Usa la ruta /groups/:groupId o pasa la prop groupId.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h3>Chat del grupo</h3>
      <div style={{ border: '1px solid #333', height: 400, overflowY: 'auto', padding: 12, background: '#111' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <strong style={{ color: '#8cf' }}>{m.userId}</strong>
            <div style={{ color: '#ddd' }}>{m.content}</div>
            <small style={{ color: '#666' }}>{new Date(m.timestamp || Date.now()).toLocaleString()}</small>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
