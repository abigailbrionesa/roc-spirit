import { ViroARTrackingTargets } from "@reactvision/react-viro";

export const POSTER_TARGET_ID = "melioraPoster";

export const registerPosterTargets = () => {
  console.log("[posterTargets] creating AR tracking targets");

  ViroARTrackingTargets.createTargets({
    [POSTER_TARGET_ID]: {
      source: require("../../assets/posters/melioraPoster.png"),
      orientation: "Up",   // poster upright on a wall
      physicalWidth: 0.6,  // meters - adjust to your real printed width
    },
  });
};
