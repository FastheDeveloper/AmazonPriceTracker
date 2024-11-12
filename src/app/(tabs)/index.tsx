import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '~/src/utils/supabase';

export default function Home() {
  const [search, setSearch] = useState<string>('');

  const performSearch = () => {
    console.warn('search', search);
    router.navigate('/search');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View className="flex-row gap-3 bg-white p-3">
        <TextInput
          placeholder="Search for Product"
          className="flex-1  rounded border border-gray-300 p-3"
          value={search}
          onChangeText={setSearch}
        />
        <Pressable onPress={performSearch} className="rounded bg-teal-300 p-3">
          <Text>Search</Text>
        </Pressable>
      </View>

      <Link href={'/(auth)/Login'}>Open Auth</Link>

      <TouchableOpacity onPress={() => supabase.auth.signOut()}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </>
  );
}
