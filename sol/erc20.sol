// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract MyERC20 {
    string public name = "CliCli";
    string public symbol = "CCB";
    uint8 public decimals = 6;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 total) {
        totalSupply = total;
        balanceOf[msg.sender] = total;
    }

    function transfer(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        return true;
    }
}
