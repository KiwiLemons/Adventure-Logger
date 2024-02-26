import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, View} from '../components/Themed';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        deferredUpdatesInterval: 1000
      });
    }
  }
};

const stopTask = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}

export default function ModalScreen() {
  const [backgroundLocaton, setBackgroundLocation] = useState(false);

  useEffect(() => {
    let TaskStatus = TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    TaskStatus.then((value) => {
      setBackgroundLocation(value)
    });
  }, [])

  console.log(backgroundLocaton);
  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {backgroundLocaton == false ? 
        (<Button onPress={requestPermissions} title="Enable background location" />)
        : <Button onPress={stopTask} title="Disable background location" />}
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error.message)
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations)
    // do something with the locations captured in the background
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
