import type { WalletClientBase } from "@goat-sdk/core";
import { viem } from "@goat-sdk/wallet-viem";
import { createWalletClient, formatEther, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mode } from "viem/chains";
import { publicActionsL2 } from 'viem/op-stack'

// Add the chain you want to use, remember to update also
// the EVM_PROVIDER_URL to the correct one for the chain
export const chain = mode;

export async function getWalletClient(
    getSetting: (key: string) => string | undefined
) {
    const privateKey = getSetting("EVM_PRIVATE_KEY");
    if (!privateKey) return null;

    const provider = getSetting("EVM_PROVIDER_URL");
    if (!provider) throw new Error("EVM_PROVIDER_URL not configured");

    const wallet = createWalletClient({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        chain: chain,
        transport: http(provider),
    }).extend(publicActionsL2()) 

    const fee = await wallet.estimateTotalFee({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        value: parseEther('1'),
        chain: chain
    })
    const feeInEther = formatEther(fee);

    // Log the estimated fee to the console
    try {
        console.log(`Estimated Total Fee: ${fee} ETH`);
    } catch (error) {
        console.error('Error estimating the transaction fee:', error);
    }

    return viem(wallet);
}

export function getWalletProvider(walletClient: WalletClientBase) {
    return {
        async get(): Promise<string | null> {
            try {
                const address = walletClient.getAddress();
                const balance = await walletClient.balanceOf(address);
                return `EVM Wallet Address: ${address}\nBalance: ${balance} ETH`;
            } catch (error) {
                console.error("Error in EVM wallet provider:", error);
                return null;
            }
        },
    };
}
