import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Text, View, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker'; // Import ImagePicker
import {delUser_id} from '../globals'

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to store selected profile picture

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleSignOut = () => {
    //TODO: check if you are currently tracking a route?
    delUser_id();
    navigation.navigate('index');
  };

  const selectProfilePicture = () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchImageLibrary(options , (response) => { // Corrected ImagePicker method
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets) {
        const imageAssetsArray = response.assets[0].uri;
        setProfilePicture(imageAssetsArray);
      }
    });
  };

  return (
    <View style={isDarkMode ? [styles.container, styles.darkContainer] : styles.container}>
      <View style={isDarkMode ? [styles.separator, { backgroundColor: 'rgba(255,255,255,0.1)' }] : styles.separator} />
      <View style={isDarkMode ? [styles.settingContainer, styles.darkSettingContainer] : styles.settingContainer}>
        <Text style={isDarkMode ? styles.darkText : null}>Toggle Theme</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      <TouchableOpacity style={isDarkMode ? [styles.signOutButton, styles.darkSignOutButton] : styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  darkContainer: {
    backgroundColor: 'black',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  darkSettingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  darkText: {
    color: 'white',
  },
  selectPFPButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  darkSelectPFPButton: {
    backgroundColor: '#388E3C',
  },
  selectPFPButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6347',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  darkSignOutButton: {
    backgroundColor: 'blue',
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
