// app/ar/posterArScene.tsx

import {
    Viro3DObject,
    ViroARImageMarker,
    ViroARScene,
    ViroARTrackingTargets,
    ViroAmbientLight,
    ViroBox,
    ViroDirectionalLight,
    ViroMaterials,
    ViroNode,
    ViroText,
} from "@reactvision/react-viro";
import React from "react";
import { POSTER_TARGET_IDS } from "./posterTargets";

// -----------------------------
// AR target + materials setup
// -----------------------------

try {
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
} catch (e) {
  console.log("[PosterArScene] Tracking targets already created");
}

try {
  ViroMaterials.createMaterials({
    chatBubbleBg: {
      diffuseColor: "#ffffff", // white chat box
    },
  });
} catch (e) {
  console.log("[PosterArScene] Materials already created");
}

// -----------------------------
// Model configurations
// -----------------------------

const POSTER_CONFIGS = {
  [POSTER_TARGET_IDS.FLOWER]: {
    model: require("../../assets/models/flower.glb"),
    message: "You found a beautiful flower!",
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 180, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.GHOST]: {
    model: require("../../assets/models/ghost_ur.glb"),
    message: "A friendly ghost appears!",
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.ROCKY]: {
    model: require("../../assets/models/Rocky3.glb"),
    message: "It's Rocky, the Rochester mascot!",
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 180, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.TEACHER]: {
    model: require("../../assets/models/teacher.glb"),
    message: "A wise teacher appears!",
    scale: [0.6, 0.6, 0.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
};

// -----------------------------
// Scene component
// -----------------------------

const PosterArScene: React.FC = () => {
  const handleAnchorFound = (posterName: string) => {
    console.log(`[PosterArScene] ${posterName} poster detected`);
  };

  const renderPosterMarker = (targetId: string) => {
    const config = POSTER_CONFIGS[targetId as keyof typeof POSTER_CONFIGS];
    
    return (
      <ViroARImageMarker
        key={targetId}
        target={targetId}
        onAnchorFound={() => handleAnchorFound(targetId)}
      >
        {/* Anchor at poster center; put character + chat just above */}
        <ViroNode position={[0, 0.08, 0]}>
          {/* 3D Model on the left */}
          <ViroNode
            position={[-0.16, 0.04, 0]}
            transformBehaviors={["billboardY"]}
          >
            <Viro3DObject
              source={config.model}
              type="GLB"
              scale={config.scale}
              rotation={config.rotation}
              position={[0, 0, 0]}
            />
          </ViroNode>

          {/* Chat box to the right */}
          <ViroNode
            position={[0.20, 0.06, 0]}
            transformBehaviors={["billboardY"]}
            scale={[0.9, 0.9, 0.9]}
          >
            {/* White 3D chat box */}
            <ViroBox
              width={0.24}
              height={0.08}
              length={0.02}
              materials={["chatBubbleBg"]}
            />

            {/* Text: centered and slightly in front of box face */}
            <ViroText
              text={config.message}
              width={0.20}
              height={0.06}
              position={[0, 0, 0.011]}
              style={{
                fontSize: 12,
                color: "#111827",
                textAlign: "center",
              }}
            />
          </ViroNode>
        </ViroNode>
      </ViroARImageMarker>
    );
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

      {/* Render all poster markers */}
      {Object.values(POSTER_TARGET_IDS).map(targetId => renderPosterMarker(targetId))}
    </ViroARScene>
  );
};

export default PosterArScene;
