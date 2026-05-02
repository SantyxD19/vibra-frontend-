import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function Combos() {
  const { id } = useParams();

  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [zona, setZona] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // 🔥 LOAD MEMOIZADO
  const loadCombos = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/combos/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCombos(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando combos");
    }
  }, [id, token, API]);

  // 🔥 USE EFFECT LIMPIO
  useEffect(() => {
    const fetchCombos = async () => {
      await loadCombos();
      setLoading(false);
    };

    fetchCombos();
  }, [loadCombos]);

  // 🔥 CREAR COMBO
  const handleCreate = async () => {
    if (!zona.trim()) return toast.error("Escribe la zona del combo");

    try {
      const res = await fetch(`${API}/api/combos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: id,
          zona,
          max_members: Number(maxMembers),
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Combo creado 🔥");

      setShowModal(false);
      setZona("");
      setMaxMembers(5);
      setDescription("");

      loadCombos();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error creando combo");
    }
  };

  // 🔥 UNIRSE
  const handleJoin = async (comboId) => {
    try {
      const res = await fetch(`${API}/api/combos/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ combo_id: comboId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Te uniste al combo 🎉");
      loadCombos();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error al unirse");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Cargando combos...</div>;
  }

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">🎉 Combos del evento</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto"
        >
          + Crear combo
        </button>
      </div>

      {/* LISTA */}
      {combos.length === 0 ? (
        <p className="text-gray-400">No hay combos disponibles</p>
      ) : (
        <div className="space-y-4">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-gray-900 p-4 rounded-xl border border-gray-700"
            >
              <h3 className="font-semibold text-lg">{combo.zona}</h3>

              <p className="text-sm text-gray-400 mt-1">
                {combo.description || "Sin descripción"}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                👥 {combo.members_count || 0}/{combo.max_members}
              </p>

              <div className="mt-3">
                <button
                  onClick={() => handleJoin(combo.id)}
                  disabled={combo.is_member}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    combo.is_member
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {combo.is_member ? "Ya estás" : "Unirse 💬"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-3">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Crear combo</h3>

            <input
              placeholder="Zona del combo (VIP, General, etc)"
              className="w-full p-2 mb-3 bg-gray-800 rounded"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
            />

            <input
              type="number"
              placeholder="Máximo de miembros"
              className="w-full p-2 mb-3 bg-gray-800 rounded"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
            />

            <textarea
              placeholder="Descripción"
              className="w-full p-2 mb-3 bg-gray-800 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-3 py-1 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreate}
                className="bg-purple-600 px-3 py-1 rounded"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Combos;
