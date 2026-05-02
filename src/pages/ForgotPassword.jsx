import { useState } from "react";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error enviando correo");
        return;
      }

      toast.success(data.message || "Revisa tu correo 📩");

      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Error enviando solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🔐 Recuperar contraseña
        </h2>

        <p className="text-gray-400 text-sm mb-4 text-center">
          Ingresa tu correo y te enviaremos un enlace
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700"
            required
          />

          <button
            disabled={loading}
            className={`w-full p-3 rounded-xl transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar link 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
