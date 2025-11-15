import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';

export default function LobbyScreen() {
    const router = useRouter();
    const { code } = useLocalSearchParams<{ code: string }>();
    const [name, setName] = useState('');
    const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie']);

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
    };

    const handleBegin = () => {
        alert('Game Started!');
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

            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.joinButtonRow} onPress={handleJoin}>
                    <Text style={styles.buttonText}>Add Name</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputRowField}
                    placeholder=""
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
                <Text style={styles.buttonText}>Begin</Text>
            </TouchableOpacity>
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
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 10,
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
        backgroundColor: '#75a1ffff',
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginRight: 10,
        borderWidth: 3,
        borderColor: '#1e3a8a',
    },
    inputRowField: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#1e3a8a',
        padding: 14,
        fontSize: 18,
        fontFamily: 'pix',
        backgroundColor: '#fff',
    },
    beginButton: {
        backgroundColor: '#facc15',
        padding: 16,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1e3a8a',
        color: '#1e3a8a',
        marginTop: 12,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'pix',
        color: '#1e3a8a',
    },
});
