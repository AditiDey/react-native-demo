import React, { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { View, Text, Button, Image, TextInput } from 'react-native';

import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [showMorePage, setShowMorePage] = useState(false); // Track if the "For More" page should be shown

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      expoClientId: '276714645070-6dh9brrg9augn2eemc070aeccv95a9oc.apps.googleusercontent.com',
      clientId: '276714645070-pnr5010p7pu4aagn1mluv7ns248j1iih.apps.googleusercontent.com',
      androidClientId: '276714645070-ptnh1ldhjehhp4fna2v8o6c9subu6hgi.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
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
      setLoginSuccessful(true); // Set loginSuccessful to true after successful login
    } catch (error) {
      // Add your own error handler here
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
    setLoginSuccessful(false); // Set loginSuccessful to false on logout
  };

  const handleLearnMore = () => {
    WebBrowser.openBrowserAsync('https://arthmate.com');
  };

  const handleRedirect = () => {
    setShowMorePage(true); // Show the "For More" page
  };

  const handleBack = () => {
    setShowMorePage(false); // Go back to the initial page
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 50, textAlign: 'center' }}>
        Arthmate Direct
      </Text>
      {user ? (
        <View style={{ marginTop: 30 }}>
          {loginSuccessful && !showMorePage ? ( // Show the login successful message only on the initial page
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
              <Button title="Back" onPress={handleBack} style={{ marginTop: 20 }} />
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
              <Button
                title={loginSuccessful ? "For more" : "Learn More"}
                onPress={loginSuccessful ? handleRedirect : handleLearnMore}
              />
              {loginSuccessful ? (
                <Button title="Learn More" onPress={handleLearnMore} />
              ) : null}
            </View>
          )}

          <TextInput
            value={JSON.stringify(user)} // Convert user object to string for display
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
}

