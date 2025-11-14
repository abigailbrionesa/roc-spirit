import React, { useState } from 'react';
import { TextInput, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, View, Image } from 'react-native';
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
            <Image 
                source={require('../../assets/rockyandgrass.png')} 
                style={styles.bottomImage} 
                resizeMode="contain"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        backgroundColor: '#f0f4f8',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'pix',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1e3a8a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#1e3a8a',
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        fontFamily: 'pix',
        marginBottom: 20,
        color: '#1e3a8a',
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'pix',
    },
    bottomImage: {
        width: '100%',
        height: 120,
        marginBottom: 10,
    },
});
