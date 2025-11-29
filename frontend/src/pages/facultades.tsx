import Navbar from "../components/Navbar";
import ingenieriaImg from "../assets/images/ingenieria.jpg";
import saludImg from "../assets/images/salud.jpg";
import quimicaImg from "../assets/images/quimica.jpg";
import musicaImg from "../assets/images/musica.jpg";

type Faculty = {
  name: string;
  description: string;
  programs: string[];
  color: string;
  image: string;
};

const faculties: Faculty[] = [
  {
    name: "Salud",
    description:
      "Ofrece programas como Medicina, Enfermería, Fisioterapia, Odontología, Psicología, Fonoaudiología y Terapia Respiratoria.",
    programs: [
      "Medicina",
      "Enfermería",
      "Fisioterapia",
      "Odontología",
      "Psicología",
      "Fonoaudiología",
      "Terapia Respiratoria",
    ],
    color: "from-[#0f172a] via-[#1d4ed8] to-[#22c55e]",
    image: saludImg,
  },
  {
    name: "Ingeniería",
    description:
      "Incluye carreras como Ingeniería Civil, de Sistemas, Industrial, Química, Electrónica, en Energías y Bioingeniería. También ofrece posgrados relacionados con informática y logística.",
    programs: [
      "Civil",
      "Sistemas",
      "Industrial",
      "Química",
      "Electrónica",
      "Energías",
      "Bioingeniería",
    ],
    color: "from-[#1e3a8a] via-[#2563eb] to-[#38bdf8]",
    image: ingenieriaImg,
  },
  {
    name: "Derecho",
    description:
      "Es pionera en la región y ofrece programas como Derecho y posgrados como especializaciones en Derecho Administrativo, Penal y de Familia.",
    programs: [
      "Derecho",
      "Especialización en Derecho Administrativo",
      "Especialización en Derecho Penal",
      "Especialización en Derecho de Familia",
    ],
    color: "from-[#7f1d1d] via-[#b91c1c] to-[#f87171]",
    image:
      "https://concepto.de/wp-content/uploads/2012/03/derecho-ley-e1552664252875.jpg",
  },
  {
    name: "Ciencias Económicas y Empresariales",
    description:
      "Cuenta con programas como Contaduría Pública, Administración de Empresas y Finanzas y Negocios Internacionales.",
    programs: [
      "Contaduría Pública",
      "Administración de Empresas",
      "Finanzas",
      "Negocios Internacionales",
    ],
    color: "from-[#78350f] via-[#ea580c] to-[#fcd34d]",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJAEwanBd5qz_f1psiQk8CUKEp-9deFjIwdg&s",
  },
  {
    name: "Educación",
    description:
      "Ofrece posgrados como maestrías en Educación Ambiental, Educación e Inglés, y especializaciones como Pedagogía Infantil.",
    programs: [
      "Maestría en Educación Ambiental",
      "Maestría en Educación e Inglés",
      "Pedagogía Infantil",
    ],
    color: "from-[#4c1d95] via-[#7e22ce] to-[#c084fc]",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0w0fKVIKsf9rwpEaeJAyMsqowASSeAnbyw&s",
  },
  {
    name: "Ciencias Básicas",
    description:
      "Ofrece el Doctorado en Ciencias Aplicadas y la Maestría en Química Industrial.",
    programs: [
      "Doctorado en Ciencias Aplicadas",
      "Maestría en Química Industrial",
    ],
    color: "from-[#065f46] via-[#10b981] to-[#6ee7b7]",
    image: quimicaImg,
  },
  {
    name: "Humanidades y Artes",
    description:
      "Programas relacionados con creatividad, cultura y expresión en diversas áreas artísticas y humanísticas.",
    programs: [
      "Música",
      "Literatura",
      "Historia del Arte",
      "Filosofía",
      "Comunicación",
    ],
    color: "from-[#0f172a] via-[#4338ca] to-[#f472b6]",
    image: musicaImg,
  },
];

export default function FacultadesPage() {
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
              Programas, enfoques y comunidades listos para que encuentres tu
              camino académico.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
                Ver programas
              </button>
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow ring-1 ring-blue-100 transition hover:bg-blue-50">
                Contactar facultad
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/80 via-blue-500/80 to-cyan-400/80 p-[1px] shadow-[0_20px_45px_-15px_rgba(30,58,138,0.45)] ring-1 ring-white/50">
              <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-white/80 px-6 py-8 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  {faculties.slice(0, 4).map((faculty) => (
                    <div
                      key={faculty.name}
                      className="rounded-2xl bg-slate-900/5 px-4 py-5 text-sm font-semibold text-slate-800 shadow-sm"
                    >
                      {faculty.name}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Elige una facultad y descubre programas, foros y eventos
                  asociados.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {faculties.map((faculty) => (
            <article
              key={faculty.name}
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
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${faculty.color} px-3 py-1 text-xs font-semibold uppercase text-white shadow`}
              >
                {faculty.name}
              </div>
              <p className="mt-3 text-base text-slate-700">
                {faculty.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
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
                <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
                  Ver detalles
                </button>
                <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow ring-1 ring-blue-100 transition hover:bg-blue-50">
                  Foros de la facultad
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
