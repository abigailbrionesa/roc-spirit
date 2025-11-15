// components/CharacterModelView.tsx
import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARScene,
  ViroARSceneNavigator,
  ViroDirectionalLight,
  ViroNode,
} from "@reactvision/react-viro";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type CharacterModelViewProps = {
  characterName?: string;
};

// Local mapping from name -> model config
const MODEL_CONFIGS: Record<
  string,
  {
    source: any;
    scale: [number, number, number];
    rotation: [number, number, number];
  }
> = {
  Rocky: {
    source: require("../assets/models/Rocky3.glb"),
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 180, 0],
  },
  "Flower Spirit": {
    source: require("../assets/models/flower.glb"),
    scale: [0.28, 0.28, 0.28],
    rotation: [0, 180, 0],
  },
  "Ghost Friend": {
    source: require("../assets/models/ghost_ur.glb"),
    scale: [0.28, 0.28, 0.28],
    rotation: [0, 0, 0],
  },
  Teacher: {
    source: require("../assets/models/teacher.glb"),
    scale: [0.5, 0.5, 0.5],
    rotation: [0, 0, 0],
  },
};

const CharacterModelView: React.FC<CharacterModelViewProps> = ({ characterName }) => {
  const config = useMemo(() => {
    if (!characterName) return null;
    
    // Try exact match first
    if (MODEL_CONFIGS[characterName]) {
      return MODEL_CONFIGS[characterName];
    }
    
    // Fallback: loose match on lowercase
    const lower = characterName.toLowerCase();
    const key = Object.keys(MODEL_CONFIGS).find(k =>
      lower.includes(k.toLowerCase().split(" ")[0])
    );
    return key ? MODEL_CONFIGS[key] : null;
  }, [characterName]);

  // If no config, show fallback
  if (!config) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Model not found: {characterName}</Text>
      </View>
    );
  }

  const ModelScene = () => (
    <ViroARScene>
      {/* Lighting */}
      <ViroAmbientLight color="#ffffff" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.2]}
        intensity={800}
      />
      
      {/* 3D Model - fixed in front of camera, no marker needed */}
      <ViroNode position={[0, -0.2, -1.5]}>
        <Viro3DObject
          source={config.source}
          type="GLB"
          scale={config.scale}
          rotation={config.rotation}
          animation={{ name: "idle", run: true, loop: true }}
        />
      </ViroNode>
    </ViroARScene>
  );

  return (
    <View style={styles.wrapper}>
      {/* White background layer */}
      <View style={styles.whiteBackground} />
      
      {/* AR Scene with model */}
      <ViroARSceneNavigator
        autofocus={false}
        initialScene={{
          scene: ModelScene,
        }}
        style={styles.scene}
      />
      
      {/* Caption */}
      <View style={styles.captionWrap}>
        <Text style={styles.captionText}>{characterName || "Model"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 320,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  whiteBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  scene: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  fallback: {
    width: "100%",
    height: 320,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#6b7280",
    fontSize: 14,
  },
  captionWrap: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 3,
  },
  captionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CharacterModelView;