// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./PriceConverter.sol";

// custom err
error NotOwner();
error NotEnoughETH(uint256 sent, uint256 required);


// main contract
contract FundMe{

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD=1*1e18;
    
    mapping(address=>uint256) private s_funderToAmount;
    // You cannot iterate over a mapping directly, so, we need arr.
    address[] private s_funders;

    address public immutable i_owner;
    AggregatorV3Interface public priceFeedInterface;



    // modifiers
    modifier onlyOwner{
        if(msg.sender!=i_owner){
            revert NotOwner();
        }
        _;
    }

    modifier meetsMinimumUSD(uint256 ethAmount) {
        uint256 convertedAmount = ethAmount.getConversionRate(priceFeedInterface);
        if (convertedAmount < MINIMUM_USD) {
            revert NotEnoughETH(convertedAmount, MINIMUM_USD);
        }
        _;
    }
    

    // this will only run once when the contract is being deployed.
    constructor(address _priceFeedAddress){
        i_owner=msg.sender;
        priceFeedInterface=AggregatorV3Interface(_priceFeedAddress);
    }



    // this will automatically handle the transaction(getting eth) because of payable keyword.
    // this store the funded eth to contract address
    function fund() public payable meetsMinimumUSD(msg.value){
        s_funderToAmount[msg.sender]+=msg.value;
        s_funders.push(msg.sender);
    }
    

    // Withdraw fund
    function withdraw() public onlyOwner{
        // resetting
        for(uint256 i=0;i<s_funders.length;i++){
            address funder=s_funders[i];
            s_funderToAmount[funder]=0;
        }
        s_funders=new address[](0);
        
        // withdrawing.
        (bool callSuccess,)=payable(msg.sender).call{value:address(this).balance}("");
        require(callSuccess,"Withdrawal failed!");
    }



    // function name don't match.
    fallback() external payable{
        fund();
    }

    // didn't provide any function.
    receive() external payable{
        fund();
    }


    // Getter functions
    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256){
        return s_funderToAmount[fundingAddress];
    }

    function getFunder(uint256 index) public view returns(address){
        return s_funders[index];
    }

    function getPriceFeedInterface() public view returns(AggregatorV3Interface){
        return priceFeedInterface;
    }
}