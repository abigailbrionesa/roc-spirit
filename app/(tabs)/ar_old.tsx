import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PosterArScene from "../ar/posterArScene";

const { width, height } = Dimensions.get("window");

export default function ARScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  
  // Game state from Zustand store
  const { 
    currentStepIndex, 
    gamePhase, 
    collectedMascots,
    setGamePhase,
    advanceToNextStep,
    markMascotCollected,
  } = useGameStore();

  // Derived data
  const currentTarget = QUEST_STOPS[currentStepIndex];
  const isGameComplete = gamePhase === "COMPLETED";
  const totalStops = QUEST_STOPS.length;

  // Handle when the correct poster is scanned
  const handleScanSuccess = useCallback(() => {
    console.log("[ARScreen] Correct poster scanned:", currentTarget.name);
    setGamePhase("INTERACTING");
  }, [currentTarget, setGamePhase]);

  // Handle when wrong poster is scanned
  const handleScanFailure = useCallback((scannedName: string) => {
    console.log("[ARScreen] Wrong poster scanned:", scannedName, "Expected:", currentTarget.name);
    // Could show error message here
  }, [currentTarget]);

  // Handle continuing to next quest step
  const handleContinueQuest = useCallback(() => {
    console.log("[ARScreen] Continuing quest from:", currentTarget.name);
    
    // Mark current mascot as collected
    markMascotCollected(currentTarget.id);
    
    const nextStepIndex = currentStepIndex + 1;
    
    if (nextStepIndex < QUEST_STOPS.length) {
      // Continue to next stop
      advanceToNextStep();
    } else {
      // Game completed!
      setGamePhase("COMPLETED");
    }
  }, [currentStepIndex, currentTarget, markMascotCollected, advanceToNextStep, setGamePhase]);

  // Handle starting chat with character
  const handleStartChat = useCallback(() => {
    console.log("[ARScreen] Starting chat with:", currentTarget.name);
    router.push({
      pathname: "/chat" as any,
      params: { characterName: currentTarget.name },
    });
  }, [currentTarget, router]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need camera access</Text>
          <Text style={styles.permissionSub}>
            Camera access is required for AR experiences.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Viro AR camera */}
        <ViroARSceneNavigator
          autofocus
          style={styles.camera}
          initialScene={{
            scene: () => (
              <PosterArScene 
                onPosterFound={handlePosterFound}
                onPosterLost={handlePosterLost}
                onSpecificPosterLost={handleSpecificPosterLost}
                collectedCharacters={collectedCharacters}
              />
            ),
          }}
        />

        {/* Collection buttons - 4 character slots */}
        <View style={styles.rightButtons} pointerEvents="box-none">
          {CHARACTERS.map((character) => {
            const isCollected = collectedCharacters.has(character.name);
            const isCurrentlyScanning = currentlyScanning === character.name;
            
            console.log(`[ARScreen] Character: ${character.name}, Collected: ${isCollected}, Scanning: ${isCurrentlyScanning}`);
            
            return (
              <TouchableOpacity
                key={character.id}
                style={[
                  styles.btn,
                  isCollected && styles.btnCollected,
                  isCurrentlyScanning && styles.btnScanning,
                ]}
                activeOpacity={0.7}
                onPress={() => handleCharacterTapped(character.name, isCollected)}
              >
                {isCollected ? (
                  <View style={styles.btnContent}>
                    <Text style={styles.btnNameText}>{character.shortName}</Text>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                ) : (
                  <Text style={styles.btnText}>mystery</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scanning indicator */}
        {currentlyScanning && (
          <View style={styles.scanningIndicator}>
            <View style={styles.scanningTextContainer}>
              <Text style={styles.scanningText}>
                Scanning: {currentlyScanning}
              </Text>
              <View style={styles.dotsContainer}>
                <Text style={[styles.dot, dotCount >= 1 && styles.dotActive]}>•</Text>
                <Text style={[styles.dot, dotCount >= 2 && styles.dotActive]}>•</Text>
                <Text style={[styles.dot, dotCount >= 3 && styles.dotActive]}>•</Text>
              </View>
            </View>
            <Text style={styles.scanningSubText}>
              Tap on the right to chat →
            </Text>
          </View>
        )}

        {/* Collection progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {collectedCharacters.size} / {CHARACTERS.length} collected
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    width,
    height,
  },
  rightButtons: {
    position: "absolute",
    right: 12,
    top: "30%",
    height: 280,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    width: 70,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  btnCollected: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "rgba(34, 197, 94, 0.5)",
  },
  btnScanning: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    borderColor: "rgba(59, 130, 246, 0.8)",
    borderWidth: 2,
  },
  btnContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#888",
    fontSize: 11,
    textTransform: "lowercase",
    fontWeight: "500",
  },
  btnNameText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 12,
  },
  checkmark: {
    position: "absolute",
    bottom: 2,
    right: 2,
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  permissionSub: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scanningIndicator: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  scanningTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanningText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dotsContainer: {
    flexDirection: "row",
    marginLeft: 4,
    width: 30,
  },
  dot: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 1,
  },
  dotActive: {
    color: "#fff",
  },
  scanningSubText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  progressContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

function useGameStore(): { currentStepIndex: any; gamePhase: any; collectedMascots: any; setGamePhase: any; advanceToNextStep: any; markMascotCollected: any; } {
  throw new Error("Function not implemented.");
}
