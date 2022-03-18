// export applyProcessor
//  ---> roadman.app(applyProcessor)
// export resolvers

import {
    TransactionAdminResolver,
    TransactionDefaultResolver,
    TransactionResolver,
} from './transactions';

import {WalletDefaultResolver} from './wallet';

export const getWalletResolvers = () => [
    TransactionResolver,
    TransactionAdminResolver,
    WalletDefaultResolver,
    TransactionDefaultResolver,
];

export * from './wallet';
export * from './transactions';
export * from './processors';
