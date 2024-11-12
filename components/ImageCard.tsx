import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { blurhash } from '@/constants/data'
import { getImageSize, wp } from '@/helpers/common'
import theme from '@/constants/theme'
import { useNavigation } from '@react-navigation/native'

const ImageCard = ({ item, columns, navigation, index }: any) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0
  }
  const getImageHeight = () => {
    let { imageWidth: width, imageHeight: height } = item
    return { height: getImageSize(width, height) }
  }

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Image',{...item,navigation})
      }}
      style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        placeholder={{ blurhash }}
        transition={100}
        accessible={true}
        accessibilityLabel={'Logo'}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    marginBottom: wp(2),
    borderRadius: 18,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  spacing: {
    marginRight: wp(2)
  }
})

export default ImageCard
