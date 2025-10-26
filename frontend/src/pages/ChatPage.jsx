import { useState } from "react";

function Chat() {
  const [grupoId, setGrupoId] = useState("BWM-06");
  const [usuarioId, setUsuarioId] = useState("1");
  const [nombre, setNombre] = useState("Johan Lucumi");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState("");

  const enviarMensaje = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/chat/${grupoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          nombre_usuario: nombre,
          contenido: mensaje,
          tipo: "texto",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al enviar mensaje");

      setMensajes((prev) => [...prev, data]);
      setMensaje("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          💬 Chat del grupo {grupoId}
        </h2>

        <form onSubmit={enviarMensaje} className="flex mb-4 gap-2">
          <input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </form>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="space-y-2">
          {mensajes.map((m, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg p-2 text-sm border border-gray-200"
            >
              <p className="font-semibold">{m.nombre_usuario}:</p>
              <p>{m.contenido}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chat;
