// import React from 'react';
// import { Pressable, StyleSheet, View } from 'react-native';
// import { Calendar as RNCalendar } from 'react-native-calendars';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { APP_COLOR } from 'src/core/constants/colorConstants';
// import { withModal } from 'src/providers/modalService';

// // Calendar component wrapped with modal functionality
// export const CalendarModal = withModal(({ onDateSelected, closeModal ,currentDate}: { onDateSelected: (day: any) => void, closeModal: () => void ,currentDate:string}) => {
//   const { top } = useSafeAreaInsets();
//   return (
//     <Pressable
//       style={{
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         flex: 1,
//         paddingTop: top,
//         paddingHorizontal: '5%',
//         justifyContent: 'center',
//       }}
//       onPress={closeModal}>
//       <View
//         style={{
//           backgroundColor: 'red',
//           alignItems: 'center',
//         }}
//       />

//       <RNCalendar
//         onDayPress={(day: any) => {
//           onDateSelected?.(day);
//           closeModal();
//         }}
//         current={currentDate}
//         style={s.calendar}
//         enableSwipeMonths={true}
//         theme={{
//           calendarBackground: 'color',
//           backgroundColor: 'green',
//           textSectionTitleColor: APP_COLOR.MAIN_GREEN,
//           todayTextColor: APP_COLOR.MAIN_DARK,
//           dayTextColor: APP_COLOR.MAIN_GREEN,
//           textDayFontWeight: '500',
//           textMonthFontWeight: 'bold',
//           textDayHeaderFontWeight: 'bold',
//           monthTextColor: APP_COLOR.MAIN_GREEN,
//           arrowColor: APP_COLOR.MAIN_GREEN,
//           todayBackgroundColor: APP_COLOR.ACCENT_GREEN,
//           selectedDayTextColor: APP_COLOR.MAIN_GREEN,
//           selectedDayBackgroundColor: APP_COLOR.ACCENT_GREEN,
//         }}
//       />
//     </Pressable>
//   );
// });

// const s = StyleSheet.create({
//   calendar: {
//     borderWidth: 0.5,
//     borderColor: 'gray',
//     backgroundColor: "#71879C1A",
//     borderRadius: 13,
//     paddingHorizontal: 16,
//   },
// });
