import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import API_URL from '@/server/constants/URL'
import { deleteComment } from '@/server/actions/postActions';

function Comment({ showDelete = false }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const screenWidth2 = Dimensions.get('window').width;
  const route = useRoute();
  const { id } = route.params;
  const [refreshing, setRefreshing] = useState(false); // Add this state


  const { deleteid } = route.params;


  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const postDelete = useSelector((state) => state.postDelete);
  const { success, error: errorDelete } = postDelete;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const deleteCommentHandler = async (postId) => {
    dispatch(deleteComment(postId));
    showSnackbar("Comment Deleted", 'success');
  };

  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible(true);
  };

  const onDismissSnackBar = () => setVisible(false);


  const handleRefresh = async () => {
    setRefreshing(true); // Start the refreshing animation
    setPage(1); // Reset page to 1 before fetching new data
    setComments([]); // Clear current posts to avoid duplicates

    await fetchData();

    setRefreshing(false); // Stop the refreshing animation
  };

  useEffect(() => {



    if (success) {
      showSnackbar("Comment Deleted", 'success');
      handleRefresh()


    }
  }, [dispatch, success, fetchData]);


  const fetchData = async () => {
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    setLoading(true);
    const response = await axios.get(`${API_URL}/api/posts/${id}/comments/?page=${page}`, config);
    setComments((prevComments) => [...prevComments, ...response.data.results]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, success]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.commentContainer, { width: screenWidth2 }]}>
      <View style={styles.userInfo}>
        <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
        {deleteid && (
          <TouchableOpacity onPress={() => deleteCommentHandler(item.id)} style={styles.deleteButton}>
            <Ionicons name="trash-bin-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Post', { postId: item.post })}>
        <Text style={styles.commentText}>{item.message}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComments = () => (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={() => (loading ? <ActivityIndicator size="small" color="red" /> : null)}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );

  return (
    <View style={styles.container}>
      {comments && comments.length > 0 ? renderComments() : comments && comments.length === 0 && loading ? <ActivityIndicator size="small" color="green" />  : <Text style={styles.noCommentsText}>No comments yet... Explore</Text>}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 5,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentText: {
    color: 'white',
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  noCommentsText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Comment;
