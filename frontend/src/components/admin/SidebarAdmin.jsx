import { NavLink, useNavigate } from "react-router-dom";
import { Home, Bug, Activity, ClipboardList, FileText, LogOut } from "lucide-react";
import { useAdmin } from "../../context/AdminAuth";

export default function SidebarAdmin() {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const menu = [
    { to: "/admin", icon: <Home size={18} />, label: "Dashboard", exact: true },
    { to: "/admin/penyakit", icon: <Bug size={18} />, label: "Penyakit" },
    { to: "/admin/gejala", icon: <Activity size={18} />, label: "Gejala" },
    { to: "/admin/aturan", icon: <ClipboardList size={18} />, label: "Aturan" },
    { to: "/admin/rekap", icon: <FileText size={18} />, label: "Rekap Konsultasi" },
  ];

  return (
    <aside className="w-64 bg-[var(--primary)] text-white border-r border-gray-400 min-h-screen p-4">
      <div className="flex mb-10 justify-center">
        <h1 className="font-semibold text-xl text-center">SIPATE</h1>
      </div>

      <nav className="space-y-3">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `flex items-center gap-3 p-2 rounded-md transition ${isActive ? "bg-white text-[var(--primary)]" : "text-white hover:bg-white hover:text-[var(--primary)]"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="flex items-center gap-3 p-2 mt-6 rounded-md text-white hover:bg-white hover:text-[var(--primary)] transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
