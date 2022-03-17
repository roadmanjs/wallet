import {RoadmanBuild} from '@roadmanjs/core';
import {expressifyStripe} from './app.checkout';
import isEmpty from 'lodash';
import {stripeSecret} from './config';

// TODO test
export const stripeRoadman = async (roadmanArgs: RoadmanBuild) => {
    // if stripe env is null do not enable it
    if (isEmpty(stripeSecret)) {
        return null;
    }

    roadmanArgs.app.use('/stripe', expressifyStripe());
};

// exports all for customizations
export * from './app.checkout';
export * from './response.interface';
export * from './config';
