import create from 'zustand'

export const useCoordinateSystemStore = create(set => ({
    startX: 0,
    startY: 0,
    startMood: 'neutral',
    endX: 0,
    endY: 0,
    endMood: 'neutral',
    length: 30,
    genre: "rock",
    name: "Mood Vector Name!",

    squareSize: 640,
    cnvCtx: null,

    setStartX: (val) => set({ startX: val }),
    setStartY: (val) => set({ startY: val }),
    setStartMood: (val) => set({ startMood: val }),
    setEndX: (val) => set({ endX: val }),
    setEndY: (val) => set({ endY: val }),
    setEndMood: (val) => set({ endMood: val }),
    setLength: (val) => set({ length: val }),
    setGenre: (val) => set({ genre: val }),
    setName: (val) => set({ name: val }),
    setCnvCtx: (val) => set({ cnvCtx: val }),
}))