import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import dummyproducts from '@data/amazon.json';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { supabase } from '~/src/utils/supabase';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from '~/src/components/Button';
import { Tables } from '~/types/supabase';
import { Octicons } from '@expo/vector-icons';
import AppButton from '~/src/components/components/AppButton';
import { APP_COLOR } from '~/src/core/constants/colorConstants';
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

type ProductSearchJoin = {
  products: {
    asin: string;
    url: string;
    name: string;
    sponsored: string;
    initial_price: number;
    final_price: number;
    currency: string;
    sold: number;
    rating: number;
    num_ratings: number;
    variations?:
      | {
          asin: string;
          name: string;
        }[]
      | null;
    badge: string | null;
    business_type: string | null;
    brand: string | null;
    delivery: string[];
    keyword: string;
    image: string;
    domain: string;
    bought_past_month: number;
    page_number: number;
    rank_on_page: number;
  };
  search_id: number;
  product_id: string;
  // ... any other fields from product_search table
};

type SearchRecordUpdated = {
  created_at: string;
  id: number;
  is_tracked: boolean;
  last_scraped_at: string | null;
  query: string;
  snapshot_id: string | null;
  status: string;
  user_id: string;
};

type UpdateEvent = {
  commit_timestamp: string;
  errors: string | null;
  eventType: 'UPDATE' | 'INSERT' | 'DELETE';
  new: SearchRecordUpdated;
  old: Partial<SearchRecordUpdated>;
  schema: string;
  table: string;
};

const SearchResultScreen = () => {
  // const products = dummyproducts.slice(1, 21);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [search, setSearch] = useState<Tables<'searches'> | null>(null);
  const [products, setProducts] = useState<Tables<'products'>[]>([]);

  const supabaseQuerySearches = () => {
    supabase
      .from('searches')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setSearch(data));
  };

  const supabaseQueryProducts = () => {
    supabase
      .from('product_search')
      .select('*, products(*)')
      .eq('search_id', id)
      .then(({ data, error }) => {
        console.log(JSON.stringify(data, null, 2));
        setProducts(data?.map((d) => d.products).filter((p) => !!p) as [Tables<'products'>]);
      });
  };

  const startScraping = async () => {
    // const {data,error}= await supabase.from('searches')
    // .update({"snapshot_id":'',"status":"Scraped"})
    // .eq("id",id)
    // .select()
    // .

    const { data, error } = await supabase.functions.invoke('scrapeStarted', {
      body: JSON.stringify({ record: search }),
    });
  };

  const handleUpdates = (payload: any) => {
    // supabaseQuerySearchesANDProducts()
    if (payload.new?.id === parseInt(id)) {
      setSearch(payload.new);
      supabaseQueryProducts();
    }
    console.log('Change received!', JSON.stringify(payload, null, 2));
  };

  useEffect(() => {
    supabaseQuerySearches();
    supabaseQueryProducts();
  }, [id]);

  useEffect(() => {
    const subscription = supabase
      .channel('supabase_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'searches' },
        handleUpdates
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const trackProducts = async () => {
    if (!search?.id) {
      return;
    }
    const { data, error } = await supabase
      .from('searches')
      .update({ is_tracked: !search?.is_tracked })
      .eq('id', search?.id)
      .select()
      .single();
    console.log(data, '[      ]', error);
  };

  if (!search) {
    return <ActivityIndicator />;
  }

  return (
    // <View className="bg-white pt-14">
    <ImageBackground
      source={require('src/assets/images/homeBg.png')}
      resizeMode="cover"
      className="flex-1 pt-14">
      <View className="m-2 mb-4 flex flex-row items-center justify-between gap-2 rounded bg-transparent p-2 ">
        <View>
          <Text className="text-xl font-semibold">{search.query}</Text>
          <Text className="text-xl font-semibold">{dayjs(search.last_scraped_at).fromNow()}</Text>
          <Text className="text-xl font-semibold">{search.status}</Text>
        </View>
        <View className="items-end gap-4">
          <Octicons
            onPress={trackProducts}
            name={search.is_tracked ? 'bell-fill' : 'bell'}
            size={24}
            color={APP_COLOR.MAIN_GREEN}
            className="mr-8"
          />
          <AppButton label="Scrap Manually" onPressOut={startScraping} />
        </View>
      </View>
      <FlatList
        data={products}
        contentContainerClassName="gap-3 p-3 "
        keyExtractor={(item) => `${item.asin}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.asin}`} asChild>
            <Pressable
              // onPress={() => !!item.url && Linking.openURL(item.url)}

              className="flex-row gap-2 rounded-lg  bg-white p-3 shadow-sm">
              <Image
                source={item.image ? { uri: item.image } : undefined}
                className="cover  h-20 w-20"
              />
              <Text className="flex-1" numberOfLines={4}>
                {item.name}
              </Text>
              <Text className="font-spaceg-medium text-APP_COLOR-MAIN_TEXT_DARK text-xl">
                ${item.final_price.toFixed(2)}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </ImageBackground>
  );
};

export default SearchResultScreen;
