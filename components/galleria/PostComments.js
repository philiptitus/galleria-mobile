import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Text, Image } from "react-native";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRoute } from '@react-navigation/native';
import API_URL from "@/server/constants/URL";
import AddComment from "@/components/galleria/Comment"
import { listPostDetails, deleteComment } from "@/server/actions/postActions";

interface ListProps {
  avatar: boolean;
  postId: string;
  user: string;
  total: number;
  showLike?: boolean;
  showBookmark?: boolean;
  showComment?: boolean;
}

const Comments = () => {
  const postDetails = useSelector((state) => state.postDetails);
  const { post, loading, error, success: successPost } = postDetails;
  const [page, setPage] = useState(1);
  const route = useRoute();
  const [commentActive, setCommentActive] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const { postId } = route.params;

  const postCommentCreate = useSelector((state) => state.postCommentCreate);
  const { success: successCreate } = postCommentCreate;

  const postDelete = useSelector((state) => state.postDelete);
  const { success, error: errorDelete , loading:loadingDelete} = postDelete;

  useEffect(() => {
    if (!userInfo && isFocused) {
      navigation.navigate('Login');
    }
  }, [userInfo, isFocused, navigation]);


  useEffect(() => {
    if (userInfo) {
      dispatch(listPostDetails(postId));
    }
  }, [dispatch, postId, success, successCreate, userInfo]);

  const dynamicData = post && post.comments ? post.comments.map((comment) => ({
    id: comment.user,
    _id: comment.id,
    text: comment.message,
    imageUrl: comment.comment_avi,
    emailer: comment.comment_email,
  })) : [];





  const deleteCommentHandler = (postId) => {
    dispatch(deleteComment(postId));
    console.log("I am being triggered with this did " + postId)

  };

  console.log(errorDelete)




  
  useEffect(() => {
    if (Array.isArray(dynamicData)) {
      setCommentActive(dynamicData.some(commenter => commenter.emailer === userInfo.email));
    } else {
      setCommentActive(false);
    }
    
    // Log a message when the component is loaded

  }, [userInfo, dynamicData]);



  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Other', { userId: item.id })}>
        <Image source={{ uri: API_URL + item.imageUrl }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text2}>{item.emailer}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
      {userInfo.id === post.user && (
  loading ? (
    <ActivityIndicator color="red" />
  ) : (
    <View>
    <Ionicons 
      // onPress={() => deleteCommentHandler(item.id)}
      name="trash" 
      size={24} 
      color="red" 
      style={{ marginLeft: 8 }} 
    />
    <Text style={{ color:"red" }}> Coming soon</Text>
    </View>
  )
)}

    </View>
  );

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator color="red" />
      ) : (
        <View>
          {!commentActive &&
          <View>
          <AddComment postID={postId}/>

            </View>
             }
          <Text style={styles.text}>Total Comments: {post?.total_comments}</Text>
          <FlatList
            data={dynamicData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && <ActivityIndicator color='red' />}
          />
        </View>
      )}
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "black"
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  text2: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});
