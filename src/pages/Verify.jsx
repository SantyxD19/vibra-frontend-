import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  const API = import.meta.env.VITE_API_URL;

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      return toast.error("Completa todos los campos");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error verificando código");
      }

      toast.success("Cuenta verificada 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verifica tu cuenta 📩
        </h2>

        <p className="text-gray-400 text-sm text-center mb-4">
          Ingresa el código que enviamos a tu correo
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl"
            required
          />

          <input
            type="text"
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl text-center tracking-widest text-lg"
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Verificando..." : "Verificar cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;
