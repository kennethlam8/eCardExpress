/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, { useRef } from 'react';
import { createStackNavigator, CardStyleInterpolators, } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginMain from './src/views/screens/LoginMain';
import LoginStep2 from './src/views/screens/LoginStep2';
import LoginStep3 from './src/views/screens/LoginStep3';
import Footer from './src/views/components/Footer';
import Qrcode from './src/views/screens/Qrcode';
import Camera from './src/views/screens/Camera';
import Album from './src/views/screens/Album';
import COLORS from './src/conts/colors';
import EventDetail from './src/views/screens/EventDetail';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import CardCreate from './src/views/screens/CardCreate';
import EventCreate from './src/views/screens/EventCreate';
import UserRegister from './src/views/screens/UserRegister';
import EmailVerification from './src/views/screens/EmailVerification';
import CardStyle from './src/views/screens/CardStyle';
import Scan from './src/views/screens/Scan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket, SocketContext } from './src/views/components/Socket';
import { SocketListener } from './src/views/components/SocketListener';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Text, View } from 'react-native';
import { CardRequest } from './src/views/screens/CardRequest';
import { navigationRef } from './RootNavigation';
import CardDetail from './src/views/screens/CardDetail';
import EventEdit from './src/views/screens/EventEdit';
import ProfileEdit from './src/views/screens/ProfileEdit';
import EventGroup from './src/views/screens/EventGroup';
import QrcodeShow from './src/views/screens/QrcodeShow';
import { WithSplashScreen } from './src/views/components/Splash';
import Loading from './src/views/screens/Loading';
import SearchCard from './src/views/components/SearchCard';



const Stack = createStackNavigator();

//custom toast config
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
    // text2Style={{
    //   fontSize: 15
    // }}
    />
  ),
  requestToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '80%', backgroundColor: 'pale green' }}>
      <Text>{text1}</Text>
    </View>
  )
};

const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const checkUserLogInStatus = async () => {
  //   try {
  //     let value = await AsyncStorage.getItem('isLoggedIn');
  //     if (value) setIsLoggedIn(true)
  //   }
  //   catch (e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   checkUserLogInStatus()
  // }, [])

  //const store = useRef(undefined);
  const queryClient = useRef(undefined);

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    /* initialize().then((context) => {
            setIsAppReady(true);
    }); */
    setIsAppReady(true);
  }, []);

  async function initialize() {
    //inital await function
  }

  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <Provider store={store}>
        <SocketContext.Provider value={socket}>
          <SocketListener />
        </SocketContext.Provider>

        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }} >

            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{
                headerShown: false
              }}
            />

            <Stack.Screen
              name="LoginMain"
              component={LoginMain}
              options={{
                headerShown: false
              }}
            />

            <Stack.Screen
              name="LoginStep2"
              component={LoginStep2}
              options={{
                headerShown: false
              }} />

            <Stack.Screen
              name="LoginStep3"
              component={LoginStep3}
              options={{
                headerShown: false
              }} />

            <Stack.Screen
              name="UserRegister"
              component={UserRegister}
              options={{
                headerShown: false
              }} />

            <Stack.Screen
              name="EmailVerification"
              component={EmailVerification}
              options={{
                headerShown: false
              }} />


            <Stack.Screen
              name="Footer"
              component={Footer}
              options={({ navigation }) => ({
                headerShown: false,
                navigation,
              })}
            />
            <Stack.Screen
              name="SearchCard"
              component={SearchCard}
              options={({ navigation }) => ({
                headerShown: false,
                navigation,
              })}
            />

            <Stack.Screen
              name="CardCreate"
              component={CardCreate}
              options={{
                headerBackTitleVisible: false,
                title: "Create Card",
                headerStyle: { backgroundColor: COLORS.veryLight },
                headerTintColor: COLORS.black,
                headerTitleStyle: { alignContent: 'center', fontWeight: 'bold', color: COLORS.black }, //back button style
                headerBackTitleStyle: { color: COLORS.black }
              }}
            />
            <Stack.Screen
              name="CardRequest"
              component={CardRequest}
              options={{
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }} />

            <Stack.Screen
              name="CardDetail"
              component={CardDetail}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEdit}
              options={{
                headerShown: false
              }}
            />


            <Stack.Screen
              name="Qrcode"
              component={Qrcode}
              options={{
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }} />
            <Stack.Screen
              name="Upload Card"
              component={Camera}
              options={{
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }} />
            <Stack.Screen
              name="Scan"
              component={Scan}
              options={{
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }} />
            <Stack.Screen
              name="Album"
              component={Album}
              options={{
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }} />

            <Stack.Screen
              name="EventCreate"
              component={EventCreate}
              options={
                {
                  title: "Create Event",
                  headerBackTitleVisible: false,
                  headerStyle: { backgroundColor: COLORS.primaryColor },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }} />

            <Stack.Screen
              name="EventDetail"
              component={EventDetail}
              options={
                {
                  title: "Event Detail",
                  headerBackTitleVisible: false,
                  headerStyle: { backgroundColor: COLORS.primaryColor },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }} />

            <Stack.Screen
              name='EventEdit'
              component={EventEdit}
              options={
                {
                  title: "Edit Event",
                  headerBackTitleVisible: false,
                  headerStyle: { backgroundColor: COLORS.primaryColor },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }} />

            <Stack.Screen
              name='EventGroup'
              component={EventGroup}
              options={
                {
                  title: "Event Group",
                  headerBackTitleVisible: false,
                  headerStyle: { backgroundColor: COLORS.primaryColor },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }} />



            <Stack.Screen
              name="CardStyle"
              component={CardStyle}
              options={{
                headerShown: false
              }}
            />

            <Stack.Screen
              name="Qrcode Show"
              component={QrcodeShow}
              options={{
                title: "My Card Code",
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.primaryColor },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />

          </Stack.Navigator>
        </NavigationContainer >
        <Toast config={toastConfig} />
      </Provider>
    </WithSplashScreen>
  );
};


export default App;
function createReduxStore() {
  throw new Error('Function not implemented.');
}

