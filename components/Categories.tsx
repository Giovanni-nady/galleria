import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { data } from '@/constants/data'
import { hp, wp } from '@/helpers/common'
import theme from '@/constants/theme'
import Animated, { FadeInRight } from 'react-native-reanimated'

export default function Categories ({
  activeCategory,
  handleChangeCategory
}: any) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      data={data.categories}
      renderItem={({ item, index }) => (
        <CategoryItem
          active={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
          title={item}
          index={index}
        />
      )}
      keyExtractor={item => item}
    />
  )
}

const CategoryItem = ({ title, index, active, handleChangeCategory }: any) => {
  let textColor = active ? theme.colors.white : theme.colors.neutral(0.8)
  let bgColor = active ? theme.colors.neutral(0.8) : theme.colors.white
  return (
    <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)}>
      <Pressable
        style={[styles.category, { backgroundColor: bgColor }]}
        onPress={() => handleChangeCategory(active ? null : title)}
      >
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: wp(4),
    gap: 8
  },
  category: {
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.white
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: '500'
  }
})
