// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner; // the owner of the contract

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    } // the struct of the product

    mapping(uint256 => Item) public items; // the mapping of the product, saving key-value pairs, where the key is the id of the product and the value is the product itself, the key is uint256 and the value is Item, unique id of the product

    event List(string name, uint256 cost, uint256 quantity); // the event that is triggered when a product is listed
    
    // Modifier to check if the caller is the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner); // require a condition to be true, otherwise, the function will revert; only the owner can list a product
        _; // the underscore is a special character that represents the function that the modifier is applied to; it is replaced by the function's code; Do this before the function body is executed
    }

    constructor() {
        owner = msg.sender; // the owner is the address that deploys the contract
    }

    // List Product
    function list(
        uint256 _id,
        string memory _name, // memory is used to store the variable in memory instead of storage
        string memory _category, // memory is the data location of the given variable
        string memory _image, // the url of the image of the product
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner { // only the owner can list a product
        
        // Crate Item Struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        ); // create a new Item Struct

        // Svae Item Struct to the blockchain
        items[_id] = item; // save the item to the blockchain, the key is the id of the product and the value is the product itself

        // Emit an even; trigger the event
        emit List(_name, _cost, _stock); // trigger the event List
    }

}
