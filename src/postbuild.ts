import 'reflect-metadata';

import {DirArg, buildDirs, createClientPackageJson} from '@roadmanjs/utils';

// Automatically run this
(async () => {
    const args: DirArg[] = [
        {cmd: 'rm', dir: 'dist-client'},
        {cmd: 'mkdir', dir: 'dist-client'},
        {cmd: 'cp', dir: 'dist/client', newDir: 'dist-client'},
        {cmd: 'cp', dir: 'register', newDir: 'dist-client/register'},
        {cmd: 'cp', dir: 'docs', newDir: 'dist-client/docs'},
        {cmd: 'cp', dir: 'README.md', newDir: 'dist-client/README.md'},
        // {cmd: 'cp', dir: 'LICENSE', newDir: 'dist-client/LICENSE'},
        // {cmd: 'cp', dir: 'dist/client/index.js', newDir: 'dist-client/index.js'},
        // {cmd: 'cp', dir: 'dist/client/index.d.ts', newDir: 'dist-client/index.d.ts'},
        // {cmd: 'cp', dir: 'dist/client/index.js.map', newDir: 'dist-client/index.js.map'},
    ];

    buildDirs(args);

    await createClientPackageJson({
        name: '@roadmanjs/badge-client',
        description: 'GraphQL client gql for @roadmanjs/badge',

        extraProps: {
            main: 'client/index.js',
            types: 'client/index.d.ts',
            files: ['index.d.ts', '/client', 'docs/', '/gql', 'register/', 'LICENSE'],
        },
    });
})();
