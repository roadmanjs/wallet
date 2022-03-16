import 'reflect-metadata';

import {BadgeClient} from './badge';
import {writeAutomaticClient} from '@roadmanjs/utils';

// Automatically run this before building
(async () => {
    const clients: any[] = [{name: 'Badge', client: BadgeClient, fragment: Comment}];

    await writeAutomaticClient({
        clients,
        rootDir: '.',
        destDir: 'src/clients',
    });
})();
