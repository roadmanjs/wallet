import {Field, InputType, Model, ObjectType} from 'couchset';

@InputType('WalletInput')
@ObjectType()
export class Wallet {
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date = new Date();

    @Field(() => Date, {nullable: true})
    updatedAt?: Date = new Date();

    @Field(() => String, {nullable: true, description: 'The owner of the account'})
    owner = '';

    @Field(() => String, {nullable: true, description: 'The currency of the wallet'})
    currency = '';

    @Field(() => Number, {nullable: true, description: 'Amount in this wallet'})
    amount = 0;
    // TODO currencyName, symbol e.t.c for localization
}

export const WalletModel = new Model(Wallet.name, {graphqlType: Wallet});

// TODO automatic
// TODO no need for automatic wallet
// export const {
//     resolver: WalletDefaultResolver, // there's going to be other custom resolvers
//     pagination: WalletPagination,
//     client: WalletClient,
//     modelKeys: WalletModelKeys,
// } = WalletModel.automate();
