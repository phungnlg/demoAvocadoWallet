import React from "react"
import { ViewProps } from "react-native";
import { WalletProvider } from "./useWallet";

const HooksProvider: React.FC<ViewProps> = ({ children }) => {
    return (
        <WalletProvider>
            {children}
        </WalletProvider>
    )
}

export default HooksProvider;