import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import theme from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Categories from '@/components/Categories'
import { getPhotos } from '@/api'
import ImageGrid from '@/components/ImageGrid'
import { debounce } from 'lodash'

export default function HomeScreen () {
  let page = 1
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 10 : 30
  const [search, setSearch] = useState('')
  const [images, setImages] = useState<any>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    getPhotosHomeScreen()
  }, [])

  const getPhotosHomeScreen = async (params = { page: 1 }, append = false) => {
    console.log(params, append)

    let res = await getPhotos(params)
    if (res.success && res?.data?.hits)
      if (append) setImages([...images, ...res.data.hits])
      else setImages([...res.data.hits])
  }

  const handleChangeCategory = (category: string | null) => {
    setActiveCategory(category)
    setImages([])
    clearSearch()
    page = 1
    let params: any = {
      page
    }
    if (category) params.category = category
    getPhotosHomeScreen(params, false)
  }

  const handleSearch = (text: string) => {
    console.log('searching for:', text)
    setSearch(text)
    if (text.length > 2) {
      page = 1
      setActiveCategory(null)
      setImages([])
      getPhotosHomeScreen({ page, q: text }, false)
    }
    if (text === '') {
      page = 1
      setActiveCategory(null)
      searchInputRef?.current?.clear()
      setImages([])
      getPhotosHomeScreen({ page })
    }
  }

  const clearSearch = () => {
    setSearch('')
    searchInputRef?.current?.clear()
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

  return (
    <View style={{ flex: 1, gap: 14, paddingTop: paddingTop }}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Galleria</Text>
        <FontAwesome6
          name='bars-staggered'
          size={24}
          color={theme.colors.neutral(0.7)}
        />
      </View>

      <ScrollView contentContainerStyle={{ gap: 14 }}>
        {/* searchBar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name='search'
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder='Search for photos...'
            placeholderTextColor={theme.colors.neutral(0.4)}
            style={styles.inputText}
            ref={searchInputRef}
            // value={search}
            onChangeText={handleTextDebounce}
          />
          {search && (
            <Pressable
              onPress={() => {
                handleSearch('')
              }}
              style={styles.closeIcon}
            >
              <Ionicons
                name='close'
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* categories */}
        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* images masonry grid */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandName: {
    fontSize: hp(4),
    fontWeight: '600',
    color: theme.colors.neutral(0.9)
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg
  },
  searchIcon: {
    padding: 8
  },
  inputText: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8)
  },
  closeIcon: {
    padding: 8,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm
  }
})
