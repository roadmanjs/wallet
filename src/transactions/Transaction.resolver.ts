import {
    Resolver,
    Query,
    Arg,
    UseMiddleware,
    Ctx,
    // Int,
} from 'type-graphql';
import _get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import {log} from '@roadmanjs/logs';
import TransactionModel, {Transaction} from './Transaction.model';
import {ContextType, isAuth} from '@roadmanjs/auth';
import {CouchbaseConnection, getPagination} from 'couchset';
import {awaitTo} from 'couchset/dist/utils';

const TransactionPagination = getPagination(Transaction);
@Resolver()
export class TransactionResolver {
    // TODO move this couchset when byTime Updated
    @Query(() => [TransactionPagination])
    @UseMiddleware(isAuth)
    async transactionsByTime(
        @Ctx() ctx: ContextType,
        @Arg('filter', () => String, {nullable: true}) filter?: string,
        @Arg('sort', () => String, {nullable: true}) sortArg?: string,
        @Arg('before', () => Date, {nullable: true}) before?: Date,
        @Arg('after', () => Date, {nullable: true}) after?: Date,
        @Arg('limit', () => Number, {nullable: true}) limitArg?: number
    ): Promise<{items: Transaction[]; hasNext?: boolean; params?: any}> {
        const transactionModelName = Transaction.name;
        const owner = _get(ctx, 'payload.userId', '');
        const bucket = CouchbaseConnection.Instance.bucketName;
        const sign = before ? '<=' : '>=';
        const time = new Date(before || after);
        const sort = sortArg || 'DESC';
        const limit = limitArg || 10;
        const limitPassed = limit + 1; // adding +1 for hasNext

        const copyParams = pickBy(
            {
                sort,
                filter,
                before,
                after,
                owner,
                limit,
            },
            identity
        );

        try {
            const query = `
              SELECT *
                  FROM \`${bucket}\` trans
                  WHERE trans._type = "${transactionModelName}"
                  ${filter ? `AND trans.type = "${filter}"` : ''}
                  AND trans.owner = "${owner}"
                  AND trans.createdAt ${sign} "${time.toISOString()}"
                  ORDER BY trans.createdAt ${sort}
                  LIMIT ${limitPassed};
              `;

            const [errorFetching, data = []] = await awaitTo(
                TransactionModel.customQuery<any>({
                    limit: limitPassed,
                    query,
                    params: copyParams,
                })
            );

            if (errorFetching) {
                throw errorFetching;
            }

            const [rows = []] = data;

            const hasNext = rows.length > limit;

            if (hasNext) {
                rows.pop(); // remove last element
            }

            const dataToSend = rows.map((d) => {
                const {trans} = d;
                return TransactionModel.parse(trans);
            });

            return {items: dataToSend, params: copyParams, hasNext};
        } catch (error) {
            log('error getting transactions', error);
            return {items: [], hasNext: false, params: copyParams};
        }
    }
}

export default TransactionResolver;
