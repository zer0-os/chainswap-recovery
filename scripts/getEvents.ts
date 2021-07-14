
import axios from "axios";
import { ethers } from "ethers";
import { BEP20Token__factory } from "../typechain";
import * as fs from 'fs';

require('dotenv').config()

const main = async () => {

  const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);

  const wildToken = await BEP20Token__factory.connect("0x089165ac9a7bf61833da86268f34a01652543466", provider);

  const filter = wildToken.filters.Transfer(null, null, null);
  console.log(filter.topics);


  try {
    const slices = 20; // try to pre-cut to maybe save some API calls
    const start = 7395577;
    const finish = 9042267;
    const length = finish - start;
    const sizeOfSlice = Math.floor(length / slices);

    interface Cut {
      start: number;
      end: number;
    }

    const cuts: Cut[] = [];

    let curStart = start;
    for (let i = 0; i <= slices; ++i) {
      cuts.push({
        start: curStart,
        end: Math.min(curStart + sizeOfSlice, finish)
      });
      curStart += sizeOfSlice;
    }

    let results: any[] = [];


    for (const cut of cuts) {
      let fromCut = 0;
      console.log(`cut is ${cut.start} - ${cut.end}`)
      let startBlock = cut.start;
      let endBlock = cut.end;

      while (true) {
        console.log(`query; start:${startBlock} end:${endBlock}`)
        const response = await axios.get(`https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${startBlock}&toBlock=${endBlock}&address=0x089165ac9a7bf61833da86268f34a01652543466&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&apikey=${process.env.BSC_SCAN_API_KEY}`);

        const result = response.data.result;
        console.log(`> got ${result.length} results...`);

        if (result.length >= 1000) {
          // too big, cut smaller
          const length = endBlock - startBlock;
          const reduceAmount = Math.floor(length / 2);
          endBlock = startBlock + reduceAmount;

          console.log(`cut smaller by ${reduceAmount}`);
          continue;
        }

        console.log(`saving ${result.length} results.`)
        fromCut += result.length;
        results = [].concat(results, result);

        if (endBlock < cut.end) {
          console.log(`move to next chunk`);
          startBlock = endBlock;
          endBlock = cut.end;
          continue;
        }

        console.log(`finished cut`)
        break;
      }

      console.log(`found ${fromCut} results from this cut\n`);

    }

    fs.writeFileSync('txEvents.json', JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e);
    return;
  }


}

main();