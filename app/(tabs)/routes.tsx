import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';

const savedRoutes = [
  { id: 1, origin: '308 Penny Ln, Ruston, LA, USA', destination: '811 Saratoga Street, Ruston, LA, USA', distance: '0.71 miles' },
];

export default function TabOneScreen() {
  const navigation = useNavigation();

  const renderRoutePreview = ({ item }) => {
    const { origin, destination } = item;

    return (
      <TouchableOpacity
        style={styles.routePreview}
        onPress={() => navigation.navigate('map', { origin, destination })}
      >
        <Text style={styles.routeText}>{origin} to {destination}</Text>
        <Text style={styles.distanceText}>{item.distance}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Routes</Text>
      <FlatList
        data={savedRoutes}
        renderItem={renderRoutePreview}
        keyExtractor={item => item.id.toString()}
        style={styles.routeList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  distanceText: {
    fontSize: 14,
    color: 'gray',
  },
});
