import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'
import theme from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import Categories from '@/components/Categories'
import { getPhotos } from '@/api'
import ImageGrid from '@/components/ImageGrid'
import { debounce, filter } from 'lodash'
import FiltersModal from '@/components/FiltersModal'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Animated from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen () {
  let page = 1
  const { top } = useSafeAreaInsets()
  const paddingTop = top > 0 ? top + 10 : 30
  const [search, setSearch] = useState('')
  const [images, setImages] = useState<any>([])
  const [filters, setFilters] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const searchInputRef = useRef(null)
  const scrollRef = useRef(null)
  const modalRef = useRef<BottomSheetModal>(null)
  const [isEndReached, setIsEndReached] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    getPhotosHomeScreen()
  }, [])


  const getPhotosHomeScreen = async (params = { page: 1 }, append = false) => {
  try {
    const res = await getPhotos(params);
    if (res.success && res?.data?.hits) {
      setImages(append ? [...images, ...res.data.hits] : [...res.data.hits]);
    } else {
      console.error("API response error:", res);
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
};


  const handleChangeCategory = (category: string | null) => {
    setActiveCategory(category)
    setImages([])
    clearSearch()
    page = 1
    let params: any = {
      page,
      ...filters
    }
    if (category) params.category = category
    getPhotosHomeScreen(params, false)
  }

  const handleSearch = (text: string) => {
    console.log('searching for:', text)
    setSearch(text)
    page = 1
    setImages([])
    setActiveCategory(null)
    if (text.length > 2) {
      getPhotosHomeScreen({ page, q: text, ...filters }, false)
    }
    if (text === '') {
      searchInputRef?.current?.clear()
      getPhotosHomeScreen({ page, ...filters },false)
    }
  }

  const clearSearch = () => {
    setSearch('')
    searchInputRef?.current?.clear()
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

  const handleOpenFiltersModal = () => {
    modalRef?.current?.present()
  }
  const handleCloseFiltersModal = () => {
    modalRef?.current?.close()
  }

  const applyFilters = () => {
    if (filters) {
      page = 1
      setImages([])
      let params = {
        page,
        ...filters
      }
      if (activeCategory) params.category = activeCategory
      if (search) params.q = search
      getPhotosHomeScreen(params, false)
    }
    console.log('apply filters')
    handleCloseFiltersModal()
  }

  const resetFilters = () => {
    if (filters) {
      page = 1
      setFilters(null)
      setImages([])
      let params: any = {
        page
      }
      if (activeCategory) params.category = activeCategory
      if (search) params.q = search
      getPhotosHomeScreen(params, false)
    }

    handleCloseFiltersModal()
  }

  const clearThisFilter = (filterName: any) => {
    let separatedFilters = { ...filters }
    delete separatedFilters[filterName]
    setFilters({ ...separatedFilters })
    page = 1
    setImages([])
    let params = {
      page,
      ...separatedFilters
    }
    if (activeCategory) params.category = activeCategory
    if (search) params.q = search
    getPhotosHomeScreen(params, false)
  }

  const handleScroll = (event: any) => {
    console.log('event scroll View')
    const contentHeight = event.nativeEvent.contentSize.height
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height
    const scrollOffset = event.nativeEvent.contentOffset.y
    const bottomPosition = contentHeight - scrollViewHeight

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true)
        console.log('reached the bottom of the ScrollView')
        ++page
        let params = {
          page,
          ...filters
        }
        if (activeCategory) params.category = activeCategory
        if (search) params.q = search
        getPhotosHomeScreen(params, true)
      }
    } else if (isEndReached) {
      setIsEndReached(false)
    }
  }

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true
    })
  }
  console.log('filters', filters)

  return (
    <View style={{ flex: 1, gap: 14, paddingTop: paddingTop }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.brandName}>Galleria</Text>
        </Pressable>
        <Pressable onPress={handleOpenFiltersModal}>
          <FontAwesome6
            name='bars-staggered'
            size={24}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={5}
        contentContainerStyle={{ gap: 14 }}
      >
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

        {/* filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === 'colors' ? (
                      <View
                        style={{
                          width: 30,
                          height: 20,
                          borderRadius: 7,
                          backgroundColor: filters[key]
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name='close'
                        size={24}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        )}

        {/* images masonry grid */}
        <View>{images.length > 0 && <ImageGrid images={images} navigation={navigation} />}</View>

        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size='large' />
        </View>
      </ScrollView>

      {/* filters modal */}
      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={handleCloseFiltersModal}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
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
  },
  filters: {
    gap: 10,
    paddingHorizontal: wp(4)
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  filterItemText: {
    fontSize: hp(1.9)
  },
  filterCloseIcon: {
    padding: 4,
    borderRadius: 7,
    backgroundColor: theme.colors.neutral(0.2)
  }
})
