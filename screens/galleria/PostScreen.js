import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import Post from '@/components/galleria/Post';
import { listPostDetails } from '@/server/actions/postActions';

const PostScreen = () => {
  const route = useRoute();
  const { postId } = route.params;

  const postDelete = useSelector((state) => state.postDelete);
  const { success } = postDelete;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;

  const postDetails = useSelector((state) => state.postDetails);
  const { error, loading, post: item, success: successPost } = postDetails;

  const dispatch = useDispatch();

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(listPostDetails(postId));
    }
  }, [dispatch, postId, success, successCreate, userInfo]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.postContainer}>
            <Post
              date={formatTimestamp(item?.created_date)}
              user={item?.user}
              caption={item?.caption}
              description={item?.description}
              total_likes={item?.total_likes}
              total_bookmarks={item?.total_bookmarks}
              total_comments={successCreate ? item?.total_comments + 1 : item?.total_comments}
              avi={item?.user_avi}
              name={item?.user_name}
              id={item?.id}
              likers={item?.likers}
              bookers={item?.bookers}
              comments={item?.comments}
              currentUserEmail={userInfo?.email}
              poster={item}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  scrollView: {
    flexGrow: 1,
  },
  postContainer: {
    flex: 1,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default PostScreen;
