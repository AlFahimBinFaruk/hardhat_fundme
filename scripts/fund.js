const {ethers,deployments, network}=require("hardhat");


async function main(){
    
    const chainId=network.config.chainId;
    if(chainId==31337){
        await deployments.fixture(["all"]);
    }
    
    const fundMeDeployment = await deployments.get("FundMe");
    const fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);

    console.log("Funding contract");
    const txRespone=await fundMe.fund({
        value:ethers.parseEther("0.1")
    });

    await txRespone.wait(1);
    console.log("Funded!");
}

main().then(()=>process.exit(0)).catch((err)=>{
    console.log("error => ",err);
    process.exit(1);
});