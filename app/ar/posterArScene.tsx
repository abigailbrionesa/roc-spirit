// app/ar/posterArScene.tsx

import React from "react";
import {
  ViroARScene,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
  ViroBox,
  ViroText,
  ViroMaterials,
} from "@reactvision/react-viro";

// -----------------------------
// AR target + materials setup
// -----------------------------

const POSTER_TARGET_ID = "melioraPoster";

try {
  ViroARTrackingTargets.createTargets({
    [POSTER_TARGET_ID]: {
      source: require("../../assets/posters/melioraPoster.png"),
      orientation: "Up",
      physicalWidth: 0.6, // meters – match your printed poster width
    },
  });
} catch (e) {
  console.log("[PosterArScene] Tracking targets already created");
}

try {
  ViroMaterials.createMaterials({
    characterDummy: {
      diffuseColor: "#3b82f6", // blue character box
    },
    chatBubbleBg: {
      diffuseColor: "#ffffff", // white chat box
    },
  });
} catch (e) {
  console.log("[PosterArScene] Materials already created");
}

// -----------------------------
// Scene component
// -----------------------------

const PosterArScene: React.FC = () => {
  const handleAnchorFound = () => {
    console.log("[PosterArScene] Poster detected (onAnchorFound fired)");
  };

  return (
    <ViroARScene>
      {/* Lighting so things are visible */}
      <ViroAmbientLight color="#ffffff" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={800}
      />

      <ViroARImageMarker
        target={POSTER_TARGET_ID}
        onAnchorFound={handleAnchorFound}
      >
        {/* Anchor at poster center; put character + chat just above */}
        <ViroNode position={[0, 0.08, 0]}>
          {/* Character placeholder on the left */}
          <ViroNode
            position={[-0.16, 0.04, 0]}
            transformBehaviors={["billboardY"]}
          >
            <ViroBox
              width={0.06}         // smaller character box
              height={0.12}
              length={0.04}
              materials={["characterDummy"]}
            />
          </ViroNode>

          {/* Chat box to the right */}
          <ViroNode
            position={[0.20, 0.06, 0]}
            transformBehaviors={["billboardY"]}
            scale={[0.9, 0.9, 0.9]} // overall shrink for crispness
          >
            {/* White 3D chat box */}
            <ViroBox
              width={0.24}         // physical size of the box
              height={0.08}
              length={0.02}
              materials={["chatBubbleBg"]}
            />

            {/* Text: centered and slightly in front of box face */}
            <ViroText
              text="Welcome to Meliora Quest!"
              width={0.20}        // stay inside box width
              height={0.06}
              position={[0, 0, 0.011]} // half the length (0.01) + a tiny offset
              style={{
                fontSize: 12,      // smaller → sharper
                color: "#111827",
                textAlign: "center",
              }}
            />
          </ViroNode>
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

export default PosterArScene;
