import 'reflect-metadata';

import {Transaction, TransactionClient} from './transactions/Transaction.model';
import {Wallet, WalletClient} from './wallet/Wallet.model';

import {writeAutomaticClient} from '@roadmanjs/utils';

// Automatically run this before building
(async () => {
    const clients: any[] = [
        {name: 'Wallet', client: WalletClient, fragment: Wallet},
        {name: 'Transaction', client: TransactionClient, fragment: Transaction},
    ];

    await writeAutomaticClient({
        clients,
        rootDir: '.',
        destDir: 'src/client',
    });
})();
