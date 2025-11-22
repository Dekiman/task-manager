import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore.js";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

function AppLayout() {
  const { authUser } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!authUser) return <Navigate to="/login" replace />;

  return (
    <div
      className="
        h-screen
        flex
        bg-gradient-to-br from-[#020617] via-[#020617] to-[#050816]
        text-slate-100
      "
    >
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col
          flex-shrink-0
          border-r border-[#213448]
          bg-[#020617]
          transition-all duration-200
          ${collapsed ? "w-16" : "w-48"}
        `}
      >
        <button
          className="
            flex items-center justify-center
            py-2 text-[0.7rem]
            text-[#94B4C1]
            hover:text-[#ECEFCA]
          "
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? "»" : "«"}
        </button>

        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main
          className="
            flex-1
            overflow-y-auto
            p-4
          "
        >
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
