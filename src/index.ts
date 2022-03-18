// export applyProcessor
//  ---> roadman.app(applyProcessor)
// export resolvers

import {
    TransactionAdminResolver,
    TransactionDefaultResolver,
    TransactionResolver,
} from './transactions';
import {WalletDefaultResolver, WalletResolver} from './wallet';

export const getWalletResolvers = () => [
    TransactionResolver,
    TransactionAdminResolver,
    TransactionDefaultResolver,
    WalletDefaultResolver,
    WalletResolver,
];

export * from './wallet';
export * from './transactions';
export * from './processors';
