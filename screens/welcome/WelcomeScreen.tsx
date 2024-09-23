import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '@/helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import theme from '@/constants/theme'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export default function WelcomeScreen () {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <Image
        source={require('./../../assets/welcome.png')}
        resizeMode='cover'
        style={styles.bgImage}
      />
      {/* linear gradient */}
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.5)',
            'white',
            'white'
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        {/* content */}
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.brandName}
          >
            Galleria
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.slug}
          >
            Manage you photos
          </Animated.Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home')
            }}
          >
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={styles.button}
          >
              <Text style={styles.buttonText}>Start Explore</Text>
          </Animated.View>
            </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute'
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: 'absolute'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16
  },
  brandName: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: '700'
  },
  slug: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '500'
  },
  button: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 16,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: hp(3),
    letterSpacing: 1,
    fontWeight: '500'
  }
})
