import create from 'zustand'

export const useUserStore = create(set => ({
    isAuthenticated: false,
    setIsAuthenticated: (val) => set(state => ({ isAuthenticated: val })),
    username: "",
    setUsername: (val) => set(state => ({ username: val })),
    deviceID: "",
    setDeviceID: (val) => set(state => ({ deviceID: val }))
}))