import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { useTheme } from '../../contexts/ThemeContext';

export default function TabTwoScreen() {
  const navigation = useNavigation(); // Initialize navigation hook
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prevState => !prevState);
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    // For example, clear user session
    navigation.navigate('index'); // Navigate to the login screen
  };

  return (
    <View style={isDarkMode ? [styles.container, styles.darkContainer] : styles.container}>
      <View style={isDarkMode ? [styles.separator, { backgroundColor: 'rgba(255,255,255,0.1)' }] : styles.separator} />
      <View style={isDarkMode ? [styles.settingContainer, styles.darkSettingContainer] : styles.settingContainer}>
        <Text style={isDarkMode ? styles.darkText : null}>Toggle Theme</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
      <View style={isDarkMode ? [styles.settingContainer, styles.darkSettingContainer] : styles.settingContainer}>
        <Text style={isDarkMode ? styles.darkText : null}>Enable Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
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
    borderRadius: 5,
  },
  darkSettingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  darkText: {
    color: 'white',
  },
  signOutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6347',
    borderRadius: 5,
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
