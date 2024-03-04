const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Global constants for listing an item...
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IAMGE =
  "https://www.ipfs.io/ipfs/Qmhttps://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1); // 1 WEI = 0.000000000000000001 ETH = 1e-18 ETH
const RATING = 4;
const STOCK = 5;

describe("Dappazon", () => {
  let dappazon; // Contract
  let deployer, buyer; // Accounts

  beforeEach(async () => {
    //Set up Accounts
    [deployer, buyer] = await ethers.getSigners(); // Get the first two accounts from the wallet
    //console.log(deployer.address, buyer.address) // Print the addresses of the accounts

    // Deploy the contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IAMGE, COST, RATING, STOCK);

      await transaction.wait();
    });
    it("Returns item attributes", async () => {
      const item = await dappazon.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IAMGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits List event", async () => {
      expect(transaction).to.emit(dappazon, "List");
    });
  });

  

  describe("Buying", () => {
    let transaction;

    beforeEach(async () => {
      // List an item
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IAMGE, COST, RATING, STOCK);

      await transaction.wait();

      // Buy the item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
    });

    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address); // Get the order count of the buyer
      expect(result).to.equal(1); // Check if the order count of the buyer is equal to 1
    });

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1); // Get the order count of the buyer
      expect(order.time).to.be.greaterThan(0); // Check if the time of the order is greater than 0
      expect(order.item.name).to.equal(NAME); // Check if the name of the item is equal to the name of the item listed
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address); // Get the balance of the contract; Check the smart contract balance
      expect(result).to.equal(COST); // Check if the contract balance is equal to the cost of the item
    });

    it("Emits Buy event", async () => {
      expect(transaction).to.emit(dappazon, "Buy");
    });
  });
});
