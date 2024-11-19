import { Image, Pressable, Text, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInLeft,
  SlideInLeft,
  SlideOutRight,
  FadeOutRight,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { save } from '~/src/utils/secureStorage';
import { STORAGE_KEYS } from '~/src/core/constants/asyncKeys';
import { APP_COLOR } from '~/src/core/constants/colorConstants';
import { useAuth } from '~/src/Context/AuthContext';
import AppButton from '~/src/components/components/AppButton';
import { Redirect, router, Stack } from 'expo-router';

const onboardingSteps = [
  {
    icon: (
      <Image
        source={require('src/assets/images/onBoardone.png')}
        style={{ width: 300, height: 300 }}
      />
    ),

    title: 'Track Prices Instantly',
    description: 'Search for items and get real-time price updates directly from Amazon.',
  },
  {
    icon: (
      <Image
        source={require('src/assets/images/onBoardtwo.png')}
        style={{ width: 300, height: 300 }}
      />
    ),
    title: 'Stay Updated Daily',
    description: 'Enable daily price tracking to automatically monitor changes at midnight.',
  },
  {
    icon: (
      <Image
        source={require('src/assets/images/onBoardthree.png')}
        style={{ width: 300, height: 300 }}
      />
    ),
    title: 'Get Price Drop Alerts',
    description: 'Receive notifications whenever prices drop on your monitored items.',
  },
];

const Onboarding = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { setHasBeenUsed, hasBeenUsed } = useAuth();
  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [step, setStep] = useState(0);
  const data = onboardingSteps[step];

  const { backgroundColor, accentColor } = useMemo(() => {
    switch (step) {
      case 0:
        return { backgroundColor: '#FEFAF7', accentColor: APP_COLOR.MAIN_ORANGE };
      case 1:
        return { backgroundColor: '#FDF4F9', accentColor: APP_COLOR.MAIN_INDIGO };
      case 2:
        return { backgroundColor: '#F6FFFE', accentColor: APP_COLOR.MAIN_TEAL };
      default:
        return { backgroundColor: APP_COLOR.MAIN_WHITE, accentColor: APP_COLOR.MAIN_GREEN };
    }
  }, [step]);

  const arrowColor = step === 0 ? APP_COLOR.DARK_GREY : accentColor;

  const onContinue = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      endOnboarding();
    }
  };

  const endOnboarding = async () => {
    try {
      setHasBeenUsed(true);
      await save(STORAGE_KEYS.HAS_APP_BEEN_USED, 'true');
    } catch (err) {
      console.log('error', err);
    }
  };

  const onBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onEnd((event) => {
      if (event.velocityX < -500 && step < onboardingSteps.length - 1) {
        setStep(step + 1);
      } else if (event.velocityX > 500 && step > 0) {
        setStep(step - 1);
      }
    })
    .runOnJS(true);

  const handleSignUp = async () => {
    await endOnboarding();
  };

  const handleSignIn = async () => {
    await endOnboarding();
    router.navigate('/(auth)/Login');
  };

  if (hasBeenUsed) {
    return <Redirect href={'/(auth)/Signup'} />;
  }

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        className={`flex-1 px-[5%]`}
        style={{ paddingTop: top, paddingBottom: bottom, backgroundColor }}
        key={`background-${step}`}
        entering={FadeInLeft.duration(300)}
        exiting={FadeOutRight.duration(300)}>
        <View className="flex-1 pt-[15%]">
          <View className="items-center">
            <Animated.View
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              key={`icon-${step}`}>
              {data.icon}
            </Animated.View>
            <View className="my-[10%] flex-row items-center gap-2">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: index === step ? accentColor : APP_COLOR.LIGHT_GREY }}
                />
              ))}
            </View>
          </View>
          <View className="mt-5 items-start px-[5%]">
            <Animated.Text
              entering={SlideInLeft.delay(200)}
              exiting={SlideOutRight}
              className="font-spaceg-bold text-left text-2xl"
              style={{ color: accentColor }}
              key={`title-${step}`}>
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={FadeInLeft.delay(300)}
              exiting={FadeOutRight}
              className="text-main-dark font-dmsans-regular mt-2.5 text-left text-lg"
              key={`description-${step}`}>
              {data.description}
            </Animated.Text>
          </View>
        </View>

        <View className="absolute bottom-[10%] left-[5%] right-[5%]">
          {step === onboardingSteps.length - 1 ? (
            <>
              <AppButton
                label="Sign up"
                onPress={handleSignUp}
                style={{ backgroundColor: accentColor }}
                textStyle={{ color: APP_COLOR.MAIN_WHITE }}
              />
              <AppButton
                label="Sign in"
                onPress={handleSignIn}
                style={{ backgroundColor: APP_COLOR.MAIN_GREY }}
                textStyle={{ color: accentColor }}
                className="mt-2.5"
              />
            </>
          ) : (
            <View className="flex-row items-center justify-between gap-4">
              <Pressable
                onPress={onBack}
                className="bg-APP_COLOR-MAIN_GREY flex-[0.1] items-center justify-center rounded-lg p-3.5">
                <FontAwesome5 name="arrow-left" size={20} color={arrowColor} />
              </Pressable>
              <View className="flex-[0.4]">
                <AppButton
                  onPress={onContinue}
                  label="Next"
                  style={{ backgroundColor: APP_COLOR.MAIN_GREY }}
                  textStyle={{ color: accentColor }}
                  rightIcon="arrow-right"
                />
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Onboarding;
