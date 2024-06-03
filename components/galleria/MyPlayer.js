import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';

export default function VideoScreen({ post }) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      video.current.pauseAsync();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: post,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(status)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: 400,
  },
});