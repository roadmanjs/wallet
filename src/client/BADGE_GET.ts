export const BadgeGET = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: {kind: 'Name', value: 'GetBadge'},
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
                        name: {kind: 'Name', value: 'badgeGet'},
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
                                    name: {kind: 'Name', value: 'BadgeFragment'},
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
            name: {kind: 'Name', value: 'BadgeFragment'},
            typeCondition: {kind: 'NamedType', name: {kind: 'Name', value: 'Badge'}},
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
                        name: {kind: 'Name', value: 'model'},
                        arguments: [],
                        directives: [],
                    },
                    {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'count'},
                        arguments: [],
                        directives: [],
                    },
                ],
            },
        },
    ],
    loc: {start: 0, end: 187},
};
