import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
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
    if (!newMessage.trim() || !groupId) return;
    const userId = localStorage.getItem('userId') || 'anonymous';
    const userName = localStorage.getItem('userName') || localStorage.getItem('name') || undefined
    const payload = {
      groupId,
      message: newMessage.trim(),
      userId,
      userName,
      timestamp: new Date().toISOString(),
    } as Message;

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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Chat del grupo</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-lg h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <div className="text-xs text-gray-400">{new Date(m.timestamp).toLocaleString()}</div>
            <div className="mt-1 inline-block px-3 py-2 rounded-lg bg-gray-800 text-gray-100">
              <div className="text-sm font-medium text-indigo-300">{m.userName ?? m.userId}</div>
              <div className="text-sm">{m.message}</div>
            </div>
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
