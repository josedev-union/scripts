const CONFIG = require('../../config/config');
const ABI = require('../../config/abi.json');
const ADDRESS = require('../../config/address.json');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.RPC));
const helpers = require('../core/helpers');

const chunkSize = 10;

/*
 * Lists information about all pools in MiniChefV2
 */
(async () => {
    const start = Date.now();

    let totalAllocPoints = 0;
    const table = [];
    const miniChefContract = new web3.eth.Contract(ABI.MINICHEF_V2, ADDRESS.PANGOLIN_MINICHEF_V2_ADDRESS);

    const [ lpTokens, poolInfos ] = await Promise.all([
        miniChefContract.methods.lpTokens().call(),
        miniChefContract.methods.poolInfos().call(),
    ]);

    let lookupDatas = lpTokens.map((pgl, pid) => [pid, pgl]);
    await helpers.promiseAllChunked(lookupDatas, lookup, chunkSize, null, 500);
    table.sort((a,b) => a.pid > b.pid ? 1 : -1);

    console.log(`Completed in ${(Date.now() - start) / 1000} sec`);

    console.table(table);
    console.log(`Total alloc points: ${totalAllocPoints}`);


    async function lookup([pid, pgl]) {
        const pglContract = new web3.eth.Contract(ABI.PAIR, pgl);
        const [token0Symbol, token1Symbol, rewarder] = await Promise.all([
            pglContract.methods.token0().call().then(helpers.getSymbolCached),
            pglContract.methods.token1().call().then(helpers.getSymbolCached),
            miniChefContract.methods.rewarder(pid).call(),
        ]);

        console.log(`pid #${pid}: (${token0Symbol}-${token1Symbol}) weight ${poolInfos[pid].allocPoint}`);
        table.push({
            pid: pid,
            pgl: pgl.toLowerCase(),
            rewarder: rewarder,
            token0: token0Symbol,
            token1: token1Symbol,
            weight: poolInfos[pid].allocPoint,
        });

        totalAllocPoints += parseInt(poolInfos[pid].allocPoint);
    }
})();
