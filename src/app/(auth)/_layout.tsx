import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '~/src/Context/AuthContext';

const AuthLayout = () => {
  const { user, hasBeenUsed } = useAuth();
  // if (hasBeenUsed) {
  //   return <Redirect href={'/(auth)/Signup'} />;
  // }
  if (user) {
    return <Redirect href="/" />;
  }
  return <Slot />;
};

export default AuthLayout;

const styles = StyleSheet.create({});
