// app/config/questStops.ts
import { POSTER_TARGET_IDS } from "../ar/posterTargets";

export type QuestStop = {
  id: string;
  name: string;
  posterTargetName: string;
  model: any;
  video: any; // NEW: Add video field
  scale: [number, number, number];
  rotation: [number, number, number];
};

export const QUEST_STOPS: QuestStop[] = [
  {
    id: "rocky",
    name: "Rocky",
    posterTargetName: POSTER_TARGET_IDS.ROCKY,
    model: require("../../assets/models/Rocky3.glb"),
    video: require("../../assets/videos/rockyfinalvideo.mp4"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 180, 0],
  },
  {
    id: "ghost",
    name: "Ghost Friend",
    posterTargetName: POSTER_TARGET_IDS.GHOST,
    model: require("../../assets/models/ghost_ur.glb"),
    video: require("../../assets/videos/ghostfinalvideo.mp4"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
  },
  {
    id: "flower",
    name: "Flower Spirit",
    posterTargetName: POSTER_TARGET_IDS.FLOWER,
    model: require("../../assets/models/flower.glb"),
    video: require("../../assets/videos/flowerfinalvideo.mp4"),
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 180, 0],
  },
  {
    id: "teacher",
    name: "Teacher",
    posterTargetName: POSTER_TARGET_IDS.TEACHER,
    model: require("../../assets/models/teacher.glb"),
    video: require("../../assets/videos/teacherfinalvideo.mp4"),
    scale: [0.6, 0.6, 0.6],
    rotation: [0, 0, 0],
  },
];