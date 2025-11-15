// app/store/useGameStore.ts
import { create } from "zustand";

type GameState = {
  score: number;
  hasScannedPoster: boolean;
  addScore: (points: number) => void;
  markPosterScanned: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  hasScannedPoster: false,

  addScore: (points) =>
    set((state) => ({
      score: state.score + points,
    })),

  markPosterScanned: () =>
    set({
      hasScannedPoster: true,
    }),
}));
