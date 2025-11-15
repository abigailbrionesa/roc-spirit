import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
const { height } = Dimensions.get('window');

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollY, {
        toValue: -height,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundWrapper}>
          <AnimatedImageBackground
            source={require('../../assets/background.png')}
            style={[
              styles.background,
              { transform: [{ translateY: scrollY }] },
            ]}
            resizeMode="repeat"
          />
        </View>

        <Image
          source={require('../../assets/rocspirit.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>

          <TouchableOpacity
            onPress={() => router.push('/enter_code')}
          >
            <Image
              source={require('../../assets/startbutton.png')}
              style={styles.button}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Image
              source={require('../../assets/menubutton.png')}
              style={styles.button}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.featureRow}>
            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/ar')}
            >
              <Text style={styles.featureButtonText}>🎮 AR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/map')}
            >
              <Text style={styles.featureButtonText}>📍 Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/quiz')}
            >
              <Text style={styles.featureButtonText}>❓ Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/leaderboard')}
            >
              <Text style={styles.featureButtonText}>🏆 Ranks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: height * 2,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 192,
    height: 64,
    marginVertical: 12,
  },
  featureRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
    paddingHorizontal: 20,
  },
  featureButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e40af',
    minWidth: 90,
    alignItems: 'center',
  },
  featureButtonText: {
    color: '#fff',
    fontFamily: 'pix',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default HomeScreen;
