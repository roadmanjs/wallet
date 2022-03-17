import {Field, InputType, Model, ObjectType} from 'couchset';

export const TransactionModelName = 'Transaction';

@InputType('TransactionInput')
@ObjectType()
export class Transaction {
    // Auto
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => String, {nullable: true})
    owner?: string = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date;

    @Field(() => Date, {nullable: true})
    updatedAt?: Date;

    @Field(() => String, {nullable: true}) // TODO use enums
    type: string; // withdraw or deposit

    @Field(() => String, {nullable: true})
    status: string;

    @Field({nullable: true})
    source: string; // paypal, credit card, interact

    @Field({nullable: true})
    sourceId?: string; // paypal, credit card, interact

    @Field({nullable: true})
    currency: string;

    @Field({nullable: true})
    amount: number;
}

export const TransactionModel: Model = new Model(TransactionModelName);

// TODO automatic

export default TransactionModel;
