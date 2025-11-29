import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="
      flex items-center justify-between px-10 py-3
      bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA]
      shadow-md
    ">

      {/* LOGO */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" className="h-8" alt="LearnUP" />
      </div>

      {/* MENU */}
      <div className="flex items-center space-x-4">
        {["Inicio", "Facultades', 'Foros"].map((item) => (
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

      {/* SEARCH */}
      <div className="bg-white/60 hover:bg-white p-2 rounded-full transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#0c1a40ff"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z"
          />
        </svg>
      </div>

      {/* AVATAR */}
      <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden flex items-center justify-center">
        <img src="/avatar.png" className="object-cover" />
      </div>
    </nav>
  );
};

export default Navbar;
