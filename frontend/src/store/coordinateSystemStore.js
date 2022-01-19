import create from 'zustand'

export const useCoordinateSystemStore = create(set => ({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    name: "Mood Vector Name!",


    setStartX: (val) => set({ startX: val }),
    setStartY: (val) => set({ startY: val }),
    setEndX: (val) => set({ endX: val }),
    setEndY: (val) => set({ endY: val }),
    setName: (val) => set({ name: val }),
}))