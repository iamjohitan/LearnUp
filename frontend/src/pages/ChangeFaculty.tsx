import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

type Profile = {
  id: string;
  name: string;
  email: string;
  faculty_id: string | null;
};

type Faculty = {
  id: string;
  name: string;
};

export default function ChangeFaculty() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosClient.get<Profile>("/users/me"),
      axiosClient.get<Faculty[]>("/faculty/listar"),
    ])
      .then(([pRes, fRes]) => {
        setProfile(pRes.data);
        setFaculties(fRes.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error al cargar datos");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (facultyId: string) => {
    try {
      await axiosClient.patch("/users/faculty", { facultyId });
      navigate("/inicio");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar facultad");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-[#dceaff]">
        Cargando...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef3ff] to-[#dceaff]">
        No se pudo cargar el perfil
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gradient-to-b from-[#eef3ff] to-[#dceaff]">
      {/* LOGO */}
      <img src={logo} alt="logo" className="w-24 h-24 mb-6 drop-shadow-md" />

      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {profile.faculty_id ? "Tu facultad" : "Selecciona tu facultad"}
      </h2>

      {error && (
        <p className="bg-red-200 text-red-700 py-2 px-4 rounded-lg mb-4">
          {error}
        </p>
      )}

      {/* si ya tiene facultad */}
      {profile.faculty_id ? (
        <div
          className="
          bg-white shadow-lg rounded-2xl p-6
          max-w-md text-center border
        "
        >
          <p className="text-gray-700 mb-1">Ya tienes la facultad:</p>
          <p className="text-xl font-semibold text-gray-900">
            {faculties.find((f) => f.id === profile.faculty_id)?.name}
          </p>
        </div>
      ) : (
        <div
          className="
          grid grid-cols-1 sm:grid-cols-2 gap-6 
          mt-8 w-full max-w-3xl
        "
        >
          {faculties.map((fac) => (
            <button
              key={fac.id}
              onClick={() => handleSelect(fac.id)}
              className="
                bg-white
                rounded-2xl p-6 shadow-md
                hover:shadow-xl hover:-translate-y-1 
                transition-all border
              "
            >
              <p className="text-xl font-semibold text-gray-800 text-center">
                {fac.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
