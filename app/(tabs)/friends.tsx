import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { getUser_id } from '.././globals';
import placeholderImage from '../../assets/images/defaultPFP.jpg'; // Import default profile picture

// Modal Component for User Account
const UserModal = ({ visible, user, onClose, onFollow, onUnfollow }) => {
  if (!visible || !user) return null;

  const handleFollow = async () => {
    try {
      const user_id = getUser_id();
      const response = await fetch(`https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/follow?from=${user_id}&to=${user.user_id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
      // Update followed users list with user ID
      onFollow(user.user_id);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      const user_id = getUser_id();
      const response = await fetch(`https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/unfollow?from=${user_id}&to=${user.user_id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
      // Update followed users list by filtering out the user ID
      onUnfollow(user.user_id);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Image
            source={user.profile_picture ? { uri: user.profile_picture } : placeholderImage}
            style={styles.modalProfileImage}
          />
          <Text style={styles.modalUserName}>{user.userName}</Text>

          {/* Follow/Unfollow buttons */}
          {user.following ? (
            <TouchableOpacity onPress={handleUnfollow} style={styles.button}>
              <Text style={styles.buttonText}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleFollow} style={styles.button}>
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default function FriendsScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [followedUsers, setFollowedUsers] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user for modal
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    const fetchAllUsers = async () => {
      try {
        const url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setErrorVisible(true);
      }
    };

    fetchFollowedUsers();
    fetchAllUsers();
  }, []);

  // Filter users not followed
  // Filter users not followed and not the signed-in user
  const notFollowedUsers = allUsers.filter(user => !followedUsers.some(followedUser => followedUser.user_id === user.user_id && user.user_id !== getUser_id));

  // Filter users based on search text
  const filteredFollowedUsers = followedUsers.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredNotFollowedUsers = notFollowedUsers.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show user modal
  const showUserModal = user => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Hide user modal
  const hideUserModal = () => {
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      {errorVisible && <Text style={styles.error}>Error fetching users</Text>}
      
      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username"
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
      
      {/* Followed Users */}
      <ScrollView style={styles.friendsList}>
        <Text style={styles.subTitle}>Followed</Text>
        {filteredFollowedUsers.map(user => (
          <TouchableOpacity key={user.user_id} style={styles.friendContainer} onPress={() => showUserModal(user)}>
            <View style={styles.userContainer}>
              <Image
                source={user.profile_picture ? { uri: user.profile_picture } : placeholderImage}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{user.userName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Not Followed Users */}
      <ScrollView style={styles.friendsList}>
        <Text style={styles.subTitle}>Not Followed</Text>
        {filteredNotFollowedUsers.map(user => (
          <TouchableOpacity key={user.user_id} style={styles.friendContainer} onPress={() => showUserModal(user)}>
            <View style={styles.userContainer}>
              <Image
                source={user.profile_picture ? { uri: user.profile_picture } : placeholderImage}
                style={styles.profileImage}
              />
              <Text style={styles.userName}>{user.userName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <UserModal
        visible={isModalVisible}
        user={selectedUser}
        onClose={hideUserModal}
      />
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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendsList: {
    flexGrow: 1,
    width: '100%',
  },
  friendContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 100,
    borderRadius: 20, // Increase border radius
    alignItems: 'center',
    width: '80%', // Adjust width as needed
    alignSelf: 'center', // Center horizontally
    marginTop: '40%', // Adjust vertical margin as needed
  },
  modalProfileImage: {
    width: 150, // Adjust image size as needed
    height: 150, // Adjust image size as needed
    borderRadius: 75, // Adjust border radius to make it circular
    marginBottom: 20, // Add margin bottom for spacing
  },
  modalUserName: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: 'bold',
    textAlign: 'center', // Center text
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
