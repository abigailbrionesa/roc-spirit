import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import pixelStyle from "../../assets/pixelstyle.json";
import { Image } from "react-native";

export default function CampusMap() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const UR_CENTER = {
        latitude: 43.127892,
        longitude: -77.627005,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const markers = [
        {
            id: 1,
            title: "Rush Rhees Library",
            coordinate: { latitude: 43.128445, longitude: -77.628003 },
        },
        {
            id: 2,
            title: "Frederick Douglass Commons",
            coordinate: { latitude: 43.129779, longitude: -77.626214 },
        },
        {
            id: 3,
            title: "Goergen Athletic Center",
            coordinate: { latitude: 43.125673, longitude: -77.630179 },
        },
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
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={require("../../assets/mapicon.png")}
                        style={styles.headerIcon}
                    />
                    <Text style={styles.headerText}>Campus Map</Text>
                </View>
            </View>

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
                        icon={require("../../assets/marker2.png")}
                    />
                ))}

                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        icon={require("../../assets/marker1.png")}
                        title="Your Location"
                    />
                )}
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: "#FFD82B",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 3,
        borderColor: '#1e3a8a',
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",

    },
    headerText: {
        fontSize: 40,
        fontFamily: "pix",
        marginLeft: 10,
        color: "#000",
    },
    headerIcon: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    map: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
