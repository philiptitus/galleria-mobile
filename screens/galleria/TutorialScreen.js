import React from 'react';
import { Image, StyleSheet, View, Text, Alert, Linking } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Simple = () => {
  const navigation = useNavigation();

  const handleOpenLink = () => {
    Linking.openURL('https://mrphilip.pythonanywhere.com/contact/')
      .catch((err) => Alert.alert('Failed to open link', err.message));
  };

  return (
    <Onboarding
      onDone={() => navigation.navigate('Galleria')}
      onSkip={() => navigation.navigate('Galleria')}
      containerStyles={styles.container}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      imageContainerStyles={styles.imageContainer}
      pages={[
        {
          backgroundColor: '#4CAF50',
          image: <LottieView source={require('../../assets/animation/one.json')} autoPlay loop style={styles.lottie} />,
          title: 'Hi ,Welcome to Galleria-Mobile Version',
          subtitle: 'First Time Using The App Dont Worry We Will Take You Through',
        },
        {
          backgroundColor: '#2196F3',
          image: <LottieView source={require('../../assets/animation/two.json')} autoPlay loop style={styles.lottie} />,
          title: 'Post Interactions',
          subtitle: 'Simply Click A Post Action icon to do things such as liking and commenting, Long Press To View More Information Such As Like Counts and who liked.',
        },
        {
          backgroundColor: '#FF9800',
          image: <LottieView source={require('../../assets/animation/swipe15.json')} autoPlay loop style={styles.lottie} />,
          title: 'Drawer Options',
          subtitle: 'Swiping From Your Left Or Clicking The top Camera Icon Will Show You Your Notifications, Chat And Main Feed. You Can also logout from there and click on your profile picture to view your profile. Feel Free To Refesh your feed by pulling down on top of the list to load the newest posts',
        },
        {
          backgroundColor: '#9C27B0',
          image: <LottieView source={require('../../assets/animation/four.json')} autoPlay loop style={styles.lottie} />,
          title: 'Bottom Tab Options',
          subtitle: "Once You Are Done with this tutorial you will see a tab on the bottom of the screen.Home tab Icon -> Main Feed,   Video Icon -> Slices/Videos ,   Photo Gallery Icon  -> Exploring More Posts,   Search  Icon -> Search for Other Users",
        },
        {
          backgroundColor: '#3F51B5',
          image: <LottieView source={require('../../assets/animation/share.json')} autoPlay loop style={styles.lottie} />,
          title: 'Share Your Post Idea With Others',
          subtitle: 'Ready To make your First Post in The app.. Click on the  + icon on your profile',
        },
        {
          backgroundColor: '#009688',
          image: <LottieView source={require('../../assets/animation/feed.json')} autoPlay loop style={styles.lottie} />,
          title: 'Any More Questions Or Feedback',
          subtitle: (
            <Text onPress={handleOpenLink} style={styles.link}>
              Click here to contact us
            </Text>
          ),
        },
        {
          backgroundColor: '#FF5722',
          image: <LottieView source={require('../../assets/animation/nine.json')} autoPlay loop style={styles.lottie} />,
          title: 'One Last Thing',
          subtitle: 'Enjoy The App!',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  link: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Simple;
