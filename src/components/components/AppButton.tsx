import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, PressableProps, TextStyle, ViewStyle } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { APP_COLOR } from 'src/core/constants/colorConstants';
import { FONT_NAMES } from 'src/core/constants/fontConstants';

// Custom button component with support for loading state and optional icons
interface AppButtonProps extends PressableProps {
  loading?: boolean;
  leftIcon?: React.ComponentProps<typeof FontAwesome5>['name'] | React.ReactElement;
  label: string;
  rightIcon?: React.ComponentProps<typeof FontAwesome5>['name'] | React.ReactElement;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AppButton: React.FC<AppButtonProps> = ({ 
  loading, 
  leftIcon, 
  label, 
  rightIcon, 
  style, 
  textStyle, 
  ...pressableProps 
}) => {
  const renderIcon = (icon: React.ComponentProps<typeof FontAwesome5>['name'] | React.ReactElement, style: ViewStyle) => {
    if (React.isValidElement(icon)) {
      return <View style={style}>{icon}</View>;
    } else if (typeof icon === 'string') {
      return (
        <View style={style}>
          <FontAwesome5 name={icon} size={20} color={textStyle?.color} />
        </View>
      );
    }
    return null;
  };

  // Render content based on loading state
  const content = loading ? (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="small" color={textStyle?.color || 'white'} animating={true} />
    </View>
  ) : (
    <>
      {leftIcon && renderIcon(leftIcon, styles.leftIcon)}
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      {rightIcon && renderIcon(rightIcon, styles.rightIcon)}
    </>
  );

  return (
    <Pressable
      style={[
        styles.button,
        pressableProps.disabled ? [styles.disabled, { opacity: 0.4 }] : styles.enabled,
        style
      ]}
      {...pressableProps}>
      {content}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    // elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: '2%',
  },
  buttonText: {
    color: APP_COLOR.MAIN_WHITE,
    fontSize: 16,
    fontFamily: FONT_NAMES.DMSANS_BOLD,
    textAlign: 'center',
  },
  loaderWrapper: {
    height: 24,
    justifyContent: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
  },
  enabled: {
    backgroundColor: APP_COLOR.MAIN_GREEN,
  },
  disabled: {
    backgroundColor: '#A9CABC',
  },
});
