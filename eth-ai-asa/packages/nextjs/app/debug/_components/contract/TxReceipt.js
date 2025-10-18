"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxReceipt = void 0;
const outline_1 = require("@heroicons/react/24/outline");
const contract_1 = require("~~/app/debug/_components/contract");
const useCopyToClipboard_1 = require("~~/hooks/scaffold-eth/useCopyToClipboard");
const common_1 = require("~~/utils/scaffold-eth/common");
const TxReceipt = ({ txResult }) => {
    const { copyToClipboard: copyTxResultToClipboard, isCopiedToClipboard: isTxResultCopiedToClipboard } = (0, useCopyToClipboard_1.useCopyToClipboard)();
    return (<div className="flex text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-secondary py-0">
      <div className="mt-1 pl-2">
        {isTxResultCopiedToClipboard ? (<outline_1.CheckCircleIcon className="ml-1.5 text-xl font-normal text-base-content h-5 w-5 cursor-pointer" aria-hidden="true"/>) : (<outline_1.DocumentDuplicateIcon className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer" aria-hidden="true" onClick={() => copyTxResultToClipboard(JSON.stringify(txResult, common_1.replacer, 2))}/>)}
      </div>
      <div tabIndex={0} className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0! peer"/>
        <div className="collapse-title text-sm min-h-0! py-1.5 pl-1 after:top-4!">
          <strong>Transaction Receipt</strong>
        </div>
        <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl pl-0!">
          <pre className="text-xs">
            {Object.entries(txResult).map(([k, v]) => (<contract_1.ObjectFieldDisplay name={k} value={v} size="xs" leftPad={false} key={k}/>))}
          </pre>
        </div>
      </div>
    </div>);
};
exports.TxReceipt = TxReceipt;
