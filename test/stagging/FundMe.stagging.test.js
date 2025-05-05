const {deployments,getNamedAccounts,ethers, network}=require("hardhat");
const {assert}=require("chai");
const { expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");


// 
(developmentChains.includes(network.name)) ? describe.skip :
describe("FundMe stagging test",function(){
    let fundMe,deployer;

    //converts eth amount into wei.
    const sendValue=ethers.parseEther("0.1");

    beforeEach(async()=>{
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    });


    it("allows people to fund and withdraw",async function(){
        const signer = await ethers.provider.getSigner(); // default deployer

        const tx = await fundMe.connect(signer).fund({ value: sendValue });
        await tx.wait(1);

        const withdrawTx = await fundMe.connect(signer).withdraw();
        await withdrawTx.wait(1);


        // Check balance
        const finalBalance = await ethers.provider.getBalance(await fundMe.getAddress());

        // console.log("cc=> ",finalBalance);

        assert.equal(finalBalance.toString(),"0");
    })
})