import { FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import React from 'react';

import dummyproducts from '@data/amazon.json';

const SearchResultScreen = () => {
  const products = dummyproducts.slice(1, 21);

  return (
    <View>
      <Text className="text-xl">SearchResultScreen</Text>
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
