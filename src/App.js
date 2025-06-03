import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./components/LoginForm";
import RegisterPage from "./components/RegisterForm";

import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import UserDashboard from "./pages/UserDashboard";

import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import QualityPage from "./pages/QualityPage";
import SentimentPage from "./pages/SentimentPage";
import PricingPage from "./pages/PricingPage";

import PaymentPage from "./pages/PaymentPage";
import PaymentsPage from "./pages/PaymentsPage";
import PaymentDine from "./pages/PaymentDine";
import PaymentOnline from "./pages/PaymentOnline";

import OrderTrackingPage from "./pages/OrderTrackingPage";
import Recommend from "./pages/Recommend"; // ← Import your Recommend page

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) setAuth({ token, role });
  }, []);

  const ProtectedRouteAdmin = ({ children }) =>
    !auth || auth.role !== "admin" ? <Navigate to="/login" /> : children;

  const ProtectedRouteUser = ({ children }) =>
    !auth ? <Navigate to="/login" /> : children;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminPage />
            </ProtectedRouteAdmin>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRouteUser>
              <UserDashboard />
            </ProtectedRouteUser>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRouteUser>
              <MenuPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRouteUser>
              <OrdersPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/quality"
          element={
            <ProtectedRouteUser>
              <QualityPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/sentiment"
          element={
            <ProtectedRouteUser>
              <SentimentPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRouteUser>
              <PricingPage />
            </ProtectedRouteUser>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRouteUser>
              <PaymentPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRouteUser>
              <PaymentsPage />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/payment-dine"
          element={
            <ProtectedRouteUser>
              <PaymentDine />
            </ProtectedRouteUser>
          }
        />
        <Route
          path="/payment-online"
          element={
            <ProtectedRouteUser>
              <PaymentOnline />
            </ProtectedRouteUser>
          }
        />

        <Route
          path="/track/:id"
          element={
            <ProtectedRouteUser>
              <OrderTrackingPage />
            </ProtectedRouteUser>
          }
        />

        {/* Add Recommend route here */}
        <Route
          path="/recommend"
          element={
            <ProtectedRouteUser>
              <Recommend />
            </ProtectedRouteUser>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
