"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressStorageTab = void 0;
const react_1 = require("react");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.hardhat,
    transport: (0, viem_1.http)(),
});
const AddressStorageTab = ({ address }) => {
    const [storage, setStorage] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const fetchStorage = async () => {
            try {
                const storageData = [];
                let idx = 0;
                while (true) {
                    const storageAtPosition = await publicClient.getStorageAt({
                        address: address,
                        slot: (0, viem_1.toHex)(idx),
                    });
                    if (storageAtPosition === "0x" + "0".repeat(64))
                        break;
                    if (storageAtPosition) {
                        storageData.push(storageAtPosition);
                    }
                    idx++;
                }
                setStorage(storageData);
            }
            catch (error) {
                console.error("Failed to fetch storage:", error);
            }
        };
        fetchStorage();
    }, [address]);
    return (<div className="flex flex-col gap-3 p-4">
      {storage.length > 0 ? (<div className="mockup-code overflow-auto max-h-[500px]">
          <pre className="px-5 whitespace-pre-wrap break-words">
            {storage.map((data, i) => (<div key={i}>
                <strong>Storage Slot {i}:</strong> {data}
              </div>))}
          </pre>
        </div>) : (<div className="text-lg">This contract does not have any variables.</div>)}
    </div>);
};
exports.AddressStorageTab = AddressStorageTab;
