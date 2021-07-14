# Chain Swap BSC Recovery Script

This repo and scripts were used to recover from the Chain Swap Hack on WILD

Theses scripts were ran:

- `./scripts/getEvents.ts` - Get all WILD token `Transfer` events from BSCScan
- `./scripts/parseRawEvents.ts` - Parse those events to get the accounts involved
- `./scripts/getTokenBalances.ts` - Get the token balances of each of those accounts
- `./scripts/filterBalances.ts` - Throw out 0 balances, and separate contracts from actual user accounts

Technically it could've been one mega script, but things tend to fail and not having to wait an hour for each run is nice.

The final balances can be found here:

- [User Accounts](./balances-accounts.json)  
- [Smart Contracts](./balances-contracts.json)

Some other data:

- `0x817e98df6f3c290b77c2703e977e30b0ab3830f8` is the pancake swap pair
- The hack happened sometime around block `9042267`

