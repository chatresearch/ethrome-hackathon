"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevealBurnerPKModal = void 0;
const react_1 = require("react");
const burner_connector_1 = require("burner-connector");
const outline_1 = require("@heroicons/react/24/outline");
const scaffold_eth_1 = require("~~/hooks/scaffold-eth");
const scaffold_eth_2 = require("~~/utils/scaffold-eth");
const BURNER_WALLET_PK_KEY = "burnerWallet.pk";
const RevealBurnerPKModal = () => {
    const { copyToClipboard, isCopiedToClipboard } = (0, scaffold_eth_1.useCopyToClipboard)();
    const modalCheckboxRef = (0, react_1.useRef)(null);
    const handleCopyPK = async () => {
        try {
            const storage = burner_connector_1.rainbowkitBurnerWallet.useSessionStorage ? sessionStorage : localStorage;
            const burnerPK = storage?.getItem(BURNER_WALLET_PK_KEY);
            if (!burnerPK)
                throw new Error("Burner wallet private key not found");
            await copyToClipboard(burnerPK);
            scaffold_eth_2.notification.success("Burner wallet private key copied to clipboard");
        }
        catch (e) {
            const parsedError = (0, scaffold_eth_2.getParsedError)(e);
            scaffold_eth_2.notification.error(parsedError);
            if (modalCheckboxRef.current)
                modalCheckboxRef.current.checked = false;
        }
    };
    return (<>
      <div>
        <input type="checkbox" id="reveal-burner-pk-modal" className="modal-toggle" ref={modalCheckboxRef}/>
        <label htmlFor="reveal-burner-pk-modal" className="modal cursor-pointer">
          <label className="modal-box relative">
            {/* dummy input to capture event onclick on modal box */}
            <input className="h-0 w-0 absolute top-0 left-0"/>
            <label htmlFor="reveal-burner-pk-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
              ✕
            </label>
            <div>
              <p className="text-lg font-semibold m-0 p-0">Copy Burner Wallet Private Key</p>
              <div role="alert" className="alert alert-warning mt-4">
                <outline_1.ShieldExclamationIcon className="h-6 w-6"/>
                <span className="font-semibold">
                  Burner wallets are intended for local development only and are not safe for storing real funds.
                </span>
              </div>
              <p>
                Your Private Key provides <strong>full access</strong> to your entire wallet and funds. This is
                currently stored <strong>temporarily</strong> in your browser.
              </p>
              <button className="btn btn-outline btn-error" onClick={handleCopyPK} disabled={isCopiedToClipboard}>
                Copy Private Key To Clipboard
              </button>
            </div>
          </label>
        </label>
      </div>
    </>);
};
exports.RevealBurnerPKModal = RevealBurnerPKModal;
