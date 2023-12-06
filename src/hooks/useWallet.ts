import constate from 'constate';
import { ethers, Wallet, utils } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletHelper } from '../utils/helpers/WalletHelper';
import {
    DAI_DATA,
    USDC_DATA,
    USDT_DATA,
    POLYGON_USDC_DATA,
    POLYGON_DAI_DATA,
    POLYGON_USDT_DATA,
    ARBITRUM_DAI_DATA,
    BSC_BUSD_DATA,
    POLYGON_USDC_E_DATA,
} from '../utils/constants/CryptoConstants';

//Constants
const MNEMONIC_STORAGE_KEY = 'MNEMONIC_STORAGE_KEY';
export const ethProvider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com");
export const polygonProvider = new ethers.providers.JsonRpcProvider("https://polygon.llamarpc.com");
export const arbitrumProvider = new ethers.providers.JsonRpcProvider("https://arbitrum.llamarpc.com");
export const bscProvider = new ethers.providers.JsonRpcProvider("https://binance.llamarpc.com");
export const avocadoProvider = new ethers.providers.JsonRpcProvider("https://rpc.avocado.instadapp.io");
const forwarderContractAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54';
const forwarderABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
            },
            {
                "internalType": "uint32",
                "name": "index_",
                "type": "uint32"
            }
        ],
        "name": "computeAvocado",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const contract = new ethers.Contract(forwarderContractAddress, forwarderABI, polygonProvider);

