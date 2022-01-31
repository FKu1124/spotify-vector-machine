import create from 'zustand'

export const useUserStore = create(set => ({
    isAuthenticated: undefined,
    setIsAuthenticated: (val) => set(state => ({ isAuthenticated: val })),
    username: "",
    setUsername: (val) => set(state => ({ username: val })),
    showPresentation: false,
    setShowPresentation: (val) => set(state => ({ showPresentation: val }))
}))