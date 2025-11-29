import React, { useState } from "react";
import { register } from "../api/auth";
import { useAuthMutation } from "../hooks/useAuthMutation";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, execute } = useAuthMutation(register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await execute({ name, email, password });
      navigate("/verify", { state: { email } });
    } catch (err) {
      console.error("Error en registro");
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

        <h2 className="text-4xl font-extrabold mb-2 text-center">
          Crea tu cuenta
        </h2>
        <div className="w-90 h-1 bg-blue-600 rounded-full mb-8"></div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white shadow-lg px-8 py-10 rounded-2xl flex flex-col gap-5"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>

        {/* LINK DEBAJO */}
        <p className="mt-4 text-gray-600 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>

        <p className="mt-10 text-gray-400 text-xs">
          © 2025 LearnUp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
