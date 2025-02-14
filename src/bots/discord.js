const {Colors, Client, EmbedBuilder, GatewayIntentBits} = require('discord.js');

const lowBalance = async (discord_token, discord_channel_id, {title = 'Low Balance', link, walletAddress, walletName, tokenAddress, message, chainId, color = Colors.Yellow, roleIds = []} = {}) => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });
    return new Promise((resolve, reject) => {
        client
            .on('ready', async () => {
                let embed = new EmbedBuilder();
                embed.setColor(color);
                embed.setAuthor({
                    name: title,
                    iconURL: chainId ? `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${chainId}/0x0000000000000000000000000000000000000000/logo_24.png` : undefined,
                    url: link ?? undefined,
                })
                if (roleIds?.length > 0) {
                    embed.setDescription(roleIds.map(roleId => `<@&${roleId}>`).join(' '));
                }
                if (walletAddress) {
                    embed.addFields({name: walletName ?? 'Wallet', value: walletAddress, inline: false});
                }
                if (tokenAddress) {
                    embed.addFields({name: 'Token', value: tokenAddress, inline: false});
                }
                if (message) {
                    embed.addFields({name: 'Message', value: message});
                }
                await client.channels.cache.get(discord_channel_id).send({embeds: [embed]});
                client.destroy();
                resolve();
            })
            .login(discord_token);
    });
};

const smartContractResult = async (discord_token, discord_channel_id, {title = 'Smart Contract Result', link, transactionHashes = [], methodFrom, methodTo, methodName, message, chainId, color = Colors.Green, roleIds = []} = {}) => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });
    return new Promise((resolve, reject) => {
        client
            .on('ready', async () => {
                let embed = new EmbedBuilder();
                embed.setColor(color);
                embed.setAuthor({
                    name: title,
                    iconURL: chainId ? `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${chainId}/0x0000000000000000000000000000000000000000/logo_24.png` : undefined,
                    url: link ?? undefined,
                })
                if (roleIds?.length > 0) {
                    embed.setDescription(roleIds.map(roleId => `<@&${roleId}>`).join(' '));
                }
                if (methodFrom) {
                    embed.addFields({name: 'From', value: methodFrom, inline: true});
                }
                if (methodTo) {
                    embed.addFields({name: 'To', value: methodTo, inline: true});
                }
                if (methodName) {
                    embed.addFields({name: 'Method', value: methodName, inline: true});
                }
                transactionHashes.forEach(transactionHash => {
                    embed.addFields({name: 'Transaction', value: transactionHash});
                });
                if (message) {
                    embed.addFields({name: 'Message', value: message});
                }
                await client.channels.cache.get(discord_channel_id).send({embeds: [embed]});
                client.destroy();
                resolve();
            })
            .login(discord_token);
    });
};

const generalAlert = async (discord_token, discord_channel_id, {title = 'Alert', link, message, chainId, color = Colors.Grey, roleIds = []} = {}) => {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });
    return new Promise((resolve, reject) => {
        client
            .on('ready', async () => {
                let embed = new EmbedBuilder();
                embed.setColor(color);
                embed.setAuthor({
                    name: title,
                    iconURL: chainId ? `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/${chainId}/0x0000000000000000000000000000000000000000/logo_24.png` : undefined,
                    url: link ?? undefined,
                })
                if (roleIds?.length > 0) {
                    embed.setDescription(roleIds.map(roleId => `<@&${roleId}>`).join(' '));
                }
                if (message) {
                    embed.addFields({name: 'Message', value: message});
                }
                await client.channels.cache.get(discord_channel_id).send({embeds: [embed]});
                client.destroy();
                resolve();
            })
            .login(discord_token);
    });
};

const generateAddressLink = (address, chainId) => {
    switch (chainId.toString()) {
        case '43113':
            return `https://testnet.snowtrace.io/address/${address}`;
        case '43114':
            return `https://snowtrace.io/address/${address}`;
        case '19':
            return `https://songbird-explorer.flare.network/address/${address}`;
        case '14':
            return `https://flare-explorer.flare.network/address/${address}`;
        case '16':
            return `https://coston-explorer.flare.network/address/${address}`;
        case '114':
            return `https://coston2-explorer.flare.network/address/${address}`;
        case '9000':
            return `https://evm.evmos.dev/address/${address}`;
        case '9001':
            return `https://escan.live/address/${address}`;
        case '295':
            return `https://hashscan.io/mainnet/account/${address}`;
        case '294':
            return `https://hashscan.io/testnet/account/${address}`;
        case '1':
            return `https://etherscan.io/address/${address}`;
        default:
            return `https://pangolin.exchange/404/${chainId}/${address}`; // Ensure url is returned
    }
};

const generateTransactionLink = (hash, chainId) => {
    switch (chainId.toString()) {
        case '43113':
            return `https://testnet.snowtrace.io/tx/${hash}`;
        case '43114':
            return `https://snowtrace.io/tx/${hash}`;
        case '19':
            return `https://songbird-explorer.flare.network/tx/${hash}`;
        case '14':
            return `https://flare-explorer.flare.network/tx/${hash}`;
        case '16':
            return `https://coston-explorer.flare.network/tx/${hash}`;
        case '114':
            return `https://coston2-explorer.flare.network/tx/${hash}`;
        case '9000':
            return `https://evm.evmos.dev/tx/${hash}`;
        case '9001':
            return `https://escan.live/tx/${hash}`;
        case '295':
            return `https://hashscan.io/mainnet/transactionsById/${hash}`;
        case '294':
            return `https://hashscan.io/testnet/transactionsById/${hash}`;
        case '1':
            return `https://etherscan.io/tx/${hash}`;
        default:
            return `https://pangolin.exchange/404/${chainId}/${hash}`; // Ensure url is returned
    }
};

module.exports = {
    Colors: Colors,
    lowBalance,
    smartContractResult,
    generalAlert,
    generateAddressLink,
    generateTransactionLink,
};
