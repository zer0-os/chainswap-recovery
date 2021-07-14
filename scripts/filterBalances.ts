import { BigNumber, ethers } from "ethers";
import * as fs from "fs";

require('dotenv').config()

interface Balance {
  amount: string;
  revocable?: boolean;
}

interface BalanceMap {
  [account: string]: Balance | undefined;
}

const main = async () => {
  const inputBalances = JSON.parse(fs.readFileSync(`balances.json`).toString()) as BalanceMap;

  const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);


  const contractBalances: BalanceMap = {};
  const balances: BalanceMap = {};

  let contractTotal = BigNumber.from(0);
  let numContracts = 0;

  let zeroBalance = 0;
  for (const [account, balance] of Object.entries(inputBalances)) {
    if (balance.amount === "0") {
      ++zeroBalance;
      continue;
    }

    console.log(`Checking ${account}`);

    const code = await provider.getCode(account);
    if (code != "0x") {
      ++numContracts;
      console.log(`${account} is a contract`);
      contractTotal = contractTotal.add(BigNumber.from(balance.amount));

      contractBalances[account] = { ...balance, revocable: true }
      continue;
    }

    balances[account] = { ...balance, revocable: true }
  }

  let total = BigNumber.from(0);

  for (const [, balance] of Object.entries(balances)) {
    total = total.add(BigNumber.from(balance.amount));
  }

  console.log(`Dropped ${zeroBalance} accounts for having no balance`);

  console.log(`${ethers.utils.formatEther(contractTotal)} WILD were inside of ${numContracts} contracts`)

  console.log(`${ethers.utils.formatEther(total)} WILD owed to ${Object.keys(balances).length} accounts`);

  fs.writeFileSync(`balances-accounts.json`, JSON.stringify(balances, null, 2));
  fs.writeFileSync(`balances-contracts.json`, JSON.stringify(contractBalances, null, 2));
}

main();