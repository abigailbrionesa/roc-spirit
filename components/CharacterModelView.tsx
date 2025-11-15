// components/CharacterModelView.tsx
import {
    Viro3DObject,
    ViroAmbientLight,
    ViroARScene,
    ViroARSceneNavigator,
} from "@reactvision/react-viro";
import { BlurView } from "expo-blur";
import { CameraView } from "expo-camera";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

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
  "Rocky": {
    source: require("../assets/models/Rocky3.glb"),
    scale: [0.12, 0.12, 0.12],
    rotation: [0, 180, 0],
  },
  "Flower Spirit": {
    source: require("../assets/models/flower.glb"),
    scale: [0.12, 0.12, 0.12],
    rotation: [0, 180, 0],
  },
  "Ghost Friend": {
    source: require("../assets/models/ghost_ur.glb"),
    scale: [0.12, 0.12, 0.12],
    rotation: [0, 0, 0],
  },
  "Teacher": {
    source: require("../assets/models/teacher.glb"),
    scale: [1.2, 1.2, 1.2],
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

  // If no config, just render empty space
  if (!config) {
    return <View style={styles.fallback} />;
  }

  const Scene = () => (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={1000} />
      <Viro3DObject
        source={config.source}
        type="GLB"
        scale={config.scale}
        rotation={config.rotation}
        position={[0, 0, -1.2]}
      />
    </ViroARScene>
  );

  return (
    <View style={styles.wrapper}>
      {/* Background: Live Camera with Blur */}
      <View style={StyleSheet.absoluteFill}>
        <CameraView style={styles.camera} facing="back" />
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      </View>
      
      {/* Foreground: 3D Model */}
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: Scene }}
        style={styles.scene}
        viroAppProps={{ 
          displayPointCloud: false,
        }}
        worldAlignment="GravityAndHeading"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 350,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  fallback: {
    width: "100%",
    height: 350,
    backgroundColor: "#1f2937",
  },
});

export default CharacterModelView;
