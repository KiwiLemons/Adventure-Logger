import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, View } from 'react-native';
import { Text } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { getUser_id, getRoute_id } from '../globals';

const routeImages = {
  '1': require('../../assets/images/carl.jpg'),
  '2': require('../../assets/images/carl.jpg'),
  '3': require('../../assets/images/carl.jpg'),
};

export default function TabOneScreen() {
  const navigation = useNavigation();
  const [routes, setRoutes] = useState([]);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalRouteID, setGlobalRouteID] = useState("");

  useEffect(() => {
    //Get global route_id which could be null
    getRoute_id().then((id) => {
      if (id !== null) {
        setGlobalRouteID(id);
      }
    });
    // TODO: Fix this updating everytime you go back even though you do not create a new route
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    var user_id = await getUser_id();
    if (user_id == null){
      navigation.navigate('index');
      return;
    }
    setLoading(true);
    try {
      var url = `https://webserver-image-ccuryd6naa-uc.a.run.app/api/users/${user_id}/routes`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
    setLoading(false);
  };

  const sortRoutesByDistance = () => {
    const sortedRoutes = [...routes].sort((a, b) => {
      if (sortByDistance) {
        return a.distance.localeCompare(b.distance);
      } else {
        return b.distance.localeCompare(a.distance);
      }
    });
    setRoutes(sortedRoutes);
    setSortByDistance(!sortByDistance);
  };

  const renderRoutePreview = ({ item }) => {
    const { name, distance, route_id } = item;
    const routeImage = routeImages[route_id] || require('../../assets/images/MapPlaceholder.jpg'); // Default image
  
    return (
      <TouchableOpacity
        style={route_id == globalRouteID ? styles.activeRoutePreview : styles.routePreview}
        onPress={() => navigation.navigate('viewRoute', item)}
      >
        <Image source={routeImage} style={styles.routeImage} />
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeName}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
    


  if (routes.length == 0 && !loading){
    return(
      <View style={{flex:1, justifyContent: 'center'}}>
        <Text style={styles.warningMessage}>No Routes!</Text>
        <Text style={styles.subWarningMessage}>Click the top right to create a new route</Text>
      </View>
    )
  }
  else{
    return (
      <View style={styles.container}>
        <FlatList
          data={routes}
          renderItem={renderRoutePreview}
          keyExtractor={item => item.route_id.toString()}
          contentContainerStyle={styles.routeList} // Apply styles to the content container
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sortButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  sortButtonText: {
    fontSize: 16,
  },
  warningMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
  subWarningMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
  },
  routeList: {
    // paddingHorizontal: 20,
  },
  routePreview: {
    marginBottom: 20,
    backgroundColor: '#c9c9c9',
    borderRadius: 20,
  },
  activeRoutePreview: {
    marginBottom: 20,
    backgroundColor: '#319e27',
    borderRadius: 20,
  },
  routeImage: {
    width: '100%',
    height: 250,
    marginBottom: 4,
    borderRadius: 20, // Add border radius to round the corners
  },
  routeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold', // Make the route name bold
    marginRight: 10, // Add spacing between name and distance
    marginBottom: 6,
    marginLeft: 10
  },
  routeDistance: {
    fontSize: 14,
    marginBottom: 5,
  },  
});
