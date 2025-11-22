import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from 'react-hot-toast'
// import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set,get) => ({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLoggingIn : false,
    isUploadingImage: false,
    socket: null,
    onlineUsers: [],

    /**
     * Check if user is logged in
     * @returns {Promise<void>}
     */
    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser : res.data});
        } catch (error) {
            set({authUser : null});
        } finally {
            set({isCheckingAuth : false});
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");            

        } catch (error) {
            if(error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Internal Server Error");
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup : async (data) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser : res.data});

            //toast notifiications
            toast.success("Account created successfully")

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    logout : async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({authUser : null});
            toast.success("Logged out successfully")

        } catch (error) {
            toast.error("Error logging out");
            console.log("Error logging out:", error);
        } finally {
            set({isSigningOut : false});
        }
    },

    updateProfile: async (data) => {
        set({isUploadingImage: true});
        try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
        } catch (error) {
        console.log("Error in update profile:", error);
        toast.error(error.response.data.message);
        } finally {
            set({isUploadingImage: false});
        }
    },

    // connectSocket: () => {
    //     const {authUser} = get();
    //     if(!authUser || get.socket?.connected) return;

    //     const socket = io(BASE_URL, {
    //         withCredentials: true, //sending cookies with connection
    //     });

    //     socket.connect()

    //     set({socket})

    //     socket.on("getOnlineUsers", (usersIds) => {
    //         set({onlineUsers : usersIds})
    //     })   

    // },

    // disconnectSocket: () => {
    //     if (get().socket?.connected) get().socket.disconnect();
    // },


}));