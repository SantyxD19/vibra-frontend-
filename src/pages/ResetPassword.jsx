import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) return "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe tener una mayúscula";
    if (!/[0-9]/.test(password)) return "Debe tener un número";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const error = validatePassword(password);
    if (error) {
      return toast.error(error);
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.error || "Error al actualizar");
      }

      toast.success("Contraseña actualizada 🔥");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Error actualizando contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🔐 Nueva contraseña
        </h2>

        <p className="text-gray-400 text-sm mb-4 text-center">
          Debe tener mínimo 8 caracteres, una mayúscula y un número
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700"
            required
          />

          <button
            disabled={loading}
            className={`w-full p-3 rounded-xl transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar contraseña 🔥"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
