import { MasonryFlashList } from '@shopify/flash-list'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import ImageCard from './ImageCard'
import { getColumns, wp } from '@/helpers/common'

const ImageGrid = ({ images, navigation }: any) => {
  const columns = getColumns()
  return (
    <View style={{ minHeight: 3, width: wp(100) }}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        // initialNumToRender={1000}
        contentContainerStyle={{ paddingHorizontal: wp(4) }}
        renderItem={({ item, index }) => (
          <ImageCard item={item} columns={columns} navigation={navigation} index={index} />
        )}
        estimatedItemSize={200}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default ImageGrid
