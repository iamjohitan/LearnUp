import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axiosClient from '../api/axiosClient'
import ingenieriaImg from '../assets/images/ingenieria.jpg'
import saludImg from '../assets/images/salud.jpg'
import quimicaImg from '../assets/images/quimica.jpg'
import musicaImg from '../assets/images/musica.jpg'

type FacultyApi = {
  id: string
  name: string
}

type FacultyCard = FacultyApi & {
  description: string
  programs: string[]
  color: string
  image: string
}

const facultyMetadata: Record<string, Omit<FacultyCard, 'id' | 'name'>> = {
  'Ingenierías': {
    description: 'Tecnología, innovación y resolución de problemas complejos.',
    programs: ['Sistemas', 'Industrial', 'Ambiental'],
    color: 'from-[#1e3a8a] via-[#2563eb] to-[#38bdf8]',
    image: ingenieriaImg,
  },
  'Ciencias de la Salud': {
    description: 'Formación integral con énfasis en bienestar y cuidado humano.',
    programs: ['Medicina', 'Enfermería', 'Psicología'],
    color: 'from-[#0f172a] via-[#1d4ed8] to-[#22c55e]',
    image: saludImg,
  },
  'Química': {
    description: 'Investigación, laboratorio y ciencia aplicada al servicio de la sociedad.',
    programs: ['Química Pura', 'Bioquímica', 'Materiales'],
    color: 'from-[#0f172a] via-[#2563eb] to-[#22d3ee]',
    image: quimicaImg,
  },
  'Artes y Humanidades': {
    description: 'Creatividad, cultura y expresión en todas sus formas.',
    programs: ['Música', 'Literatura', 'Historia del Arte'],
    color: 'from-[#0f172a] via-[#4338ca] to-[#f472b6]',
    image: musicaImg,
  },
}

const buildCard = (f: FacultyApi): FacultyCard => {
  const meta = facultyMetadata[f.name] ?? {
    description: 'Programas y oportunidades académicas.',
    programs: [],
    color: 'from-[#1e293b] via-[#334155] to-[#0ea5e9]',
    image: ingenieriaImg,
  }
  return { ...f, ...meta }
}

export default function FacultadesPage() {
  const navigate = useNavigate()
  const [faculties, setFaculties] = useState<FacultyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [profileFaculty, setProfileFaculty] = useState<string | null>(null)

  const hasFaculty = useMemo(() => !!profileFaculty, [profileFaculty])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [profileRes, facRes] = await Promise.all([
          axiosClient.get<{ faculty_id: string | null }>('/users/me'),
          axiosClient.get<FacultyApi[]>('/faculty/listar'),
        ])
        if (!mounted) return
        setProfileFaculty(profileRes.data?.faculty_id ?? null)
        const cards = (facRes.data || []).map(buildCard)
        setFaculties(cards)
      } catch (e: any) {
        if (!mounted) return
        setError(e.response?.data?.message || e.message || 'No se pudieron cargar las facultades')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const selectFaculty = async (facultyId: string, facultyName: string) => {
    setError(null)
    setSuccess(null)
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setError('Debes iniciar sesión para seleccionar una facultad.')
      navigate('/login')
      return
    }
    if (hasFaculty) {
      setError('Ya tienes una facultad asignada. No puedes cambiarla aquí.')
      return
    }
    try {
      setSubmitting(true)
      const res = await axiosClient.patch('/users/faculty', { facultyId })
      setSuccess(res.data?.message || `Facultad ${facultyName} asignada.`)
      setProfileFaculty(facultyId)
      // Ir a cursos filtrados
      setTimeout(() => navigate('/courses'), 400)
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'No se pudo asignar la facultad')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="grid gap-6 rounded-3xl bg-white/60 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] ring-1 ring-white/60 backdrop-blur-xl md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Facultades
            </p>
            <h1 className="bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Explora las áreas de conocimiento de LearnUp
            </h1>
            <p className="text-lg text-slate-700">
              Elige tu facultad para ver los cursos correspondientes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/courses')}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
              >
                Ir a cursos
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow ring-1 ring-blue-100 transition hover:bg-blue-50"
              >
                Inicio
              </button>
            </div>
            {hasFaculty && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-100">
                Ya tienes una facultad asignada. Puedes ver tus cursos en "Ir a cursos".
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/80 via-blue-500/80 to-cyan-400/80 p-[1px] shadow-[0_20px_45px_-15px_rgba(30,58,138,0.45)] ring-1 ring-white/50">
              <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-white/80 px-6 py-8 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  {(faculties || []).slice(0, 4).map((faculty) => (
                    <div
                      key={faculty.id}
                      className="rounded-2xl bg-slate-900/5 px-4 py-5 text-sm font-semibold text-slate-800 shadow-sm"
                    >
                      {faculty.name}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Elige una facultad y descubre programas, foros y eventos asociados.
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm">
            {success}
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2">
          {loading ? (
            <div className="md:col-span-2 text-slate-600">Cargando facultades...</div>
          ) : faculties.length === 0 ? (
            <div className="md:col-span-2 text-slate-600">No se encontraron facultades.</div>
          ) : (
            faculties.map((faculty) => (
              <article
                key={faculty.id}
                className="rounded-3xl bg-white/75 p-6 shadow-[0_20px_50px_-25px_rgba(30,41,59,0.4)] ring-1 ring-white/60 backdrop-blur"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${faculty.color} px-3 py-1 text-xs font-semibold uppercase text-white shadow`}>
                  {faculty.name}
                </div>
                <p className="mt-3 text-base text-slate-700">{faculty.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {faculty.programs.length === 0 && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      Programas por anunciar
                    </span>
                  )}
                  {faculty.programs.map((program) => (
                    <span
                      key={program}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100"
                    >
                      {program}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => selectFaculty(faculty.id, faculty.name)}
                    disabled={submitting || hasFaculty}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {hasFaculty ? 'Ya tienes facultad' : 'Elegir esta facultad'}
                  </button>
                  <button
                    onClick={() => navigate('/courses')}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow ring-1 ring-blue-100 transition hover:bg-blue-50"
                  >
                    Ver cursos
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}
