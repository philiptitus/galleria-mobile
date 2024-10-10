import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import VideoScreen from '@/components/galleria/MyPlayer';
import Carousel from '@/components/galleria/MyCarousel';

import API_URL from '@/server/constants/URL'
import PostActions from '@/components/galleria/PostActions';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { followUser, getUserDetails } from '@/server/actions/userAction';

import { Snackbar } from 'react-native-paper'; // Import Snackbar from react-native-paper


const MyPost = ({ date, caption, description, avi, name, id, currentUserEmail, likers, bookers, poster, comments }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigation = useNavigation();
  const userInfo = useSelector(state => state.userLogin.userInfo);
  const [visible2, setVisible2] = useState(false);
  const dispatch = useDispatch();
  const [follower, setFollower] = useState(true);
  const followUserState = useSelector((state) => state.userFollow) || {};
  const {
    error: errorFollow,
    success: successFollow,
  } = followUserState;
  const [isCurrentUserFollower, setIsCurrentUserFollower] = useState(false);

 
  const [snackbarMessage, setSnackbarMessage] = useState('');


  
  doubleTapRef = React.createRef();
  
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);




  const showSnackbar = (message, variant) => {
    setSnackbarMessage(message);
    setVisible2(true);
  };

  const onDismissSnackBar = () => setVisible2(false);






  const LeftContent = () => (
      <Image source={{ uri: avi }} style={{ width: 50, height: 50, borderRadius: 25 }} />
  );

  const handleExpandClick = () => setExpanded(!expanded);

  const handleDoubleTap = () => {
    console.log('I was double tapped');
  };

  return (
    <View style={styles.container}>
      
<Snackbar
        visible={visible2}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
      <PaperProvider>
        <Card style={styles.card}>
          <Card.Title
            titleStyle={{ color: 'white' }}
            subtitleStyle={{ color: 'red' }}
            title={name}
            subtitle={date}
            left={LeftContent}
          />

            <Card.Content>
              {poster?.isSlice ? (
                <View>
                  <VideoScreen post={ poster.video} />
                </View>
              ) : (
                <Carousel post={poster} />
              )}
            </Card.Content>

            
          <View>
            <Text style={styles.name}>{caption}</Text>
            <PostActions currentuseremail={currentUserEmail} likers={likers} bookers={bookers} comments={comments} showModal={showModal} id={id} posteremail={name} />
          </View>
          {description && (
            <View>
              <TouchableOpacity onPress={handleExpandClick} style={styles.expandButton}>
                <Ionicons name={expanded ? 'arrow-up' : 'arrow-down'} size={24} color="red" />
              </TouchableOpacity>
              {expanded && <Text style={styles.name}>{description}</Text>}
            </View>
          )}
        </Card>
        <Portal>
          <Modal style={styles.modal} backdropDismiss={false} visible={visible} onDismiss={hideModal}>
            <Text>Delete This Post</Text>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </Modal>
        </Portal>
      </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 1,
    backgroundColor: 'black',
    color: 'white',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    minHeight: 600,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default MyPost;
