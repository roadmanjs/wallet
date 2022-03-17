
<p align="center">
  <h1 align="center"> RoadmanJS Wallet - a very wallet </h1>
</p>

<div align="center">
<img src="./docs/wallet.jpg" width="300" />
</div>



## A Roadman for wallet that supports, coinbase, stripe .e.t.c ...

env

```sh

# to enable stripe
STRIPE_PAYMENT_DESC=mycompany
STRIPE_SECRET=xxxxxx
STRIPE_ENDPOINT_SECRET=xxxxxx

# TODO coinbase
```

How to use

```ts
import roadman from "roadman";
import { stripeRoadman, getWalletResolvers} from "@roadmanjs/wallet"

roadman({
  roadmen: [stripeRoadman],
  resolvers: [...myresolvers, getWalletResolvers()]
});

```
