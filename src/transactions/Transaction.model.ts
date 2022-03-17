import {Field, InputType, Model, ObjectType} from 'couchset';

@InputType('TransactionInput')
@ObjectType()
export class Transaction {
    @Field(() => String, {nullable: true})
    owner?: string = '';

    @Field(() => String, {nullable: true}) // TODO use enums
    type = ''; // withdraw or deposit

    @Field(() => String, {nullable: true})
    status = '';

    @Field({nullable: true})
    source = ''; // crypto paypal, credit card, interact

    @Field({nullable: true})
    sourceId?: string = ''; // paypal, credit card, interact

    @Field({nullable: true})
    currency = '';

    @Field({nullable: true})
    amount = 0;
}

export const TransactionModel: Model = new Model(Transaction.name, {graphqlType: Transaction});

// TODO automatic

export default TransactionModel;
