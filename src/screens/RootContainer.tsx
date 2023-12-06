import React from 'react';
import { Text, View } from 'react-native';
import AppNavigation from '../navigations/AppNavigation';

export default function RootContainer() {

    return (
        <View style={{flex: 1}}>
            <AppNavigation />
        </View>
    )
};