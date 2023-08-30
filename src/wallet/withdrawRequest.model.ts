import {Field, InputType, Model, ObjectType} from 'couchset';

import {UserType} from '@roadmanjs/auth';
import {Wallet} from './Wallet.model';

export const WithdrawRequestModelName = 'WithdrawRequest';

export const WithdrawRequestStatus = {
    requested: 'requested',
    accepted: 'accepted',
    cancelled: 'cancelled',
    completed: 'completed',
};
/**
 * GraphQL Types start
 */
@InputType('WithdrawRequestInput')
@ObjectType()
export class WithdrawRequest {
    // Automatic
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => String, {nullable: true})
    owner?: string | UserType = '';

    @Field(() => Date, {nullable: true})
    createdAt?: Date = new Date();

    @Field(() => Date, {nullable: true})
    updatedAt?: Date = new Date();

    @Field(() => Boolean, {nullable: true})
    deleted?: boolean = false;
    // Automatic

    @Field(() => String, {
        nullable: true,
        description: 'Type of withdraw request crypto | bank | xxxx',
    })
    type?: string = '';

    @Field(() => String, {nullable: true})
    receiver?: string = '';

    @Field(() => String, {
        nullable: true,
        description: 'Transaction hash if a crypto withdraw request',
    })
    transactionHash?: string = '';

    @Field(() => String, {nullable: true})
    status?: string = '';

    // if status === cancelled
    @Field(() => String, {nullable: true})
    reason?: string = '';

    @Field(() => String, {nullable: true})
    currency?: string = '';

    @Field(() => Number, {nullable: true})
    amount?: number = 0;

    @Field(() => String, {nullable: true, description: 'Wallet Id'})
    walletId?: string = ''; // no auto
}

@ObjectType()
export class WithdrawRequestOutput extends WithdrawRequest {
    @Field(() => UserType, {nullable: true, description: 'Owner'})
    owner?: UserType; // no auto

    @Field(() => Wallet, {nullable: true, description: 'Wallet'})
    wallet?: Wallet; // no auto
}

export const orderSelectors = [
    'id',
    'owner',
    'createdAt',
    'updatedAt',
    'type',
    'receiver',
    'transactionHash',
    'status',
    'reason',
    'currency',
    'amount',
    'walletId',
];

export const WithdrawRequestModel: Model = new Model(WithdrawRequestModelName, {
    graphqlType: WithdrawRequest,
});

export default WithdrawRequestModel;
