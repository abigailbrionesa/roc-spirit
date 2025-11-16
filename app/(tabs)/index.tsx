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
            {/* <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/ar')}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.featureButtonIcon}>🎮</Text>
                <Text style={styles.featureButtonText}>AR</Text>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/map')}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.featureButtonIcon}>📍</Text>
                <Text style={styles.featureButtonText}>Map</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/quiz')}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.featureButtonIcon}>❓</Text>
                <Text style={styles.featureButtonText}>Quiz</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureButton}
              onPress={() => router.push('/leaderboard')}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.featureButtonIcon}>🏆</Text>
                <Text style={styles.featureButtonText}>Ranks</Text>
              </View>
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
    gap: 16,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#000000',
    minWidth: 85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureButtonIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  featureButtonText: {
    color: '#041a46',
    fontFamily: 'pix',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
