// export applyProcessor
//  ---> roadman.app(applyProcessor)
// export resolvers

import {TransactionDefaultResolver} from './transactions';
import {WalletDefaultResolver} from './wallet';

export const getWalletResolvers = () => [WalletDefaultResolver, TransactionDefaultResolver];

export * from './wallet';
export * from './transactions';
export * from './processors';
