import './shim';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import RootContainer from './src/screens/RootContainer';
import HooksProvider from './src/hooks/HookProviders';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

function App(): JSX.Element {

  const backgroundStyle = {
    backgroundColor: '#FFF',
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <HooksProvider>
        <RootContainer />
      </HooksProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
