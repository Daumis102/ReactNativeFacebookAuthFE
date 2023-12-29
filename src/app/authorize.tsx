import { useEffect } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSession } from '../contexts/AuthContext';

export default function Authorize() {
  const { signIn, authenticated, isAuthLoading } = useSession();

  useEffect(() => {
    if (authenticated) {
      router.replace('/');
    }
  }, [authenticated]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isAuthLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Text
          onPress={() => {
            signIn();
          }}
        >
          Sign In
        </Text>
      )}
    </View>
  );
}
