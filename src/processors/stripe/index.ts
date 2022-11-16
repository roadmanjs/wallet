import {RoadmanBuild} from '@roadmanjs/core';
import express from 'express';
import {expressifyStripe} from './app.checkout';
import isEmpty from 'lodash/isEmpty';
import {log} from '@roadmanjs/logs';
import {stripeSecret} from './config';

// TODO test
export const stripeRoadman = async (roadmanArgs: RoadmanBuild) => {
    // if stripe env is null do not enable it
    if (isEmpty(stripeSecret)) {
        log('Cannot enable stripe, keys are missing');
    } else {
        log('Stripe enabled');
        roadmanArgs.app.use('/stripe/webhook', express.raw({type: '*/*'}));
        roadmanArgs.app.use('/stripe', expressifyStripe());
    }
    return roadmanArgs;
};

// exports all for customizations
export * from './app.checkout';
export * from './response.interface';
export * from './config';
