import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const [editingEvent, setEditingEvent] = useState(null);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // ================= HELPER IMÁGENES =================
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API}${url}`;
  };

  // ================= LOAD =================
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando eventos");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [API]);

  // ================= CREATE =================
  const createEvent = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("location", location);
      formData.append("city", city);
      formData.append("date", date);

      if (image) formData.append("image", image);

      const res = await fetch(`${API}/api/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setEvents((prev) => [data, ...prev]);

      setName("");
      setLocation("");
      setCity("");
      setDate("");
      setImage(null);

      toast.success("Evento creado 🔥");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error creando evento");
    }
  };

  // ================= FINISH =================
  const finishEvent = async (id) => {
    try {
      const res = await fetch(`${API}/api/events/${id}/finish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setEvents((prev) => prev.filter((e) => e.id !== id));

      toast.success("Evento finalizado 🏁");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ================= UPDATE =================
  const updateEvent = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editingEvent.name);
      formData.append("location", editingEvent.location);
      formData.append("city", editingEvent.city);
      formData.append("date", editingEvent.date);

      if (editingEvent.imageFile) {
        formData.append("image", editingEvent.imageFile);
      }

      const res = await fetch(`${API}/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)));

      setEditingEvent(null);

      toast.success("Evento actualizado 🔥");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error actualizando evento");
    }
  };

  if (loading) return <div className="p-6 text-white">Cargando...</div>;

  return (
    <div className="p-6 text-white">
      {/* ================= CREATE ================= */}
      <div className="bg-gray-900 p-4 rounded-2xl mb-8 border border-gray-800">
        <h2 className="font-bold mb-4">Crear evento</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            className="bg-gray-800 p-2 rounded"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="bg-gray-800 p-2 rounded"
            placeholder="Lugar"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="bg-gray-800 p-2 rounded"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="date"
            className="bg-gray-800 p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <button
          onClick={createEvent}
          className="w-full mt-5 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
        >
          Crear evento 🚀
        </button>
      </div>

      {/* ================= EVENTS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
          >
            {/* IMAGE FIXED */}
            <div className="aspect-square bg-gray-800">
              {event.image_url ? (
                <img
                  src={getImageUrl(event.image_url)}
                  className="w-full h-full object-cover"
                  alt={event.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-3">
              <h3 className="font-bold">{event.name}</h3>
              <p className="text-gray-400 text-sm">📍 {event.location}</p>
              <p className="text-gray-500 text-xs">{event.city}</p>
              <p className="text-gray-500 text-xs">
                {event.date?.slice(0, 10)}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="bg-blue-600 px-3 py-1 rounded text-xs"
                >
                  Editar
                </button>

                <button
                  onClick={() => finishEvent(event.id)}
                  className="bg-yellow-600 px-3 py-1 rounded text-xs"
                >
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px]">
            <h2 className="mb-4 font-bold">Editar evento</h2>

            <input
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editingEvent.name || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, name: e.target.value })
              }
            />

            <input
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editingEvent.location || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, location: e.target.value })
              }
            />

            <input
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editingEvent.city || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, city: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full p-2 mb-2 bg-gray-800 rounded"
              value={editingEvent.date?.slice(0, 10) || ""}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
            />

            <input
              type="file"
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  imageFile: e.target.files[0],
                })
              }
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={updateEvent}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Guardar
              </button>

              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
