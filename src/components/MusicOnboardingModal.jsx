import { useState } from "react";

const genres = [
  "Reggaetón",
  "Techno",
  "Rock",
  "Pop",
  "Salsa",
  "Hip Hop",
  "EDM",
];

function MusicOnboardingModal({ isOpen, onClose, onSave }) {
  const [selected, setSelected] = useState([]);

  if (!isOpen) return null;

  const toggleGenre = (genre) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleSave = () => {
    if (selected.length === 0) {
      alert("Selecciona al menos un género 🎧");
      return;
    }

    onSave(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md p-6 rounded-2xl border border-gray-800 shadow-xl">
        {/* TITLE */}
        <h2 className="text-white text-xl font-bold text-center">
          🎧 ¿Qué música te gusta?
        </h2>

        <p className="text-gray-400 text-sm text-center mt-2">
          Esto nos ayudará a recomendarte mejores combos
        </p>

        {/* GENRES */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selected.includes(genre)
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl"
          >
            Omitir
          </button>

          <button
            onClick={handleSave}
            className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicOnboardingModal;
