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

dayjs.extend(relativeTime);
type History = {
  created_at: string; // ISO date string
  id: number; // unique identifier
  is_tracked: boolean; // indicates if the query is being tracked
  last_scraped_at: string | null; // ISO date string or null if not scraped
  query: string; // search query term
  snapshot_id: number | null; // nullable snapshot identifier
  status: string; // status of the query
  user_id: string; // UUID of the user
};

type Historys = History[];

export default function Home() {
  const [search, setSearch] = useState<string>('');
  const { user } = useAuth();
  const [history, setHistory] = useState<Tables<'searches'>[]>([]);
  const performSearch = async () => {
    console.warn('search', search);

    //save to database with this command
    const { data, error } = await supabase
      .from('searches')
      .insert({
        query: search,
        user_id: user?.id,
      })
      .select()
      .single();
    if (data) {
      router.navigate(`/search/${data.id}`);
    }
    if (error) {
      console.log('====================================');
      console.log(error.message, 'err');
      console.log('====================================');
    }
  };
  const fetchHistory = () => {
    // query from database with this comand
    if (user)
      supabase
        .from('searches')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false }) //order parameter
        .then(({ data }) => setHistory(data || [])); //take everything from 'Searches' table where the user_id matches the user.id from client side, then set the data recieved into setHistory state
  };
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <View className="flex-1 bg-white">
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

      <FlatList
        data={history}
        keyExtractor={(item) => item?.id.toString()}
        onRefresh={fetchHistory}
        refreshing={false}
        contentContainerClassName="p-3 gap-2 "
        renderItem={({ item }) => <SearchListItem search={item} />}
      />
      <Link href={'/(auth)/Login'}>Open Auth</Link>
      <Text onPress={() => supabase.auth.signOut()}>Sign out</Text>
    </View>
  );
}
