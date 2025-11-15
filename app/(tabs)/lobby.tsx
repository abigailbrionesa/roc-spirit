import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import { ImageBackground } from 'react-native';

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

    const [fontsLoaded] = useFonts({
        pix: require('../../assets/fonts/pix.ttf'),
    });

    if (!fontsLoaded) return null;

    const handleJoin = () => {
        if (!name.trim()) return;
        if (!players.some(p => p.name === name)) {
            const nextAvatarIndex = players.length + 1;
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

        <ImageBackground
            source={require('../../assets/background4.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>

                <Text style={styles.title}>🧭 Game Code: {code}</Text>

                <Text style={styles.subtitle}>Players in the Lobby</Text>
                <FlatList
                    data={players}
                    keyExtractor={(item) => item.name}
                    renderItem={renderPlayer}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />


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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 50,
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
        padding: 14,
        marginVertical: 6,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    avatar: {
        height: 80,
        width: '100%',
        resizeMode: 'contain',
        marginTop: 8,
    },
    player: {
        fontSize: 18,
        fontFamily: 'pix',
        color: '#1e3a8a',
        textAlign: 'center',
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
