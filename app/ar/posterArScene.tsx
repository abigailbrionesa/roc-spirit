// app/ar/posterArScene.tsx
// Simplified version - plays video on poster, then shows buttons

import {
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroVideo,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import React, { useEffect, useRef, useState } from "react";
import type { QuestStop } from "../config/questStops";
import { QUEST_STOPS } from "../config/questStops";
import type { GamePhase } from "../store/useGameStore";
import { POSTER_TARGET_IDS } from "./posterTargets";

// -----------------------------
// AR target setup
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

// -----------------------------
// Scene component
// -----------------------------

type PosterArSceneProps = {
  currentTarget: QuestStop;
  gamePhase: GamePhase;
  collectedMascots: string[];
  onScanSuccess: () => void;
  onVideoFinished: () => void;
  onCollectedCharacterScanned: (scannedId: string, scannedName: string) => void;
  onScanFailure: (scannedName: string) => void;
};

const PosterArScene: React.FC<PosterArSceneProps> = ({ 
  currentTarget,
  gamePhase,
  collectedMascots,
  onScanSuccess,
  onVideoFinished,
  onCollectedCharacterScanned,
  onScanFailure,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hasTriggeredScanRef = useRef(false);
  const ignoreWrongScansUntilRef = useRef<number>(0);

  // Reset when target changes or returning to FINDING phase
  useEffect(() => {
    console.log("[PosterArScene] Resetting for:", currentTarget.name, "Phase:", gamePhase);
    
    // Always reset when returning to FINDING (allows re-scanning)
    if (gamePhase === "FINDING") {
      setIsVideoPlaying(false);
      setShowVideo(false);
      hasTriggeredScanRef.current = false;
      ignoreWrongScansUntilRef.current = Date.now() + 1000; // Short cooldown
    }
  }, [currentTarget.posterTargetName, gamePhase]);

  const handleAnchorFound = (scannedTargetName: string) => {
    console.log(`[PosterArScene] Detected:`, scannedTargetName, "Current phase:", gamePhase);
    
    // Only process if we're in FINDING phase
    if (gamePhase !== "FINDING") {
      console.log("[PosterArScene] Not in FINDING phase, ignoring scan");
      return;
    }

    // Check if this is the correct poster
    if (scannedTargetName === currentTarget.posterTargetName) {
      console.log("[PosterArScene] ✅ Correct poster!");
      
      if (!hasTriggeredScanRef.current) {
        hasTriggeredScanRef.current = true;
        setShowVideo(true);
        setIsVideoPlaying(true);
        onScanSuccess();
      }
    } else {
      // Wrong poster scanned
      if (Date.now() < ignoreWrongScansUntilRef.current) {
        console.log("[PosterArScene] ⏭️ Ignoring scan during cooldown");
        return;
      }

      const scannedCharacter = QUEST_STOPS.find(
        stop => stop.posterTargetName === scannedTargetName
      );
      
      if (!scannedCharacter) {
        return;
      }

      // Check if this character has been collected (unlocked)
      if (collectedMascots.includes(scannedCharacter.id)) {
        console.log("[PosterArScene] ✅ Previously collected character - allow chat!");
        onCollectedCharacterScanned(scannedCharacter.id, scannedCharacter.name);
      } else {
        // Character not unlocked yet
        console.log("[PosterArScene] 🔒 Character not unlocked yet!");
        onScanFailure(scannedCharacter.name);
      }
    }
  };

  const handleVideoFinish = () => {
    console.log("[PosterArScene] Video finished!");
    setIsVideoPlaying(false);
    onVideoFinished();
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={500} />

      {/* Current target marker - shows video */}
      <ViroARImageMarker
        target={currentTarget.posterTargetName}
        onAnchorFound={() => handleAnchorFound(currentTarget.posterTargetName)}
      >
        {showVideo && (
          <ViroVideo
            source={currentTarget.video}
            width={0.6}
            height={0.8} // Back to square/full coverage
            position={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            paused={!isVideoPlaying}
            loop={false}
            onFinish={handleVideoFinish}
          />
        )}
      </ViroARImageMarker>

      {/* Other posters - for wrong scan detection */}
      {Object.values(POSTER_TARGET_IDS)
        .filter(targetId => targetId !== currentTarget.posterTargetName)
        .map(targetId => (
          <ViroARImageMarker
            key={targetId}
            target={targetId}
            onAnchorFound={() => handleAnchorFound(targetId)}
          >
            {/* No content rendered */}
          </ViroARImageMarker>
        ))
      }
    </ViroARScene>
  );
};

export default PosterArScene;