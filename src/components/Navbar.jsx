import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const isActive = (path) =>
    location.pathname === path
      ? "text-purple-400"
      : "text-gray-300 hover:text-white";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <h1 className="text-xl font-bold text-purple-500">Vibra</h1>

        {/* BOTÓN MOBILE */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={isActive("/")}>
            Eventos
          </Link>

          <Link to="/my-combos" className={isActive("/my-combos")}>
            Mis Combos 🔥
          </Link>

          <Link to="/profile" className={isActive("/profile")}>
            Perfil
          </Link>

          {isAdmin && (
            <Link to="/admin" className={isActive("/admin")}>
              Admin ⚙️
            </Link>
          )}
        </div>
      </div>

      {/* LINKS MOBILE */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 mt-4">
          <Link to="/" className={isActive("/")}>
            Eventos
          </Link>

          <Link to="/my-combos" className={isActive("/my-combos")}>
            Mis Combos 🔥
          </Link>

          <Link to="/profile" className={isActive("/profile")}>
            Perfil
          </Link>

          {isAdmin && (
            <Link to="/admin" className={isActive("/admin")}>
              Admin ⚙️
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
