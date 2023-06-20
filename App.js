import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [showMorePage, setShowMorePage] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      expoClientId: '276714645070-6dh9brrg9augn2eemc070aeccv95a9oc.apps.googleusercontent.com',
      clientId: '276714645070-pnr5010p7pu4aagn1mluv7ns248j1iih.apps.googleusercontent.com',
      androidClientId: '276714645070-ptnh1ldhjehhp4fna2v8o6c9subu6hgi.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      prompt: 'consent',
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUser(user);
      setLoginSuccessful(true);
    } catch (error) {

    }
  };

  const handleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginSuccessful(false);
    navigation.navigate('Arthmate'); 
  };

  const handleLearnMore = () => {
    WebBrowser.openBrowserAsync('https://arthmate.com');
  };

  const handleRedirect = () => {
    setShowMorePage(true);
  };

  const handleBack = () => {
    setShowMorePage(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 50, textAlign: 'center' }}>
        Arthmate Direct
      </Text>
      {user ? (
        <View style={{ marginTop: 30 }}>
          {loginSuccessful && !showMorePage ? (
            <Text>
              Login is successful!
            </Text>
          ) : null}
          {showMorePage ? (
            <View>
              <TextInput
                value="Login is successful"
                multiline
                editable={false}
                style={{ borderWidth: 1, borderColor: 'blue', marginTop: 20, padding: 20 }}
              />
              <Button title="Back" onPress={handleBack} style={{ marginTop: 40 }} />
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 20, padding: 50 }}>
              <Image
                source={{
                  uri: 'https://www.arthmate.com/storage/company/2022-12-30-63ae7284252bc.png',
                }}
                style={{ width: 400, height: 200 }}
                resizeMode="contain"
              />
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 60 }}>
              <Button
                 title={loginSuccessful ? "For more" : "Learn More"}
               onPress={loginSuccessful ? handleRedirect : handleLearnMore}
               />
            {loginSuccessful ? (
            <Button title="Learn More" onPress={handleLearnMore} />
           ) : null}
          </View>

            </View>
          )}

          <TextInput
            value={JSON.stringify(user)}
            multiline
            editable={false}
            style={{ borderWidth: 1, borderColor: 'blue', marginTop: 20, padding: 20 }}
          />
          <Button title="Logout" onPress={handleLogout} style={{ marginTop: 20 }} />
        </View>
      ) : (
        <Button title="Login with Google" onPress={handleLogin} />
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
