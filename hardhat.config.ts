// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "solidity-coverage";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.4.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
  mocha: {
    timeout: 50000,
  },
  networks: {
    hardhat: {
      forking: {
        url:
          "https://eth-mainnet.alchemyapi.io/v2/MnO3SuHlzuCydPWE1XhsYZM_pHZP8_ix",
      },
    },
    mainnet: {
      accounts: { mnemonic: process.env.MAINNET_MNEMONIC || "" },
      url: `https://mainnet.infura.io/v3/0e6434f252a949719227b5d68caa2657`,
      gasPrice: 20000000000,
    },
    bsc: {
      accounts: { mnemonic: process.env.TESTNET_MNEMONIC || "" },
      url: 'https://wild-proud-pine.bsc.quiknode.pro/5698455e8356fba0380b17cb2ee8e08453e66d5b/',
      timeout: 1000000000
    },
    kovan: {
      accounts: { mnemonic: process.env.TESTNET_MNEMONIC || "" },
      url: `https://kovan.infura.io/v3/0e6434f252a949719227b5d68caa2657`,
    },
    ropsten: {
      accounts: { mnemonic: process.env.TESTNET_MNEMONIC || "" },
      url: "https://ropsten.infura.io/v3/77c3d733140f4c12a77699e24cb30c27",
    },
    rinkeby: {
      accounts: { mnemonic: process.env.TESTNET_MNEMONIC || "" },
      url: "https://rinkeby.infura.io/v3/77c3d733140f4c12a77699e24cb30c27",
    },
    localhost: {
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,
      url: "http://127.0.0.1:8545",
      chainId: 1776,
      accounts: {
        mnemonic: "test test test test test test test test test test test test",
      },
    },
  },
  etherscan: {
    apiKey: "FZ1ANB251FC8ISFDXFGFCUDCANSJNWPF9Q",
  },
};
export default config;
