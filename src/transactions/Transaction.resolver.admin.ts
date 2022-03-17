import {
    Resolver,
    Query,
    Arg,
    UseMiddleware,
    // Int,
} from 'couchset';
import {log} from '@roadmanjs/logs';
import {isAuth, isAdmin} from '@roadmanjs/auth';
import TransactionModel, {Transaction} from './Transaction.model';

@Resolver()
export class TransactionResolver {
    // TODO time pagination

    @Query(() => [Transaction])
    @UseMiddleware(isAuth)
    @UseMiddleware(isAdmin)
    async allTransactions(
        @Arg('search', {nullable: true}) search: string,
        @Arg('owner', {nullable: true}) owner: number,
        @Arg('page', {nullable: true}) page: number,
        @Arg('limit', {nullable: true}) limit: number
    ): Promise<Transaction[]> {
        try {
            const extraWhere: any = {};

            if (owner) {
                extraWhere.owner = {$eq: owner};
            }

            const data = await TransactionModel.pagination({
                where: {
                    ...extraWhere,
                },
                limit,
                page,
            });

            log(`all transactions returned ${data && data.length}`);
            return data;
        } catch (error) {
            log('error getting transactions', error);
            return [];
        }
    }
}

export default TransactionResolver;
