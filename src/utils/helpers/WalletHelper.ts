import { Provider } from '@ethersproject/providers';
import { BigNumber, Wallet, ethers } from 'ethers';

const commonABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function decimals() public view returns (uint8)',
]
export class WalletHelper {
    static async getTokenBalance(
        provider: Provider,
        tokenAddress: string,
        tokenAmount: number,
        address: string,
    ) {
        try {
            const contract = new ethers.Contract(
                tokenAddress,
                commonABI,
                provider,
            );
            // const decimals = await contract.decimals();
            // console.log('decimals --,>', tokenAddress, decimals);

            const balance = await contract.balanceOf(address);
            // console.log('balance --,>', tokenAddress, address, balance, ethers.utils.formatUnits(balance, tokenAmount));

            return ethers.utils.formatUnits(balance, tokenAmount);
        } catch (error) {
            console.log("getTokenBalance error", error);
            return '0';
        }
    }

    static async transferToken(
        provider: Provider,
        tokenAddress: string,
        tokenAmount: number,
        wallet: ethers.utils.HDNode,
        recipient: string,
        amount: string,
    ) {
        try {
            const nonce = await provider.getTransactionCount(wallet.address);
            const UserWallet = new Wallet(wallet.privateKey, provider);

            const contract = new ethers.Contract(
                tokenAddress,
                commonABI,
                provider,
            );

            const sendableAmount = amount?.startsWith('0x')
                ? amount
                : ethers.utils.parseUnits(amount, tokenAmount);
            

            const gasFee = await WalletHelper.calculateTransferFee(
                provider,
                tokenAddress,
                tokenAmount,
                wallet,
                recipient,
                amount,
            )

            const gasPrice = ethers.utils.hexValue(gasFee.gasPrice);
            const gasLimit = ethers.utils.hexValue(gasFee.gasLimit);

            const tx = {
                to: tokenAddress,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                value: 0,
                nonce: ethers.utils.hexValue(nonce),
                data: contract.interface.encodeFunctionData("transfer", [
                    recipient,
                    sendableAmount,
                ]),
            };

            await UserWallet.signTransaction(tx);
            const txRes = await UserWallet.sendTransaction(tx);

            return txRes.hash;
        } catch (error) {
            console.log("transferToken error", error);
            return '';
        }
    }

    static async calculateTransferFee(
        provider: Provider,
        tokenAddress: string,
        tokenAmount: number,
        wallet: any,
        recipient: string,
        amount: string
    ) {
        const UserWallet = new Wallet(wallet.privateKey, provider);

        const amountToSend = amount?.startsWith('0x')
            ? amount
            : ethers.utils.parseUnits(amount, tokenAmount);

        const contract = new ethers.Contract(
            tokenAddress,
            commonABI,
            UserWallet,
        );

        let gasLimit = BigNumber.from(240000);
        try {
            gasLimit = await contract.estimateGas.transfer(
                recipient,
                amountToSend,
            );
        } catch (e) { }

        const gasPrice = await provider.getGasPrice();

        return {
            gasLimit: gasLimit,
            gasPrice: gasPrice,
        };
    };
}