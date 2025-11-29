import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';

type Faculty = { id: string; name: string };
type Course = { id: string; name?: string; code?: string; description?: string; faculties?: Faculty[] };
type Profile = { id: string; name?: string; email?: string; faculty_id?: string | null };

export default function CoursesByFaculty() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // obtener perfil del usuario al montar
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axiosClient
      .get<Profile>('/users/me')
      .then((r) => {
        if (!mounted) return;
        setProfile(r.data);
      })
      .catch((e) => {
        console.error('Error al obtener perfil', e);
        setError(e.response?.data?.message || e.message || 'Error al cargar perfil');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // cuando tengamos profile con faculty_id, cargar cursos y filtrar
  useEffect(() => {
    if (!profile) return;
    if (!profile.faculty_id) return;

    let mounted = true;
    setLoadingCourses(true);
    setError(null);

    axiosClient
      .get<Course[]>('/course/list')
      .then(async (res) => {
        if (!mounted) return;
        const allCourses = res.data || [];

        const detailPromises = allCourses.map(async (c) => {
          try {
            const r = await axiosClient.get<Faculty[]>(`/course/${c.id}/faculties`);
            return { ...c, faculties: r.data || [] };
          } catch {
            return { ...c, faculties: [] };
          }
        });

        const withFacs = await Promise.all(detailPromises);
        if (!mounted) return;
        setCourses(withFacs);

        const filteredCourses = withFacs.filter((c) =>
          (c.faculties || []).some((f) => f.id === profile.faculty_id),
        );
        setFiltered(filteredCourses);
      })
      .catch((e) => {
        console.error('Error al cargar cursos', e);
        setError(e.response?.data?.message || e.message || 'Error al cargar cursos');
      })
      .finally(() => {
        if (mounted) setLoadingCourses(false);
      });

    return () => {
      mounted = false;
    };
  }, [profile]);

  const facultyName = useMemo(() => {
    // algunos endpoints no devuelven nombre de faculty; si no está, mostrar id
    return profile?.faculty_id ?? '';
  }, [profile]);

  if (loading) return <div className="p-6">Cargando perfil...</div>;

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  if (!profile) return <div className="p-6 text-red-600">No se pudo cargar el perfil.</div>;

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Mis cursos</h1>

        {!profile.faculty_id ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded space-y-3">
            <p className="text-sm">No tienes una facultad asignada. Debes escoger una para ver tus cursos.</p>
            <div className="flex gap-2">
              <Link to="/changeFaculty" className="px-3 py-2 bg-indigo-600 text-white rounded">
                Cambiar facultad
              </Link>
              <button onClick={() => window.location.reload()} className="px-3 py-2 border rounded">
                Refrescar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Facultad:</span>
              <div className="text-lg font-medium">{facultyName}</div>
            </div>

            {loadingCourses ? (
              <div>Cargando cursos...</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-600">No se encontraron cursos para tu facultad.</div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((c) => (
                  <article key={c.id} className="p-4 bg-white rounded shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium">{c.name ?? c.code ?? 'Curso'}</div>
                        {c.code && <div className="text-sm text-gray-500">{c.code}</div>}
                      </div>
                      <div className="text-sm text-gray-500">{(c.faculties || []).map((f) => f.name).join(', ')}</div>
                    </div>
                    {c.description && <p className="mt-2 text-sm text-gray-700">{c.description}</p>}
                    <div className="mt-3 flex gap-2">
                      <Link to={`/course/${c.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">
                        Ver detalles
                      </Link>
                      <Link to={`/course/${c.id}/groups`} className="px-3 py-1 border rounded">
                        Ver grupos
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}