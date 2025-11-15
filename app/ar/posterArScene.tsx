// app/ar/posterArScene.tsx

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

// -----------------------------
// Model configurations
// -----------------------------

const CHARACTER_NAMES = {
  [POSTER_TARGET_IDS.FLOWER]: "Flower Spirit",
  [POSTER_TARGET_IDS.GHOST]: "Ghost Friend",
  [POSTER_TARGET_IDS.ROCKY]: "Rocky",
  [POSTER_TARGET_IDS.TEACHER]: "Teacher",
};

const POSTER_CONFIGS = {
  [POSTER_TARGET_IDS.FLOWER]: {
    model: require("../../assets/models/flower.glb"),
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 180, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.GHOST]: {
    model: require("../../assets/models/ghost_ur.glb"),
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.ROCKY]: {
    model: require("../../assets/models/Rocky3.glb"),
    scale: [0.05, 0.05, 0.05] as [number, number, number],
    rotation: [0, 180, 0] as [number, number, number],
  },
  [POSTER_TARGET_IDS.TEACHER]: {
    model: require("../../assets/models/teacher.glb"),
    scale: [0.6, 0.6, 0.6] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
};

// -----------------------------
// Scene component
// -----------------------------

type PosterArSceneProps = {
  onPosterFound?: (characterName: string) => void;
  onPosterLost?: () => void;
};

const PosterArScene: React.FC<PosterArSceneProps> = ({ onPosterFound, onPosterLost }) => {
  const [visiblePosters, setVisiblePosters] = useState<Set<string>>(new Set());
  const lastSeenRef = useRef<{ [key: string]: number }>({});
  const notifiedPosters = useRef<Set<string>>(new Set());

  // How long we tolerate no updates before hiding (ms)
  const HIDE_DELAY_MS = 700;

  const handleAnchorFound = (posterName: string) => {
    console.log(`[PosterArScene] ${posterName} poster detected (onAnchorFound)`);
    
    setVisiblePosters((prev) => new Set(prev).add(posterName));
    lastSeenRef.current[posterName] = Date.now();
    
    // Notify parent about character found
    if (!notifiedPosters.current.has(posterName)) {
      notifiedPosters.current.add(posterName);
      const characterName = CHARACTER_NAMES[posterName as keyof typeof CHARACTER_NAMES];
      onPosterFound?.(characterName);
    }
  };

  const handleAnchorUpdated = (posterName: string) => {
    // This is called repeatedly while ARKit is tracking the marker
    lastSeenRef.current[posterName] = Date.now();
    
    if (!visiblePosters.has(posterName)) {
      console.log(`[PosterArScene] ${posterName} back in view (onAnchorUpdated)`);
      setVisiblePosters((prev) => new Set(prev).add(posterName));
    }
  };

  // Background timer: hide markers if we haven't seen them for a while
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setVisiblePosters((prev) => {
        const newSet = new Set(prev);
        let changed = false;

        prev.forEach((posterName) => {
          const lastSeen = lastSeenRef.current[posterName];
          if (!lastSeen) return;

          const elapsed = now - lastSeen;
          if (elapsed > HIDE_DELAY_MS) {
            console.log(
              `[PosterArScene] ${posterName}: No updates for ${elapsed}ms → hiding`
            );
            newSet.delete(posterName);
            notifiedPosters.current.delete(posterName);
            changed = true;
          }
        });

        // Call onPosterLost if no posters are visible
        if (changed && newSet.size === 0) {
          console.log("[PosterArScene] No posters visible → calling onPosterLost");
          onPosterLost?.();
        }

        return changed ? newSet : prev;
      });
    }, 200); // check 5x/sec

    return () => clearInterval(interval);
  }, [onPosterLost]);

  const renderPosterMarker = (targetId: string) => {
    const config = POSTER_CONFIGS[targetId as keyof typeof POSTER_CONFIGS];
    const isVisible = visiblePosters.has(targetId);

    return (
      <ViroARImageMarker
        key={targetId}
        target={targetId}
        onAnchorFound={() => handleAnchorFound(targetId)}
        onAnchorUpdated={() => handleAnchorUpdated(targetId)}
      >
        {/* Only render 3D model when poster is actively tracked */}
        {isVisible && (
          <ViroNode position={[0, 0.08, 0]}>
            <ViroNode transformBehaviors={["billboardY"]}>
              <Viro3DObject
                source={config.model}
                type="GLB"
                scale={config.scale}
                rotation={config.rotation}
                position={[0, 0, 0]}
              />
            </ViroNode>
          </ViroNode>
        )}
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
