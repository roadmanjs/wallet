// NO need for auto clients
import 'reflect-metadata';

import {Transaction, TransactionClient} from './transactions/Transaction.model';

import {StructureKind} from 'ts-morph';
import {writeAutomaticClient} from '@roadmanjs/utils';

// import {Wallet, WalletClient} from './wallet/Wallet.model';

// Automatically run this before building
(async () => {
    const clients: any[] = [
        // {name: 'Wallet', client: WalletClient, fragment: Wallet},
        {name: 'Transaction', client: TransactionClient, fragment: Transaction},
    ];

    await writeAutomaticClient({
        clients,
        rootDir: '.',
        destDir: 'src/client',
        extraMorphs: [
            {
                filename: 'customQuery',
                exports: [
                    {
                        // @ts-ignore
                        kind: StructureKind.ExportDeclaration,
                        moduleSpecifier: `./query`,
                    },
                ],
            },
        ],
    });
})();
