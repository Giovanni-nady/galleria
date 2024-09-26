import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '@/screens/welcome/WelcomeScreen'
import HomeScreen from '@/screens/home/HomeScreen'
import {
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type AppStackParamList = {
  Welcome: undefined
  Home: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function App () {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name='Welcome' component={WelcomeScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
