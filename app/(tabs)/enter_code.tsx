import React, { useState } from 'react';
import { TextInput, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ImageBackground, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/colors';
export default function CodeInputScreen() {
    const [code, setCode] = useState('');
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'pix': require('../../assets/fonts/pix.ttf'),
    });

    if (!fontsLoaded) return null;

    const handleSubmit = () => {
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter a code.');
            return;
        }
        router.push(`/lobby?code=${code.toUpperCase()}`);
    };

    return (
        <ImageBackground
            source={require('../../assets/rockyscene.png')}
            style={styles.background}
            resizeMode="cover"
        >

                <View style={styles.container}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity
                            style={[styles.joinButtonRow]}

                        >
                            <Text style={styles.buttonText}>Code</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.inputRowField}
                            value={code}
                        onChangeText={setCode}
                        autoCapitalize="characters"
                        />
                    </View>

                    <TouchableOpacity style={styles.beginButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
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
    marginTop: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  joinButtonRow: {
    backgroundColor: colors.secondary.connectiveCornflower,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 10,
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
  },
  inputRowField: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
    padding: 14,
    fontSize: 20,
    fontFamily: 'pix',
    backgroundColor: colors.tertiary.white,
  },
  beginButton: {
    backgroundColor: colors.primary.dandelion,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Snowball',
    color: colors.primary.navy,
  },
});
