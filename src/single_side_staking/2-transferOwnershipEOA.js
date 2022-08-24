// Helper modules to provide common or secret values
const CONFIG = require('../../config/config');
const StakingConfig = require('./stakingConfig');
const ABI = require('../../config/abi.json');
const ADDRESS = require('../../config/address.json');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.RPC));
web3.eth.accounts.wallet.add(CONFIG.WALLET.KEY);
let startingAvax;
let endingAvax;


/*
 * Transfer ownership of the staking contract to the multisig. Must be sent from an end user wallet
 */
(async () => {
    startingAvax = await web3.eth.getBalance(CONFIG.WALLET.ADDRESS);

    const stakingContract = new web3.eth.Contract(ABI.STAKING_REWARDS, StakingConfig.STAKING_CONTRACT);

    const tx = stakingContract.methods.transferOwnership(
        ADDRESS.PANGOLIN_MULTISIG_ADDRESS,
    );

    const gas = await tx.estimateGas({ from: CONFIG.WALLET.ADDRESS });
    const baseGasPrice = await web3.eth.getGasPrice();

    console.log(`Submitting tx ...`);

    const receipt = await tx.send({
        from: CONFIG.WALLET.ADDRESS,
        gas,
        maxFeePerGas: baseGasPrice * 2,
        maxPriorityFeePerGas: web3.utils.toWei('1', 'nano'),
    });

    if (!receipt?.status) {
        console.log(receipt);
        process.exit(1);
    } else {
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    }

})()
    .catch(console.error)
    .finally(async () => {
        endingAvax = await web3.eth.getBalance(CONFIG.WALLET.ADDRESS);
        console.log(`AVAX spent: ${(startingAvax - endingAvax) / (10 ** 18)}`);
        process.exit(0);
    });
