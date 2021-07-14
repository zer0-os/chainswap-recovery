//https://bscscan.com/token/0x089165ac9a7bf61833da86268f34a01652543466


import { BEP20Token__factory } from "../typechain";
import { ethers } from "ethers";
import * as fs from "fs";

require('dotenv').config()

const main = async () => {

  const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);

  const wildToken = await BEP20Token__factory.connect("0x089165ac9a7bf61833da86268f34a01652543466", provider);
  // hack on mainnet: 12801468

  interface BalanceMap {
    [account: string]: {
      amount: string
    } | undefined;
  }

  // hack on 9042267
  // deployed on 7396251
  const addresses = JSON.parse(fs.readFileSync(`addresses.json`).toString()) as string[];

  let balances: BalanceMap = {};

  try {
    const checkpoint = JSON.parse(fs.readFileSync(`checkpoint.json`).toString()) as BalanceMap;
    balances = checkpoint;

    console.log(`Loaded ${Object.keys(balances).length} entries from checkpoint.`)
  } catch (e) {
    console.warn(`Unable to load checkpoint: ${e}`);
  }

  const targetBlock = 9042267;

  console.log(`Getting balances of ${addresses.length} accounts at block ${targetBlock}`);


  let completed = 0;
  for (const address of addresses) {
    if (balances[address] !== undefined) {
      ++completed;
      console.debug(`${completed}/${addresses.length}: skipped ${address} (in checkpoint)`)
      continue;
    }

    const balance = await wildToken.balanceOf(address, {
      blockTag: targetBlock
    });

    balances[address] = {
      amount: balance.toString()
    };

    ++completed;
    console.log(`${completed}/${addresses.length}: Fetched balance for ${address}`)

    if (completed % 100 === 0) {
      console.log(`saving checkpoint`)
      fs.writeFileSync('checkpoint.json', JSON.stringify(balances, null, 2));
    }
  }

  fs.writeFileSync('balances.json', JSON.stringify(balances, null, 2));
}

main();