import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import { capitalize, hp } from '@/helpers/common'
import theme from '@/constants/theme'
import FilterSectionView, { ColorFilter, CommonFilterRow } from './FilterSectionView'
import { filtersData } from '@/constants/data'

export default function FiltersModal ({
  modalRef,
  onClose,
  filters,
  setFilters,
  applyFilters,
  resetFilters
}: any) {
  const snapPoints = useMemo(() => ['75%'], [])

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={{ gap: 15 }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: hp(4),
              color: theme.colors.neutral(0.8),
              marginBottom: 5
            }}
          >
            Filters
          </Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName]
            let title = capitalize(sectionName)
            let sectionData = filtersData[sectionName]

            return (
              <View key={sectionName}>
                <FilterSectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName
                  })}
                />
              </View>
            )
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const sections: any = {
  order: (props: any) => <CommonFilterRow {...props} />,
  orientation: (props: any) => <CommonFilterRow {...props} />,
  type: (props: any) => <CommonFilterRow {...props} />,
  color: (props: any) => <ColorFilter {...props} />
}

const CustomBackdrop = ({ animatedIndex, style }: any) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    )
    return { opacity }
  })

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle
  ]
  return (
    <Animated.View style={containerStyle}>
      <BlurView intensity={25} tint='dark' style={StyleSheet.absoluteFill} />
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center'
    // backgroundColor: 'grey'
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
})