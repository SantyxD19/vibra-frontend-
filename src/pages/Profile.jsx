import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar perfil");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [API]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Cargando perfil...
      </div>
    );
  }

  const music = Array.isArray(user.music_preferences)
    ? user.music_preferences.join(", ")
    : user.music_preferences || "No definidos";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md text-center shadow-lg">
        {/* FOTO */}
        <img
          src={user.image ? `${API}${user.image}` : "/default-avatar.png"}
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
          className="w-28 h-28 rounded-full object-cover border-2 border-purple-500 mx-auto"
        />

        {/* NOMBRE */}
        <h2 className="text-white text-2xl font-semibold mt-4">{user.name}</h2>

        {/* EMAIL */}
        <p className="text-gray-400">{user.email}</p>

        {/* BIO */}
        <div className="mt-4 text-gray-300 text-sm">
          {user.bio || "Sin biografía aún..."}
        </div>

        {/* MÚSICA */}
        <div className="mt-4">
          <p className="text-purple-400 font-semibold">🎵 Gustos musicales</p>
          <p className="text-gray-300 text-sm mt-1">{music}</p>
        </div>

        {/* BOTONES */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
          >
            Editar perfil ✏️
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
