import { useEffect, useRef, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Navbar from "../components/Navbar";

type Message = {
  groupId: string;
  userId: string;
  content?: string;
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
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const SOCKET_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:3000"
  ).replace(/\/api$/, "");

  // Cargar mensajes y conectar socket
  useEffect(() => {
    if (!groupId) return;
    let mounted = true;

    axiosClient
      .get<Message[]>(`/monitorias/${groupId}/chat`)
      .then((res) => mounted && setMessages(res.data || []))
      .catch((err) => console.error("Error fetching chat history:", err));

    const token = localStorage.getItem("accessToken") || undefined;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket conectado", socket.id);
      socket.emit("joinGroup", { groupId });
    });

    socket.on("message", (m: Message) => setMessages((prev) => [...prev, m]));
    socket.on("newMessage", (m: Message) =>
      setMessages((prev) => [...prev, m])
    );

    return () => {
      mounted = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId, SOCKET_URL]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userId = localStorage.getItem("userId") || "";

    const payload: Message = {
      groupId,
      content: newMessage.trim(),
      userId,
      timestamp: new Date().toISOString(),
    };

    socketRef.current?.emit("message", payload);
    setNewMessage("");
  };

  if (!groupId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">No se especificó groupId.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#eef3ff] text-slate-800">
      <Navbar />

      <div className="flex flex-col flex-1 items-center px-4 py-6">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col">
          {/* HEADER */}
          <header className="bg-indigo-600 text-white px-6 py-4 text-lg font-semibold">
            Chat del Grupo
          </header>

          {/* CHAT BOX */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
            {messages.map((m, i) => {
              const isMine = m.userId === localStorage.getItem("userId");
              return (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-3 shadow 
                    ${
                      isMine
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800"
                    }
                  `}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {m.userName || m.userId}
                    </p>
                    <p className="text-sm">{m.content}</p>
                    <p className="text-[10px] opacity-60 mt-1">
                      {new Date(m.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* INPUT */}
          <div className="p-4 bg-white border-t flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
