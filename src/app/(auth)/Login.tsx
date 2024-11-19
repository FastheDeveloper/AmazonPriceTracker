import { Alert, Keyboard, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { APP_COLOR } from '~/src/core/constants/colorConstants';
import { validateEmail, allFieldsFilled, handleEmailBlur } from '~/src/utils/fieldValidators';
import { useAuth } from '~/src/Context/AuthContext';
import InputField from '~/src/components/components/InputField';
import AppButton from '~/src/components/components/AppButton';
import { supabase } from '~/src/utils/supabase';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

const SignIn = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    handleEmailBlur(userDetails.email, setErrorMessage);
  }, [userDetails.email]);

  const isFormValid = () => {
    return validateEmail(userDetails.email) && allFieldsFilled(userDetails);
  };

  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const onSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userDetails.email,
      password: userDetails.password,
    });
    if (data) {
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'Lets get cooking!',
      });
    }
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: 'Please check your credentials and try again.',
      });
    }
    setLoading(false);
  };

  // Reset error messages when an input field is focused
  const handleInputFocus = () => {
    setErrorMessage('');
    setShowError(false);
  };

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View
        className={`bg-APP_COLOR-MAIN_WHITE flex-1 px-[3%] `}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mb-[3%] mt-[15%]">
          <Text className="font-spaceg-medium text-2xl ">Welcome back</Text>
          <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT mr-12   text-lg">
            Let's get you logged in to get back to building your dollar-denominated investment
            portfolio.
          </Text>
        </View>
        <View>
          <InputField
            label="Email Address"
            onChangeText={(text: string) => handleChange('email', text)}
            onBlur={() => setShowError(true)}
            onFocus={handleInputFocus}
            keyboardType="email-address"
            leftIcon={undefined}
            rightIcon={undefined}
          />
          {errorMessage && showError && (
            <Text className="text-12 font-dmsans-regular text-APP_COLOR-MAIN_RED px-[2%]">
              {errorMessage}
            </Text>
          )}
          <InputField
            label="Password"
            secureTextEntry
            onChangeText={(text: string) => handleChange('password', text)}
            leftIcon={undefined}
            rightIcon={undefined}
          />
        </View>

        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Sign In'}
            disabled={!isFormValid()}
            onPress={onSignIn}
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="mt-10 flex-row justify-center">
            <Text className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1">
              I forgot my password
            </Text>
          </View>
        </View>
        <View className="mt-auto justify-center pb-4">
          <View className="flex-row justify-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
              Don't have an account?
            </Text>
            <Text
              className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1"
              onPress={() => router.navigate('/(auth)/Signup')}>
              Sign up
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
