const {ethers,deployments, network}=require("hardhat");

async function main(){
    const chainId=network.config.chainId;
    if(chainId==31337){
        await deployments.fixture(["all"]);
    }
    
    const fundMeDeployment = await deployments.get("FundMe");
    const fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);

    console.log("Withdrawing fund from contract.");
    const txRespone=await fundMe.withdraw();
    await txRespone.wait(1);
    console.log("Withdrawal successful!");
};


main().then(()=>process.exit(0)).catch((err)=>{
    console.log("error => ",err);
    process.exit(1);
});