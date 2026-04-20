import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Delivery from "../pages/Delivery/Delivery";
import Booking from "../pages/Booking/Booking";
import CartaPage from "../pages/CartaPage/CartaPage";
import AdminPage from "../pages/Admin/AdminPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/pmv-short-menu">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/menu" element={<CartaPage />} />

          {/* Admin protegido */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* Rutas protegidas opcionales */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Perfil de usuario</h1>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Login/Register fuera del Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}