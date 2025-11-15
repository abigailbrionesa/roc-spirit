// app/ar/posterArScene.tsx

import {
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials
} from "@reactvision/react-viro";
import React, { useState } from "react";

const POSTER_TARGET_ID = "melioraPoster";

try {
  ViroARTrackingTargets.createTargets({
    [POSTER_TARGET_ID]: {
      source: require("../../assets/posters/melioraPoster.png"),
      orientation: "Up",
      physicalWidth: 0.6,
    },
  });
} catch {
  console.log("[PosterArScene] Tracking targets already created");
}

try {
  ViroMaterials.createMaterials({
    characterDummy: {
      diffuseColor: "#2563eb",
    },
  });
} catch {
  console.log("[PosterArScene] Materials already created");
}

type PosterArSceneProps = {
  sceneNavigator?: any;
  arSceneNavigator?: any;
  onCharacterTapped?: () => void;
  onPosterFound?: (characterName: string) => void;
};

const PosterArScene: React.FC<PosterArSceneProps> = (props) => {
  console.log("[PosterArScene] Component rendered");
  const [hasNotified, setHasNotified] = useState(false);

  const handleAnchorFound = () => {
    console.log("[PosterArScene] Poster detected!");
    if (!hasNotified) {
      setHasNotified(true);
      props.onPosterFound?.("Meliora Character");
    }
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      
      <ViroARImageMarker
        target={POSTER_TARGET_ID}
        onAnchorFound={handleAnchorFound}
      >
        {/* Character appears on poster */}
        <ViroBox
          position={[0, 0.12, 0]}
          width={0.1}
          height={0.15}
          length={0.05}
          materials={["characterDummy"]}
        />
      </ViroARImageMarker>
    </ViroARScene>
  );
};

export default PosterArScene;
