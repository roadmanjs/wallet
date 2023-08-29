import {btcpayServerStore, btcpayServerToken, btcpayServerUrl} from './btcpayserver.config';

import {RoadmanBuild} from '@roadmanjs/core';
import {isEmpty} from 'lodash';
import {log} from '@roadmanjs/logs';
import {startBtcpayserverPullingCron} from './btcpayserver.cron';

export const btcpayserverRoadman = async (args: RoadmanBuild): Promise<RoadmanBuild> => {
    // TODO verify enabled providers
    // if btcpayserver, start pulling queues
    if (!isEmpty(btcpayServerToken) && !isEmpty(btcpayServerStore) && !isEmpty(btcpayServerUrl)) {
        log(`btcpayserver enabled at ${btcpayServerUrl}`);
        startBtcpayserverPullingCron();
    } else {
        log(
            `btcpayserver requires BTCPAYSERVER_TOKEN, BTCPAYSERVER_STORE, BTCPAYSERVER_URL and or BTCPAYSERVER_BTC, BTCPAYSERVER_XMR`
        );
    }

    // ...other providers

    return args;
};

export * from './blockchain';
export * from './btcpayserver';
export * from './btcpayserver.config';
export * from './btcpayserver.queue';
export * from './btcpayserver.cron';
export * from './btcpayserver.resolver';
