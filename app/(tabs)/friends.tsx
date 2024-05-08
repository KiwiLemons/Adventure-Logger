import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUser_id } from '.././globals';
import placeholderImage from '../../assets/images/defaultPFP.jpg';

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [followedUsers, setFollowedUsers] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('followed');
  const [user_id, setUser_id] = useState('');

  useEffect(() => {
    getUser_id().then((id) => {
      if (id !== null){
        setUser_id(id);
      }
    });

    const fetchFollowedUsers = async () => {
      try {
        const user_id = await getUser_id();
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

  const notFollowedUsers = allUsers.filter(user => !followedUsers.some(followedUser => followedUser.user_id === user.user_id && user.user_id !== user_id));
  const filteredFollowedUsers = followedUsers.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredNotFollowedUsers = notFollowedUsers.filter(user =>
    user.userName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFollow = (userId) => {
    setFollowedUsers([...followedUsers, userId]);
  };

  const handleUnfollow = (userId) => {
    setFollowedUsers(followedUsers.filter(id => id !== userId));
  };

  const showUserModal = user => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

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
      
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('followed')} style={[styles.tabButton, activeTab === 'followed' && styles.activeTab]}>
          <Text style={styles.tabText}>Followed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('unfollowed')} style={[styles.tabButton, activeTab === 'unfollowed' && styles.activeTab]}>
          <Text style={styles.tabText}>Not Followed</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'followed' && (
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
      )}

      {activeTab === 'unfollowed' && (
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
      )}

      <UserModal
        visible={isModalVisible}
        user={selectedUser}
        onClose={hideUserModal}
        setFollowedUsers={setFollowedUsers}
        followedUsers={followedUsers}
      />
    </View>
  );
};

// Modal Component for User Account
const UserModal = ({ visible, user, onClose, setFollowedUsers, followedUsers }) => {
  if (!visible || !user) return null;

  const [userRoutes, setUserRoutes] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const fetchUserRoutes = async () => {
      try {
        const response = await fetch(`https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/${user.user_id}/routes`);
        if (!response.ok) {
          throw new Error('Failed to fetch user routes');
        }
        const data = await response.json();
        setUserRoutes(data);
      } catch (error) {
        console.error('Error fetching user routes:', error);
      }
    };

    const checkIsFollowed = () => {
      setIsFollowed(followedUsers.some(followedUser => followedUser.user_id === user.user_id));
    };

    if (visible && user) {
      fetchUserRoutes();
      checkIsFollowed();
    }
  }, [visible, user, followedUsers]);

  // Follow/unfollow handlers
  const handleFollow = async () => {
    try {
      const user_id = await getUser_id();
      const url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/follow?from=${user_id}&to=${user.user_id}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
      // Update followed users list with user ID
      setFollowedUsers([...followedUsers, user]);
      setIsFollowed(true);
    } catch (error) {
      console.error('Error following user:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const user_id = await getUser_id();
      const url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/unfollow?from=${user_id}&to=${user.user_id}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
      // Update followed users list by filtering out the user ID
      setFollowedUsers(followedUsers.filter(followedUser => followedUser.user_id !== user.user_id));
      setIsFollowed(false);
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
          {isFollowed ? (
            <TouchableOpacity onPress={handleUnfollow} style={styles.unfollowButton}>
              <Text style={styles.buttonText}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
          )}

          {/* Display user routes or message */}
          {isFollowed ? (
            <ScrollView horizontal style={styles.routeContainer}>
              {userRoutes.map(route => (
                <View key={route.route_id} style={styles.route}>
                  <Image
                    source={route.image ? { uri: route.image } : require('../../assets/images/MapPlaceholder.jpg')}
                    style={styles.routeImage}
                  />
                  <Text style={styles.routeName}>{route.name}</Text>
                  <Text style={styles.routeDistance}>{route.distance} mi</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.followMessage}>Follow to view routes</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 120,
    borderRadius: 20, // Increase border radius
    alignItems: 'center',
    width: '90%', // Adjust width as needed
    alignSelf: 'center', // Center horizontally
    marginTop: '30%', // Adjust vertical margin as needed
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
  routeContainer: {
    flexDirection: 'row',
    marginTop: 50,
    marginBottom: 50,
    paddingLeft: 150,
    paddingRight: 150,
  },
  routeWrapper: {
    marginRight: 20,
  },
  route: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  routeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
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
  followButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
