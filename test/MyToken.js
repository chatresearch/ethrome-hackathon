"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const chai_1 = require("chai");
describe("MyToken", () => {
    let token;
    let owner;
    let addr1;
    let addr2;
    const toWei = (value) => hardhat_1.default.ethers.parseUnits(value, 18);
    beforeEach(async () => {
        ;
        [owner, addr1, addr2] = await hardhat_1.default.ethers.getSigners();
        const MyToken = await hardhat_1.default.ethers.getContractFactory("MyToken");
        token = await MyToken.deploy(toWei("1000000"));
        await token.waitForDeployment();
    });
    it("assigns initial supply to deployer", async () => {
        const balance = await token.balanceOf(owner.address);
        (0, chai_1.expect)(balance).to.equal(toWei("1000000"));
    });
    it("allows minting by MINTER_ROLE", async () => {
        const amount = toWei("1000");
        await token.mint(addr1.address, amount);
        const balance = await token.balanceOf(addr1.address);
        (0, chai_1.expect)(balance).to.equal(amount);
    });
    it("rejects minting by non-minters", async () => {
        const amount = toWei("1000");
        const MINTER_ROLE = await token.MINTER_ROLE();
        await (0, chai_1.expect)(token.connect(addr1).mint(addr2.address, amount))
            .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount")
            .withArgs(addr1.address, MINTER_ROLE);
    });
    it("allows burning", async () => {
        const burnAmount = toWei("500");
        await token.burn(burnAmount);
        const balance = await token.balanceOf(owner.address);
        (0, chai_1.expect)(balance).to.equal(toWei("1000000") - burnAmount);
    });
    it("pauses transfers", async () => {
        await token.pause();
        await (0, chai_1.expect)(token.transfer(addr1.address, 1)).to.be.revertedWithCustomError(token, "EnforcedPause");
    });
    it("rejects pause by non-pauser", async () => {
        const PAUSER_ROLE = await token.PAUSER_ROLE();
        await (0, chai_1.expect)(token.connect(addr1).pause())
            .to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount")
            .withArgs(addr1.address, PAUSER_ROLE);
    });
    it("unpauses transfers", async () => {
        await token.pause();
        await token.unpause();
        await (0, chai_1.expect)(token.transfer(addr1.address, 100)).to.not.be.reverted;
    });
    it("assigns roles correctly", async () => {
        const MINTER_ROLE = await token.MINTER_ROLE();
        const PAUSER_ROLE = await token.PAUSER_ROLE();
        (0, chai_1.expect)(await token.hasRole(MINTER_ROLE, owner.address)).to.be.true;
        (0, chai_1.expect)(await token.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });
});
