// @ts-check
import "reflect-metadata";

import {TransactionDefaultResolver, stripeRoadman} from "./src"

import { roadman } from "roadman";

const run = async () => {
    await roadman({
        roadmen: [stripeRoadman],
        resolvers: [TransactionDefaultResolver]
    })
}

run();