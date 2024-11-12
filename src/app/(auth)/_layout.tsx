import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '~/src/Context/AuthContext';

const AuthLayout = () => {
  const { user } = useAuth();
  if (user) {
    return <Redirect href="/" />;
  }
  return <Slot />;
};

export default AuthLayout;

const styles = StyleSheet.create({});
