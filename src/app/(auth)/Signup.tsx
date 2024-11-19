import { Alert, Keyboard, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '~/navigation';
import AppButton from '~/src/components/components/AppButton';
import InputField from '~/src/components/components/InputField';
import { useAuth } from '~/src/Context/AuthContext';
import { validateEmail, allFieldsFilled, handleEmailBlur } from '~/src/utils/fieldValidators';
import { APP_COLOR } from '~/src/core/constants/colorConstants';
import { supabase } from '~/src/utils/supabase';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const SignUp = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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

  const onSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
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
        text1: 'Sign Up Failed',
        text2: 'Please check your credentials and try again.',
      });
    }
    console.log(data);
    setLoading(false);
  };

  const isFormValid = () => {
    return (
      validateEmail(userDetails.email) &&
      allFieldsFilled(userDetails) &&
      isPasswordValid(userDetails.password)
    );
  };

  const handleChange = (name: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleInputFocus = () => {
    setErrorMessage('');
    setShowError(false);
  };

  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <KeyboardAwareScrollView
      className="bg-APP_COLOR-MAIN_WHITE"
      scrollEnabled={isKeyboardVisible}
      showsVerticalScrollIndicator={false}>
      <View
        className={`bg-APP_COLOR-MAIN_WHITE flex-1 px-[3%] `}
        style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className="mb-[3%] mt-[15%]">
          <Text className="font-spaceg-medium text-2xl ">Create an account</Text>
          <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT mr-10   text-lg">
            Start monitoring prices and saving money effortlessly.
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

        <View className="mx-[2%] my-[3%] flex-col items-start justify-start">
          {[
            { condition: userDetails.password.length >= 8, text: 'Minimum of 8 characters' },
            { condition: /[A-Z]/.test(userDetails.password), text: 'One UPPERCASE character' },
            {
              condition: /[@$!%*?&]/.test(userDetails.password),
              text: 'One special character (@$!%*?&)',
            },
            {
              condition: /^[A-Za-z\d@$!%*?&]+$/.test(userDetails.password),
              text: 'Only letters, numbers, and special characters (@$!%*?&)',
            },
          ].map((item, index) => (
            <View key={index} className="mb-2 flex-row items-center">
              <Ionicons
                name={item.condition ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color="#008080"
              />
              <Text className="font-dmsans-regular ml-2 text-sm">{item.text}</Text>
            </View>
          ))}
        </View>
        <View className="flex-1 pt-[5%]">
          <AppButton
            label={'Sign Up'}
            disabled={!isFormValid()}
            onPress={onSignUp}
            loading={loading}
            style={{ backgroundColor: APP_COLOR.MAIN_GREEN }}
            textStyle={{ color: APP_COLOR.MAIN_WHITE }}
          />
          <View className="mt-4 flex-row justify-center">
            <Text className="font-dmsans-regular text-APP_COLOR-MAIN_GREY_TEXT">
              Already have an account?
            </Text>
            <Text
              className="font-dmsans-medium text-APP_COLOR-MAIN_GREEN ml-1"
              onPress={() => router.navigate('/(auth)/Login')}>
              Sign In
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
