// src/pages/Register.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Ajusta la ruta según tu estructura

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("⏳ Creando cuenta...");

    // Validar correo USC
    if (!email.endsWith("@usc.edu.co")) {
      setMensaje("❌ Solo se permiten correos institucionales (@usc.edu.co)");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
        emailRedirectTo: "http://localhost:5173/home",
      },
    });

    if (error) {
      setMensaje("❌ Error: " + error.message);
    } else {
      setMensaje(
        "✅ Cuenta creada. Revisa tu correo para confirmar el registro."
      );
      setTimeout(() => navigate("/"), 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Crear cuenta 🧑‍🎓
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
          placeholder="Correo institucional (@usc.edu.co)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 w-full transition"
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
