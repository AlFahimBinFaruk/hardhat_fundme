require("hardhat-deploy");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("dotenv").config();



const SEPOLIA_RPC_URL=process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;



module.exports = {

  solidity: "0.8.28",

  defaultNetwork:"hardhat",

  networks:{
    sepolia:{
      url:SEPOLIA_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:11155111,
      blockConfirmations: 6
    }
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  namedAccounts:{
    deployer:{
      default:0,
      1:0,
      11155111:0
    }
  },

  gasReporter:{
    enabled:true,
    currency:"USD",
    outputFile:"gas-report.txt",
    noColors:true
  }
};
