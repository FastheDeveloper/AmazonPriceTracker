import { Link, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '~/src/Context/AuthContext';
import { supabase } from '~/src/utils/supabase';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '~/types/supabase';
import { Octicons } from '@expo/vector-icons';
import SearchListItem from '~/src/components/SearchListItem';

export default function Home() {
  const { user } = useAuth();
  const [trackedHistory, setTrackedHistory] = useState<Tables<'searches'>[]>([]);

  const fetchTrackedHistory = () => {
    // query from database with this comand
    if (user)
      supabase
        .from('searches')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_tracked', true)
        .order('created_at', { ascending: false }) //order parameter
        .then(({ data }) => setTrackedHistory(data || [])); //take everything from 'Searches' table where the user_id matches the user.id from client side, then set the data recieved into setTrackedHistory state
  };
  useEffect(() => {
    fetchTrackedHistory();
  }, []);
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Tracked Product',
        }}
      />
      <FlatList
        data={trackedHistory}
        keyExtractor={(item) => item?.id.toString()}
        onRefresh={fetchTrackedHistory}
        refreshing={false}
        contentContainerClassName="p-3 gap-2 "
        renderItem={({ item }) => <SearchListItem search={item} />}
      />
    </View>
  );
}
