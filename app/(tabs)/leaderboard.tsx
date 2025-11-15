import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const scores = [
        { name: 'Alice', score: 320, avatar: require('../../assets/avatars/avatar1.png') },
        { name: 'Bob', score: 280, avatar: require('../../assets/avatars/avatar2.png') },
        { name: 'Charlie', score: 260, avatar: require('../../assets/avatars/avatar3.png') },
        { name: 'Daisy', score: 240, avatar: require('../../assets/avatars/avatar4.png') },
        { name: 'Evan', score: 220, avatar: require('../../assets/avatars/avatar5.png') },
    ]
    const renderScore = ({ item, index }: { item: any; index: number }) => (
        <View style={[styles.scoreCard, index === 0 && styles.topScoreCard]}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.score}>{item.score} pts</Text>
            </View>
        </View>
    );

    return (
        <ImageBackground
            source={require('../../assets/background2.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={{ flex: 1 }}>

                <View style={styles.header}>
                    <Text style={styles.title}>🏆 Leaderboard</Text>
                </View>

                <FlatList
                    data={scores}
                    
                    renderItem={renderScore}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.list}
                />

            </SafeAreaView>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'red',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#1e3a8a',
        margin: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'pix',
        color: '#1e3a8a',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 22,
        fontFamily: 'pix',
        color: '#2563eb',
        marginTop: 6,
    },
    list: {
        padding: 20,
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 8,
        borderWidth: 3,
        borderColor: '#1e3a8a',
        borderRadius: 10,
    },
    topScoreCard: {
        backgroundColor: '#FFF3B1',
    },
    rank: {
        fontSize: 26,
        fontFamily: 'pix',
        color: '#1e3a8a',
        width: 50,
        textAlign: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginHorizontal: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontFamily: 'pix',
        color: '#1e3a8a',
    },
    score: {
        fontSize: 20,
        fontFamily: 'pix',
        color: '#2563eb',
    },
});
