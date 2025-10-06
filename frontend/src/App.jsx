import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("usuarios").select("*");
      if (error) {
        console.error("❌ Error obteniendo datos:", error.message);
      } else {
        console.log("✅ Datos obtenidos:", data);
        setMensajes(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mensajes desde Supabase 💬</h1>
      {mensajes.length > 0 ? (
        <ul className="space-y-2">
          {mensajes.map((item, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
              {item.Mensaje}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay mensajes disponibles.</p>
      )}
    </div>
  );
}

export default App;
