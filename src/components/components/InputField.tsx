import React, { useState, useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, TextInputProps, Animated, TextStyle } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { FONT_NAMES } from 'src/core/constants/fontConstants';
import { APP_COLOR } from 'src/core/constants/colorConstants';

// Update these types
type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];
type EntypoIconName = React.ComponentProps<typeof Entypo>['name'];
type IconComponent = React.ReactElement;

// Update the interface
interface InputFieldProps extends TextInputProps {
  leftIcon?: FontAwesomeIconName | IconComponent;
  label?: string;
  rightIcon?: EntypoIconName | IconComponent;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ leftIcon, label, rightIcon, children, ...inputProps }) => {
  const [hide, setHide] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!inputProps.value || false);
  const animatedIsFocused = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (label) {
      Animated.timing(animatedIsFocused, {
        toValue: (isFocused || hasValue) ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, hasValue, label]);

  const labelStyle: Animated.AnimatedProps<TextStyle> = label
    ? {
        position: 'absolute' as const,
        left: 16,
        top: animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [17, -8],
        }),
        fontSize: animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 12],
        }),
        color: animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [APP_COLOR.PLACEHOLDER_DARK, APP_COLOR.MAIN_GREEN],
        }),
        backgroundColor: APP_COLOR.MAIN_WHITE,
        paddingHorizontal: 4,
        fontFamily: FONT_NAMES.DMSANS_BOLD,
      }
    : {};

  // Helper function to render icons
  const renderIcon = (icon: FontAwesomeIconName | EntypoIconName | IconComponent, isLeft: boolean) => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (isLeft) {
      return <FontAwesome name={icon as FontAwesomeIconName} size={16} color={APP_COLOR.MAIN_GREY_TEXT} />;
    }
    return <Entypo name={icon as EntypoIconName} size={20} color={APP_COLOR.MAIN_TEAL} />;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        !label && styles.fullBorder,
        isFocused && styles.selectedField,
      ]}>
        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
        {leftIcon && (
          <View style={styles.leftIcon} testID="left-icon">
            {renderIcon(leftIcon, true)}
          </View>
        )}

        {children ? (
          <View style={[
            styles.childrenContainer,
            rightIcon || inputProps.secureTextEntry
              ? styles.inputWithRightIcon
              : styles.inputFullWidth,
          ]}>
            {children}
          </View>
        ) : (
          <TextInput
            style={[
              styles.input,
              rightIcon || inputProps.secureTextEntry
                ? styles.inputWithRightIcon
                : styles.inputFullWidth,
              !label && styles.inputWithoutLabel,
              {
                paddingBottom: label ? 15 : 0,
              }
            ]}
            {...inputProps}
            placeholder={!label ? inputProps.placeholder : undefined}
            placeholderTextColor={APP_COLOR.PLACEHOLDER_DARK}
            secureTextEntry={inputProps.secureTextEntry && !rightIcon ? hide : undefined}
            onFocus={(e) => {
              setIsFocused(true);
              if (inputProps.onFocus) inputProps.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (inputProps.onBlur) inputProps.onBlur(e);
            }}
            onChangeText={(text) => {
              setHasValue(text.length > 0);
              if (inputProps.onChangeText) inputProps.onChangeText(text);
            }}
            autoCapitalize="none"
          />
        )}

        {(rightIcon || inputProps.secureTextEntry) && (
          <View style={styles.rightIcon}>
            <Pressable onPress={() => (rightIcon ? null : setHide(!hide))} testID="passwordTest">
              {rightIcon ? (
                renderIcon(rightIcon, false)
              ) : (
                <Entypo
                  name={inputProps.secureTextEntry ? (hide ? 'eye' : 'eye-with-line') : undefined}
                  size={20}
                  color={APP_COLOR.MAIN_TEAL}
                />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '2%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT_NAMES.DMSANS_MEDIUM,
    marginVertical: 4,
    color: APP_COLOR.MAIN_GREY,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: APP_COLOR.MAIN_WHITE,
    width: '100%',
    marginTop: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: APP_COLOR.LIGHT_GREY,
    paddingLeft: '2%',
  },
  leftIcon: {
    marginLeft: 8,
  },
  input: {
    height: 55,
    paddingHorizontal: '2%',
    color: APP_COLOR.MAIN_DARK,
    fontFamily: FONT_NAMES.DMSANS_MEDIUM,
    paddingTop: 16, // Increase top padding to make room for label

    alignSelf: 'center',
  },
  inputFullWidth: {
    width: '100%',
  },
  inputWithRightIcon: {
    width: '85%',
  },
  rightIcon: {
    marginRight: 8,
    paddingHorizontal: '2%',
  },
  selectedField: {
    borderColor: APP_COLOR.MAIN_GREEN,
  },
  fullBorder: {
    borderWidth: 1,
    borderColor: APP_COLOR.LIGHT_GREY,
  },
  inputWithoutLabel: {
    paddingTop: 0,
  },
  childrenContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
