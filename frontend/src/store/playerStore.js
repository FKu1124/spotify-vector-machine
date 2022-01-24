import create from 'zustand'

export const usePlayerStore = create(set => ({
    player: undefined,
    setPlayer: (val) => set(state => ({ player: val })),
    deviceID: "",
    setDeviceID: (val) => set(state => ({ deviceID: val })),
    devices: [],
    setDevices: (val) => set(state => ({ devices: val })),
    player: null,
    token: "",
    setToken: (val) => set(state => ({ token: val })),
    tokenExpiry: undefined,
    setTokenExpiry: (val) => set(state => ({ tokenExpiry: val })),
    setPlayer: (val) => set(state => ({ player: val })),
    active: false,
    setActive: (val) => set(state => ({ active: val })),
    loading: false,
    paused: true,
    position: 0,
    repeatMode: 0,
    shuffle: false,
    name: "",
    duration: 0,
    cover: "",
    artists: [],
    updatePlayerState: (val) => set(state => ({ 
        loading: val.loading,
        paused: val.paused,
        position: val.position,
        repeatMode: val.repeatMode,
        shuffle: val.shuffle,
        name: val.name,
        duration: val.duration,
        cover: val.cover,
        artists: val.artists,
     })),
    updatePlayerStateByName: (name, val) => set(state => ({ [name]: val })),
    nextTracks: [],
    setNextTracks: (val) => set(state => ({ nextTracks: val })),
    prevTracks: [],
    setPrevTracks: (val) => set(state => ({ prevTracks: val }))
}))