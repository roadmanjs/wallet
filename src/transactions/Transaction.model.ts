import {Field, InputType, Model, ObjectType} from 'couchset';

@InputType('TransactionInput')
@ObjectType()
export class Transaction {
    @Field(() => String, {nullable: true})
    id?: string;

    @Field(() => Date, {nullable: true})
    createdAt?: Date;

    @Field(() => Date, {nullable: true})
    updatedAt?: Date;

    @Field(() => String, {nullable: true})
    owner?: string = '';

    @Field(() => String, {nullable: true}) // TODO use enums
    type = ''; // withdraw or deposit

    @Field(() => String, {nullable: true})
    status = '';

    @Field(() => String, {nullable: true})
    source = ''; // crypto paypal, credit card, interact

    @Field(() => String, {nullable: true})
    sourceId?: string = ''; // paypal, credit card, interact

    @Field(() => String, {nullable: true})
    currency = '';

    @Field(() => Number, {nullable: true})
    amount = 0;
}

export const TransactionModel: Model = new Model(Transaction.name, {graphqlType: Transaction});

// TODO use automatic transaction when couchset byTime is completed
export const {
    resolver: TransactionDefaultResolver, // there's going to be other custom resolvers
    pagination: TransactionPagination,
    client: TransactionClient,
    modelKeys: TransactionModelKeys,
} = TransactionModel.automate();

// TODO automatic

export default TransactionModel;
