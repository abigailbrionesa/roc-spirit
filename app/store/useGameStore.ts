// app/store/useGameStore.ts
import { create } from "zustand";

export type GamePhase = "FINDING" | "INTERACTING" | "COMPLETED";

type GameState = {
  // Sequential quest state
  currentStepIndex: number;
  gamePhase: GamePhase;
  collectedMascots: string[]; // Array of mascot IDs that have been collected
  
  // Actions
  startQuest: () => void;
  advanceToNextStep: () => void;
  setGamePhase: (phase: GamePhase) => void;
  markMascotCollected: (mascotId: string) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  currentStepIndex: 0,
  gamePhase: "FINDING",
  collectedMascots: [],

  // Start the quest from the beginning
  startQuest: () =>
    set({
      currentStepIndex: 0,
      gamePhase: "FINDING",
      collectedMascots: [],
    }),

  // Move to the next quest step
  advanceToNextStep: () =>
    set((state) => ({
      currentStepIndex: state.currentStepIndex + 1,
      gamePhase: "FINDING",
    })),

  // Change the current game phase
  setGamePhase: (phase) =>
    set({
      gamePhase: phase,
    }),

  // Mark a mascot as collected
  markMascotCollected: (mascotId) =>
    set((state) => ({
      collectedMascots: [...state.collectedMascots, mascotId],
    })),

  // Reset everything
  resetGame: () =>
    set({
      currentStepIndex: 0,
      gamePhase: "FINDING",
      collectedMascots: [],
    }),
}));
