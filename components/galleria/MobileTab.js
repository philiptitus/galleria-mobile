import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MobileTab = ({ id, showBookmark = false, showRequests = false, showLike = false, showDelete = false }) => {
  const navigation = useNavigation();
  const screenWidth2 = Dimensions.get('window').width;

  const handleTabPress = (navigateTo, params) => {
    navigation.navigate(navigateTo, params);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.tab, { backgroundColor: 'purple', width: screenWidth2 / 2 - 20 }]}
            onPress={() => navigation.navigate('Albums', { id: id })}
          >
            <Ionicons name="images" size={30} color="white" />
            <Text style={styles.tabText}>Album</Text>
          </TouchableOpacity>

          {showLike && (
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: 'red', width: screenWidth2 / 2 - 20 }]}
              onPress={() => navigation.navigate('Like', { id: id })}
            >
              <Ionicons name="heart" size={30} color="white" />
              <Text style={styles.tabText}>Likes</Text>
            </TouchableOpacity>
          )}

          {showBookmark && (
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: 'blue', width: screenWidth2 / 2 - 20 }]}
              onPress={() => navigation.navigate('Bookmark', { id: id })}
            >
              <Ionicons name="bookmark" size={30} color="white" />
              <Text style={styles.tabText}>Bookmarks</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.tab, { backgroundColor: 'green', width: screenWidth2 / 2 - 20 }]}
            onPress={() => navigation.navigate('Comment', { id: id, deleteid: showDelete })}
          >
            <Ionicons name="chatbubbles" size={30} color="white" />
            <Text style={styles.tabText}>Comments</Text>
          </TouchableOpacity>

          {showRequests && (
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: 'orange', width: screenWidth2 / 2 - 20 }]}
              onPress={() => navigation.navigate('Requests')}
            >
              <Ionicons name="person-add" size={30} color="white" />
              <Text style={styles.tabText}>Requests</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Ensure space at the bottom
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 1,
    paddingVertical: 50,
    borderRadius: 10,
    flexBasis: '48%', // Ensures two columns with space between
  },
  tabText: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default MobileTab;