function _useWallet() {
    //States
    const [address, setAddress] = useState('');
    const [avoPersonalAddress, setAvoPersonalAddress] = useState('');
    const [avoMultiSignAddress, setAvoMultisignAddress] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [phrase, setPhrase] = useState('');
    const [wallet, setWallet] = useState<ethers.utils.HDNode | null>(null);
    const [ethWallet, setEthWallet] = useState<ethers.Wallet>();
    const [isGettingBalance, setIsGettingBalance] = useState(false);
    const [usdcBalance, setUsdcBalance] = useState('0');
    const [usdceBalance, setUsdceBalance] = useState('0');
    const [daiBalance, setDaiBalance] = useState('0');
    const [usdtBalance, setUsdtBalance] = useState('0');
    const [busdBalance, setBusdBalance] = useState('0');
    const [isGettingAvoBalance, setIsGettingAvoBalance] = useState(false);
    const [avoUsdcBalance, setAvoUsdcBalance] = useState('0');
    const [avoUsdceBalance, setAvoUsdceBalance] = useState('0');
    const [avoDaiBalance, setAvoDaiBalance] = useState('0');
    const [avoUsdtBalance, setAvoUsdtBalance] = useState('0');
    const [avoBusdBalance, setAvoBusdBalance] = useState('0');

    const isWalletInitialized = useMemo(() => !!address && !!avoPersonalAddress,
        [address, avoPersonalAddress]
    );

    //Effects
    useEffect(() => {
        // initSeedphraseWallet();
        checkStorageSeedPhrase();
    }, [])

    useEffect(() => {
        getBalances();
    }, [address])

    useEffect(() => {
        getAvoBalances();
    }, [avoPersonalAddress])

    async function checkStorageSeedPhrase() {
        //FIXME: save to storage to prevent re-init everytime
        let mnemonic = await AsyncStorage.getItem(MNEMONIC_STORAGE_KEY) ?? '';
        setPhrase(mnemonic);
    }


    async function initSeedphraseWallet(storageAware: boolean = true) {
        //FIXME: save to storage to prevent re-init everytime
        let mnemonic = await AsyncStorage.getItem(MNEMONIC_STORAGE_KEY) ?? '';
        if (!storageAware || !mnemonic) {
            const randomBytes = utils.randomBytes(16);
            mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
            await AsyncStorage.setItem(MNEMONIC_STORAGE_KEY, mnemonic);
        }

        setTimeout(() => {
            generateWalletFromPhrase(mnemonic);
        }, 100);
    }

    async function validateMnemonic(mnemonic: string) {
        return ethers.utils.isValidMnemonic(mnemonic);
    }

    async function createWallet(phrase: string) {
        //Reset data
        setWallet(null);
        setAddress('');
        setAvoPersonalAddress('');
        setAvoMultisignAddress('');
        setPublicKey('');
        setEthWallet(undefined);
        //Create new
        setTimeout(async () => {
            const nWallet = ethers.utils.HDNode.fromMnemonic(phrase).derivePath("m/44'/60'/0'/0/0");
            setWallet(nWallet);
            setAddress(nWallet.address);
            const [personalAddress, multiSignAddress] = await Promise.all([
                contract.computeAvocado(nWallet.address, 0),
                contract.computeAvocado(nWallet.address, 1),
            ]);
            setAvoPersonalAddress(personalAddress);
            setAvoMultisignAddress(multiSignAddress);
            setPublicKey(nWallet.publicKey);
            setEthWallet(new ethers.Wallet(nWallet));
        }, 100);
        // console.log(await avoProvider.send('api_getSafes', [{address: nWallet.address}]))
    }

    function generateWalletFromPhrase(phrase: string) {
        setPhrase(phrase);
        createWallet(phrase);
    }

    function signMessage(message: string | ethers.utils.Bytes) {
        return ethWallet?.signMessage(message);
    }

    async function getBalances() {
        if (!address) {
            setUsdcBalance('0');
            setUsdceBalance('0');
            setDaiBalance('0');
            setUsdtBalance('0');
            setBusdBalance('0');
            return;
        }
        if (isGettingBalance) {
            return;
        }
        setIsGettingBalance(true);

        const [usdcBL, usdceBL, daiBL, usdtBL, busdBL] = await Promise.all([
            WalletHelper.getTokenBalance(
                polygonProvider,
                POLYGON_USDC_DATA.address,
                POLYGON_USDC_DATA.decimals,
                address,
            ),
            WalletHelper.getTokenBalance(
                polygonProvider,
                POLYGON_USDC_E_DATA.address,
                POLYGON_USDC_E_DATA.decimals,
                address,
            ),
            WalletHelper.getTokenBalance(
                arbitrumProvider,
                ARBITRUM_DAI_DATA.address,
                ARBITRUM_DAI_DATA.decimals,
                address,
            ),
            WalletHelper.getTokenBalance(
                ethProvider,
                USDC_DATA.address,
                USDC_DATA.decimals,
                address,
            ),
            WalletHelper.getTokenBalance(
                bscProvider,
                BSC_BUSD_DATA.address,
                BSC_BUSD_DATA.decimals,
                address,
            ),
        ]);
        setUsdcBalance(usdcBL);
        setUsdceBalance(usdceBL);
        setDaiBalance(daiBL);
        setUsdtBalance(usdtBL);
        setBusdBalance(busdBL);
        setIsGettingBalance(false);
    }

    async function getAvoBalances() {
        if (!avoPersonalAddress) {
            setAvoUsdcBalance('0');
            setAvoUsdceBalance('0');
            setAvoDaiBalance('0');
            setAvoUsdtBalance('0');
            setAvoBusdBalance('0');
            return;
        }
        if (isGettingAvoBalance) {
            return;
        }
        setIsGettingAvoBalance(true);

        const [usdcBL, usdceBL, daiBL, usdtBL, busdBL] = await Promise.all([
            WalletHelper.getTokenBalance(
                polygonProvider,
                POLYGON_USDC_DATA.address,
                POLYGON_USDC_DATA.decimals,
                avoPersonalAddress,
            ),
            WalletHelper.getTokenBalance(
                polygonProvider,
                POLYGON_USDC_E_DATA.address,
                POLYGON_USDC_E_DATA.decimals,
                avoPersonalAddress,
            ),
            WalletHelper.getTokenBalance(
                arbitrumProvider,
                ARBITRUM_DAI_DATA.address,
                ARBITRUM_DAI_DATA.decimals,
                avoPersonalAddress,
            ),
            WalletHelper.getTokenBalance(
                ethProvider,
                USDC_DATA.address,
                USDC_DATA.decimals,
                avoPersonalAddress,
            ),
            WalletHelper.getTokenBalance(
                bscProvider,
                BSC_BUSD_DATA.address,
                BSC_BUSD_DATA.decimals,
                avoPersonalAddress,
            ),
        ]);
        setAvoUsdcBalance(usdcBL);
        setAvoUsdceBalance(usdceBL);
        setAvoDaiBalance(daiBL);
        setAvoUsdtBalance(usdtBL);
        setAvoBusdBalance(busdBL);
        setIsGettingAvoBalance(false);

    }

    async function transferTokensToAvocadoWallet() {
        if (!address || !avoPersonalAddress || !wallet) {
            return false;
        }

        const [usdcTransferRes, usdceTransferRes, daiTransferRes, usdtTransferRes, busdTransferRes] = await Promise.all([
            WalletHelper.transferToken(
                polygonProvider,
                POLYGON_USDC_DATA.address,
                POLYGON_USDC_DATA.decimals,
                wallet,
                avoPersonalAddress,
                usdcBalance,
            ),
            WalletHelper.transferToken(
                polygonProvider,
                POLYGON_USDC_E_DATA.address,
                POLYGON_USDC_E_DATA.decimals,
                wallet,
                avoPersonalAddress,
                usdceBalance,
            ),
            WalletHelper.transferToken(
                arbitrumProvider,
                ARBITRUM_DAI_DATA.address,
                ARBITRUM_DAI_DATA.decimals,
                wallet,
                avoPersonalAddress,
                daiBalance,
            ),
            WalletHelper.transferToken(
                ethProvider,
                USDC_DATA.address,
                USDC_DATA.decimals,
                wallet,
                avoPersonalAddress,
                usdtBalance,
            ),
            WalletHelper.transferToken(
                bscProvider,
                BSC_BUSD_DATA.address,
                BSC_BUSD_DATA.decimals,
                wallet,
                avoPersonalAddress,
                busdBalance,
            ),
        ]);

        return (!!usdcTransferRes || usdcBalance == '0') &&
            (!!usdceTransferRes || usdceBalance == '0') &&
            (!!daiTransferRes || daiBalance == '0') &&
            (!!usdtTransferRes || usdtBalance == '0') &&
            (!!busdTransferRes || busdBalance == '0');
    }
    async function transferATokenToAvocadoWallet(
        provider: Provider,
        token: typeof POLYGON_USDC_DATA,
        amount: string,
    ) {
        if (!address || !avoPersonalAddress || !wallet) {
            return false;
        }

        const res = await WalletHelper.transferToken(
            provider,
            token.address,
            token.decimals,
            wallet,
            avoPersonalAddress,
            amount,
        ) 
        return !!res || amount == '0';
    }

    return {
        isWalletInitialized,
        address,
        avoPersonalAddress,
        avoMultiSignAddress,
        phrase,
        setPhrase,
        generateWalletFromPhrase,
        validateMnemonic,
        initSeedphraseWallet,
        createWallet,
        signMessage,
        wallet,
        publicKey,
        provider: polygonProvider,
        //
        usdcBalance,
        usdceBalance,
        daiBalance,
        usdtBalance,
        busdBalance,
        avoUsdcBalance,
        avoUsdceBalance,
        avoDaiBalance,
        avoUsdtBalance,
        avoBusdBalance,
        getBalances,
        getAvoBalances,
        transferTokensToAvocadoWallet,
        transferATokenToAvocadoWallet,
    };
}

const [WalletProvider, useWallet] = constate(_useWallet);

export { useWallet, WalletProvider };
