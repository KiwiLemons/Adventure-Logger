import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text, View } from '../../components/Themed';

export default function FriendsScreen() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  
  const friends = [
    { id: 1, name: 'John', profileImage: require('../../assets/images/carl.jpg') },
    { id: 2, name: 'Alice', profileImage: require('../../assets/images/DonClawleone.jpg') },
    { id: 3, name: 'Bob', profileImage: require('../../assets/images/SignsMelGibson.jpg') }
  ];

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
  };

  const handleCloseRoutes = () => {
    setSelectedFriend(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <ScrollView contentContainerStyle={styles.friendsList}>
        {friends.map(friend => (
          <TouchableOpacity 
            key={friend.id} 
            style={styles.friendItem} 
            onPress={() => handleFriendSelect(friend)}
          >
            <Image source={friend.profileImage} style={styles.profileImage} />
            <Text style={styles.friendName}>{friend.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedFriend && (
        <View style={styles.routesTab}>
          <Text style={styles.routesTitle}>Routes for {selectedFriend.name}</Text>
          {/* Your routes component goes here */}
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseRoutes}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendsList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routesTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  routesTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
