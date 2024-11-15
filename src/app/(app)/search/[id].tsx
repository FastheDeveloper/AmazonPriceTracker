import { ActivityIndicator, FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import dummyproducts from '@data/amazon.json';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '~/src/utils/supabase';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from '~/src/components/Button';
dayjs.extend(relativeTime);

type SearchRecord = {
  created_at: string; // ISO date string
  id: number; // unique identifier
  is_tracked: boolean; // indicates if the query is being tracked
  last_scraped_at: string | null; // ISO date string or null if not scraped
  query: string; // search query term
  snapshot_id: number | null; // nullable snapshot identifier
  status: string; // status of the query
  user_id: string; // UUID of the user
};
const SearchResultScreen = () => {
  // const products = dummyproducts.slice(1, 21);
  const { id } = useLocalSearchParams();
  const [search, setSearch] = useState<SearchRecord>();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    supabase
      .from('searches')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setSearch(data));

    supabase
      .from('product_search')
      .select('*, products(*)')
      .eq('search_id', id)
      .then(({ data, error }) => {
        console.log(JSON.stringify(data, null, 2), error);
        setProducts(data?.map((d) => d.products));
      });
  }, [id]);

  if (!search) {
    return <ActivityIndicator />;
  }

  const startScraping = async () => {
    // const {data,error}= await supabase.from('searches')
    // .update({"snapshot_id":'',"status":"Scraped"})
    // .eq("id",id)
    // .select()
    // .
    console.log(search, ' search');
    const { data, error } = await supabase.functions.invoke('scrapeStarted', {
      body: JSON.stringify({ record: search }),
    });
    console.log('===============data=====================');
    console.log(data);
    console.log('=================error===================');
    console.log(error);
  };
  return (
    <View>
      <View className="m-2 gap-2 rounded bg-white p-2 shadow-sm">
        <Text className="text-xl font-semibold">{search.query}</Text>
        <Text className="text-xl font-semibold">{dayjs(search.created_at).fromNow()}</Text>
        <Text className="text-xl font-semibold">{search.status}</Text>

        <Button title="Start scraping" onPressOut={startScraping} />
      </View>
      <FlatList
        data={products}
        contentContainerClassName="gap-3 p-3 "
        keyExtractor={(item) => item.asin}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => Linking.openURL(item.url)}
            className="flex-row gap-2 bg-white p-3">
            <Image source={{ uri: item.image }} className="h-20  w-20" />
            <Text className="flex-1" numberOfLines={4}>
              {item.name}
            </Text>
            <Text>${item.final_price.toFixed(2)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default SearchResultScreen;
