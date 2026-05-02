import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  // 🔥 CARGAR PERFIL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = null;

        try {
          data = await res.json();
        } catch {
          throw new Error("Backend no devolvió respuesta válida");
        }

        if (!res.ok) {
          console.error("BACKEND ERROR:", data);
          throw new Error(data?.error || "Error cargando perfil");
        }

        setBio(data.bio || "");

        // 🎯 música segura
        if (Array.isArray(data.music_preferences)) {
          setMusic(data.music_preferences);
        } else if (typeof data.music_preferences === "string") {
          try {
            setMusic(JSON.parse(data.music_preferences));
          } catch {
            setMusic([]);
          }
        } else {
          setMusic([]);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API]);

  // 💾 GUARDAR PERFIL
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          music_preferences: music,
        }),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        console.error("BACKEND ERROR:", data);
        throw new Error(data?.error || "Error actualizando perfil");
      }

      toast.success("Perfil actualizado 🔥");

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">✏️ Editar perfil</h2>

        {/* BIO */}
        <label className="text-gray-400 text-sm">Biografía</label>
        <textarea
          className="w-full mt-2 p-3 bg-gray-800 rounded-xl outline-none"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* MÚSICA */}
        <label className="text-gray-400 text-sm mt-4 block">
          🎵 Gustos musicales
        </label>

        <input
          className="w-full mt-2 p-3 bg-gray-800 rounded-xl outline-none"
          value={music.join(", ")}
          onChange={(e) =>
            setMusic(
              e.target.value
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean),
            )
          }
          placeholder="rock, pop, reggaeton"
        />

        {/* BOTONES */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="w-1/2 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl"
          >
            Guardar 💾
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-1/2 bg-gray-700 hover:bg-gray-600 py-2 rounded-xl"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
