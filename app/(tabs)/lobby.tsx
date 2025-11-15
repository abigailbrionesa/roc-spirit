import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';

export default function LobbyScreen() {
    const router = useRouter();
    const { code } = useLocalSearchParams<{ code: string }>();
    const [name, setName] = useState('');
    const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie']);
    const [pressedAnim] = useState(new Animated.Value(1));

    const [fontsLoaded] = useFonts({
        pix: require('../../assets/fonts/pix.ttf'),
    });

    if (!fontsLoaded) return null;

    const handleJoin = () => {
        if (!name.trim()) return;
        if (!players.includes(name)) {
            setPlayers([...players, name]);
        }
        setName('');
        animateButton();
    };

    const handleBegin = () => {
        alert('Game Started!');
        animateButton();
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(pressedAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
            Animated.timing(pressedAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.ease,
            }),
        ]).start();
    };

    const renderPlayer = ({ item }: { item: string }) => (
        <View style={styles.playerCard}>
            <Text style={styles.player}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🧭 Game Code: {code}</Text>

            <Text style={styles.subtitle}>Players in the Lobby</Text>
            <FlatList
                data={players}
                keyExtractor={(item) => item}
                renderItem={renderPlayer}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Input + Add Name Button Row */}
            <View style={styles.inputRow}>
                <Animated.View style={{ transform: [{ scale: pressedAnim }] }}>
                    <TouchableOpacity style={styles.joinButtonRow} onPress={handleJoin}>
                        <Text style={styles.buttonText}>Add Name</Text>
                    </TouchableOpacity>
                </Animated.View>
                <TextInput
                    style={styles.inputRowField}
                    placeholder=""
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <Animated.View style={{ transform: [{ scale: pressedAnim }] }}>
                <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
                    <Text style={styles.buttonText}>Begin</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 50,
        backgroundColor: '#e6f0ff',
    },
    title: {
        fontSize: 26,
        fontFamily: 'pix',
        textAlign: 'center',
        marginBottom: 15,
        color: '#1e3a8a',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 20,
        fontFamily: 'pix',
        marginBottom: 10,
        color: '#2563eb',
        textAlign: 'center',
    },
    playerCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 3,
        alignItems: 'center',
    },
    player: {
        fontSize: 18,
        fontFamily: 'pix',
        color: '#1e3a8a',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    joinButtonRow: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        marginRight: 10,
        shadowColor: '#2563eb',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 8,
    },
    inputRowField: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#1e3a8a',
        borderRadius: 12,
        padding: 14,
        fontSize: 18,
        fontFamily: 'pix',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
    },
    beginButton: {
        backgroundColor: '#facc15',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#facc15',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 8,
        marginTop: 12,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'pix',
        color: '#fff',
    },
});
