export const TransactionCREATE = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: {kind: 'Name', value: 'CreateTransaction'},
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {kind: 'Variable', name: {kind: 'Name', value: 'args'}},
                    type: {
                        kind: 'NonNullType',
                        type: {kind: 'NamedType', name: {kind: 'Name', value: 'TransactionInput'}},
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
                        name: {kind: 'Name', value: 'transactionCreate'},
                        arguments: [
                            {
                                kind: 'Argument',
                                name: {kind: 'Name', value: 'args'},
                                value: {kind: 'Variable', name: {kind: 'Name', value: 'args'}},
                            },
                        ],
                        directives: [],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: {kind: 'Name', value: 'ResTypeFragment'},
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
            name: {kind: 'Name', value: 'ResTypeFragment'},
            typeCondition: {kind: 'NamedType', name: {kind: 'Name', value: 'ResType'}},
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'success'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'message'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'data'},
                        arguments: [],
                        directives: [],
                    },
                ],
            },
        },
    ],
    loc: {start: 0, end: 256},
};
