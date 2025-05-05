const {network}=require("hardhat");
const {developmentChains,networkConfig}=require("../helper-hardhat-config");
const { verify } = require("../utils/verify");


module.exports=async({getNamedAccounts,deployments})=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();

    const chainId=network.config.chainId;

    let ethUSDPriceFeedAddress;
    if(chainId==31337){
        const mockAggregator=await deployments.get("MockV3Aggregator");
        ethUSDPriceFeedAddress=mockAggregator.address;
    }else{
        ethUSDPriceFeedAddress=networkConfig[chainId]["ethUsdPriceFeed"];
    }

    
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    let arguments=[ethUSDPriceFeedAddress];
    const fundMe=await deploy("FundMe",{
        contract:"FundMe",
        from:deployer,
        log:true,
        args:arguments,
        waitConfirmations:network.config.blockConfirmations||1
    })

    log(`Fund me deployed at ==> `,fundMe.address);


    if(!developmentChains.includes(network.name)){
        await verify(fundMe.address,arguments);
    }

}

module.exports.tags=["all","fundme"];