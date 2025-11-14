import React, { useState } from 'react';
import { ImageBackground, Image, View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from 'expo-font';

const Section = ({ title, children }: any) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Ionicons name={open ? "chevron-up" : "chevron-down"} size={22} color="#1e3a8a" />
            </TouchableOpacity>

            {open && <View style={styles.sectionBody}>{children}</View>}
        </View>
    );
};

const { height } = Dimensions.get('window');

export default function InstructionsMenu() {
    const [fontsLoaded] = useFonts({
        'pix': require('../../assets/fonts/pix.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ImageBackground
                source={require('../../assets/background2.png')}
                style={styles.background}
                resizeMode="cover"
            />
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/roclogo2.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.subtitle}>AR Campus Quest – Instructions</Text>
                </View>

                <Section title="Overview">
                    <Text style={styles.text}>
                        <Text style={styles.underline}>Rochester Spirit: AR Campus Quest</Text> is an immersive campus tour experience where you explore the University of Rochester using augmented reality, character interactions, and gamified learning.
                    </Text>
                </Section>

                <Section title="How It Works">
                    <View style={styles.list}>
                        <Text style={styles.listItem}><Text style={styles.underline}>Guided Exploration:</Text> Follow your tour guide.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Find Posters:</Text> Scan character posters.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>AR Interaction:</Text> Meet characters & play games.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Points:</Text> Earn points from quizzes.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Winner:</Text> Top score wins UR merch.</Text>
                    </View>
                </Section>

                <Section title="Characters">
                    <Text style={styles.category}>History & Traditions</Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}><Text style={styles.underline}>Asahel the Scholar</Text> – Teaches “Meliora”.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Azariah the Dandelion Spirit</Text> – Perseverance.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Rocky the Yellowjacket</Text> – Mascot spirit.</Text>
                    </View>

                    <Text style={styles.category}>Landmarks & Campus</Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}><Text style={styles.underline}>Rush Rhees Librarian Ghost</Text> – Trivia.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Clock Tower Guardian</Text> – Acorn toss.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Eastman & Wilson Volunteers</Text> – Service game.</Text>
                    </View>

                    <Text style={styles.category}>Arts & Music</Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}><Text style={styles.underline}>Maestro of Eastman</Text> – Conducting game.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Gallery Greeter</Text> – Art puzzles.</Text>
                    </View>

                    <Text style={styles.category}>Seasonal & Fun</Text>
                    <View style={styles.list}>
                        <Text style={styles.listItem}><Text style={styles.underline}>Winterfest Snow Sprite</Text> – Toss game.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Boar’s Head Herald</Text> – Feast trivia.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Tunnel Painter</Text> – Virtual graffiti.</Text>
                        <Text style={styles.listItem}><Text style={styles.underline}>Quizmaster Owl</Text> – Bonus quizzes.</Text>
                    </View>
                </Section>

                <Section title="Rewards">
                    <Text style={styles.text}>
                        Earn points from each interaction and final quiz. The player with the most points wins official University of Rochester merchandise
                    </Text>
                </Section>

                <Section title="Goals">
                    <View style={styles.list}>
                        <Text style={styles.listItem}>Make campus tours interactive.</Text>
                        <Text style={styles.listItem}>Teach history, culture, and landmarks.</Text>
                        <Text style={styles.listItem}>Boost school spirit — Meliora.</Text>
                        <Text style={styles.listItem}>Encourage collaboration.</Text>
                    </View>
                </Section>

                <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startText}>Start Tour</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: height,
        zIndex: -1,
    },
    wrapper: {
        padding: 20,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: 30,
    },
    subtitle: {
        fontSize: 20,
        color: "#d5ddf4",
        fontFamily: "pix",
    },
    text: {
        fontFamily: "pix",
        color: "#374151",
        fontSize: 20,
    },
    sectionContainer: {
        borderWidth: 3,
        borderColor: "#000000ff",
        backgroundColor: "rgba(255, 255, 255, 1)",
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 1,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 25,
        color: "#1e3a8a",
        fontFamily: "pix",
    },
    sectionBody: {
        marginTop: 12,
    },
    list: {
        marginTop: 4,
        marginBottom: 10,
    },
    listItem: {
        marginBottom: 6,
        fontSize: 20,
        color: "#374151",
        fontFamily: "pix",
    },
    category: {
        marginTop: 10,
        marginBottom: 6,
        color: "#1e3a8a",
        fontFamily: "pix",
        textDecorationLine: "underline",
    },
    startButton: {
        backgroundColor: "#2563eb",
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginTop: 20,
        marginBottom: 40,
    },
    startText: {
        color: "white",
        textAlign: "center",
        fontSize: 17,
        fontFamily: "pix",
        textDecorationLine: "underline",
    },
    logo: {
        width: 200,
        height: 150,
        marginBottom: 10,
    },
    underline: {
        textDecorationLine: 'underline',
        fontFamily: 'pix',
    },
});
