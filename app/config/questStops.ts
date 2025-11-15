// app/config/questStops.ts
// This defines the entire sequential quest path

import { POSTER_TARGET_IDS } from "../ar/posterTargets";

export type QuestStop = {
  id: string;
  name: string;
  posterTargetName: string;
  model: any;
  scale: [number, number, number];
  rotation: [number, number, number];
  // Optional: Add map coordinates if you implement map navigation
  // mapCoords?: { lat: number; lon: number };
};

export const QUEST_STOPS: QuestStop[] = [
  {
    id: "rocky",
    name: "Rocky",
    posterTargetName: POSTER_TARGET_IDS.ROCKY,
    model: require("../../assets/models/Rocky3.glb"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 180, 0],
  },
  {
    id: "ghost",
    name: "Ghost Friend",
    posterTargetName: POSTER_TARGET_IDS.GHOST,
    model: require("../../assets/models/ghost_ur.glb"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
  },
  {
    id: "flower",
    name: "Flower Spirit",
    posterTargetName: POSTER_TARGET_IDS.FLOWER,
    model: require("../../assets/models/flower.glb"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 180, 0],
  },
  {
    id: "teacher",
    name: "Teacher",
    posterTargetName: POSTER_TARGET_IDS.TEACHER,
    model: require("../../assets/models/teacher.glb"),
    scale: [0.6, 0.6, 0.6],
    rotation: [0, 0, 0],
  },
];
