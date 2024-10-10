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
    imgPath:  album.album,
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










// import React, { useState, useMemo } from "react";
// import { View, Dimensions, TouchableOpacity, StyleSheet, PixelRatio } from 'react-native';
// import Animated, { useAnimatedScrollHandler, useSharedValue, useDerivedValue } from 'react-native-reanimated';
// import { Image } from 'expo-image';
// import API_URL from '@/server/constants/URL';
// import PropTypes from "prop-types";

// const extractHostname = (url) => {
//   let hostname;
//   if (url.indexOf("//") > -1) {
//     hostname = url.split('/')[2];
//   } else {
//     hostname = url.split('/')[0];
//   }
//   hostname = hostname.split(':')[0];
//   hostname = hostname.split('?')[0];
//   return hostname;
// };

// const GumletScaledImage = ({ style, source, ...restProps }) => {
//   const flattenedStyles = useMemo(() => StyleSheet.flatten(style), [style]);

//   if (typeof flattenedStyles.width !== "number" && typeof flattenedStyles.height !== "number") {
//     throw new Error("GumletScaledImage requires either width or height");
//   }

//   const size = {
//     width: flattenedStyles.width || 200,
//     height: flattenedStyles.height || 200,
//   };

//   const gumletConfig = {
//     hosts: [{
//       current: "galleria.pythonanywhere.com",
//       gumlet: "galleria.gumlet.io"
//     }]
//   };

//   const matchedHost = gumletConfig.hosts.find(o => o.current === extractHostname(source.uri));
  
//   if (!matchedHost) {
//     throw new Error(`No matching host found for URL: ${source.uri}`);
//   }

//   let gumletSourceURL = source.uri.replace(matchedHost.current, matchedHost.gumlet);
//   if (gumletSourceURL.indexOf("?") !== -1) {
//     gumletSourceURL += `&width=${size.width}&dpr=${parseInt(PixelRatio.get())}`;
//   } else {
//     gumletSourceURL += `?width=${size.width}&dpr=${parseInt(PixelRatio.get())}`;
//   }

//   return <Image source={{ uri: gumletSourceURL }} style={[style, size]} {...restProps} />;
// };

// GumletScaledImage.propTypes = {
//   source: PropTypes.object.isRequired,
//   style: PropTypes.object
// };

// GumletScaledImage.defaultProps = {
//   style: {}
// };

// const { width: screenWidth } = Dimensions.get('window');

// const MyCarousel = ({ post }) => {
//   const scrollX = useSharedValue(0);
//   const scrollViewRef = React.useRef();

//   const images = post && post.albums ? post.albums.map(album => ({
//     label: album.id,
//     imgPath: API_URL + album.album,
//   })) : [];

//   const scrollHandler = useAnimatedScrollHandler(event => {
//     scrollX.value = event.contentOffset.x;
//   });

//   const navigateToIndex = (index) => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
//     }
//   };

//   const currentIndex = useDerivedValue(() => Math.round(scrollX.value / screenWidth), [scrollX]);

//   return (
//     <View style={styles.container}>
//       <Animated.ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//         decelerationRate="fast"
//         snapToInterval={screenWidth}
//         snapToAlignment="center"
//         contentContainerStyle={{ alignItems: 'center' }}
//       >
//         {images.map((image, index) => (
//           <View key={index} style={styles.imageContainer}>
//             <GumletScaledImage
//               style={styles.image}
//               source={{ uri: image.imgPath }}
//             />
//           </View>
//         ))}
//       </Animated.ScrollView>

//       {images.length > 1 && (
//         <View style={styles.indicatorContainer}>
//           {images.map((_, index) => (
//             <TouchableOpacity key={index} onPress={() => navigateToIndex(index)}>
//               <Animated.View style={[
//                 styles.indicator,
//                 {
//                   backgroundColor: currentIndex.value === index ? 'red' : '#ccc'
//                 }
//               ]} />
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// MyCarousel.propTypes = {
//   post: PropTypes.object.isRequired
// };

// export default MyCarousel;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     width: screenWidth,
//     height: 500,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 494,
//     height: "100%",
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   indicator: {
//     width: 8,
//     height: 8,
//     marginHorizontal: 5,
//     borderRadius: 4,
//   },
// });

