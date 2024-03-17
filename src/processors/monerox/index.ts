import {moneroxUrl, moneroxWallet} from './monerox.config';

import {RoadmanBuild} from '@roadmanjs/core';
import {isEmpty} from 'lodash';
import {log} from '@roadmanjs/logs';
import {startXmrPullingCron} from './monerox.cron';

export const moneroserverRoadman = async (args: RoadmanBuild): Promise<RoadmanBuild> => {
    // TODO verify enabled providers
    // if btcpayserver, start pulling queues
    if (!isEmpty(moneroxUrl) && !isEmpty(moneroxWallet)) {
        log(`moneroserver enabled at ${moneroxUrl}`);
        startXmrPullingCron();
    } else {
        log(`moneroserver requires MONEROX_URL, MONEROX_WALLET`);
    }

    // ...other providers

    return args;
};

export * from './monerox.config';
export * from './monerox.cron';
export * from './monerox';
export * from './monerox.queue';
