import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { AddMedicationScreen } from '@/screens/AddMedicationScreen';
import { EditMedicationScreen } from '@/screens/EditMedicationScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Medication Reminder' }} />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} options={{ title: 'Add Medication' }} />
      <Stack.Screen name="EditMedication" component={EditMedicationScreen} options={{ title: 'Edit Medication' }} />
    </Stack.Navigator>
  );
}
