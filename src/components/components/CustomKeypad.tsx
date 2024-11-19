import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const CustomKeypad: React.FC<CustomKeypadProps> = ({ onKeyPress, onDelete }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <View className="flex-row flex-wrap justify-between">
      {keys.map((key) => (
        <View key={key} className="w-[33%] items-center mb-4">
          {key === '.' ? (
            <View className="w-[71px] h-[71px] bg-[#71879C1A]  rounded-full justify-center items-center">
              <Text className="font-spaceg-medium text-2xl text-[#0898A0]">{key}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => onKeyPress(key)}
              className="w-[71px] h-[71px] bg-[#71879C1A] rounded-full justify-center items-center"
            >
              <Text className="font-spaceg-medium text-2xl text-[#0898A0]">{key}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <View className="w-[33%] items-center mb-4">
        <TouchableOpacity
          onPress={onDelete}
          className="w-[71px] h-[71px] bg-[#71879C1A] rounded-full justify-center items-center"
        >
          <Ionicons name="backspace-outline" size={24} color="#0898A0" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomKeypad;
