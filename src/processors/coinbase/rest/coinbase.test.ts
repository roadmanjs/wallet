import 'mocha';

import {createAddress} from './coinbase.methods';
import {expect} from 'chai';

describe('Coinbase', () => {
    it('it should create a coinbase address', async () => {
        const address = await createAddress({name: 'My cool address'});
        console.log('created the address', address);
        expect(address).to.be.not.null;
    });
});
