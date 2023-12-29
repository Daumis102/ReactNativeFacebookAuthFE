import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';
import { useSession } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { authenticated, isAuthLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isAuthLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!authenticated) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/authorize" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
