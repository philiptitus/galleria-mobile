import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, Linking, TouchableOpacity , StyleSheet, Image, ActivityIndicator, Alert, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updatePost } from '@/server/actions/postActions';
import { POST_UPDATE_RESET } from '@/server/constants/postConstants';
import * as ImagePicker from 'expo-image-picker'; // Assuming Expo is used for React Native development
import API_URL from '@/server/constants/URL';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const VideoUpload = ({ onChange }) => {
  const handleButtonClick = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
      console.log('Selected file:', file); // Debugging log
      if (!file.canceled) {
        const fileUri = file.assets[0].uri;
        console.log('Calling onChange with URI:', fileUri); // Debugging log
        onChange(fileUri); // Pass the URI to onChange
      }
    } catch (error) {
      console.log('Error selecting video:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleButtonClick} style={{ alignItems: 'center' }}>
        <Ionicons name="cloud-upload" size={30} color="green" />
        <Text style={{ color: 'green' }}>Upload Video and Finish</Text>
      </TouchableOpacity>
    </View>
  );
};



const FilesUpload = ({ onChange }) => {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleButtonClick = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,

      allowsMultipleSelection: true, // Allow multiple selection

    };

    const result = await ImagePicker.launchImageLibraryAsync(options);
    console.log('Image Picker Result:', result);

    if (!result.cancelled) {
      const uris = result.assets.map(asset => asset.uri); // Access the URIs from the assets array
      console.log('Image URIs:', uris);
      onChange(uris);
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleButtonClick} style={{ alignItems: 'center' }}>
        <Ionicons name="cloud-upload" size={30} color="green" />
        <Text style={{ color: 'green' }}>Select Image(s) and Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const BasicTextFields = ({ id }) => {
  const buttonRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [album, setAlbum] = useState([]);
  const [uploading, setUploading] = useState(false);
  const postUpdate = useSelector((state) => state.postUpdate);
  const { success } = postUpdate;
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // Current step
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const screenheight = Dimensions.get('window').height;
  const screenWidth2 = Dimensions.get('window').width;



  // const { id } = useParams();

  useEffect(() => {
    if (success) {
      dispatch({ type: POST_UPDATE_RESET });
    }
  }, [dispatch, navigation, success]);

  const uploadFileHandler = async (uris) => {
    const formData = new FormData();
    uris.forEach((uri, index) => {
        formData.append('albums', {
            uri: uri,
            name: `photo_${index}.jpg`,
            type: 'image/jpeg',
        });
    });
    formData.append('post_id', id);

    setAlbum(uris);
    setUploading(true);

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo?.token}`,
            },
        };

        const { data } = await axios.post(`${API_URL}/api/posts/uploads/`, formData, config);
        showSnackbar("Post Created", 'success');
        navigation.navigate('Post', { postId: id })
        setUploading(false);
        setAlbum(Array.from(uris).map((uri) => URL.createObjectURL(uri)));
        setStep(step + 1); // Move to the next step after uploading

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
        showSnackbar(errorMessage, 'error');
        console.log(errorMessage);
        setUploading(false);
    }
};

useEffect(() => {
    if (album && buttonRef.current) {
        buttonRef.current.click();
    }
}, [album]);



  const showSnackbar = () => setVisible(true);
  const hideSnackbar = () => setVisible(false);



  const submitPost = () => {
    dispatch(
      updatePost({
        id: id,
        caption: caption,
        description: description,
        albums: album,
      })
    );
    setStep(step + 1)
  };

return(
  

  <View style={{ 
    width: screenWidth2,
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#121212' }}>
  <View style={{ width: '100%', backgroundColor: '#1e1e1e', padding: 20, borderRadius: 10 }}>
    {step === 1 && (
      <>
        <TextInput
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: 10,
            marginBottom: 15,
            borderRadius: 5,
            fontSize: 16,
          }}
          placeholderTextColor="white"
          multiline
          placeholder="Caption (Optional)"
          value={caption}
          onChangeText={(text) => setCaption(text)}
        />
        <TextInput
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: 10,
            marginBottom: 15,
            borderRadius: 5,
            fontSize: 16,
            width: '100%',
            height: 100,
            textAlignVertical: 'top',
          }}
          placeholder="Description (Optional)"
          placeholderTextColor="white"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={() => submitPost()}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Next</Text>
        </TouchableOpacity>
      </>
    )}
    {step === 2 && (
      <>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 15 }}>
          Upload some Images To Finish Making Your Post
        </Text>
        <FilesUpload onChange={uploadFileHandler} />
        {uploading && <ActivityIndicator size="small" color="red" />}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              flex: 1,
              marginRight: 10,
            }}
            onPress={() => setStep(step - 1)}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 15,
              borderRadius: 5,
              alignItems: 'center',
              flex: 1,
              marginRight: 10,
            }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Discard Post</Text>
          </TouchableOpacity>

        </View>
      </>
    )}
  </View>
</View>
)











  // Rest of the code remains the same
};

const BasicVideoFields = ({ id }) => {
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [uploading, setUploading] = useState(false);
  const postUpdate = useSelector((state) => state.postUpdate);
  const { success } = postUpdate;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [stepper, setStepper] = useState(1);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const screenWidth2 = Dimensions.get('window').width;

  useEffect(() => {
    if (success) {
      dispatch({ type: POST_UPDATE_RESET });
    }
  }, [dispatch, navigation, success]);

  const uploadVideoHandler = async (fileUri) => {
    console.log('uploadVideoHandler called with URI:', fileUri); // Debugging log
    const formData = new FormData();
    formData.append('video', {
      uri: fileUri,
      name: 'video.mp4',
      type: 'video/mp4',
    });
    formData.append('post_id', id);

    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/api/posts/videos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      setVideo(fileUri);
      setUploading(false);
      setStepper(3); // Move to the next step after uploading
      navigation.navigate('Post', { postId: id });
    } catch (error) {
      setUploading(false);
      console.error('Error uploading video:', error);
    }
  };

  const submitPost = () => {
    dispatch(
      updatePost({
        id: id,
        caption: caption,
        description: description,
        video: video,
      })
    );
    setStepper(stepper + 1);
  };

  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#121212' , width: screenWidth2}}>
      <View style={{ width: '100%', backgroundColor: '#1e1e1e', padding: 20, borderRadius: 10 }}>
        {stepper === 1 && (
          <>
            <TextInput
              style={{
                backgroundColor: '#333',
                color: 'white',
                padding: 10,
                marginBottom: 15,
                borderRadius: 5,
                fontSize: 16,
                width: '100%',
              }}
              placeholderTextColor="white"
              multiline
              placeholder="Caption (Optional)"
              value={caption}
              onChangeText={(text) => setCaption(text)}
            />
            <TextInput
              style={{
                backgroundColor: '#333',
                color: 'white',
                padding: 10,
                marginBottom: 15,
                borderRadius: 5,
                fontSize: 16,
                width: '100%',
                height: 100,
                textAlignVertical: 'top',
              }}
              placeholder="Description (Optional)"
              placeholderTextColor="white"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={submitPost}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {stepper === 2 && (
          <>
            <Text style={{ color: 'white', textAlign: 'center', marginBottom: 15 }}>
              Upload A Video To Finish Making Your Post
            </Text>
            <VideoUpload onChange={uploadVideoHandler} />
            {uploading && <ActivityIndicator size="small" color="red" />}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'gray',
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 10,
                }}
                onPress={() => setStepper(stepper - 1)}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 10,
                }}
                onPress={() => navigation.navigate('Profile')}
                >
                <Text style={{ color: 'white', fontSize: 16 }}>Discard Post</Text>
              </TouchableOpacity>

            </View>
          </>
        )}
      </View>
    </View>
  );
};


const NewPost = () => {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const [postType, setPostType] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { newId } = route.params;

  const handlePostTypeSelect = (type) => {
    setPostType(type);
  };

  const handlePrevious = () => {
    setPostType(null); // Reset postType to allow selecting again
  };

  // useEffect(() => {
  //   if (!userInfo) {
  //     const intervalId = setInterval(() => {
  //       navigation.navigate('Login');
  //     }, 500); // Reduced interval time to 500 milliseconds
  
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo, navigation]);

  return (

    <View style={styles.container}>
      <Text style={styles.header}>Make A New Post</Text>
      <View style={styles.content}>
        {postType === null && (
          <View style={styles.postTypeSelector}>
            <Text style={styles.text}>What post would you like to make?</Text>
            <TouchableOpacity style={styles.button} onPress={() => handlePostTypeSelect('normal')}>
              <Text style={styles.buttonText}>Normal Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePostTypeSelect('slice')}>
              <Text style={styles.buttonText}>Slice / Video Post</Text>
            </TouchableOpacity>
          </View>
        )}
        {postType === 'normal' && (
          <View style={styles.normalPostUpload}>
            <BasicTextFields id={newId}/>
            {/* Normal post upload fields */}
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Post Type</Text>
            </TouchableOpacity>
          </View>
        )}
        {postType === 'slice' && (
          <View style={styles.slicePostUpload}>
            <BasicVideoFields id={newId} />
            {/* Slice/Video post upload fields */}
            <TouchableOpacity style={styles.button} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Post Type</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    backgroundColor:"black"

  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    color:"red"
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  postTypeSelector: {
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    color:"white"
  },
  normalPostUpload: {
    alignItems: 'center',
  },
  slicePostUpload: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, // Add some space between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  
  input: {
    padding: 10,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    color: "white"

  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:"white"
  },
});

export default NewPost;
