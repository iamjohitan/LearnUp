import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar"; // Ajusta la ruta según tu estructura

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("⏳ Iniciando sesión...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      setMensaje("❌ " + error.message);
    } else {
      setMensaje("✅ Bienvenido nuevamente!");
      console.log("Usuario:", data.user);
      // Aquí puedes redirigir al Home
      window.location.href = "/home";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Iniciar Sesión 🔐
        </h1>

        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 w-full transition"
        >
          Iniciar sesión
        </button>

        {mensaje && (
          <p className="mt-4 text-center text-sm font-semibold">{mensaje}</p>
        )}
      </form>
    </div>
  );
}

export default Login;
