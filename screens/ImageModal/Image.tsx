import {
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  Platform,
  Pressable,
  Alert,
  Text
} from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '@/helpers/common'
import { Image } from 'expo-image'
import theme from '@/constants/theme'
import { Octicons } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import Toast from 'react-native-toast-message'

export default function ImageScreen ({ route }: any) {
  const { imageWidth, imageHeight, webformatURL, previewURL, navigation } =
    route.params || {}
  const [status, setStatus] = useState('loading')
  const fileName = previewURL.split('/').pop()
  const filePath = `${FileSystem.documentDirectory}${fileName}`

  const getSize = () => {
    let aspectRatio = imageWidth / imageHeight

    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92)
    let calculatedHeight = maxWidth / aspectRatio
    let calculatedWidth = maxWidth

    // if aspectRatio less than 1 that's mean that the image is portrait
    if (aspectRatio < 1) calculatedWidth = calculatedHeight * aspectRatio

    return {
      width: calculatedWidth,
      height: calculatedHeight
    }
  }

  const onLoad = () => {
    setStatus('')
  }

  const handleDownloadImage = async () => {
    setStatus('downloading')
    const uri = await downloadFile()
    if (uri) showToast('Image downloaded')
  }

  const handleShareImage = async () => {
    setStatus('sharing')
    let uri = await downloadFile()
    if (uri) {
      await Sharing.shareAsync(uri)
    }
  }

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(webformatURL, filePath)
      console.log('downloaded at: ', uri)
      return uri
    } catch (error) {
      console.log('got error: ', error?.message)
      Alert.alert('Image', error?.message)
      return null
    } finally {
      setStatus('')
    }
  }

  const showToast = message => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom'
    })
  }

  const toastConfig = {
    success: ({ text1, props, ...rest }: any) => {
      return (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      )
    }
  }

  return (
    <BlurView style={styles.container} tint='dark' intensity={60}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status == 'loading' && (
            <ActivityIndicator size='large' color={'white'} />
          )}
        </View>
        <Image
          source={webformatURL}
          transition={100}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => navigation.goBack()}>
            <Octicons name='x' size={24} color='white' />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size='small' color='white' />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name='download' size={24} color='white' />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'sharing' ? (
            <View style={styles.button}>
              <ActivityIndicator size='small' color='white' />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name='share' size={24} color='white' />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  image: {
    borderWidth: 2,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)'
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50
  },
  button: {
    height: hp(6),
    width: hp(6),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous'
  },
  toastContainer: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: theme.colors.white
  }
})
