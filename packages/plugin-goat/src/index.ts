import type { Plugin } from "@elizaos/core";
import { getOnChainActions } from "./actions";
import { getWalletClient, getWalletProvider } from "./wallet";

async function createGoatPlugin(
    getSetting: (key: string) => string | undefined
): Promise<Plugin> {
    const walletClient = await getWalletClient(getSetting);
    const actions = await getOnChainActions(walletClient);

    return {
        name: "Superchain Plugin",
        description: "Superchain Plugin built with Op Stack",
        providers: [getWalletProvider(walletClient)],
        evaluators: [],
        services: [],
        actions: actions,
    };
}

export default createGoatPlugin;
