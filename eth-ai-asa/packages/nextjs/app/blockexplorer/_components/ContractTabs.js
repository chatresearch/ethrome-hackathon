"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTabs = void 0;
const react_1 = require("react");
const AddressCodeTab_1 = require("./AddressCodeTab");
const AddressLogsTab_1 = require("./AddressLogsTab");
const AddressStorageTab_1 = require("./AddressStorageTab");
const PaginationButton_1 = require("./PaginationButton");
const TransactionsTable_1 = require("./TransactionsTable");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.hardhat,
    transport: (0, viem_1.http)(),
});
const ContractTabs = ({ address, contractData }) => {
    const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage } = (0, scaffold_eth_1.useFetchBlocks)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("transactions");
    const [isContract, setIsContract] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const checkIsContract = async () => {
            const contractCode = await publicClient.getBytecode({ address: address });
            setIsContract(contractCode !== undefined && contractCode !== "0x");
        };
        checkIsContract();
    }, [address]);
    const filteredBlocks = blocks.filter(block => block.transactions.some(tx => {
        if (typeof tx === "string") {
            return false;
        }
        return tx.from.toLowerCase() === address.toLowerCase() || tx.to?.toLowerCase() === address.toLowerCase();
    }));
    return (<>
      {isContract && (<div role="tablist" className="tabs tabs-lift">
          <button role="tab" className={`tab ${activeTab === "transactions" ? "tab-active" : ""}`} onClick={() => setActiveTab("transactions")}>
            Transactions
          </button>
          <button role="tab" className={`tab ${activeTab === "code" ? "tab-active" : ""}`} onClick={() => setActiveTab("code")}>
            Code
          </button>
          <button role="tab" className={`tab  ${activeTab === "storage" ? "tab-active" : ""}`} onClick={() => setActiveTab("storage")}>
            Storage
          </button>
          <button role="tab" className={`tab  ${activeTab === "logs" ? "tab-active" : ""}`} onClick={() => setActiveTab("logs")}>
            Logs
          </button>
        </div>)}
      {activeTab === "transactions" && (<div className="pt-4">
          <TransactionsTable_1.TransactionsTable blocks={filteredBlocks} transactionReceipts={transactionReceipts}/>
          <PaginationButton_1.PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage}/>
        </div>)}
      {activeTab === "code" && contractData && (<AddressCodeTab_1.AddressCodeTab bytecode={contractData.bytecode} assembly={contractData.assembly}/>)}
      {activeTab === "storage" && <AddressStorageTab_1.AddressStorageTab address={address}/>}
      {activeTab === "logs" && <AddressLogsTab_1.AddressLogsTab address={address}/>}
    </>);
};
exports.ContractTabs = ContractTabs;
