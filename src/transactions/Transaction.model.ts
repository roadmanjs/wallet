import {Field, InputType, Model, ObjectType} from 'couchset';

@InputType('TransactionInput')
@ObjectType()
export class Transaction {
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date = new Date();

    @Field(() => Date, {nullable: true})
    updatedAt?: Date = new Date();

    @Field(() => String, {nullable: true})
    owner?: string = '';

    @Field(() => String, {nullable: true}) // TODO use enums
    type = ''; // withdraw or deposit

    @Field(() => String, {nullable: true})
    status = '';

    @Field(() => String, {nullable: true})
    source = ''; // crypto wallet, paypal, credit card, interact

    @Field(() => String, {nullable: true})
    sourceId?: string = ''; // it's source id

    @Field(() => String, {
        nullable: true,
        description: 'hash of the transaction, if source = crypto wallet',
    })
    transactionHash?: string = ''; // hash of the transaction

    @Field(() => String, {nullable: true})
    currency = '';

    @Field(() => Number, {nullable: true})
    amount = 0;
}

export const TransactionModel: Model = new Model(Transaction.name, {graphqlType: Transaction});

export default TransactionModel;
