import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { launchImageLibrary } from 'react-native-image-picker'; // Import the launchImageLibrary function from react-native-image-picker

export default function TabTwoScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    // For example, clear user session
    navigation.navigate('index'); // Navigate to the login screen
  };

  const selectProfilePicture = () => {
    // Define options for image picker
    const options = {
      mediaType: 'photo', // Only allow selecting images
      includeBase64: false, // We don't need base64 data
    };

    // Launch image picker
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // User cancelled image selection
        console.log('User cancelled image selection');
      } else if (response.error) {
        // Image picker encountered an error
        console.log('ImagePicker Error:', response.error);
        Alert.alert('Error', 'Failed to select image. Please try again later.');
      } else {
        // Selected image successfully
        console.log('Selected image:', response.uri);
        // Now you can upload the selected image to your database
        // Make sure to handle the upload logic here
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
      <TouchableOpacity style={isDarkMode ? [styles.selectPFPButton, styles.darkSelectPFPButton] : styles.selectPFPButton} onPress={selectProfilePicture}>
        <Text style={styles.selectPFPButtonText}>Select Profile Picture</Text>
      </TouchableOpacity>
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
