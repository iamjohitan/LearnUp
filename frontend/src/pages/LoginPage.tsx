import React, { useState } from "react";
import { login } from "../api/auth";
import { useAuthMutation } from "../hooks/useAuthMutation";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, execute } = useAuthMutation(login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await execute({ email, password });
      navigate("/facultad");
    } catch (err) {
      console.error("Error en login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef3ff] to-[#dceaff] flex justify-center items-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          className="w-28 h-28 mb-8 drop-shadow-xl animate-fadeIn"
        />

        <h2 className="text-4xl font-extrabold mb-2 text-center text-gray-800">
          Inicia sesión
        </h2>
        <div className="w-90 h-1 bg-blue-600 rounded-full mb-8"></div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white shadow-xl px-8 py-10 rounded-2xl flex flex-col gap-6 border border-gray-200"
        >
          <input
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-60"
          >
            {isLoading ? "Entrando..." : "Iniciar sesión"}
          </button>

          {error && (
            <p className="text-red-500 text-center text-sm mt-1">{error}</p>
          )}
        </form>

        {/* LINK DEBAJO */}
        <p className="mt-5 text-gray-700 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>

        {/* FOOTER */}
        <p className="mt-10 text-gray-400 text-xs">
          © 2025 LearnUp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
