import {TransactionAdminResolver, TransactionResolver} from './transactions';
import {
    btcpayServerStore,
    btcpayServerToken,
    btcpayServerUrl,
} from './processors/btcpayserver/btcpayserver.config';

// export applyProcessor
//  ---> roadman.app(applyProcessor)
// export resolvers
import {RoadmanBuilder} from 'roadman';
import {WalletResolver} from './wallet';
import {isEmpty} from 'lodash';
import {log} from '@roadmanjs/logs';
import {startBtcpayserverPullingCron} from './processors/btcpayserver/btcpayserver.cron';

export const getWalletResolvers = () => [
    TransactionResolver,
    TransactionAdminResolver,
    WalletResolver,
];

export const walletRoadman = async (args: RoadmanBuilder): Promise<RoadmanBuilder> => {
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

export * from './wallet';
export * from './transactions';
export * from './processors';
