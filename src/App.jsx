import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoutes";

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"; // 🔥 NUEVO
import ResetPassword from "./pages/ResetPassword"; // 🔥 NUEVO

// USER
import Events from "./pages/Events";
import Combos from "./pages/Combos";
import ComboChat from "./components/ComboChat";
import Profile from "./pages/Profile";
import MyCombos from "./pages/MyCombos";
import EditProfile from "./pages/EditProfile";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" || // 🔥 NUEVO
    location.pathname.startsWith("/reset-password") || // 🔥 NUEVO
    location.pathname.includes("/chat");

  return (
    <>
      <Toaster position="top-right" />

      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/events" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 NUEVAS RUTAS */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER ROUTES */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id/combos"
          element={
            <ProtectedRoute>
              <Combos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/combos/:comboId/chat"
          element={
            <ProtectedRoute>
              <ComboChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-combos"
          element={
            <ProtectedRoute>
              <MyCombos />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
