import {Address, Client} from 'coinbase';
import {coinbaseAddress, coinbaseKey, coinbaseSecret} from './config';

interface Args {
    address?: string;
    name: string;
}

export const createAddress = async (args: Args): Promise<Address> => {
    const {address = coinbaseAddress, name} = args;
    const client = new Client({apiKey: coinbaseKey, apiSecret: coinbaseSecret});

    return new Promise((res, rej) => {
        client.getAccount(address, function (error, account) {
            if (error) return rej(error);
            account.createAddress({name}, function (err, address) {
                if (err) return rej(err);
                return res(address);
            });
        });
    });
};
