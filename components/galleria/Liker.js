import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
 
function Liker({ total, red = false, bookmark = false }) {
  const [likeCount, setLikeCount] = useState(total);
  const [liked, setLiked] = useState(red);

  const toggleDisplay = () => {
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  // Styles object
  const styles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heartBg: {
      backgroundColor: liked ? 'rgba(255, 192, 200, 0.7)' : 'rgba(255, 192, 200, 0)',
      borderRadius: 50,
      height: 30,
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background 100ms ease',
      cursor: 'pointer',
    },
    heartIcon: {
      fontSize: 48,
      color: liked ? 'red' : 'grey',
    },
    likesAmount: {
      fontSize: 20,
      color: liked ? 'red' : '#888',
      fontWeight: '900',
      marginLeft: 6,
    },
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.heartBg} onPress={toggleDisplay}>
        {!bookmark ? (
          <FavoriteIcon style={styles.heartIcon} />
        ) : (
          <BookmarkIcon style={styles.heartIcon} />
        )}
      </TouchableOpacity>
      <Text style={styles.likesAmount}>{likeCount}</Text>
    </View>
  );
}

export default Liker;
