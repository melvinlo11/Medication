import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initializeNotifications } from './src/services/notifications';
import { initializeDatabase } from './src/db';

export default function App() {
  React.useEffect(() => {
    void initializeDatabase();
    void initializeNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
