import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text, View } from '../../components/Themed';

const savedRoutes = [
  { id: 1, fid: 1, origin: '308 Penny Ln, Ruston, LA, USA', destination: '811 Saratoga Street, Ruston, LA, USA', distance: '0.71 miles' },
  { id: 4, fid: 2, origin: '305 Penny Ln, Ruston, LA, USA', destination: '811 Saratoga Street, Ruston, LA, USA', distance: '0.71 miles' },
];

export default function FriendsScreen() {

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [routes, setRoutes] = useState([]);

  const friends = [
    { id: 1, name: 'austen', profileImage: null /*require('../../assets/images/carl.jpg') */ },
    { id: 2, name: 'kaiden  ', profileImage: null /* require('../../assets/images/DonClawleone.jpg') */},
  ];

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    // Filter the routes for the selected friend
    const friendRoutes = savedRoutes.filter(route => route.fid === friend.id);
    setRoutes(friendRoutes);
  };

  const handleCloseRoutes = () => {
    setSelectedFriend(null);
    setRoutes([]);
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
          <View style={styles.routesHeader}>
            <Text style={styles.routesTitle}>Routes</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseRoutes}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          {routes.map(route => (
            <View key={route.id} style={styles.route}>
              <Text>Origin: {route.origin}</Text>
              <Text>Destination: {route.destination}</Text>
              <Text>Distance: {route.distance}</Text>
            </View>
          ))}
        </View>
      )}
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  routesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  route: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});