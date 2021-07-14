
import { BigNumber, ethers } from 'ethers';
import * as fs from 'fs';

interface Balance {
  amount: string;
  revocable?: boolean;
}

interface BalanceMap {
  [account: string]: Balance | undefined;
}

const cutOff = ethers.utils.parseEther("20");

const main = async () => {
  const balances = JSON.parse(fs.readFileSync(`balances-accounts.json`).toString()) as BalanceMap;

  let newTotal = BigNumber.from(0);
  for (const [, balance] of Object.entries(balances)) {
    const currentBalance = BigNumber.from(balance.amount);
    if (currentBalance.lt(cutOff)) {
      continue;
    }

    const newAmount = currentBalance.add(ethers.utils.parseEther("55"));
    newTotal = newTotal.add(newAmount);
    balance.amount = newAmount.toString();
  }

  console.log(`new total is ${ethers.utils.formatEther(newTotal)}`);
  fs.writeFileSync(`balances-accounts-updated.json`, JSON.stringify(balances, null, 2));
}

main();