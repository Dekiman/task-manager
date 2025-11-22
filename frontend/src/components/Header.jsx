import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function Header() {
  const { authUser } = useAuthStore();

  const displayName = authUser?.fullName || authUser?.name || "User";
  const email = authUser?.email;

  const initials =
    displayName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header
      className="
        h-14
        border-b border-[#213448]
        bg-gradient-to-r from-[#050816] via-[#0b1220] to-[#050816]
        flex items-center justify-between
        px-4
        shadow-sm
      "
    >
      {/* Left: App name / logo */}
      <div className="flex items-center gap-2">
        <div
          className="
            flex h-7 w-7 items-center justify-center
            rounded-lg bg-[#213448]
            text-xs font-semibold text-[#ECEFCA]
          "
        >
          TM
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#ECEFCA]">
            Task Manager
          </span>
        </div>
      </div>

      {/* Right: User chip */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-[#ECEFCA]">
            {displayName}
          </span>
          {email && (
            <span className="text-[0.7rem] text-[#94B4C1] truncate max-w-[160px]">
              {email}
            </span>
          )}
        </div>
        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full bg-[#213448]
            text-xs font-semibold text-[#ECEFCA]
            border border-[#547792]/60
          "
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

export default Header;
