import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

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
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      axiosClient.get<Profile>('/users/me'),
      axiosClient.get<Faculty[]>('/faculty/listar'),
    ])
      .then(([pRes, fRes]) => {
        if (!mounted) return;
        setProfile(pRes.data);
        setFaculties(fRes.data || []);
        // preselect first faculty if none selected
        if (!selected && (fRes.data || []).length > 0) {
          setSelected(fRes.data[0].id);
        }
      })
      .catch((e) => {
        console.error('Error cargando perfil/facultades', e);
        setError(e.response?.data?.message || e.message || 'Error desconocido');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selected) {
      setError('Selecciona una facultad');
      return;
    }
    if (!profile) {
      setError('Perfil no cargado');
      return;
    }
    if (profile.faculty_id !== null) {
      setError('No puedes cambiar la facultad: ya tienes una asignada.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.patch('/users/faculty', { facultyId: selected });
      setSuccess(res.data?.message || 'Facultad actualizada correctamente');
      // actualizar estado local para bloquear futuros cambios
      setProfile({ ...profile, faculty_id: selected });
    } catch (err: any) {
      console.error('Error actualizando facultad', err);
      setError(err.response?.data?.message || err.message || 'Error al actualizar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!profile) {
    return <div className="p-6 text-red-600">No se pudo cargar el perfil: {error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Cambiar Facultad</h2>

      {profile.faculty_id ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="mb-2">Ya tienes una facultad asignada y no puedes cambiarla:</p>
          <p className="font-medium">{faculties.find(f => f.id === profile.faculty_id)?.name ?? profile.faculty_id}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Selecciona la facultad</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white"
              disabled={submitting}
            >
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar facultad'}
            </button>
            <button
              type="button"
              onClick={() => { setSelected(''); setError(null); setSuccess(null); }}
              className="px-3 py-2 border rounded"
            >
              Limpiar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}