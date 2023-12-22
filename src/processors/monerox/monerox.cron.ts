import {moneroxCron, moneroxWallet} from './monerox.config';

import cron from 'node-cron';
import {fetchTransactions} from './monerox';
// TODO move cron to k8s
import {isEmpty} from 'lodash';
import {log} from '@roadmanjs/logs';

export function startXmrPullingCron() {
    if (isEmpty(moneroxWallet)) {
        log('monerox url empty');
        return;
    }

    log('starting monerox cron');

    cron.schedule(moneroxCron, async () => {
        log('XmrPullingCron: ');
        await fetchTransactions();
    });
}
