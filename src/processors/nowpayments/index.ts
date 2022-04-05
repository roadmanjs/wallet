import {RoadmanBuild} from '@roadmanjs/core';
import isEmpty from 'lodash/isEmpty';
import {log} from '@roadmanjs/logs';
import {nowPaymentsKey} from './config';
import {nowpaymentsExpressify} from './app.webhook';

// TODO test
export const nowPaymentsRoadman = async (roadmanArgs: RoadmanBuild) => {
    // if stripe env is null do not enable it
    if (isEmpty(nowPaymentsKey)) {
        log('Cannot enable nowpayments, keys are missing');
    } else {
        log('Nowpayments enabled');
        roadmanArgs.app.use('/nowpayments', nowpaymentsExpressify());
    }
    return roadmanArgs;
};

// exports all for customizations
export * from './config';
export * from './app.webhook';
export * from './nowpayments.methods';
