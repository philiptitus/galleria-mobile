import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '@/server/actions/postActions';
import { createLike, createBookmark } from '@/server/actions/postActions';
import { Modal, PaperProvider } from 'react-native-paper';


const PostActions = ({currentuseremail, posteremail ,likers, bookers, comments,id, showModal}) => {
  // State to manage the active state of each icon
  const [commentActive, setCommentActive] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [visible, setVisible] = React.useState(false);

const navigation = useNavigation()
    const handleLongPress = () => {
      console.log('Long Press', 'You have triggered a long press action!');
    };


const dispatch = useDispatch()
  // Function to handle icon click for comment
  const handleCommentClick = () => {
    showModal
  };

  // Function to handle icon click for like
  const handleLikeClick = () => {
    setLikeActive(!likeActive); // Toggle like active state
    dispatch(createLike(id));

};

  // Function to handle icon click for bookmark
  const handleBookmarkClick = () => {
    setBookmarkActive(!bookmarkActive); // Toggle bookmark active state
    dispatch(createBookmark(id));

};


const handleDelete = () => {
dispatch(deletePost(id))
navigation.navigate('Profile')
};




  useEffect(() => {
    if (Array.isArray(likers)) {
      setLikeActive(likers.some(liker => liker.liker_name === currentuseremail));
    } else {
      setLikeActive(false);
    }
    
    // Log a message when the component is loaded

  }, [currentuseremail, likers]);

  const handleLongPress2 = () => {
    if (posteremail === currentuseremail) {
      navigation.navigate('Bookmarks', { postId: id });
    }
  };


  useEffect(() => {
    if (Array.isArray(likers)) {
      setBookmarkActive(bookers.some(booker => booker.booker_name === currentuseremail));
    } else {
      setBookmarkActive(false);
    }
    
    // Log a message when the component is loaded

  }, [currentuseremail, bookers]);


  useEffect(() => {
    if (Array.isArray(comments)) {
      setCommentActive(comments.some(commenter => commenter.comment_email === currentuseremail));
    } else {
      setCommentActive(false);
    }
    
    // Log a message when the component is loaded

  }, [currentuseremail, comments]);

  return (
    <View>


 









    <View style={styles.iconRow}>
      {/* Comment Icon */}
      <TouchableOpacity
      
      onLongPress={() => navigation.navigate('Comments', { postId: id})}
      onPress={() => navigation.navigate('Comments', { postId: id}) } style={styles.icon}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={commentActive ? 'red' : 'white'} />
      </TouchableOpacity>
      
      {/* Like Icon */}
      <TouchableOpacity 
      onLongPress={() => navigation.navigate('Likes', { postId: id})}
      onPress={handleLikeClick} style={styles.icon}>
        <Ionicons name="heart-outline" size={24} color={likeActive ? 'red' : 'white'} />
      </TouchableOpacity>
      
      {/* Bookmark Icon */}
      <TouchableOpacity
  onPress={handleBookmarkClick}
  onLongPress={currentuseremail === posteremail ? handleLongPress2 : undefined}
  style={styles.icon}
>
  <Ionicons name="bookmark-outline" size={24} color={bookmarkActive ? 'red' : 'white'} />
</TouchableOpacity>

      
            {currentuseremail === posteremail && 
      <TouchableOpacity

      onPress={handleDelete} style={styles.icon}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
      }
    </View>


    </View>

  );
};

const styles = StyleSheet.create({
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10, // Add margin if needed
  },
  icon: {
    marginRight: 10,
    // Add margin between icons if needed
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'left',
    alignItems: 'left',
  },
});

export default PostActions;
