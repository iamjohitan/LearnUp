import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Home() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        window.location.href = "/login";
      } else {
        setUsuario(data.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {usuario ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido, {usuario.email} 🎓
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Home;
