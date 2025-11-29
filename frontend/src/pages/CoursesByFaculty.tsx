import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';

type Faculty = { id: string; name: string };
type Course = { id: string; name?: string; code?: string; description?: string; faculties?: Faculty[] };
type Profile = { id: string; name?: string; email?: string; faculty_id?: string | null };
type GroupOption = { id: string; code?: string };

export default function CoursesByFaculty() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // estado para evitar múltiples inscripciones simultáneas
  const [enrolling, setEnrolling] = useState<string | null>(null);

  // nuevo: control de grupos por curso y UI de selección
  const [groupsByCourse, setGroupsByCourse] = useState<Record<string, GroupOption[]>>({});
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Record<string, string>>({});

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

  // nueva función: obtener grupos para un curso y guardar en estado
  const fetchGroupsForCourse = async (courseId: string) => {
    try {
      const res = await axiosClient.get<GroupOption[]>(`/groups/course/${courseId}`);
      const groups: GroupOption[] = res.data || [];
      setGroupsByCourse((prev) => ({ ...prev, [courseId]: groups }));
      // preselect primer grupo si existe
      if (groups.length > 0) {
        setSelectedGroup((prev) => ({ ...prev, [courseId]: groups[0].id }));
      }
    } catch (e) {
      console.error('Error fetching groups for course', e);
      setGroupsByCourse((prev) => ({ ...prev, [courseId]: [] }));
    }
  };

  // Inscribir: ahora usa el selectedGroup en lugar de prompt
  const handleEnrollClick = async (courseId: string) => {
    if (!profile) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }

    // Si no hemos cargado grupos para este curso, cargarlos y expandir
    if (!groupsByCourse[courseId]) {
      await fetchGroupsForCourse(courseId);
    }
    setExpandedCourse(courseId === expandedCourse ? null : courseId);
  };

  const handleConfirmEnroll = async (courseId: string) => {
    if (!profile) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }
    const groupId = selectedGroup[courseId];
    if (!groupId) {
      alert('Selecciona un grupo');
      return;
    }

    try {
      setEnrolling(courseId);
      await axiosClient.post(`/groups/${groupId}/assign-student`, { studentId: profile.id });
      alert('Inscripción realizada correctamente');
      setExpandedCourse(null);
    } catch (e: any) {
      console.error('Error inscribiendo en grupo', e);
      alert(e.response?.data?.message || e.message || 'Error al inscribirse');
    } finally {
      setEnrolling(null);
    }
  };

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
        <h1 className="text-2xl font-bold mb-4">Cursos disponibles para inscripcion</h1>

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
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link to={`/course/${c.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded">
                          Ver detalles
                        </Link>
                        <Link to={`/course/${c.id}/groups`} className="px-3 py-1 border rounded">
                          Ver grupos
                        </Link>
                        <button
                          onClick={() => handleEnrollClick(c.id)}
                          className="px-3 py-1 border rounded"
                          disabled={enrolling === c.id}
                        >
                          {expandedCourse === c.id ? 'Cerrar' : 'Inscribirme'}
                        </button>
                      </div>

                      {/* selector desplegable para inscribirse (solo si expandedCourse === c.id) */}
                      {expandedCourse === c.id && (
                        <div className="mt-2 flex items-center gap-2">
                          {(!groupsByCourse[c.id] || groupsByCourse[c.id].length === 0) ? (
                            <div className="text-sm text-gray-600">Cargando grupos o no hay grupos disponibles...</div>
                          ) : (
                            <>
                              <select
                                value={selectedGroup[c.id] || groupsByCourse[c.id][0]?.id || ''}
                                onChange={(e) => setSelectedGroup((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                className="px-3 py-1 border rounded"
                              >
                                {groupsByCourse[c.id].map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.code ?? g.id}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleConfirmEnroll(c.id)}
                                disabled={enrolling === c.id}
                                className="px-3 py-1 bg-indigo-600 text-white rounded"
                              >
                                {enrolling === c.id ? 'Inscribiendo...' : 'Confirmar inscripción'}
                              </button>
                              <button
                                onClick={() => setExpandedCourse(null)}
                                className="px-3 py-1 border rounded"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      )}
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