export const WalletPAGE = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: {kind: 'Name', value: 'PageWallet'},
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {kind: 'Variable', name: {kind: 'Name', value: 'id'}},
                    type: {
                        kind: 'NonNullType',
                        type: {kind: 'NamedType', name: {kind: 'Name', value: 'String'}},
                    },
                    directives: [],
                },
            ],
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        alias: {kind: 'Name', value: 'data'},
                        name: {kind: 'Name', value: 'walletPagination'},
                        arguments: [
                            {
                                kind: 'Argument',
                                name: {kind: 'Name', value: 'id'},
                                value: {kind: 'Variable', name: {kind: 'Name', value: 'id'}},
                            },
                        ],
                        directives: [],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: {kind: 'Name', value: 'WalletFragment'},
                                    directives: [],
                                },
                            ],
                        },
                    },
                ],
            },
        },
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
    loc: {start: 0, end: 212},
};
