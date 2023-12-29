import React from 'react';
import { Text, View } from 'react-native';
import { useSession } from '../../contexts/AuthContext';

export default function Index() {
  const { signOut, user } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{user.lastName}</Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        Sign Out
      </Text>
    </View>
  );
}
