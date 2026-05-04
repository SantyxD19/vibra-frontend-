import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function CreateCombo({ event, onCreated }) {
  const [zona, setZona] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!zona || !maxMembers) {
      alert("Completa los campos obligatorios ⚠️");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/combos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: event.id,
          zona,
          max_members: Number(maxMembers),
          description,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Respuesta no válida del servidor");
      }

      if (res.ok) {
        alert("Combo creado 🔥");

        setZona("");
        setMaxMembers("");
        setDescription("");

        onCreated();
      } else {
        alert(data.error || "Error al crear combo");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h3 className="text-lg font-bold mb-2">Crear combo</h3>

      <input
        className="block mb-2 p-2 rounded bg-gray-800 text-white"
        placeholder="Zona"
        value={zona}
        onChange={(e) => setZona(e.target.value)}
      />

      <input
        className="block mb-2 p-2 rounded bg-gray-800 text-white"
        type="number"
        placeholder="Máx personas"
        value={maxMembers}
        onChange={(e) => setMaxMembers(e.target.value)}
      />

      <input
        className="block mb-2 p-2 rounded bg-gray-800 text-white"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 px-4 py-2 rounded-xl"
      >
        {loading ? "Creando..." : "Crear 🔥"}
      </button>
    </form>
  );
}

export default CreateCombo;
