// frontend/src/pages/Register.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Asegúrate de tener este archivo
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("⏳ Creando cuenta...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/verified",
          data: { nombre },
        },
      });

      if (error) throw error;

      setMensaje("✅ Revisa tu correo para confirmar tu cuenta.");
      setTimeout(() => navigate("/pending"), 2000);
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Registro de Usuario 🎓
        </h1>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg w-full transition"
        >
          Registrarme
        </button>

        {mensaje && (
          <p className="mt-4 text-center text-sm font-semibold">{mensaje}</p>
        )}
      </form>
    </div>
  );
}

export default Register;
