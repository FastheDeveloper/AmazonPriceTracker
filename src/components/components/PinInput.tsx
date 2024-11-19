import React from 'react';
import { View, Text } from 'react-native';

interface PinInputProps {
  value: string;
  length: number;
}

const PinInput: React.FC<PinInputProps> = ({ value, length }) => {
  return (
    <View className="flex-row justify-evenly">
      {[...Array(length)].map((_, index) => (
        <View
          key={index}
          className={`w-12 h-12 border-2 ${
            value[index] ? 'border-[#0898A0]' : 'border-APP_COLOR-MAIN_GREY'
          } rounded-md justify-center items-center ${
            index < length - 1 ? 'mr-2' : ''
          }`}
        >
          <Text className="font-spaceg-medium text-2xl">
            {value[index] ? '•' : ''}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PinInput;
