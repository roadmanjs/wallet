import 'reflect-metadata';

import {Badge, BadgeClient} from './badge';

import {writeAutomaticClient} from '@roadmanjs/utils';

// Automatically run this before building
(async () => {
    const clients: any[] = [{name: 'Badge', client: BadgeClient, fragment: Badge}];

    await writeAutomaticClient({
        clients,
        rootDir: '.',
        destDir: 'src/client',
    });
})();
