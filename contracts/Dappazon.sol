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

    struct Order {
        uint256 time;
        Item item;
    } // the struct of the order

    mapping(uint256 => Item) public items; // the mapping of the product, saving key-value pairs, where the key is the id of the product and the value is the product itself, the key is uint256 and the value is Item, unique id of the product
    mapping(address => uint256) public orderCount; // the mapping of the order, saving key-value pairs, where the key is the address of the buyer and the value is the number of orders, the key is the address and the value is uint256
    mapping(address => mapping(uint256 => Order)) public orders; // the mapping of the order, saving key-value pairs, where the key is the address of the buyer and the value is the order, the key is the address and the value is the order, the key is the address and the value is the order, the key is the address and the value is the order; nested mapping

    event List(string name, uint256 cost, uint256 quantity); // the event that is triggered when a product is listed
    event Buy(address buyer, uint256 orderId, uint256 itemId); // the event that is triggered when a product is bought

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

        // Save Item Struct to the blockchain; Add item to mapping
        items[_id] = item; // save the item to the blockchain, the key is the id of the product and the value is the product itself

        // Emit an even; trigger the event
        emit List(_name, _cost, _stock); // trigger the event List
    }

    // Buy Product
    function buy(uint256 _id) public payable { 
        // Fetch item
        Item memory item = items[_id]; // fetch the item from the blockchain

        // Require enough Ether to buy the item
        require(msg.value >= item.cost); // require a condition to be true, otherwise, the function will revert; the buyer must have enough ether to buy the product
        
        // Require item is in stock
        require(item.stock > 0); // require a condition to be true, otherwise, the function will revert; the product must be in stock

        // Create an Order
        Order memory order = Order(block.timestamp, item); // create a new Order Struct
        
        // Save Order to chain
        orderCount[msg.sender]++; // increment the order count of the buyer: <-- Order ID
        orders[msg.sender][orderCount[msg.sender]] = order; // save the order to the blockchain

        // Substract Stock
        items[_id].stock = item.stock - 1; // substract the stock of the product by 1

        //Emit an Event
        emit Buy(msg.sender, orderCount[msg.sender], item.id); // trigger the event Buy
    }

    // Withdraw funds
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}(""); // send the balance of the contract to the owner
        require(success); // require a condition to be true, otherwise, the function will revert
    }
}
