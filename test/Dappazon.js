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
const COST = tokens(1000000000000000000); // 1 WEI = 0.000000000000000001 ETH = 1e-18 ETH
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
});
