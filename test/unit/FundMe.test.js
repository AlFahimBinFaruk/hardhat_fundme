const {deployments,getNamedAccounts,ethers}=require("hardhat");
const {assert}=require("chai");
const { expect } = require("chai");

describe("FundMe",function(){
    let fundMe,mockV3Aggregator;

    //converts eth amount into wei.
    const sendValue=ethers.parseEther("1");
    let deployer;

    beforeEach(async()=>{
        await deployments.fixture(["all"]);

        deployer=(await getNamedAccounts()).deployer;
        // console.log("dd ",deployer);
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        
        const mockV3Deployment = await deployments.get("MockV3Aggregator");
        mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockV3Deployment.address);

    })

    // describe("ss",function(){
    //     it("33",async()=>{
    //         const res=await fundMe.priceFeedInterface();
    //         assert(res,mockV3Aggregator.address);
    //     })
    // })

    describe("fund",function(){
        it("Fails if you dont send enough eth",async()=>{
            await expect(fundMe.fund()).to.be.revertedWith("You didn't send enough eth.");
        });

        it("Updated amount funded in DS", async()=>{
            await fundMe.fund({value:sendValue});
            const response=await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(),sendValue.toString());
        })
    })
})