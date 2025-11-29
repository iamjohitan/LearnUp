import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { io, Socket } from 'socket.io-client';


type Message = {
    groupId: string;
    userId: string;
    content: string;
    timestamp: string;
};

interface GroupsChatProps{
    groupId: string;
}

export default function GroupsChat({ groupId }: GroupsChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '');

    useEffect(() => {

        let mounted = true;
        axiosClient.get<Message[]>(`/monitorias/${groupId}/chat`)
            .then(res => {
                if(!mounted) return;
                setMessages(res.data || []);
    });

    const token = localStorage.getItem('accessToken') || undefined;
    const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
        console.log('Connected to chat server');
        socket.emit('joinGroup', groupId);
    });

    socket.on('newMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('connect_error', (err: any) => {
      console.error('Socket connect_error', err);
    });   

    return () => {
        mounted = false;
        socket.disconnect();
        socketRef.current = null;
    };
    }, [groupId, SOCKET_URL]);

    useEffect(() => {
    // auto scroll
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userId = localStorage.getItem('userId') || '';
    const payload: Message = { groupId, message: newMessage.trim(), userId, timestamp: new Date() };
    // Emitir por socket
    socketRef.current?.emit('message', payload);
    // Añadir localmente para feedback inmediato
    setMessages(prev => [...prev, payload]);
    setNewMessage('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h3>Chat del grupo</h3>
      <div style={{ border: '1px solid #333', height: 400, overflowY: 'auto', padding: 12, background: '#111' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <strong style={{ color: '#8cf' }}>{m.userId}</strong>
            <div style={{ color: '#ddd' }}>{m.message}</div>
            <small style={{ color: '#666' }}>{new Date(m.timestamp || Date.now()).toLocaleString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}
