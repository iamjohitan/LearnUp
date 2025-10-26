import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function Home() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/login");
      } else {
        setUsuario(data.user);
      }
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 text-center w-[90%] max-w-lg">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          ¡Bienvenido a LearnUp! 🎓
        </h1>
        {usuario ? (
          <>
            <p className="text-gray-600 mb-6">
              Hola, <span className="font-semibold">{usuario.email}</span>
            </p>
            <p className="text-gray-500 mb-8">
              Estás autenticado correctamente. 🚀 Aquí podrás ver tus cursos,
              grupos y chats.
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <p className="text-gray-500">Cargando información...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
