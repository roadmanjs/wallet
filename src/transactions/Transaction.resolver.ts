import {
    Resolver,
    Query,
    Arg,
    UseMiddleware,
    Ctx,
    // Int,
} from 'type-graphql';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import TransactionModel, {Transaction} from './Transaction.model';

import {ContextType, isAuth} from '@roadmanjs/auth';
import {isEmpty} from 'lodash';

@Resolver()
export class TransactionResolver {
    @Query(() => [Transaction])
    @UseMiddleware(isAuth)
    async transactions(
        @Ctx() ctx: ContextType,
        @Arg('filter', () => String, {nullable: true}) filter: string, // WithdrawOrDeposit,
        @Arg('page', () => Number, {nullable: true}) page: number,
        @Arg('limit', () => Number, {nullable: true}) limit: number
    ): Promise<Transaction[]> {
        const owner = _get(ctx, 'payload.userId', '');

        try {
            // use context
            const wheres: any = {
                owner: {$eq: owner},
            };

            // If filter by status
            if (filter) {
                wheres.type = {$eq: filter};
            }

            const data = await TransactionModel.pagination({
                where: wheres,
                limit,
                page,
            });

            return isEmpty(data) ? [] : data;
        } catch (error) {
            log('error getting transactions', error);
            return [];
        }
    }
}

export default TransactionResolver;
