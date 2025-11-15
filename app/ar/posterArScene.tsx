// app/ar/posterArScene.tsx
// Sequential quest version - only shows the CURRENT target

import {
  Viro3DObject,
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
} from "@reactvision/react-viro";
import React, { useEffect, useRef, useState } from "react";
import type { QuestStop } from "../config/questStops";
import { QUEST_STOPS } from "../config/questStops";
import type { GamePhase } from "../store/useGameStore";
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
} catch {
  console.log("[PosterArScene] Tracking targets already created");
}

// Map poster target names to character names for display
const CHARACTER_NAMES: Record<string, string> = {
  [POSTER_TARGET_IDS.ROCKY]: "Rocky",
  [POSTER_TARGET_IDS.GHOST]: "Ghost Friend",
  [POSTER_TARGET_IDS.FLOWER]: "Flower Spirit",
  [POSTER_TARGET_IDS.TEACHER]: "Teacher",
};

// -----------------------------
// Scene component
// -----------------------------

type PosterArSceneProps = {
  currentTarget: QuestStop;
  gamePhase: GamePhase;
  collectedMascots: string[];
  onScanSuccess: () => void;
  onCollectedCharacterScanned: (scannedId: string, scannedName: string) => void;
  onScanFailure: (scannedName: string) => void;
};

const PosterArScene: React.FC<PosterArSceneProps> = ({ 
  currentTarget,
  gamePhase,
  collectedMascots,
  onScanSuccess,
  onCollectedCharacterScanned,
  onScanFailure,
}) => {
  const [markerVisible, setMarkerVisible] = useState(false);
  const hasTriggeredRef = useRef(false);
  const ignoreWrongScansUntilRef = useRef<number>(0);

  // Reset state when currentTarget changes
  useEffect(() => {
    console.log("[PosterArScene] Current target changed to:", currentTarget.name);
    setMarkerVisible(false);
    hasTriggeredRef.current = false;
    // Ignore wrong poster scans for 2 seconds after target change
    ignoreWrongScansUntilRef.current = Date.now() + 2000;
  }, [currentTarget.posterTargetName, currentTarget.name]);

  // Reset markerVisible when returning to FINDING phase
  useEffect(() => {
    if (gamePhase === "FINDING") {
      console.log("[PosterArScene] Returning to FINDING phase, resetting marker");
      setMarkerVisible(false);
      hasTriggeredRef.current = false;
      // Also ignore wrong scans when returning to FINDING
      ignoreWrongScansUntilRef.current = Date.now() + 2000;
    }
  }, [gamePhase]);

  const handleAnchorFound = (scannedTargetName: string) => {
    console.log(`[PosterArScene] Poster detected:`, scannedTargetName, "Current target:", currentTarget.posterTargetName);
    
    // Check if this is the correct poster
    if (scannedTargetName === currentTarget.posterTargetName) {
      console.log("[PosterArScene] ✅ Correct poster!");
      setMarkerVisible(true);
      
      // Only trigger scan success if we're in FINDING phase and haven't triggered yet
      if (gamePhase === "FINDING" && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onScanSuccess();
      }
    } else {
      // Check if this character has already been collected
      const scannedCharacter = QUEST_STOPS.find(stop => stop.posterTargetName === scannedTargetName);
      
      if (scannedCharacter && collectedMascots.includes(scannedCharacter.id)) {
        // This is a previously collected character - allow interaction
        console.log("[PosterArScene] ✅ Previously collected character!");
        onCollectedCharacterScanned(scannedCharacter.id, scannedCharacter.name);
      } else {
        // Ignore wrong scans during the cooldown period
        if (Date.now() < ignoreWrongScansUntilRef.current) {
          console.log("[PosterArScene] ⏭️ Ignoring wrong poster during transition");
          return;
        }
        
        console.log("[PosterArScene] ❌ Wrong poster!");
        const scannedName = CHARACTER_NAMES[scannedTargetName] || "Unknown";
        onScanFailure(scannedName);
      }
    }
  };

  const handleAnchorUpdated = () => {
    // Keep marker visible while tracking
    if (!markerVisible) {
      setMarkerVisible(true);
    }
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={800}
      />

      {/* Only render marker for the CURRENT target */}
      <ViroARImageMarker
        target={currentTarget.posterTargetName}
        onAnchorFound={() => handleAnchorFound(currentTarget.posterTargetName)}
        onAnchorUpdated={handleAnchorUpdated}
      >
        {markerVisible && (
          <ViroNode position={[0, 0.08, 0]}>
            <ViroNode transformBehaviors={["billboardY"]}>
              <Viro3DObject
                source={currentTarget.model}
                type="GLB"
                scale={currentTarget.scale}
                rotation={currentTarget.rotation}
                position={[0, 0, 0]}
              />
            </ViroNode>
          </ViroNode>
        )}
      </ViroARImageMarker>

      {/* Also scan other posters to detect wrong scans */}
      {Object.values(POSTER_TARGET_IDS)
        .filter(targetId => targetId !== currentTarget.posterTargetName)
        .map(targetId => (
          <ViroARImageMarker
            key={targetId}
            target={targetId}
            onAnchorFound={() => handleAnchorFound(targetId)}
          >
            {/* No model rendered for wrong posters */}
          </ViroARImageMarker>
        ))
      }
    </ViroARScene>
  );
};

export default PosterArScene;
