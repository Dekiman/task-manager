// Task.jsx
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "../lib/axios.js"; // adjust path
import { useTaskStore } from "../store/useTaskStore.js";

function Task({ task, onComplete }) {
  const { _id: taskId, name, text, assignedBy, dueDate } = task || {};
  const [pathString, setPathString] = useState("");
  const [isPathLoading, setIsPathLoading] = useState(false);

  // (You still have toggleTask in the store if needed for other flows)
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "No due date";

  // Fetch path once for this task
  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    const fetchPath = async () => {
      try {
        setIsPathLoading(true);
        const res = await axiosInstance.get(`/nodes/${taskId}/path`);
        if (!cancelled) {
          setPathString(res.data?.pathString || "");
        }
      } catch (err) {
        console.error("Failed to fetch path for node", taskId, err);
      } finally {
        if (!cancelled) setIsPathLoading(false);
      }
    };

    fetchPath();
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const handleCheckedChange = (checked) => {
    if (!taskId) return;
    if (checked === "indeterminate") return;
    if (typeof onComplete === "function") {
      onComplete(taskId);
    }
  };

  return (
    <div
      className="
        group
        relative
        z-0 hover:z-50
        flex flex-col justify-between
        rounded-xl
        border border-[#547792]/70
        bg-gradient-to-br from-[#213448] to-[#182435]
        px-4 py-3
        shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:border-[#94B4C1] hover:shadow-[0_18px_40px_rgba(0,0,0,0.7)]
        w-full
        min-w-[14rem]
        max-w-[16rem]
      "
    >
      {/* PATH */}
      <div className="mb-1 text-[0.65rem] text-[#94B4C1]/80 truncate">
        {isPathLoading
          ? "Loading path..."
          : pathString || ""}
      </div>

      {/* TOP: checkbox + title */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="mb-2 text-sm font-semibold leading-tight text-[#ECEFCA] truncate">
            {name || "Untitled task"}
          </h3>

          <Checkbox
            checked={task?.completed}
            onCheckedChange={handleCheckedChange}
            className="
              mt-0.5 rounded border-[#547792]
              data-[state=checked]:bg-[#547792]
              data-[state=checked]:border-[#94B4C1]
            "
          />
        </div>

        <div
          className="
            rounded-md
            border border-white/5
            bg-[#213448]/70
            h-20
            overflow-y-auto
            px-3 py-2
            text-xs leading-snug text-[#94B4C1]
          "
        >
          {text && text.trim().length > 0 ? (
            text
          ) : (
            <span className="opacity-60">No description</span>
          )}
        </div>
      </div>

      {/* BOTTOM: assignee + due date */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-2 text-[0.7rem]">
        <div className="flex-1 min-w-0">
          <div className="mb-0.5 uppercase tracking-wide text-[0.6rem] text-[#94B4C1]/80">
            Assigned by
          </div>
          <div className="truncate text-[#ECEFCA]">
            {assignedBy?.fullName || "Unknown"}
          </div>
          {assignedBy?.email && (
            <div className="truncate text-[#94B4C1]/80">
              {assignedBy.email}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="mb-0.5 uppercase tracking-wide text-[0.6rem] text-[#94B4C1]/80">
            Due
          </span>
          <span
            className="
              rounded-full
              bg-[#547792]/30
              px-2 py-0.5
              text-[0.7rem] font-medium
              text-[#ECEFCA]
            "
          >
            {formattedDueDate}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Task;
