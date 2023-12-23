// TODO move cron to k8s
import {
    btcpayServerCron,
    btcpayServerCronEnabled,
    btcpayServerCronRates,
} from './btcpayserver.config';
import {flatten, isEmpty} from 'lodash';

import cron from 'node-cron';
import {fetchRatesSaveToCache} from './rates';
import {fetchTransactions} from './btcpayserver';
import {log} from '@roadmanjs/logs';

export function startBtcpayserverPullingCron() {
    if (isEmpty(btcpayServerCronEnabled)) {
        log('cron currencies empty');
        return;
    }

    log('starting cron');

    const currencies = btcpayServerCronEnabled.split(',');

    cron.schedule(btcpayServerCronRates, async () => {
        const currenciesPairs = flatten(currencies.map((cur) => [`${cur}_USD`, `USD_${cur}`]));
        log('BtcpayserverPullingCron: currenciesPairs', currenciesPairs);
        await fetchRatesSaveToCache(currenciesPairs.join(','));
    });

    cron.schedule(btcpayServerCron, async () => {
        log('BtcpayserverPullingCron: ', currencies);
        await fetchTransactions('BTC');
    });
}
