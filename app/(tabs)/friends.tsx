import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { getUser_id } from '.././globals';
import placeholderImage from '../../assets/images/defaultPFP.jpg'; // Import default profile picture

export default function FriendsScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [followedUsers, setFollowedUsers] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const user_id = getUser_id();
        const url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/${user_id}/following`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFollowedUsers(data);
      } catch (error) {
        console.error('Error fetching followed users:', error);
        setErrorVisible(true);
      }
    };

    fetchFollowedUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      {errorVisible && <Text style={styles.error}>Error fetching followed users</Text>}
      <ScrollView style={styles.friendsList}>
        {followedUsers.map(user => (
          <View key={user.user_id} style={styles.userContainer}>
            <Image
              source={user.profile_picture ? { uri: user.profile_picture } : placeholderImage}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{user.userName}</Text>
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: '#fc3a3d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
