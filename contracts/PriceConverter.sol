// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter{

    // get the usd price for 1 eth(in terms of wei).
    function getPrice(AggregatorV3Interface priceFeedInterface) internal view returns(uint256){
        (, int256 answer,,,)=priceFeedInterface.latestRoundData();
        return uint256(answer*1e10);
    }

    function getConversionRate(uint256 ethAmount,AggregatorV3Interface priceFeedInterface) internal view returns(uint256){

        uint256 usdPrice=getPrice(priceFeedInterface);
        uint256 ethAmountInUSD=(usdPrice*ethAmount)/1e18;
        return ethAmountInUSD;
    }
}