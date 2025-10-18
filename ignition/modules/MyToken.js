"use strict";
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("@nomicfoundation/hardhat-ignition/modules");
const MyTokenModule = (0, modules_1.buildModule)("MyTokenModule", (m) => {
    const initialSupply = m.getParameter("initialSupply", 1000000n * 10n ** 18n);
    const token = m.contract("MyToken", [initialSupply]);
    return { token };
});
exports.default = MyTokenModule;
