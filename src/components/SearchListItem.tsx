import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Octicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '~/types/supabase';

dayjs.extend(relativeTime);

const SearchListItem = ({ search }: { search: Tables<'searches'> }) => {
  return (
    <Link href={`/search/${search.id}`} asChild>
      <Pressable className="flex-row items-center justify-between border-b border-gray-400 pb-2">
        <View>
          <Text className="font-semibold">{search?.query}</Text>
          <Text className="text-xl font-semibold">{dayjs(search?.created_at).fromNow()}</Text>
        </View>
        <Octicons name={search.is_tracked ? 'bell-fill' : 'bell'} size={24} color={'gold'} />
      </Pressable>
    </Link>
  );
};

export default SearchListItem;

const styles = StyleSheet.create({});
