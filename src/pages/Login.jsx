import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logov.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ======================
  // 🔐 LOGIN NORMAL
  // ======================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ❌ ERROR DEL BACKEND
      if (!res.ok) {
        toast.error(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // 🔥 LOGIN EXITOSO
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Bienvenido 🔥");

      setTimeout(() => {
        navigate(data.user.role === "admin" ? "/admin" : "/events", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el servidor");
    }

    setLoading(false);
  };

  // ======================
  // 🔵 GOOGLE LOGIN
  // ======================
  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error con Google Login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login con Google 🔥");

      navigate(data.user.role === "admin" ? "/admin" : "/events");
    } catch (error) {
      console.error(error);
      toast.error("Error con Google login");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* IZQUIERDA */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
        <div>
          <div className="flex justify-center mb-4">
            <img src={logo} className="h-40 md:h-52 object-contain" />
          </div>
          <p className="text-gray-400 mt-3">
            Conecta con eventos y combos en tiempo real
          </p>
        </div>
      </div>

      {/* DERECHA */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-lg">
          <h2 className="text-white text-2xl text-center mb-6 font-semibold">
            Iniciar sesión
          </h2>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <input
              className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <p className="text-right text-xs text-gray-400 -mt-2">
              <Link
                to="/forgot-password"
                className="text-purple-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            {/* BOTÓN */}
            <button
              disabled={loading}
              className={`w-full p-3 rounded-xl text-white font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
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
              onError={() => toast.error("Error Google Login")}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>

          {/* REGISTER */}
          <p className="text-center text-gray-400 mt-5 text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
