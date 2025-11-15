import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LobbyScreen() {
    const router = useRouter();
    const { code } = useLocalSearchParams<{ code: string }>();
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([
        { name: 'Alice', avatar: require('../../assets/avatars/avatar1.png') },
        { name: 'Bob', avatar: require('../../assets/avatars/avatar2.png') },
        { name: 'Charlie', avatar: require('../../assets/avatars/avatar3.png') },
    ]);
    const [nameAdded, setNameAdded] = useState(false);


    const handleJoin = () => {
        if (!name.trim()) return;
        if (!players.some((p) => p.name === name)) {
            const avatar = require(`../../assets/avatars/avatar4.png`);
            setPlayers([...players, { name, avatar }]);
            setNameAdded(true);
        }
        setName('');
    };

    const handleBegin = () => {
        alert('Game Started!');
    };

    const renderPlayer = ({ item }: { item: { name: string; avatar: any } }) => (
        <View style={styles.playerCard}>
            <Text style={styles.player}>{item.name}</Text>
            <Image source={item.avatar} style={styles.avatar} />
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#001e5f' }}>
            <ImageBackground
                source={require('../../assets/background4.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Game Code: {code}</Text>
                    <Text style={styles.subtitle}>Players in the Lobby</Text>
                </View>

                <View style={styles.playersContainer}>
                    {Array.from({ length: Math.ceil(players.length / 2) }).map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {players
                                .slice(rowIndex * 2, rowIndex * 2 + 2)
                                .map((player) => (
                                    <View key={player.name} style={styles.playerCard}>
                                        <Text style={styles.player}>{player.name}</Text>
                                        <Image source={player.avatar} style={styles.avatar} />
                                    </View>
                                ))}
                        </View>
                    ))}
                </View>

                <View style={styles.container}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity
                            style={[styles.joinButtonRow, nameAdded && { opacity: 0.5 }]}
                            onPress={handleJoin}
                            disabled={nameAdded}
                        >
                            <Text style={styles.buttonText}>Add Name</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputRowField}
                            placeholder=""
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={setName}
                            editable={!nameAdded}
                        />
                    </View>

                    <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
                        <Text style={styles.buttonText}>Begin</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        paddingVertical: 50,
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#1e3a8a',
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
    playersContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subtitle: {
        fontSize: 25,
        fontFamily: 'pix',
        marginBottom: 10,
        color: '#2563eb',
        textAlign: 'center',
    },
    playerCard: {
        padding: 14,
        marginVertical: 6,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
    },
    avatar: {
        height: 80,
        width: '100%',
        resizeMode: 'contain',
        marginTop: 8,
    },
    player: {
        fontSize: 25,
        fontFamily: 'pix',
        color: '#1e3a8a',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        borderWidth: 3,
        borderColor: '#1e3a8a',
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
        fontSize: 20,
        fontFamily: 'pix',
        backgroundColor: '#fff',
    },
    beginButton: {
        backgroundColor: '#facc15',
        padding: 16,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1e3a8a',
        marginTop: 12,
    },
    buttonText: {
        fontSize: 25,
        fontFamily: 'pix',
        color: '#1e3a8a',
    },
});
