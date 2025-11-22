// TaskContainer.jsx
import React, { useEffect, useState } from "react";
import Task from "./Task.jsx";
import { useTaskStore } from "../store/useTaskStore";
import { Checkbox } from "@/components/ui/checkbox";

function TaskContainer({ tasks, isLoading }) {
  const { toggleTask } = useTaskStore();
  const [showCompleted, setShowCompleted] = useState(false);

  const handleCompletedToggle = (checked) => {
    setShowCompleted(!!checked);
  };

  const handleOptimisticComplete = (taskId) => {
    toggleTask({ taskId });
  };

  const visibleTasks = Array.isArray(tasks)
    ? showCompleted
      ? tasks
      : tasks.filter((t) => !t.completed)
    : [];

  const isEmpty = !isLoading && visibleTasks.length === 0;

  return (
    <div
      className="
        relative
        max-h-[480px]
        overflow-y-auto
        rounded-2xl
        border border-[#547792]/40
        bg-gradient-to-br from-[#0b1220] via-[#111827] to-[#050816]
        px-4 py-3
        shadow-[0_18px_40px_rgba(0,0,0,0.75)]
      "
    >

      {/* ALWAYS SHOW THIS HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#ECEFCA]">
          My Tasks
        </h2>

        <div className="flex flex-col items-end">
          <Checkbox
            checked={showCompleted}
            onCheckedChange={handleCompletedToggle}
            className="
              mt-0.5 rounded border-[#547792]
              data-[state=checked]:bg-[#547792]
              data-[state=checked]:border-[#94B4C1]
            "
          />
          <p className="text-xs text-[#94B4C1]">Show completed</p>

          <span className="rounded-full bg-[#213448]/70 px-2 py-0.5 text-[0.7rem] text-[#94B4C1]">
            {visibleTasks.length} task{visibleTasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Handle loading */}
      {isLoading && visibleTasks.length === 0 && (
        <div className="text-center text-sm text-[#94B4C1] py-6">
          Loading tasks…
        </div>
      )}

      {/* Handle empty state */}
      {!isLoading && visibleTasks.length === 0 && (
        <div className="text-center text-sm text-[#94B4C1] py-6">
          No tasks yet.
        </div>
      )}

      {/* Render tasks */}
      {visibleTasks.length > 0 && (
        <div className="flex flex-row gap-3 pb-2">
          {visibleTasks.map((task) => (
            <div key={task._id} className="flex justify-start">
              <Task
                task={task}
                onComplete={handleOptimisticComplete}
                muted={showCompleted && task.completed}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default TaskContainer;