// app/ar/posterArScene.tsx

import {
  Viro3DObject,
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroNode,
  ViroText,
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
  collectedCharacters?: Set<string>;
};

const PosterArScene: React.FC<PosterArSceneProps> = ({ 
  onPosterFound, 
  onPosterLost,
  collectedCharacters = new Set(),
}) => {
  const [visiblePosters, setVisiblePosters] = useState<Set<string>>(new Set());
  const [isTracking, setIsTracking] = useState<{ [key: string]: boolean }>({});
  const hideTimeoutsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Much shorter debounce now that we have proper tracking state
  const HIDE_DEBOUNCE_MS = 3000; // 3 seconds

  const clearHideTimeout = (posterName: string) => {
    if (hideTimeoutsRef.current[posterName]) {
      clearTimeout(hideTimeoutsRef.current[posterName]);
      delete hideTimeoutsRef.current[posterName];
    }
  };

  const scheduleHide = (posterName: string) => {
    clearHideTimeout(posterName);
    
    hideTimeoutsRef.current[posterName] = setTimeout(() => {
      console.log(`[PosterArScene] ${posterName}: No activity for ${HIDE_DEBOUNCE_MS}ms → hiding`);
      
      setIsTracking((prev) => {
        const newTracking = { ...prev };
        delete newTracking[posterName];
        return newTracking;
      });
      
      let shouldCallLost = false;
      
      setVisiblePosters((prev) => {
        if (!prev.has(posterName)) return prev;
        
        const newSet = new Set(prev);
        newSet.delete(posterName);
        
        // Check if we should call onPosterLost
        if (newSet.size === 0 && prev.size > 0) {
          shouldCallLost = true;
          console.log("[PosterArScene] Marking to call onPosterLost");
        }
        
        return newSet;
      });
      
      // Call onPosterLost outside of setState
      if (shouldCallLost) {
        console.log("[PosterArScene] No posters visible → calling onPosterLost");
        setTimeout(() => {
          console.log("[PosterArScene] Actually calling onPosterLost callback");
          onPosterLost?.();
        }, 0);
      }
      
      delete hideTimeoutsRef.current[posterName];
    }, HIDE_DEBOUNCE_MS);
  };

  const handleAnchorFound = (posterName: string) => {
    console.log(`[PosterArScene] ${posterName} poster detected (onAnchorFound)`);
    
    clearHideTimeout(posterName);
    
    setIsTracking((prev) => ({ ...prev, [posterName]: true }));
    
    const wasNotVisible = !visiblePosters.has(posterName);
    
    setVisiblePosters((prev) => {
      if (!prev.has(posterName)) {
        return new Set(prev).add(posterName);
      }
      return prev;
    });
    
    if (wasNotVisible) {
      const characterName = CHARACTER_NAMES[posterName as keyof typeof CHARACTER_NAMES];
      onPosterFound?.(characterName);
      console.log(`[PosterArScene] Notifying parent: ${characterName} found`);
    }
    
    // Schedule initial hide
    scheduleHide(posterName);
  };

  const handleAnchorUpdated = (posterName: string) => {
    // Mark as actively tracking and reset the hide timer
    setIsTracking((prev) => ({ ...prev, [posterName]: true }));
    
    clearHideTimeout(posterName);
    scheduleHide(posterName);
    
    setVisiblePosters((prev) => {
      if (!prev.has(posterName)) {
        return new Set(prev).add(posterName);
      }
      return prev;
    });
  };

  // Keepalive: Monitor tracking state and clear it if no updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Reset all tracking flags - they'll be set back to true by onAnchorUpdated if still tracking
      setIsTracking((prev) => {
        const newTracking: { [key: string]: boolean } = {};
        Object.keys(prev).forEach((posterName) => {
          // Set to false - will be set back to true if onAnchorUpdated fires
          newTracking[posterName] = false;
        });
        return newTracking;
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const renderPosterMarker = (targetId: string) => {
    const config = POSTER_CONFIGS[targetId as keyof typeof POSTER_CONFIGS];
    const characterName = CHARACTER_NAMES[targetId as keyof typeof CHARACTER_NAMES];
    const isVisible = visiblePosters.has(targetId);
    const isCollected = collectedCharacters.has(characterName);

    return (
      <ViroARImageMarker
        key={targetId}
        target={targetId}
        onAnchorFound={() => handleAnchorFound(targetId)}
        onAnchorUpdated={() => handleAnchorUpdated(targetId)}
      >
        {/* Show checkmark if collected, otherwise show 3D model */}
        {isVisible && (
          <ViroNode position={[0, 0.35, 0]}>
            {isCollected ? (
              // Show checkmark for collected characters
              <ViroNode transformBehaviors={["billboardY"]}>
                <ViroText
                  text="✓"
                  scale={[0.5, 0.5, 0.5]}
                  position={[0, 0, 0]}
                  style={styles.checkmarkText}
                  width={2}
                  height={2}
                />
              </ViroNode>
            ) : (
              // Show 3D model for uncollected characters
              <ViroNode transformBehaviors={["billboardY"]}>
                <Viro3DObject
                  source={config.model}
                  type="GLB"
                  scale={config.scale}
                  rotation={config.rotation}
                  position={[0, 0, 0]}
                />
              </ViroNode>
            )}
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

const styles = {
  checkmarkText: {
    fontFamily: "Arial",
    fontSize: 120,
    color: "#22c55e",
    textAlign: "center",
    textAlignVertical: "center",
  },
};

export default PosterArScene; 