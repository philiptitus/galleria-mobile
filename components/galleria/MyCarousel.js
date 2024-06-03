import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import API_URL from '@/server/constants/URL';

const { width: screenWidth } = Dimensions.get('window');

const MyCarousel = ({ post }) => {
  const scrollX = useSharedValue(0);
  const scrollViewRef = React.useRef();

  const images = post && post.albums ? post.albums.map(album => ({
    label: album.id,
    imgPath: API_URL + album.album,
  })) : [];

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  const navigateToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
    }
  };

  const currentIndex = useDerivedValue(() => Math.round(scrollX.value / screenWidth), [scrollX]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="center"
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: image.imgPath }}
              contentFit="contain"
              resizeMode="contain"
              transition={1000}
            />
          </View>
        ))}
      </Animated.ScrollView>

      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          {images.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => navigateToIndex(index)}>
              <Animated.View style={[
                styles.indicator, 
                {
                  backgroundColor: currentIndex.value === index ? 'red' : '#ccc'
                }
              ]} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default MyCarousel;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: screenWidth,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    marginHorizontal: 5,
    borderRadius: 4,
  },
});
