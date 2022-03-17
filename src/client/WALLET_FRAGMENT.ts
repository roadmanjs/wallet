export interface Wallet {
    owner: string;
    currency: string;
    amount: number;
}

export interface WalletPagination {
    items?: Wallet[];
    hasNext?: boolean;
    params?: object;
}

export const WalletFragment = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: {kind: 'Name', value: 'WalletFragment'},
            typeCondition: {kind: 'NamedType', name: {kind: 'Name', value: 'Wallet'}},
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'owner'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'currency'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'amount'},
                        arguments: [],
                        directives: [],
                    },
                ],
            },
        },
    ],
    loc: {start: 0, end: 79},
};
