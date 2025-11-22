import { useTaskStore } from "../store/useTaskStore.js";
import { useEffect } from "react";
import TaskContainer from "./TaskContainer.jsx";

function MyTasks() {
  const { getMyTasks, userTasks, isTasksLoading } = useTaskStore();

  useEffect(() => {
    getMyTasks();
  }, []);

  if (isTasksLoading) return <div>Loading...</div>;

  return <TaskContainer tasks={userTasks} isTasksLoading={isTasksLoading}/>;
}

export default MyTasks;