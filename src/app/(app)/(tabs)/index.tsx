import { router, Stack } from 'expo-router';
import { FlatList } from 'react-native';
import { supabase } from '~/src/utils/supabase';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '~/types/supabase';
import SearchListItem from '~/src/components/SearchListItem';

dayjs.extend(relativeTime);
import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '~/src/components/components/AppButton';
import { useAuth } from '~/src/Context/AuthContext';
import InputField from '~/src/components/components/InputField';

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [search, setSearch] = useState<string>('');

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

  function getTimeOfDay(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'afternoon';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'evening';
    } else {
      return 'evening';
    }
  }

  return (
    <ImageBackground
      source={require('src/assets/images/homeBg.png')}
      resizeMode="cover"
      className="flex-1">
      <StatusBar hidden={true} />
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          paddingTop: insets.top,
        }}
        className="flex-1 px-2">
        <View className=" flex-1">
          <FlatList
            data={history}
            ListHeaderComponent={
              <>
                <View className=" flex-row justify-between">
                  <View>
                    <View className="flex-row items-center">
                      <Text className="font-dmsans-regular text-APP_COLOR-MAIN_TEXT_DARK text-lg">
                        Good {getTimeOfDay()}{' '}
                      </Text>
                      <Text className="font-dmsans-regular text-APP_COLOR-MAIN_TEXT_DARK text-lg">
                        ☀️
                      </Text>
                    </View>
                    <Text
                      className="font-dmsans-semibold text-APP_COLOR-MAIN_TEXT_DARK w-[100%] text-2xl"
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {user?.email}
                    </Text>
                  </View>
                </View>
                <View className="flex-col gap-3  py-3">
                  <InputField
                    placeholder="Search for Product"
                    value={search}
                    onChangeText={setSearch}
                  />

                  <AppButton label="Search" onPress={performSearch} />
                </View>
                <View className="mt-8 flex-row items-center justify-between">
                  <Text className="font-spaceg-medium text-APP_COLOR-MAIN_TEXT_DARK text-2xl">
                    History
                  </Text>
                </View>
                <Text className="font-dmsans-regular mb-4 mr-4 mt-2 text-xl text-[#94A1AD]">
                  View Your Recent Searches
                </Text>
              </>
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?.id.toString()}
            onRefresh={fetchHistory}
            refreshing={false}
            contentContainerClassName="p-3 gap-2 "
            renderItem={({ item }) => <SearchListItem search={item} />}
            ListFooterComponent={
              <>
                {/* <Link href={'/(auth)/Login'}>Open Auth</Link> */}
                {/* //       <Text onPress={() => supabase.auth.signOut()}>Sign out</Text> */}
              </>
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
}
