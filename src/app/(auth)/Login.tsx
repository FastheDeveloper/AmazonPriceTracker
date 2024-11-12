import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { router, Stack } from 'expo-router';
import { supabase } from '~/src/utils/supabase';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
  };
  const onSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
    console.log(data);
  };
  return (
    <View className="gap-3 p-3">
      <Stack.Screen options={{ title: 'Authenticate' }} />
      <TextInput
        placeholder="Email"
        className=" rounded border border-gray-300 p-5 py-7"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        className=" rounded border border-gray-300 p-5 py-7"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable className="items-center rounded bg-teal-300 p-3" onPress={onSignIn}>
        <Text className="text-white">Sign In</Text>
      </Pressable>
      <TouchableOpacity className="items-center rounded bg-teal-300 p-3" onPress={onSignUp}>
        <Text className="text-white">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
