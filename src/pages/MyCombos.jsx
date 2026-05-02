import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MyCombos() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadMyCombos = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API}/api/combos/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        setCombos(data);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando tus combos 😢");
      } finally {
        setLoading(false);
      }
    };

    loadMyCombos();
  }, [API]);

  if (loading) {
    return (
      <div className="p-6 text-white text-center">Cargando tus combos...</div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">🔥 Mis Combos</h2>

      {combos.length === 0 ? (
        <div className="text-gray-400 bg-gray-800 p-6 rounded-xl text-center">
          No estás en ningún combo 😢
        </div>
      ) : (
        <div className="grid gap-4">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700"
            >
              <h3 className="text-purple-400 font-semibold">{combo.zona}</h3>

              <p className="text-gray-300">
                {combo.description || "Sin descripción"}
              </p>

              <button
                onClick={() => navigate(`/combos/${combo.id}/chat`)}
                className="mt-3 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full sm:w-auto"
              >
                Entrar al chat 💬
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCombos;
