import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pb-8 pt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white shadow-md">
            LU
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              LearnUp
            </p>
            <h1 className="text-2xl font-semibold">Tailwind + Vite listo</h1>
          </div>
        </div>
        <a
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noreferrer"
        >
          Documentación
        </a>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 md:grid-cols-[2fr,1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600">Demo</p>
              <h2 className="text-xl font-semibold text-slate-900">
                Contador con utilidades
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Este bloque usa clases de Tailwind 4 para demostrar que está activo.
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              React 19
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => setCount((value) => value + 1)}
            >
              Incrementar
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => setCount(0)}
            >
              Reiniciar
            </button>
            <p className="text-sm text-slate-700">
              Valor actual:
              <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-900">
                {count}
              </span>
            </p>
          </div>
        </section>

        <aside className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold text-slate-900">Checklist</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Tailwind v4 importado en `src/index.css`
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Plugin `@tailwindcss/vite` añadido
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Estilos base limpios y listos para utilidades
            </li>
          </ul>
        </aside>
      </main>
    </div>
  )
}

export default App
