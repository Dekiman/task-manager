import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from 'react-hot-toast'
import { useAuthStore } from "./useAuthStore";

export const useTaskStore = create((set,get) => ({
    userTasks : [],
    isTasksLoading : false,


    getMyTasks: async () => {
        const authState = useAuthStore.getState();
        const userId = authState.authUser?._id;

        if (!userId) {
            toast.error("Not logged in");
            return;

        }

        set({isTasksLoading : true});
        
        try { 
            const res = await axiosInstance.get(`/nodes/assigned`);
            set({userTasks : res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({isTasksLoading : false});
        }

    },

    toggleTask: async ({ taskId }) => {
        const prevTasks = get().userTasks;

        // 1) Optimistic update: flip completed for just this task
        set({
        userTasks: prevTasks.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t
        ),
        });

        try {
        // 2) Call backend 
        await axiosInstance.put(`/nodes/${taskId}/toggle`);
        } catch (err) {
        console.error("toggleTask failed:", err);

        // 3) Rollback on error
        set({ userTasks: prevTasks });
        }
    },
}));