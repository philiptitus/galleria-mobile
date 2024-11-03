import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, createLike, createBookmark, updatePost } from '@/server/actions/postActions';
import { Modal, PaperProvider, ActivityIndicator, Snackbar, Portal } from 'react-native-paper';

const PostActions = ({ currentuseremail, posteremail, likers, bookers, comments, id, showModal, post }) => {
  // State to manage the active state of each icon
  const [commentActive, setCommentActive] = useState(false);
  const [likeActive, setLikeActive] = useState(false);
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [caption, setCaption] = useState(post?.caption);
  const [description, setDescription] = useState(post?.description);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState(''); // 'success' or 'error'

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const postUpdate = useSelector((state) => state.postUpdate);
  const { loading, error, success } = postUpdate;

  const handleLongPress = () => {
    console.log('Long Press', 'You have triggered a long press action!');
  };

  // Function to handle icon click for comment
  const handleCommentClick = () => {
    showModal();
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
    dispatch(deletePost(id));
    navigation.navigate('Profile');
  };

  useEffect(() => {
    if (Array.isArray(likers)) {
      setLikeActive(likers.some(liker => liker.liker_name === currentuseremail));
    } else {
      setLikeActive(false);
    }
  }, [currentuseremail, likers]);

  const handleLongPress2 = () => {
    if (posteremail === currentuseremail) {
      navigation.navigate('Bookmarks', { postId: id });
    }
  };

  useEffect(() => {
    if (Array.isArray(bookers)) {
      setBookmarkActive(bookers.some(booker => booker.booker_name === currentuseremail));
    } else {
      setBookmarkActive(false);
    }
  }, [currentuseremail, bookers]);

  useEffect(() => {
    if (Array.isArray(comments)) {
      setCommentActive(comments.some(commenter => commenter.comment_email === currentuseremail));
    } else {
      setCommentActive(false);
    }
  }, [currentuseremail, comments]);

  const handleUpdatePost = () => {
    dispatch(updatePost({
      id,
      caption,
      description,
    }));
  };

  useEffect(() => {
    if (success) {
      setSnackbarVisible(true);
      setSnackbarMessage('Your post was edited successfully');
      setSnackbarType('success');
      setEditVisible(false);
    } else if (error) {
      setSnackbarVisible(true);
      setSnackbarMessage(error);
      setSnackbarType('error');
    }
  }, [success, error]);

  return (
    <View>
      <PaperProvider>
        <View>
          <Portal>
            <Modal
              visible={editVisible}
              onDismiss={() => setEditVisible(false)}
              contentContainerStyle={styles.modal}
            >
              <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="red" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Caption"
                value={caption}
                onChangeText={setCaption}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />
              {loading ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Button title="Update" onPress={handleUpdatePost} />
              )}
            </Modal>
          </Portal>
        </View>

        <View style={styles.iconRow}>
          {/* Comment Icon */}
          <TouchableOpacity
            onLongPress={() => navigation.navigate('Comments', { postId: id })}
            onPress={() => navigation.navigate('Comments', { postId: id })}
            style={styles.icon}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={commentActive ? 'red' : 'white'} />
          </TouchableOpacity>

          {/* Like Icon */}
          <TouchableOpacity
            onLongPress={() => navigation.navigate('Likes', { postId: id })}
            onPress={handleLikeClick}
            style={styles.icon}
          >
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

          {currentuseremail === posteremail && (
            <>
              {/* Delete Icon */}
              <TouchableOpacity onPress={handleDelete} style={styles.icon}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>

              {/* Edit Icon */}
              <TouchableOpacity onPress={() => setEditVisible(true)} style={styles.icon}>
                <Ionicons name="pencil" size={24} color="red" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1000}
          style={snackbarType === 'success' ? styles.successSnackbar : styles.errorSnackbar}
        >
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </Snackbar>
      </PaperProvider>
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
    borderRadius: 10,
    elevation: 20,
    flexGrow: 1, // Allow the modal to grow as needed
    minHeight: 180, // Ensure a minimum height
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  successSnackbar: {
    backgroundColor: 'green',
  },
  errorSnackbar: {
    backgroundColor: 'red',
  },
  snackbarText: {
    color: 'white',
  },
});

export default PostActions;
