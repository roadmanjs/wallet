// TODO move cron to k8s
import {btcpayServerCron, btcpayServerCronEnabled} from './btcpayserver.config';

import cron from 'node-cron';
import {fetchTransactions} from './btcpayserver';
import {isEmpty} from 'lodash';
import {log} from '@roadmanjs/logs';

export function startBtcpayserverPullingCron() {
    if (isEmpty(btcpayServerCronEnabled)) {
        log('cron currencies empty');
        return;
    }

    log('starting cron');

    const currencies = btcpayServerCronEnabled.split(',');

    cron.schedule(btcpayServerCron, async () => {
        log('BtcpayserverPullingCron: ', currencies);
        await Promise.all(currencies.map((currency) => fetchTransactions(currency)));
    });
}
