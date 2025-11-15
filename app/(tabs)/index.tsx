import React, { useRef, useEffect } from 'react';
import { ImageBackground, Image, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
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
          <TouchableOpacity onPress={() => router.push('/enter_code')}>

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
});

export default HomeScreen;
