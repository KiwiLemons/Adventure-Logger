import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { getUser_id } from '../globals';

const url = 'https://webserver-image-ccuryd6naa-uc.a.run.app/api/routes/';

export default function TabOneScreen() {
  const navigation = useNavigation();
  const [user_id, setuser_id] = useState('');
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setuser_id(getUser_id());
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const renderRoutePreview = ({ item }) => {
    const { name } = item;
  
    return (
      <TouchableOpacity
        style={styles.routePreview}
        onPress={() => navigation.navigate('map', { origin: item.origin, destination: item.destination })}
      >
        <Image source={require('../../assets/images/MapPlaceholder.jpg')} style={styles.routeImage} />
        <Text style={styles.routeName}>{name}</Text>
      </TouchableOpacity>
    );
  };  

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}> 
        <FlatList
          data={routes}
          renderItem={renderRoutePreview}
          keyExtractor={item => item.route_id.toString()}
          style={styles.routeList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Remove alignItems and justifyContent styles to align with top
  },
  contentContainer: {
    width: '100%', // Ensure content takes up entire width
    paddingHorizontal: 20, // Add horizontal padding
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routeList: {
    width: '100%',
  },
  routePreview: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  routeText: {
    fontSize: 16,
  },
  routeImage: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginTop: 10,
  },
  routeName: {
    fontSize: 14,
    marginTop: 5, // Adjust as needed
    alignItems: 'center',
  },  
});
