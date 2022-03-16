import 'reflect-metadata';

import {writeAutomaticClient} from '@roadmanjs/utils';

// Automatically run this before building
(async () => {
    // const clients: any[] = [
    //     {name: 'Comment', client: CommentClient, fragment: Comment},
    //     {
    //         name: 'Reaction',
    //         client: ReactionClient,
    //         fragment: Reaction,
    //     },
    // ];
    const clients = [];

    await writeAutomaticClient({
        clients,
        rootDir: '.',
        destDir: 'src/clients',
    });
})();
