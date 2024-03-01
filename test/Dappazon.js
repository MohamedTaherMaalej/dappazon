const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether")
}

describe("Dappazon", () => {
  let dappazon // Contract
  let deployer, buyer // Accounts

  beforeEach(async () => {
    //Set up Accounts
    [deployer, buyer] = await ethers.getSigners() // Get the first two accounts from the wallet
    console.log(deployer.address, buyer.address) // Print the addresses of the accounts


    // Deploy the contract
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()


  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      const name = await dappazon.name()
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })

  describe("Deployment", () => {
    it("has a name", async () => {
      const name = await dappazon.name()
      expect(name).to.equal("Dappazon")
    })
  })
})
