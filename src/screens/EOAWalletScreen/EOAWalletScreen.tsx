import React, { useState } from 'react';
import { Provider } from '@ethersproject/providers';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { arbitrumProvider, bscProvider, ethProvider, polygonProvider, useWallet } from '../../hooks/useWallet';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Spacer from '../../components/Spacer';
import QRCode from 'react-native-qrcode-svg';
import CustomOverlaySpinner from '../../components/CustomOverlaySpinner';
import { ARBITRUM_DAI_DATA, BSC_BUSD_DATA, POLYGON_USDC_DATA, POLYGON_USDC_E_DATA, USDT_DATA } from '../../utils/constants/CryptoConstants';


const EOAWalletScreen: React.FC = () => {
  //Hooks
  const { navigate } = useNavigation<any>();
  const route: RouteProp<any, ''> = useRoute();
  const {
    isWalletInitialized,
    address,
    getBalances,
    usdcBalance,
    usdceBalance,
    daiBalance,
    usdtBalance,
    busdBalance,
    transferTokensToAvocadoWallet,
    transferATokenToAvocadoWallet,
  } = useWallet();

  //States
  const [isLoading, setIsLoading] = useState(false);

  //Effects
  useFocusEffect(
    React.useCallback(() => {
      getBalances();
    }, [route, address]),
  );

  const handleTransferItem = async (
    provider: Provider,
    type: typeof POLYGON_USDC_DATA,
    balance: string,
  ) => {
    setIsLoading(true);
    const result = await transferATokenToAvocadoWallet(provider, type, balance);
    setIsLoading(false);

    if (result) {
      Alert.alert('Succeed!', balance == '0' ? 'Since amount is 0' : '',
        [
          {
            text: 'Ok',
            onPress: () => {
              navigate('AvocadoWalletScreen');
            }
          }
        ]
      );
    } else {
      Alert.alert('Failed!', '',
        [
          {
            text: 'Ok',
            onPress: () => { }
          }
        ]
      );
    }
  }

  const handleTransferAll = async () => {
    setIsLoading(true);
    const result = await transferTokensToAvocadoWallet();
    setIsLoading(false);

    if (result) {
      Alert.alert('Succeed!', '',
        [
          {
            text: 'Ok',
            onPress: () => {
              navigate('AvocadoWalletScreen');
            }
          }
        ]
      );
    } else {
      Alert.alert('Failed!', '',
        [
          {
            text: 'Ok',
            onPress: () => { }
          }
        ]
      );
    }
  }

  const renderAddress = () => {
    if (!address) {
      return (
        <ActivityIndicator size={'large'} color={'#123'} />
      )
    }

    return (
      <View style={styles.addressWrapper}>
        <QRCode size={200} value={address} />
        <Spacer height={10} />
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(address);
          }}
        >
          <Text style={styles.txtAddress}>{address}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBalanceItem = (
    title: string,
    balance: string,
    type: typeof POLYGON_USDC_DATA,
    provider: Provider,
  ) => {
    return (
      <View style={styles.tokenItem}>
        <Text style={styles.txtTokenInfo}>{`${title}: ${balance}`}</Text>
        <Spacer width={20} />
        <TouchableOpacity
          style={styles.btnTransferItem}
          onPress={() => {
            handleTransferItem(provider, type, balance);
          }}
        >
          <Text>Transfer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.flexOne}>
      <ScrollView
        style={styles.flexOne}
        contentContainerStyle={styles.container}
      >
        <Spacer height={20} />
        {renderAddress()}
        <Spacer height={30} />
        <Text style={styles.txtBalanceTitle}>EOA Balances</Text>
        <Spacer height={10} />
        {renderBalanceItem('USDC (Polygon)', usdcBalance, POLYGON_USDC_DATA, polygonProvider)}
        {renderBalanceItem('USDC.E (Polygon)', usdceBalance, POLYGON_USDC_E_DATA, polygonProvider)}
        {renderBalanceItem('DAI (Arb)', daiBalance, ARBITRUM_DAI_DATA, arbitrumProvider)}
        {renderBalanceItem('USDT (Eth)', usdtBalance, USDT_DATA, ethProvider)}
        {renderBalanceItem('BUSD (Bsc)', busdBalance, BSC_BUSD_DATA, bscProvider)}
        <Spacer height={20} />
        <TouchableOpacity
          style={styles.btnTransfer}
          onPress={() => {
            handleTransferAll();
          }}
        >
          <Text style={styles.btnText}>Transfer all to Avocado</Text>
        </TouchableOpacity>

        <View style={styles.flexOne} />
        <TouchableOpacity
          style={styles.btnNavigate}
          onPress={() => {
            navigate('AvocadoWalletScreen');
          }}
        >
          <Text style={styles.btnText}>Go to Avocado wallet</Text>
        </TouchableOpacity>
        <Spacer height={30} />
      </ScrollView >
      <CustomOverlaySpinner visible={!isWalletInitialized || isLoading} />
    </View>

  );
}

export default EOAWalletScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#aee',
    alignItems: 'center',
  },
  addressWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  txtAddress: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 8,
  },
  txtBalanceTitle: {
    color: '#000',
    fontSize: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  tokenItem: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  txtTokenInfo: {
    flexShrink: 1,
    maxWidth: '60%',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  btnTransferItem: {
    height: 48,
    width: 86,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e5',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#1f9',
  },
  btnTransfer: {
    height: 48,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e5',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#1f9',
  },
  btnNavigate: {
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