import create from 'zustand'

export const useCoordinateSystemStore = create(set => ({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    length: 30,
    genre: "rock",
    name: "Mood Vector Name!",

    squareSize: 640,
    cnvCtx: null,

    setStartX: (val) => set({ startX: val }),
    setStartY: (val) => set({ startY: val }),
    setEndX: (val) => set({ endX: val }),
    setEndY: (val) => set({ endY: val }),
    setLength: (val) => set({ length: val }),
    setGenre: (val) => set({ genre: val }),
    setName: (val) => set({ name: val }),
    setCnvCtx: (val) => set({ cnvCtx: val }),
}))