import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Spacer from '../../components/Spacer';
import QRCode from 'react-native-qrcode-svg';
import CustomOverlaySpinner from '../../components/CustomOverlaySpinner';

const AvocadoWalletScreen: React.FC = () => {
  //Hooks
  const { navigate } = useNavigation<any>();
  const route: RouteProp<any, ''> = useRoute();
  const {
    isWalletInitialized,
    avoPersonalAddress,
    avoMultiSignAddress,
    getAvoBalances,
    avoUsdcBalance,
    avoUsdceBalance,
    avoDaiBalance,
    avoUsdtBalance,
    avoBusdBalance,
  } = useWallet();

  //States

  //Effects
  useFocusEffect(
    React.useCallback(() => {
      getAvoBalances();
    }, [route, avoPersonalAddress]),
  );

  const renderAddress = () => {
    if (!avoPersonalAddress) {
      return (
        <ActivityIndicator size={'large'} color={'#123'} />
      )
    }

    return (
      <View style={styles.addressWrapper}>
        <QRCode size={200} value={avoPersonalAddress} />
        <Spacer height={10} />
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(avoPersonalAddress);
          }}
        >
          <Text style={styles.txtAddress}>{avoPersonalAddress}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderBalanceItem = (title: string, balance: string) => {
    return (
      <View style={styles.tokenItem}>
        <Text style={styles.txtTokenInfo}>{`${title}: ${balance}`}</Text>
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
        <Text style={styles.txtBalanceTitle}>Avocado Balances</Text>
        <Spacer height={10} />
        {renderBalanceItem('USDC (Polygon)', avoUsdcBalance)}
        {renderBalanceItem('USDC.E (Polygon)', avoUsdceBalance)}
        {renderBalanceItem('DAI (Arb)', avoDaiBalance)}
        {renderBalanceItem('USDT (Eth)', avoUsdtBalance)}
        {renderBalanceItem('BUSD (Bsc)', avoBusdBalance)}
        <View style={styles.flexOne} />
        <TouchableOpacity
          style={styles.btnNavigate}
          onPress={() => {
            navigate('EOAWalletScreen');
          }}
        >
          <Text style={styles.btnText}>Go to EOA wallet</Text>
        </TouchableOpacity>
        <Spacer height={30} />
      </ScrollView>
      <CustomOverlaySpinner visible={!isWalletInitialized} />
    </View>
  );
}

export default AvocadoWalletScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#2e5',
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
    // flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  txtTokenInfo: {
    // flexShrink: 1,
    // maxWidth: '60%',
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
  btnNavigate: {
    height: 48,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 6,
    borderColor: '#333',
  },
  btnText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})