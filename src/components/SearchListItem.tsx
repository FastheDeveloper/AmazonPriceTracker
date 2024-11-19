import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Octicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tables } from '~/types/supabase';
import { APP_COLOR } from '../core/constants/colorConstants';

dayjs.extend(relativeTime);

const SearchListItem = ({ search }: { search: Tables<'searches'> }) => {
  return (
    <Link href={`/search/${search.id}`} asChild>
      <Pressable className="flex-row items-center justify-between border-b border-gray-400 pb-2">
        <View>
          <Text className="font-spaceg-medium text-APP_COLOR-MAIN_TEXT_DARK text-2xl">
            {search?.query}
          </Text>
          <Text className="font-dmsans-regular mb-4 mr-4 mt-2 text-xl ">
            Scraped {dayjs(search?.last_scraped_at).fromNow()}
          </Text>
        </View>
        <Octicons
          name={search.is_tracked ? 'bell-fill' : 'bell'}
          size={24}
          color={APP_COLOR.MAIN_GREEN}
        />
      </Pressable>
    </Link>
  );
};

export default SearchListItem;

const styles = StyleSheet.create({});
