import {Field, InputType, Model, ObjectType} from 'couchset';

import {UserType} from '@roadmanjs/auth';

@InputType('WalletAddressInput')
@ObjectType()
export class WalletAddress {
    @Field(() => String, {
        nullable: true,
        description: 'The address of the wallet, on-chain address',
    })
    id?: string = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date = new Date();

    @Field(() => Date, {nullable: true})
    updatedAt?: Date = new Date();

    @Field(() => String, {nullable: true, description: 'The owner of the account'})
    owner = '';

    @Field(() => String, {nullable: true, description: 'The currency of the wallet'})
    currency = '';

    @Field(() => Number, {
        nullable: true,
        description: 'The number of transactions received from this address',
    })
    transactions = 0;

    // TODO type, info, etc
}

@InputType('WalletInput')
@ObjectType()
export class Wallet {
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date = new Date();

    @Field(() => Date, {nullable: true})
    updatedAt?: Date = new Date();

    @Field(() => String, {nullable: false, description: 'The owner of the account'})
    owner: UserType | string = '';

    @Field(() => String, {nullable: true, description: 'The address of the wallet'})
    address?: WalletAddress | string = '';

    @Field(() => String, {nullable: true, description: 'The currency of the wallet'})
    currency?: string = '';

    @Field(() => Number, {nullable: true, description: 'Amount in this wallet'})
    amount?: number = 0;
}

export const walletModelName = Wallet.name;

export class WalletOutput extends Wallet {
    @Field(() => UserType, {nullable: true, description: 'The owner object of the account'})
    owner: UserType;

    @Field(() => WalletAddress, {nullable: true, description: 'The address object of the wallet'})
    address: WalletAddress;
}

export const WalletModel = new Model(Wallet.name, {graphqlType: Wallet});
export const WalletAddressModel = new Model(WalletAddress.name, {graphqlType: WalletAddress});
