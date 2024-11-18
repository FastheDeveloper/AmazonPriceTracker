import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, View } from 'react-native';
import { Pressable, Text } from 'react-native';
import { supabase } from '~/src/utils/supabase';
import { Tables } from '~/types/supabase';
import dayjs from 'dayjs';
import { Button } from '~/src/components/Button';

export default function ProductDetailsScreen() {
  const [products, setProducts] = useState<Tables<'products'> | null>(null);
  const [productHistory, setProductHistory] = useState<Tables<'products_history'>[]>([]);
  const { asin } = useLocalSearchParams<{ asin: string }>();

  useEffect(() => {
    //fetch product info
    // supabase
    //   .from('products')
    //   .select('*')
    //   .eq('asin', asin)
    //   .single()
    //   .then(({ data }) => setProducts(data));

    // //fetch price snapshot
    // supabase
    //   .from('products_history')
    //   .select('*')
    //   .eq('asin', asin)
    //   .select()
    //   .then(({ data }) => setProductHistory(data));

    supabase
      .from('products')
      .select('*, products_history(*)')
      .eq('asin', asin)
      .single()
      .then(({ data }) => {
        setProducts(data);
        setProductHistory(data?.products_history || []);
      });
  }, []);

  console.log(productHistory, ' history');
  if (!products) {
    return <Text>Product not found</Text>;
  }

  return (
    <>
      <FlatList
        data={productHistory}
        keyExtractor={(item) => item.asin + item.created_at + item.id}
        contentContainerClassName="gap-2"
        ListHeaderComponent={
          <View>
            <View>
              <Text>Product detauls</Text>

              <Pressable
                onPress={() => !!products.url && Linking.openURL(products.url)}
                className="flex-row gap-2 bg-white p-3">
                <Image
                  source={products.image ? { uri: products.image } : undefined}
                  className="cover  h-20 w-20"
                />
                <Text className="flex-1" numberOfLines={4}>
                  {products.name}
                </Text>
                <Text>${products.final_price.toFixed(2)}</Text>
              </Pressable>
            </View>
            {products.url && (
              <Button
                title="Open in amazon "
                onPress={() => !!products.url && Linking.openURL(products.url)}
              />
            )}
            <Text className="mt-4 p-2 font-semibold">Price History</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex flex-row justify-between bg-white p-2">
            <Text>{dayjs(item.created_at).format('dddd, MMMM D, YYYY h:mm A')}</Text>
            <Text>${item.final_price}</Text>
          </View>
        )}
      />
    </>
  );
}
