import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-native-paper';
import {theme} from './themes/themeoptions';
import Loading from './views/Loading';
import MainView from './views/MainView';
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <Provider theme={theme}>

      <View style={styles.container}>
        {isLoading ? <Loading /> : <MainView />}
        <StatusBar style="auto" />
      </View>
    </Provider>

  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});