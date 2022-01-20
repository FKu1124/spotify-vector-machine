import create from 'zustand'

export const useUserStore = create(set => ({
    isAuthenticated: false,
    setIsAuthenticated: (val) => set({ isAuthenticated: val }),
}))