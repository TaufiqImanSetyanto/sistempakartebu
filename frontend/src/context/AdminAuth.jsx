/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/apiAdmin";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const s = sessionStorage.getItem("admin_user");
    return s ? JSON.parse(s) : null;
  });
  const navigate = useNavigate();

  const login = async ({ username, password }) => {
    try {
      const { data } = await loginAdmin({ username, password });
      const adminData = { username: data.admin.username, id: data.admin.id };
      setAdmin(adminData);

      sessionStorage.setItem("admin_user", JSON.stringify(adminData));
      sessionStorage.setItem("admin_token", data.token);

      navigate("/admin");
      return { ok: true };
    } catch (err) {
      console.error("Login gagal:", err);
      return {
        ok: false,
        message: err.response?.data?.message || "Login gagal!",
      };
    }
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem("admin_user");
    sessionStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
