import Header from "@/components/ui/header";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import pixelStyle from "../../assets/pixelstyle.json";

// Only import MapView on native platforms
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== "web") {
  const MapModule = require("react-native-maps");
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

export default function CampusMap() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [loading, setLoading] = useState(true);

    const UR_CENTER = {
        latitude: 43.127892,
        longitude: -77.627005,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const markers = [
        { id: 1, title: "Rush Rhees Library", coordinate: { latitude: 43.128445, longitude: -77.628003 } },
        { id: 2, title: "Frederick Douglass Commons", coordinate: { latitude: 43.129779, longitude: -77.626214 } },
        { id: 3, title: "Goergen Athletic Center", coordinate: { latitude: 43.125673, longitude: -77.630179 } },
    ];

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission denied");
                setLoading(false);
                return;
            }

            let currentLoc = await Location.getCurrentPositionAsync({});
            setLocation(currentLoc.coords);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.loader}>
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    // Web fallback
    if (Platform.OS === "web") {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top']}>
                    <Header
                        title="Campus Map"
                        iconSource={require("../../assets/mapicon.png")}
                        style={{ backgroundColor: "#FFD82B" }}
                    />
                    <View style={styles.webFallback}>
                        <Text style={styles.webFallbackText}>
                            📱 Map view is only available on mobile devices
                        </Text>
                        <Text style={styles.webFallbackSubtext}>
                            Please open this app on iOS or Android to view the campus map
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header
                    title="Campus Map"
                    iconSource={require("../../assets/mapicon.png")}
                    style={{ backgroundColor: "#FFD82B" }}
                />

                <MapView
                    style={styles.map}
                    initialRegion={UR_CENTER}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    customMapStyle={pixelStyle}
                >
                    {markers.map((m) => (
                        <Marker
                            key={m.id}
                            coordinate={m.coordinate}
                            title={m.title}
                            icon={require("../../assets/marker22.png")}
                        />
                    ))}

                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            icon={require("../../assets/marker11.png")}
                            title="Your Location"
                        />
                    )}
                </MapView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    webFallback: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    webFallbackText: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
    },
    webFallbackSubtext: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
    },
});
