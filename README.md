
<p align="center">
  <h1 align="center"> RoadmanJS Wallet - a very wallet </h1>
</p>

<div align="center">
<img src="./docs/wallet.jpg" width="300" />
</div>



## A Roadman for wallet that supports, coinbase, stripe, nowpayments .e.t.c ...

env

```sh

# to enable stripe
STRIPE_PAYMENT_DESC=mycompany
STRIPE_SECRET=xxxxxx
STRIPE_ENDPOINT_SECRET=xxxxxx

# to enable nowpayments for crypto
NOWPAYMENTS_KEY=
NOWPAYMENTS_SECRET_IPN=xxxxx    # for verifying the webhooks
NOWPAYMENTS_CALLBACK_URL=xxxxxx # for webhooks
```

How to use

```ts
import roadman from "roadman";
import { stripeRoadman, nowPaymentsRoadman, getWalletResolvers, getNowPaymentsResolvers} from "@roadmanjs/wallet"

roadman({
  roadmen: [stripeRoadman, nowPaymentsRoadman],
  resolvers: [...myresolvers, ...getWalletResolvers(), ...getNowPaymentsResolvers()]
});
```
