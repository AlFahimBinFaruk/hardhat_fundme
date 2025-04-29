// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockV3Aggregator {
    int256 private _price;
    uint8 public decimals;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals = _decimals;
        _price = _initialAnswer;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            0,
            _price,
            block.timestamp,
            block.timestamp,
            0
        );
    }

    function updateAnswer(int256 newPrice) external {
        _price = newPrice;
    }
}
