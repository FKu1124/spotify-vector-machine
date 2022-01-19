import create from 'zustand'

export const useUserStore = create(set => ({
    isAuthenticated: true,
    setIsAuthenticated: (val) => set({ isAuthenticated: val }),
    username: "",
    setUsername: (val) => set({ username: val })
}))