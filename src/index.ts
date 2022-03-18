// export applyProcessor
//  ---> roadman.app(applyProcessor)
// export resolvers

import {TransactionAdminResolver, TransactionResolver} from './transactions';

import {WalletResolver} from './wallet';

export const getWalletResolvers = () => [
    TransactionResolver,
    TransactionAdminResolver,
    WalletResolver,
];

export * from './wallet';
export * from './transactions';
export * from './processors';
