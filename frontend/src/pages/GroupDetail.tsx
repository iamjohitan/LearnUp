import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import GroupsChat from './groups';
import Navbar from '../components/Navbar';

type Group = {
  id: string;
  code?: string;
  course_id?: string;
  professor_id?: string | null;
  monitor_id?: string | null;
  // añade campos según lo que devuelva tu endpoint /groups/:id
};

type Monitoria = {
  id: string;
  monitor_id: string;
  tipo: string;
  link?: string | null;
  salon?: string | null;
  fecha: string;
};

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMonitorias, setLoadingMonitorias] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    axiosClient
      .get<Group>(`/groups/${groupId}`)
      .then((res) => {
        if (!mounted) return;
        setGroup(res.data);
      })
      .catch((e) => {
        console.error('Error al cargar grupo', e);
        setError(e.response?.data?.message || e.message || 'Error al cargar grupo');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    let mounted = true;
    setLoadingMonitorias(true);
    axiosClient
      .get<Monitoria[]>(`/monitorias/${groupId}`)
      .then((r) => {
        if (!mounted) return;
        setMonitorias(r.data || []);
      })
      .catch((e) => {
        console.error('Error al cargar monitorias', e);
      })
      .finally(() => {
        if (mounted) setLoadingMonitorias(false);
      });
    return () => {
      mounted = false;
    };
  }, [groupId]);

  if (!groupId) {
    return <div className="p-6 text-red-600">No se especificó groupId en la ruta.</div>;
  }

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div>Cargando grupo...</div>
        ) : error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Main column: info + monitorias */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold">Grupo {group?.code ?? group?.id}</h2>
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    Curso: {group?.course_id ?? 'No disponible'}
                  </p>
                  <p>
                    Profesor: {group?.professor_id ?? 'No asignado'}
                  </p>
                  <p>
                    Monitor: {group?.monitor_id ?? 'No asignado'}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/groups/${groupId}`} className="px-3 py-2 border rounded">
                    Ver foro del grupo
                  </Link>
                  <Link to={`/groups`} className="px-3 py-2 border rounded">
                    Volver a foros
                  </Link>
                </div>
              </section>

              <section className="bg-white p-6 rounded shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Monitorias</h3>
                  <span className="text-sm text-gray-500">{monitorias.length} programadas</span>
                </div>

                {loadingMonitorias ? (
                  <div className="mt-4">Cargando monitorias...</div>
                ) : monitorias.length === 0 ? (
                  <div className="mt-4 text-gray-600">No hay monitorias para este grupo.</div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {monitorias.map((m) => (
                      <li key={m.id} className="p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{m.tipo}</div>
                            <div className="text-sm text-gray-500">{new Date(m.fecha).toLocaleString()}</div>
                            {m.link && (
                              <div className="mt-1">
                                <a className="text-indigo-600" href={m.link} target="_blank" rel="noreferrer">
                                  Enlace de la monitoria
                                </a>
                              </div>
                            )}
                            {m.salon && <div className="text-sm text-gray-600">Salón: {m.salon}</div>}
                          </div>
                          <div className="text-sm text-gray-500">Monitor: {m.monitor_id}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Right column: Chat */}
            <aside className="space-y-4">
              <div className="bg-white p-4 rounded shadow h-[600px]">
                <h4 className="font-medium mb-3">Chat del grupo</h4>
                {/* Reusar componente de chat; GroupsChat espera prop groupId */}
                <div className="h-full">
                  <GroupsChat groupId={groupId} />
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}