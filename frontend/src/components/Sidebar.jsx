import { NavLink } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Sidebar navigation for the app
 */
function Sidebar({ collapsed }) {
  const { logout } = useAuthStore();

  const baseLinkClasses =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-[0.75rem] font-medium " +
    "text-[#94B4C1] hover:bg-[#213448]/70 hover:text-[#ECEFCA] " +
    "transition-all duration-150";

  const activeClasses =
    "bg-[#213448] text-[#ECEFCA] border border-[#547792] " +
    "shadow-[0_10px_30px_rgba(0,0,0,0.7)]";

  return (
    <div className="flex-1 flex flex-col justify-between pb-4 pt-2">
      {/* Top nav links */}
      <div className="mt-2">
        <nav className="grid grid-flow-row gap-2 px-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <span
              className="
                flex h-6 w-6 items-center justify-center rounded-lg 
                bg-[#213448]/80 text-[0.75rem] text-[#ECEFCA]
              "
            >
              ⌂
            </span>
            {!collapsed && <span>Home</span>}
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <span
              className="
                flex h-6 w-6 items-center justify-center rounded-lg 
                bg-[#213448]/80 text-[0.75rem] text-[#ECEFCA]
              "
            >
              ✓
            </span>
            {!collapsed && <span>My Tasks</span>}
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="flex justify-center px-2">
        <button
          onClick={logout}
          className="
            w-full
            rounded-full
            border border-[#547792]/50
            px-3 py-1.5
            text-[0.7rem]
            text-[#94B4C1]
            hover:bg-red-500/10 hover:text-red-400 hover:border-red-400
            transition-all
          "
        >
          {collapsed ? "⏻" : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
