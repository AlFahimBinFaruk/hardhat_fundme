const {network}=require("hardhat");
const {developmentChains,networkConfig}=require("../helper-hardhat-config");


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

    // log(`address is ===> `,ethUSDPriceFeedAddress);
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe=await deploy("FundMe",{
        contract:"FundMe",
        from:deployer,
        log:true,
        args:[ethUSDPriceFeedAddress],
        waitConfirmations:network.config.blockConfirmations||1
    })

    log(`Fund me deployed at ==> `,fundMe.address);
}

module.exports.tags=["all","fundme"];