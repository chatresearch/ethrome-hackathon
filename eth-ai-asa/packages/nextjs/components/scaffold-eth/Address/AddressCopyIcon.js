"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressCopyIcon = void 0;
const outline_1 = require("@heroicons/react/24/outline");
const useCopyToClipboard_1 = require("~~/hooks/scaffold-eth/useCopyToClipboard");
const AddressCopyIcon = ({ className, address }) => {
    const { copyToClipboard: copyAddressToClipboard, isCopiedToClipboard: isAddressCopiedToClipboard } = (0, useCopyToClipboard_1.useCopyToClipboard)();
    return (<button onClick={e => {
            e.stopPropagation();
            copyAddressToClipboard(address);
        }} type="button">
      {isAddressCopiedToClipboard ? (<outline_1.CheckCircleIcon className={className} aria-hidden="true"/>) : (<outline_1.DocumentDuplicateIcon className={className} aria-hidden="true"/>)}
    </button>);
};
exports.AddressCopyIcon = AddressCopyIcon;
