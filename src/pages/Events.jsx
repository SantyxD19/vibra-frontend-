import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MusicOnboardingModal from "../components/MusicOnboardingModal";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [showMusicModal, setShowMusicModal] = useState(() => {
    return !localStorage.getItem("music_set");
  });

  // ================= LOAD EVENTS =================
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`${API}/api/events`);

        if (!res.ok) throw new Error("Error al cargar eventos");

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [API]);

  // ================= SAVE MUSIC =================
  const handleSaveMusic = async (music) => {
    try {
      await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bio: "",
          music_preferences: music,
        }),
      });

      localStorage.setItem("music_set", "true");
      setShowMusicModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <div className="p-6 text-white">Cargando eventos...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">🔥 Eventos</h2>

      {events.length === 0 ? (
        <p className="text-gray-400">No hay eventos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              {/* IMAGE 🔥 FIX */}
              <img
                src={
                  event.image_url
                    ? `${API}${event.image_url}`
                    : "https://placehold.co/400x200"
                }
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200";
                }}
                className="w-full h-40 object-cover"
                alt={event.name}
              />

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{event.name}</h3>

                <p className="text-gray-400 text-sm">📍 {event.location}</p>

                <p className="text-gray-400 text-sm">
                  📅{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "Sin fecha"}
                </p>

                <button
                  className="mt-3 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl"
                  onClick={() => navigate(`/events/${event.id}/combos`)}
                >
                  Ver Combos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <MusicOnboardingModal
        isOpen={showMusicModal}
        onClose={() => {
          localStorage.setItem("music_set", "true");
          setShowMusicModal(false);
        }}
        onSave={handleSaveMusic}
      />
    </div>
  );
}

export default Events;
