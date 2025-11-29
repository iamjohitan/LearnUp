import logo from '../assets/logo/logo_white.png'
import searchIcon from '../assets/icons/search.png'

const Navbar = () => {
  return (
    <nav
      className="
        flex items-center justify-between
        w-full
        px-10 py-3
        bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA]
        shadow-xl
      "
    >
      {/* LOGO */}
      <img src={logo} className="h-12" alt="LearnUP Logo" />

      {/* MENU */}
      <div className="flex items-center space-x-4">
        {['Inicio', 'Facultades', 'Foros'].map((item) => (
          <button
            key={item}
            className="
              px-4 py-2 text-sm font-semibold
              text-[#1E3A8A]
              bg-white/70 shadow
              rounded-full
              hover:bg-white
              transition-all duration-200
            "
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEARCH BAR CON FONDO AZUL OSCURO Y BOTÓN */}
      <div className="flex items-center gap-3 rounded-full bg-[#123a7a]/85 px-5 py-2 shadow-lg ring-1 ring-white/10 backdrop-blur">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-48 bg-transparent text-base text-white placeholder:text-white/70 outline-none"
        />
        <img src={searchIcon} alt="Buscar" className="h-5 w-5 opacity-90" />
      </div>

      {/* AVATAR */}
      <div
        className="
          flex h-10 w-10 items-center justify-center
          rounded-full bg-white text-sm font-semibold text-[#1E3A8A]
          shadow-md ring-1 ring-white/50
        "
      >
        LU
      </div>
    </nav>
  )
}

export default Navbar
