// transaction => bull queue => fulfillBtcpayserver => update wallet

import Queue from 'bull';
import {REDIS_URL} from 'roadman';
import {fulfillMonero, type MoneroxTx} from './monerox';
import {log} from '@roadmanjs/logs';
const moneroXMRqueue = new Queue('moneroXMR', REDIS_URL, {});

moneroXMRqueue.process(async (job) => {
    const data = job.data;
    const {transaction} = data;
    log('processing transaction', transaction);

    try {
        await fulfillMonero(transaction);
    } catch (error) {
        log('error processing transaction', error);
    }
});

export const addTxToXmrQueue = (transaction: MoneroxTx) => {
    moneroXMRqueue.add({transaction});
};
