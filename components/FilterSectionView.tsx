import theme from '@/constants/theme'
import { hp } from '@/helpers/common'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { capitalize } from './../helpers/common'

const FilterSectionView = ({ title, content }: any) => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={{
          fontSize: hp(2.4),
          fontWeight: '500',
          color: theme.colors.neutral(0.8)
        }}
      >
        {title}
      </Text>
      <View>{content}</View>
    </View>
  )
}

export const CommonFilterRow = ({
  data,
  filterName,
  filters,
  setFilters
}: any) => {
  const onSelect = (item: any) => {
    setFilters({ ...filters, [filterName]: item })
  }
  return (
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
      {data &&
        data.map((item: any, index: any) => {
          let isActive = filters && filters[filterName] === item
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : 'white'
          let color = isActive ? 'white' : theme.colors.neutral(0.7)
          return (
            <Pressable
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
              onPress={() => {
                onSelect(item)
              }}
            >
              <Text style={[{ color }]}>{capitalize(item)}</Text>
            </Pressable>
          )
        })}
    </View>
  )
}

export const ColorFilter = ({ data, filterName, filters, setFilters }: any) => {
  const onSelect = (item: any) => {
    setFilters({ ...filters, [filterName]: item })
  }
  return (
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
      {data &&
        data.map((item: any, index: any) => {
          let isActive = filters && filters[filterName] === item
          let borderColor = isActive ? theme.colors.neutral(0.4) : 'white'
          return (
            <Pressable
              key={item}
              onPress={() => {
                onSelect(item)
              }}
            >
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View
                  style={[
                    {
                      backgroundColor: item,
                      width: 40,
                      height: 30,
                      borderRadius: theme.radius.sm - 3,
                      borderCurve: 'continuous'
                    }
                  ]}
                ></View>
              </View>
            </Pressable>
          )
        })}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8
  },
  outlinedButton: {
    alignSelf: 'flex-start',
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: 'continuous'
  },
  colorWrapper: {
    padding: 3,
    borderWidth: 2,
    borderRadius: theme.radius.xs,
    borderCurve: 'continuous'
  }
})

export default FilterSectionView
