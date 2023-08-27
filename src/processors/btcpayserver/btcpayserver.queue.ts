// transaction => bull queue => fulfillBtcpayserver => update wallet

import Queue from 'bull';
import {REDIS_URL} from 'roadman';
import {fulfillBtcpayserver, type BtcpayserverTransaction} from './btcpayserver';
import {log} from '@roadmanjs/logs';
const btcpayserverBTCqueue = new Queue('btcpayserverBTC', REDIS_URL, {});

btcpayserverBTCqueue.process(async (job) => {
    const data = job.data;
    const {transaction} = data;
    log('processing transaction', transaction);

    try {
        await fulfillBtcpayserver(transaction);
    } catch (error) {
        log('error processing transaction', error);
    }
});

export const addTxToBtcQueue = (transaction: BtcpayserverTransaction) => {
    btcpayserverBTCqueue.add({transaction});
};
