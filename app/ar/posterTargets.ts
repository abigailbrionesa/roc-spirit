import { ViroARTrackingTargets } from "@reactvision/react-viro";

export const POSTER_TARGET_IDS = {
  FLOWER: "flowerPoster",
  GHOST: "ghostPoster",
  ROCKY: "rockyPoster",
  TEACHER: "teacherPoster",
} as const;

export const registerPosterTargets = () => {
  console.log("[posterTargets] creating AR tracking targets");

  ViroARTrackingTargets.createTargets({
    [POSTER_TARGET_IDS.FLOWER]: {
      source: require("../../assets/posters/flower.png"),
      orientation: "Up",
      physicalWidth: 0.6,
    },
    [POSTER_TARGET_IDS.GHOST]: {
      source: require("../../assets/posters/ghost.png"),
      orientation: "Up",
      physicalWidth: 0.6,
    },
    [POSTER_TARGET_IDS.ROCKY]: {
      source: require("../../assets/posters/rocky.png"),
      orientation: "Up",
      physicalWidth: 0.6,
    },
    [POSTER_TARGET_IDS.TEACHER]: {
      source: require("../../assets/posters/teacher.png"),
      orientation: "Up",
      physicalWidth: 0.6,
    },
  });
};
