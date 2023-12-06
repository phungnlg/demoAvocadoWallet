import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EnterSeedScreen from '../screens/EnterSeedScreen/EnterSeedScreen';
import EOAWalletScreen from '../screens/EOAWalletScreen/EOAWalletScreen';
import AvocadoWalletScreen from '../screens/AvocadoWalletScreen/AvocadoWalletScreen';

const Stack = createNativeStackNavigator<any>();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='EnterSeedScreen'>
            <Stack.Screen name="EnterSeedScreen" component={EnterSeedScreen} />
            <Stack.Screen name="EOAWalletScreen" component={EOAWalletScreen} />
            <Stack.Screen name="AvocadoWalletScreen" component={AvocadoWalletScreen} />
        </Stack.Navigator>
    )
}

export default function AppNavigation() {
    return (
        <NavigationContainer>
            {StackNavigator()}
        </NavigationContainer>
    );
}