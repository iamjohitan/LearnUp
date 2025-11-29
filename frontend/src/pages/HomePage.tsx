import Navbar from '../components/Navbar'
import hero from '../assets/images/hero.jpg'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClient'

export default function HomePage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupsErr, setGroupsErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingGroups(true);
    axiosClient
      .get('/users/me')
      .then((r) => {
        if (!mounted) return;
        const userId = r.data?.id;
        if (!userId) throw new Error('Perfil no disponible');
        return axiosClient.get(`/users/${userId}/groups`);
      })
      .then((rg) => {
        if (!mounted) return;
        setGroups(rg?.data || []);
      })
      .catch((e) => {
        console.error('HomePage: error cargando grupos', e);
        setGroupsErr(e.response?.data?.message || e.message || 'Error cargando grupos');
      })
      .finally(() => {
        if (mounted) setLoadingGroups(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col px-6 py-12">
        <section className="grid gap-18 rounded-3xl bg-white/60 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Bienvenido
            </p>
            <h1 className="bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Aprende, colabora y comparte conocimiento.
            </h1>
            <p className="text-lg text-slate-600">
              Explora facultades, ingresa a foros y conecta con otros estudiantes desde un solo
              lugar. Mantente al día con noticias, eventos y recursos académicos.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/facultades" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
                Explorar Facultades
              </Link>
              <Link to="/courses" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow ring-1 ring-blue-100 transition hover:bg-blue-50">
                Cursos por facultad
              </Link>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl p-4">
              <img src={hero}/>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Actualizaciones
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Noticias y recordatorios</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-[#e8f0ff] shadow hover:shadow-lg transition ring-1 ring-[#cddcff]">
              <p className="text-2xl">📰</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Noticias universitarias</h3>
              <p className="mt-1 text-sm text-slate-600">
                Descubre anuncios oficiales, nuevas iniciativas y proyectos destacados.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#e6f3ff] shadow hover:shadow-lg transition ring-1 ring-[#c6e2ff]">
              <p className="text-2xl">🎓</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Recordatorios académicos</h3>
              <p className="mt-1 text-sm text-slate-600">
                Fechas de inscripción, exámenes y trámites importantes al día.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#e3edff] shadow hover:shadow-lg transition ring-1 ring-[#c2d8ff]">
              <p className="text-2xl">📢</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Eventos del campus</h3>
              <p className="mt-1 text-sm text-slate-600">
                Charlas, talleres y actividades para conectar con la comunidad.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}