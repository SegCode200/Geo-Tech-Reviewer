import { create } from "zustand";

const useAuthStore = create((set:any) => ({
  isAuthenticated: false,
  role: null,
  login: (role:any) => set({ isAuthenticated: true, role }),
  logout: () => set({ isAuthenticated: false, role: null }),
}));

export default useAuthStore;
