// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./PriceConverter.sol";

// custom err
error NotOwner();

// main contract
contract FundMe{

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD=1*1e18;

    mapping(address=>uint256) private funderToAmount;
    address[] funders;

    address public immutable i_owner;
    AggregatorV3Interface public priceFeedInterface;
    

    // this will only run once when the contract is being deployed.
    constructor(address _priceFeedAddress){
        i_owner=msg.sender;
        priceFeedInterface=AggregatorV3Interface(_priceFeedAddress);
    }


    // this will automatically handle the transaction(getting eth) because of payable keyword.
    // this store the funded eth to contract address
    function fund() public payable{
        require(msg.value.getConversionRate(priceFeedInterface)>=MINIMUM_USD,"You didn't send enough eth.");
        funderToAmount[msg.sender]+=msg.value;
        funders.push(msg.sender);
    }

    modifier onlyOwner{
        if(msg.sender!=i_owner){
            revert NotOwner();
        }
        _;
    }
    

    function withdraw() public onlyOwner{
        // resetting
        for(uint256 i=0;i<funders.length;i++){
            address funder=funders[i];
            funderToAmount[funder]=0;
        }
        funders=new address[](0);

        // ******* transfering the fund ******** //

        // - transfer
        // payable(msg.sender).transfer(address(this).balance);

        // - send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        // - call
        (bool callSuccess,)=payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"Withdrawal failed!");
    }


    



    fallback() external payable{
        fund();
    }

    receive() external payable{
        fund();
    }



    // Getter functions
    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256){
        return funderToAmount[fundingAddress];
    }

    function getFunder(uint256 index) public view returns(address){
        return funders[index];
    }

    function getPriceFeedInterface() public view returns(AggregatorV3Interface){
        return priceFeedInterface;
    }
}