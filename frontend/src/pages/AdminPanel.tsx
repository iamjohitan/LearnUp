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
    setLoading(true);
    Promise.all([
      axiosClient.get<Profile>('/users/me'),
      axiosClient.get<Role[]>('/users/roles'),
      axiosClient.get<User[]>('/users/role/students').catch(() => ([])),
      axiosClient.get<Group[]>('/groups/list').catch(() => ([])),
    ])
      .then(async ([pRes, rolesRes, studentsRes, groupsRes]) => {
        if (!mounted) return;
        setProfile(pRes.data);
        setRoles(rolesRes.data || []);
        // combine students + other roles if needed
        const usersList: User[] = Array.isArray(studentsRes.data) ? studentsRes.data : [];
        // try to fetch professors & monitors too
        try {
          const [profRes, monRes] = await Promise.allSettled([
            axiosClient.get<User[]>('/users/role/professors'),
            axiosClient.get<User[]>('/users/role/monitors'),
          ]);
          if (profRes.status === 'fulfilled') usersList.push(...(profRes.value.data || []));
          if (monRes.status === 'fulfilled') usersList.push(...(monRes.value.data || []));
        } catch {}
        setUsers(usersList);
        setGroups(groupsRes.data || []);
        // Role check: allow 'admin' or variants
        const myRoleName = rolesRes.data?.find(r => r.id === pRes.data.role_id)?.name ?? '';
        const allowed = ['admin', 'administrador', 'administrator'].includes(myRoleName.toLowerCase());
        if (!allowed) {
          // not admin -> redirect
          navigate('/');
        }
      })
      .catch((e) => {
        console.error('AdminPanel init error', e);
        setErr(e.response?.data?.message || e.message || 'Error inicializando panel admin');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Create course
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

  // Change role
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
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || 'Error cambiando rol');
    }
  };

  // Create monitoria
  const handleCreateMonitoria = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null); setMsg(null);
    if (!monGroupId || !monMonitorId || !monFecha) {
      setErr('Grupo, monitor y fecha son requeridos');
      return;
    }
    try {
      const res = await axiosClient.post(`/monitorias/${monGroupId}/create`, {
        monitor_id: monMonitorId,
        tipo: monTipo,
        link: monLink || undefined,
        salon: monSalon || undefined,
        fecha: monFecha,
      });
      setMsg('Monitoria creada');
      setMonMonitorId(''); setMonLink(''); setMonSalon(''); setMonFecha('');
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message || 'Error creando monitoria');
    }
  };

  if (loading) return <div className="p-6">Cargando panel admin...</div>;
  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>

        {err && <div className="mb-4 text-red-600">{err}</div>}
        {msg && <div className="mb-4 text-green-600">{msg}</div>}

        <section className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Crear Curso</h2>
            <form onSubmit={handleCreateCourse} className="space-y-2">
              <input value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Nombre" className="w-full p-2 border rounded" required />
              <input value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="Código" className="w-full p-2 border rounded" required />
              <input value={courseDesc} onChange={e => setCourseDesc(e.target.value)} placeholder="Descripción" className="w-full p-2 border rounded" />
              <button className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded">Crear</button>
            </form>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Cambiar rol de usuario</h2>
            <form onSubmit={handleChangeRole} className="space-y-2">
              <select value={roleUserId} onChange={e => setRoleUserId(e.target.value)} className="w-full p-2 border rounded">
                <option value="">Selecciona usuario</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email ?? u.id}</option>)}
              </select>
              <select value={roleToAssign} onChange={e => setRoleToAssign(e.target.value)} className="w-full p-2 border rounded">
                <option value="">Selecciona rol</option>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              <button className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded">Cambiar rol</button>
            </form>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Crear Monitoria</h2>
            <form onSubmit={handleCreateMonitoria} className="space-y-2">
              <select value={monGroupId} onChange={e => setMonGroupId(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Selecciona grupo</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.code ?? g.id}</option>)}
              </select>
              <input value={monMonitorId} onChange={e => setMonMonitorId(e.target.value)} placeholder="Monitor ID" className="w-full p-2 border rounded" required />
              <select value={monTipo} onChange={e => setMonTipo(e.target.value as any)} className="w-full p-2 border rounded">
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
              </select>
              <input value={monLink} onChange={e => setMonLink(e.target.value)} placeholder="Enlace (opcional)" className="w-full p-2 border rounded" />
              <input value={monSalon} onChange={e => setMonSalon(e.target.value)} placeholder="Salón (opcional)" className="w-full p-2 border rounded" />
              <input value={monFecha} onChange={e => setMonFecha(e.target.value)} type="datetime-local" className="w-full p-2 border rounded" required />
              <button className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded">Crear monitoria</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}