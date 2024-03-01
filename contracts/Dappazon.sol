// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    string public name;
    address public owner; // the owner of the contract

    constructor() {
        name = "Dappazon";
        owner = msg.sender; // the owner is the address that deploys the contract

    }
}
