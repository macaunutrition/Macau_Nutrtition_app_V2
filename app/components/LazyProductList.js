import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import ProductCard from './ProductCard';
import memoryManager from '../utils/memoryManager';

const { height: screenHeight } = Dimensions.get('window');
const ITEM_HEIGHT = 300; // Approximate item height
const BUFFER_SIZE = 5; // Number of items to render outside visible area

const LazyProductList = ({
  data,
  navigation,
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing = false,
  onRefresh,
  numColumns = 2,
  ...props
}) => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const flatListRef = useRef(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  });

  // Calculate how many items are visible on screen
  const visibleItemCount = Math.ceil(screenHeight / ITEM_HEIGHT) * numColumns + BUFFER_SIZE;

  // Handle viewability changes
  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const newVisibleItems = new Set();
    
    viewableItems.forEach(({ item, index }) => {
      newVisibleItems.add(index);
      // Track image usage for memory management
      if (item.image) {
        memoryManager.trackImageUsage(item.image);
      }
    });
    
    setVisibleItems(newVisibleItems);
  }, []);

  // Optimized render item
  const renderItem = useCallback(({ item, index }) => {
    const isVisible = visibleItems.has(index);
    
    // Only render images for visible items and a small buffer
    const shouldRenderImage = isVisible || 
      Array.from(visibleItems).some(visibleIndex => 
        Math.abs(visibleIndex - index) <= BUFFER_SIZE
      );

    return (
      <View style={{ 
        flex: 1, 
        margin: scale(5),
        opacity: shouldRenderImage ? 1 : 0.3 // Fade out non-visible items
      }}>
        <ProductCard
          item={item}
          navigation={navigation}
          cartItems={[]} // You might want to pass this from parent
          onImageLoad={() => {
            // Track successful image loads
            memoryManager.trackImageUsage(item.image);
          }}
          // Only load images for visible items
          loadImage={shouldRenderImage}
        />
      </View>
    );
  }, [visibleItems, navigation]);

  // Get item layout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * Math.floor(index / numColumns),
    index,
  }), [numColumns]);

  // Key extractor
  const keyExtractor = useCallback((item, index) => {
    return item.id ? item.id.toString() : index.toString();
  }, []);

  // Preload images for next batch
  const handleEndReached = useCallback(() => {
    if (onEndReached) {
      onEndReached();
      
      // Preload next batch of images
      const startIndex = data.length;
      const nextBatch = data.slice(startIndex, startIndex + 10);
      const imageUrls = nextBatch
        .filter(item => item.image)
        .map(item => item.image);
      
      if (imageUrls.length > 0) {
        memoryManager.preloadCriticalImages(imageUrls);
      }
    }
  }, [onEndReached, data]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshing={refreshing}
      onRefresh={onRefresh}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={visibleItemCount}
      initialNumToRender={visibleItemCount}
      windowSize={10}
      // Memory optimizations
      disableVirtualization={false}
      legacyImplementation={false}
      {...props}
    />
  );
};

export default LazyProductList;

