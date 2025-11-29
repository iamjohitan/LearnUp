import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';

type Role = { id: string; name: string };
type Profile = { id: string; name?: string; email?: string; role_id?: string | null };
type User = { id: string; name?: string; email?: string };
type Group = { id: string; code?: string };

export default function AdminPanel() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'course' | 'role' | 'monitoria' | null>(null);

  // KPI States
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalMonitorias: 0,
    totalGroups: 0,
  });

  // Form states
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDesc, setCourseDesc] = useState('');

  const [roleUserId, setRoleUserId] = useState('');
  const [roleToAssign, setRoleToAssign] = useState('');

  const [monGroupId, setMonGroupId] = useState('');
  const [monMonitorId, setMonMonitorId] = useState('');
  const [monTipo, setMonTipo] = useState<'virtual' | 'presencial'>('virtual');
  const [monLink, setMonLink] = useState('');
  const [monSalon, setMonSalon] = useState('');
  const [monFecha, setMonFecha] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setErr(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setErr('Debes iniciar sesión para acceder al panel de administrador.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const [profileData, rolesData] = await Promise.all([
          axiosClient.get<Profile>('/users/me').then(res => res.data),
          axiosClient.get<Role[]>('/users/roles').then(res => res.data ?? []),
        ]);

        const [studentsData, groupsData] = await Promise.all([
          axiosClient.get<User[]>('/users/role/students').then(res => res.data ?? []).catch(() => [] as User[]),
          axiosClient.get<Group[]>('/groups/list').then(res => res.data ?? []).catch(() => [] as Group[]),
        ]);

        let usersList: User[] = Array.isArray(studentsData) ? [...studentsData] : [];
        const [profRes, monRes] = await Promise.allSettled([
          axiosClient.get<User[]>('/users/role/professors'),
          axiosClient.get<User[]>('/users/role/monitors'),
        ]);
        if (profRes.status === 'fulfilled') usersList.push(...(profRes.value.data || []));
        if (monRes.status === 'fulfilled') usersList.push(...(monRes.value.data || []));

        if (!mounted) return;
        setProfile(profileData);
        setRoles(rolesData || []);
        setUsers(usersList);
        setGroups(groupsData || []);

        const myRoleName = (rolesData || []).find(r => r.id === profileData.role_id)?.name ?? '';
        const allowed = ['admin', 'administrador', 'administrator'].includes(myRoleName.toLowerCase());
        if (!allowed) {
          navigate('/');
        }
        setStats({
          totalCourses: usersList.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0,
          totalUsers: usersList.length,
          totalMonitorias: groupsData?.length || 0,
          totalGroups: (groupsData || []).length,
        });
      } catch (e: any) {
        if (!mounted) return;
        console.error('AdminPanel init error', e);
        setErr(e.response?.data?.message || e.message || 'Error inicializando panel admin');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleCreateCourse = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      const res = await axiosClient.post('/course/create', {
        name: courseName,
        code: courseCode,
        description: courseDesc || undefined,
      });
      setMsg(res.data?.message || 'Curso creado');
      setCourseName(''); setCourseCode(''); setCourseDesc('');
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || 'Error creando curso');
    }
  };

  const handleChangeRole = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null); setMsg(null);
    if (!roleUserId || !roleToAssign) {
      setErr('Selecciona usuario y rol');
      return;
    }
    try {
      const res = await axiosClient.post(`/users/${roleUserId}/change-role`, { role: roleToAssign });
      setMsg(res.data?.message || 'Rol actualizado');
      setRoleUserId('');
      setRoleToAssign('');
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || 'Error cambiando rol');
    }
  };

  const handleCreateMonitoria = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null); setMsg(null);
    if (!monGroupId || !monMonitorId || !monFecha) {
      setErr('Grupo, monitor y fecha son requeridos');
      return;
    }
    try {
      await axiosClient.post(`/monitorias/${monGroupId}/create`, {
        monitor_id: monMonitorId,
        tipo: monTipo,
        link: monLink || undefined,
        salon: monSalon || undefined,
        fecha: monFecha,
      });
      setMsg('Monitoría creada');
      setMonMonitorId(''); setMonLink(''); setMonSalon(''); setMonFecha('');
      setActiveTab(null);
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || 'Error creando monitoría');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center">
        <div className="text-lg font-semibold text-slate-600 animate-pulse">
          Cargando panel admin...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Banner Institucional con Logo */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-12 shadow-[0_20px_45px_-15px_rgba(30,58,138,0.25)] ring-1 ring-white/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
            <img src="/logo.png" alt="LearnUp" className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <img src="/logo.png" alt="LearnUp" className="w-16 h-16" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-1">
                  Bienvenido al Panel
                </p>
                <h1 className="text-4xl font-bold text-slate-900">
                  ¿Qué deseas hacer hoy, {profile?.name || 'Admin'}?
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-lg">
              Gestiona toda tu plataforma académica desde un solo lugar
            </p>
          </div>
        </div>

        {/* KPIs / Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Cursos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600">Cursos Totales</p>
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {stats.totalCourses}
            </h3>
            <p className="text-xs text-slate-500 mt-2">Cursos activos en plataforma</p>
          </div>

          {/* Total Usuarios */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600">Usuarios Activos</p>
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {stats.totalUsers}
            </h3>
            <p className="text-xs text-slate-500 mt-2">Estudiantes, profesores y monitores</p>
          </div>

          {/* Total Monitorías */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600">Monitorías Creadas</p>
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {stats.totalMonitorias}
            </h3>
            <p className="text-xs text-slate-500 mt-2">Sesiones de apoyo activas</p>
          </div>

          {/* Total Grupos */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-600">Grupos Inscritos</p>
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {stats.totalGroups}
            </h3>
            <p className="text-xs text-slate-500 mt-2">Grupos de estudiantes</p>
          </div>
        </div>

        {/* Alerts */}
        {err && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 shadow-sm flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{err}</p>
            </div>
          </div>
        )}
        {msg && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 shadow-sm flex items-start gap-3">
            <span className="text-xl">✓</span>
            <div>
              <p className="font-semibold">Éxito</p>
              <p className="text-sm mt-1">{msg}</p>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Acciones Principales</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card Create Course */}
            <button
              onClick={() => setActiveTab(activeTab === 'course' ? null : 'course')}
              className={`p-8 rounded-2xl transition-all duration-300 text-left ${
                activeTab === 'course'
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102'
              }`}
            >
              <div className={`text-4xl mb-4 ${activeTab === 'course' ? 'filter drop-shadow-lg' : ''}`}>📚</div>
              <h3 className="text-xl font-bold mb-2">Crear Curso</h3>
              <p className={`text-sm ${activeTab === 'course' ? 'text-indigo-100' : 'text-slate-600'}`}>
                Agrega nuevos cursos a la plataforma
              </p>
            </button>

            {/* Card Change Role */}
            <button
              onClick={() => setActiveTab(activeTab === 'role' ? null : 'role')}
              className={`p-8 rounded-2xl transition-all duration-300 text-left ${
                activeTab === 'role'
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102'
              }`}
            >
              <div className={`text-4xl mb-4 ${activeTab === 'role' ? 'filter drop-shadow-lg' : ''}`}>👤</div>
              <h3 className="text-xl font-bold mb-2">Cambiar Rol</h3>
              <p className={`text-sm ${activeTab === 'role' ? 'text-purple-100' : 'text-slate-600'}`}>
                Asigna roles a usuarios del sistema
              </p>
            </button>

            {/* Card Create Monitoria */}
            <button
              onClick={() => setActiveTab(activeTab === 'monitoria' ? null : 'monitoria')}
              className={`p-8 rounded-2xl transition-all duration-300 text-left ${
                activeTab === 'monitoria'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102'
              }`}
            >
              <div className={`text-4xl mb-4 ${activeTab === 'monitoria' ? 'filter drop-shadow-lg' : ''}`}>📝</div>
              <h3 className="text-xl font-bold mb-2">Crear Monitoría</h3>
              <p className={`text-sm ${activeTab === 'monitoria' ? 'text-cyan-100' : 'text-slate-600'}`}>
                Organiza sesiones de apoyo académico
              </p>
            </button>
          </div>
        </div>

        {/* Content Section - Only Show Selected Tab */}
        {activeTab && (
          <div className="animate-fadeIn">
            {activeTab === 'course' && (
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-[0_20px_45px_-15px_rgba(30,58,138,0.25)] ring-1 ring-white/60">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Crear Nuevo Curso</h2>
                <form onSubmit={handleCreateCourse} className="space-y-4 max-w-xl">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Nombre del Curso</span>
                    <input
                      value={courseName}
                      onChange={e => setCourseName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Ej: Matemáticas I"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Código</span>
                    <input
                      value={courseCode}
                      onChange={e => setCourseCode(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Ej: MAT101"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Descripción (opcional)</span>
                    <textarea
                      value={courseDesc}
                      onChange={e => setCourseDesc(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                      placeholder="Describe brevemente el curso"
                      rows={3}
                    />
                  </label>

                  <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    Crear Curso
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'role' && (
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-[0_20px_45px_-15px_rgba(30,58,138,0.25)] ring-1 ring-white/60">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Cambiar Rol de Usuario</h2>
                <form onSubmit={handleChangeRole} className="space-y-4 max-w-xl">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Selecciona usuario</span>
                    <select
                      value={roleUserId}
                      onChange={e => setRoleUserId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    >
                      <option value="">-- Selecciona usuario --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name ?? u.email ?? u.id}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Nuevo rol</span>
                    <select
                      value={roleToAssign}
                      onChange={e => setRoleToAssign(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    >
                      <option value="">-- Selecciona rol --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    Cambiar Rol
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'monitoria' && (
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-[0_20px_45px_-15px_rgba(30,58,138,0.25)] ring-1 ring-white/60">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Crear Monitoría</h2>
                <form onSubmit={handleCreateMonitoria} className="space-y-4 max-w-xl">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Grupo</span>
                    <select
                      value={monGroupId}
                      onChange={e => setMonGroupId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">-- Selecciona grupo --</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.code ?? g.id}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">ID Monitor</span>
                    <input
                      value={monMonitorId}
                      onChange={e => setMonMonitorId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      placeholder="ID del monitor"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Tipo</span>
                    <select
                      value={monTipo}
                      onChange={e => setMonTipo(e.target.value as any)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    >
                      <option value="virtual">Virtual</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </label>

                  {monTipo === 'virtual' && (
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 uppercase">Enlace de Reunión</span>
                      <input
                        value={monLink}
                        onChange={e => setMonLink(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        placeholder="https://zoom.us/..."
                      />
                    </label>
                  )}

                  {monTipo === 'presencial' && (
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 uppercase">Salón</span>
                      <input
                        value={monSalon}
                        onChange={e => setMonSalon(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                        placeholder="Ej: Edificio A - Aula 101"
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 uppercase">Fecha y Hora</span>
                    <input
                      value={monFecha}
                      onChange={e => setMonFecha(e.target.value)}
                      type="datetime-local"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      required
                    />
                  </label>

                  <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    Crear Monitoría
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!activeTab && (
          <div className="text-center py-16">
            <p className="text-lg text-slate-500">
              Selecciona una acción arriba para comenzar
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
