import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '@/screens/welcome/WelcomeScreen'
import HomeScreen from '@/screens/home/HomeScreen'

type AppStackParamList = {
  Welcome: undefined
  Home: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function App () {
  return (
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
  )
}
