import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, Text, View, TouchableOpacity } from 'react-native';
import { getUser_id } from '.././globals';
import placeholderImage from '.././assets/adaptive-icon.png';


const url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/${getUser_id()}/following`;

export default function FriendsScreen() {
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Ensure that following is always an array
        const updatedData = data.map(user => ({
          ...user,
          following: Array.isArray(user.following) ? user.following : [user.following]
        }));
        setFollowingList(updatedData);
      })
      .catch(error => {
        console.error('Error fetching following list:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <ScrollView style={styles.friendsList}>
        {followingList.map(user => (
          <View key={user.user_id}>
            <Text style={styles.userName}>{user.userName}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {user.following.map(followedUser => (
              // Check if followedUser is defined
              followedUser && (
                <TouchableOpacity key={followedUser.user_id} style={styles.friendItem}>
                  <Image
                    style={styles.profileImage}
                    source={{ uri: followedUser.profile_picture || placeholderImage }}
                  />
                  <Text style={styles.friendName}>{followedUser.userName}</Text>
                </TouchableOpacity>
              )
            ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendsList: {
    flexGrow: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
