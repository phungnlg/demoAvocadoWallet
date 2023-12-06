import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Spacer from '../../components/Spacer';
import CustomOverlaySpinner from '../../components/CustomOverlaySpinner';
import Clipboard from '@react-native-clipboard/clipboard';


const EnterSeedScreen: React.FC = () => {
  //Hooks
  const { navigate } = useNavigation<any>();
  const route: RouteProp<any, ''> = useRoute();
  const {
    phrase,
    validateMnemonic,
    initSeedphraseWallet,
    generateWalletFromPhrase,
  } = useWallet();

  //States
  const [isLoading, setIsLoading] = useState(false);
  const [seedphrase, setSeedphrase] = useState(phrase);

  //Effects
  useFocusEffect(
    React.useCallback(() => {
    }, [route, phrase]),
  );

  const handleSeedphrase = async () => {
    if (!seedphrase) {
      Alert.alert('Seedphrase is empty');
      return;
    }

    setIsLoading(true);
    const validation = await validateMnemonic(seedphrase);
    setIsLoading(false);

    if (!validation) {
      Alert.alert('Seedphrase is invalid');
      return;
    }

    navigate('EOAWalletScreen');
    setTimeout(() => {
      generateWalletFromPhrase(seedphrase);
    }, 100);
  }

  return (
    <View style={styles.flexOne}>
      <ScrollView
        style={styles.flexOne}
        contentContainerStyle={styles.container}
      >
        <Spacer height={20} />
        <TextInput
          value={seedphrase}
          style={styles.seedInput}
          placeholder='Enter seed...'
          onChange={(e) => {
            setSeedphrase(e.nativeEvent?.text);
          }}
          multiline
        // secureTextEntry={true}
        />
        <Spacer height={10} />
        <TouchableOpacity
          style={styles.btnConfirm}
          onPress={() => {
            handleSeedphrase();
          }}
        >
          <Text style={styles.btnText}>Confirm</Text>
        </TouchableOpacity>

        <View style={styles.flexOne} />
        <Text style={styles.txtOr}>OR</Text>
        <View style={styles.flexOne} />

        {phrase ? (
          <>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(phrase);
              }}
            >
              <Text style={styles.txtPhrase}>Current seed phrase: {phrase}</Text>
            </TouchableOpacity>
            <Spacer height={10} />
            <TouchableOpacity
              style={styles.btnCreateNew}
              onPress={() => {
                navigate('EOAWalletScreen');
                setTimeout(() => {
                  initSeedphraseWallet();
                }, 100)
              }}
            >
              <Text style={styles.btnText}>Access Wallet</Text>
            </TouchableOpacity>
          </>
        ) : undefined}
        <Spacer height={30} />
        <TouchableOpacity
          style={styles.btnCreateNew}
          onPress={() => {
            navigate('EOAWalletScreen');
            setTimeout(() => {
              initSeedphraseWallet(false);
            }, 100)
          }}
        >
          <Text style={styles.btnText}>Create new Wallet</Text>
        </TouchableOpacity>
        <Spacer height={30} />
      </ScrollView >
      <CustomOverlaySpinner visible={isLoading} />
    </View>

  );
}

export default EnterSeedScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  seedInput: {
    minHeight: 120,
    width: '80%',
    color: '#000',
    fontSize: 16,
    textAlign: 'left',
    textAlignVertical: 'center',
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#333',
  },
  txtOr: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  txtPhrase: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  btnConfirm: {
    height: 48,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#333',
  },
  btnCreateNew: {
    height: 48,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#333',
  },
  btnText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})