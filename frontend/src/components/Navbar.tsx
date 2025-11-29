import logo from '../assets/logo/logo_white.png'
import searchIcon from '../assets/icons/search.png'
import { useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import axiosClient from "../api/axiosClient"


type Profile = { id: string; name?: string; email?: string };

const Navbar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);


    useEffect(() => {
    let mounted = true;
    axiosClient
      .get<Profile>('/users/me')
      .then((r) => {
        if (mounted) setProfile(r.data);
      })
      .catch((e) => console.error('Error obtener perfil navbar', e));
    return () => { mounted = false; };
  }, []);

  const userName = profile?.name ?? 'Usuario';
  const initials = userName
      .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
    || 'LU';

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
      <Link to="/">
        <img src={logo} className="h-12" alt="LearnUP Logo" />
      </Link>

      {/* MENU */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="px-4 py-2 text-sm font-semibold text-[#1E3A8A] bg-white/70 shadow rounded-full hover:bg-white transition-all duration-200">
          Inicio
        </Link>
        <Link to="/facultades" className="px-4 py-2 text-sm font-semibold text-[#1E3A8A] bg-white/70 shadow rounded-full hover:bg-white transition-all duration-200">
          Facultades
        </Link>
        <Link to="/courses" className="px-4 py-2 text-sm font-semibold text-[#1E3A8A] bg-white/70 shadow rounded-full hover:bg-white transition-all duration-200">
          Cursos
        </Link>
        <Link to="/groups" className="px-4 py-2 text-sm font-semibold text-[#1E3A8A] bg-white/70 shadow rounded-full hover:bg-white transition-all duration-200">
          Foros
        </Link>
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
      <div className="flex items-center gap-2">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold text-white">{userName}</div>
          <div className="text-xs text-white/70">{profile?.email ?? 'Usuario'}</div>
        </div>
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full bg-white text-sm font-semibold text-[#1E3A8A]
            shadow-md ring-1 ring-white/50
          "
          title={userName}
        >
          {initials}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
