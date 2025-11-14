import React, { useState } from 'react';
import { TextInput, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ImageBackground, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function CodeInputScreen() {
    const [code, setCode] = useState('');

    const [fontsLoaded] = useFonts({
        'pix': require('../../assets/fonts/pix.ttf'),
    });

    if (!fontsLoaded) return null;

    const handleSubmit = () => {
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter a code.');
            return;
        }
        Alert.alert('Success', `Code entered: ${code}`);
    };

    return (
        <ImageBackground
            source={require('../../assets/rockyscene.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Enter Your Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#888"
                        value={code}
                        onChangeText={setCode}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        alignItems: 'center',
        marginTop: 150,
    },
    title: {
        fontSize: 24,
        fontFamily: 'pix',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1e3a8a',
    },
    input: {
        borderWidth: 3,
        padding: 12,
        fontSize: 18,
        fontFamily: 'pix',
        marginBottom: 20,
        backgroundColor: 'white',
        width: '100%',
        color: '#1e3a8a',
    },
    button: {
        backgroundColor: '#ffea00ff',
        paddingVertical: 14,
        borderWidth: 3,
        width: '100%',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'pix',
    },
});
