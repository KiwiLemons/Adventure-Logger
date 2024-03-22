import React, { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

export default function TabTwoScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={isDarkMode ? [styles.container, styles.darkContainer] : styles.container}>
      <View
        style={isDarkMode ? [styles.separator, { backgroundColor: 'rgba(255,255,255,0.1)' }] : styles.separator}
      />
      <View style={isDarkMode ? [styles.switchContainer, styles.darkSwitchContainer] : styles.switchContainer}>
        <Text style={isDarkMode ? styles.darkText : null} >Toggle Theme</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Default light mode text color
  },
  darkText: {
    color: 'white', // Dark mode text color
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee', // Default light mode separator color
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white', // Default light mode switch container background color
  },
  darkSwitchContainer: {
    backgroundColor: 'black', // Dark mode switch container background color
  },
});