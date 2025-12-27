import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Result from "./pages/Result";
import AdminLogin from "./pages/admin/Login"; 
import AdminDashboard from "./pages/admin/Dashboard";
import DataPenyakit from "./pages/admin/DataPenyakit";
import DataGejala from "./pages/admin/DataGejala";
import DataAturan from "./pages/admin/DataAturan";
import RekapKonsultasi from "./pages/admin/RekapKonsultasi";
import { AdminProvider, useAdmin } from "./context/AdminAuth";

function AdminRoute({ children }) {
  const { admin } = useAdmin();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnose" element={<Diagnose />} />
        <Route path="/result" element={<Result />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/penyakit"
          element={
            <AdminRoute>
              <DataPenyakit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gejala"
          element={
            <AdminRoute>
              <DataGejala />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/aturan"
          element={
            <AdminRoute>
              <DataAturan />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rekap"
          element={
            <AdminRoute>
              <RekapKonsultasi />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminProvider>
  );
}
