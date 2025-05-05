const {deployments,getNamedAccounts,ethers, network}=require("hardhat");
const {assert}=require("chai");
const { expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

(!developmentChains.includes(network.name)) ? describe.skip :
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

    });

    describe("constructor",function(){
        it("sets the aggregator addresses correctly",async()=>{
            const res=await fundMe.getPriceFeedInterface();
            // console.log("res => ",res);
            assert(res,mockV3Aggregator.address);
        })
    });


    // Funding testing
    describe("fund",function(){
        it("Fails if you dont send enough eth",async()=>{
            await expect(fundMe.fund()).to.be.revertedWith("You didn't send enough eth.");
        });

        it("Updated amount funded in DS", async()=>{
            await fundMe.fund({value:sendValue});
            const response=await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(),sendValue.toString());
        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    });

    // Withdraw testing
    describe("withdraw",function(){
        it("Only allows the owner of the contract to withdraw fund",async ()=>{
            const accounts=await ethers.getSigners();
            const connectedAccount=await fundMe.connect(accounts[1]);
            
            await expect(connectedAccount.withdraw()).to.be.revertedWithCustomError(fundMe,"NotOwner");
        })
    });
})