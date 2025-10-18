"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticParams = generateStaticParams;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chains_1 = require("viem/chains");
const AddressComponent_1 = require("~~/app/blockexplorer/_components/AddressComponent");
const deployedContracts_1 = __importDefault(require("~~/contracts/deployedContracts"));
const common_1 = require("~~/utils/scaffold-eth/common");
async function fetchByteCodeAndAssembly(buildInfoDirectory, contractPath) {
    const buildInfoFiles = fs_1.default.readdirSync(buildInfoDirectory);
    let bytecode = "";
    let assembly = "";
    for (let i = 0; i < buildInfoFiles.length; i++) {
        const filePath = path_1.default.join(buildInfoDirectory, buildInfoFiles[i]);
        const buildInfo = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
        if (buildInfo.output.contracts[contractPath]) {
            for (const contract in buildInfo.output.contracts[contractPath]) {
                bytecode = buildInfo.output.contracts[contractPath][contract].evm.bytecode.object;
                assembly = buildInfo.output.contracts[contractPath][contract].evm.bytecode.opcodes;
                break;
            }
        }
        if (bytecode && assembly) {
            break;
        }
    }
    return { bytecode, assembly };
}
const getContractData = async (address) => {
    const contracts = deployedContracts_1.default;
    const chainId = chains_1.foundry.id;
    if (!contracts || !contracts[chainId] || Object.keys(contracts[chainId]).length === 0) {
        return null;
    }
    let contractPath = "";
    const buildInfoDirectory = path_1.default.join(__dirname, "..", "..", "..", "..", "..", "..", "..", "foundry", "out", "build-info");
    if (!fs_1.default.existsSync(buildInfoDirectory)) {
        throw new Error(`Directory ${buildInfoDirectory} not found.`);
    }
    const deployedContractsOnChain = contracts[chainId];
    for (const [contractName, contractInfo] of Object.entries(deployedContractsOnChain)) {
        if (contractInfo.address.toLowerCase() === address.toLowerCase()) {
            contractPath = `contracts/${contractName}.sol`;
            break;
        }
    }
    if (!contractPath) {
        // No contract found at this address
        return null;
    }
    const { bytecode, assembly } = await fetchByteCodeAndAssembly(buildInfoDirectory, contractPath);
    return { bytecode, assembly };
};
function generateStaticParams() {
    // An workaround to enable static exports in Next.js, generating single dummy page.
    return [{ address: "0x0000000000000000000000000000000000000000" }];
}
const AddressPage = async (props) => {
    const params = await props.params;
    const address = params?.address;
    if ((0, common_1.isZeroAddress)(address))
        return null;
    const contractData = await getContractData(address);
    return <AddressComponent_1.AddressComponent address={address} contractData={contractData}/>;
};
exports.default = AddressPage;
