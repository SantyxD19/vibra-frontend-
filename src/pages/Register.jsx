import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logov.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 API BASE
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ======================
  // 🔐 REGISTER NORMAL
  // ======================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (image) formData.append("image", image);

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error en registro");
        setLoading(false);
        return;
      }

      toast.success("Revisa tu correo 📩");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }

    setLoading(false);
  };

  // ======================
  // 🔵 GOOGLE REGISTER
  // ======================
  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error con Google");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Cuenta creada con Google 🔥");

      navigate(data.user.role === "admin" ? "/admin" : "/events");
    } catch (error) {
      console.error(error);
      toast.error("Error con Google");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* IZQUIERDA */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
        <div className="flex justify-center mb-4">
          <img src={logo} className="h-24 border border-red-500" />
        </div>
      </div>

      {/* DERECHA */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h2 className="text-white text-2xl text-center mb-6 font-semibold">
            Crear cuenta
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* 📸 UPLOAD */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">
                Foto de perfil
              </label>

              <label className="cursor-pointer flex flex-col items-center justify-center border border-dashed border-gray-600 rounded-xl p-5 bg-gray-900 hover:bg-gray-800 transition">
                <span className="text-sm text-gray-300">Subir archivo</span>

                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG o WEBP
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              {image && (
                <p className="text-xs text-green-400 mt-2 text-center">
                  {image.name}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className={`w-full p-3 rounded-xl text-white transition ${
                loading ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </form>

          {/* DIVISOR */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-gray-700" />
            <span className="text-gray-400 text-sm">o</span>
            <div className="flex-1 h-[1px] bg-gray-700" />
          </div>

          {/* GOOGLE */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Error Google")}
            />
          </div>

          <p className="text-center text-gray-400 mt-5 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
