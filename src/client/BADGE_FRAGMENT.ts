export interface Badge {
    owner: string;
    model: string;
    count: number;
}

export interface BadgePagination {
    items?: Badge[];
    hasNext?: boolean;
    params?: object;
}

export const BadgeFragment = {
    kind: 'Document',
    definitions: [
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
    loc: {start: 0, end: 73},
};
