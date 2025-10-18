"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerInput = void 0;
const react_1 = require("react");
const viem_1 = require("viem");
const scaffold_eth_1 = require("~~/components/scaffold-eth");
const IntegerInput = ({ value, onChange, name, placeholder, disabled, variant = scaffold_eth_1.IntegerVariant.UINT256, disableMultiplyBy1e18 = false, }) => {
    const [inputError, setInputError] = (0, react_1.useState)(false);
    const multiplyBy1e18 = (0, react_1.useCallback)(() => {
        if (!value) {
            return;
        }
        return onChange((0, viem_1.parseEther)(value).toString());
    }, [onChange, value]);
    (0, react_1.useEffect)(() => {
        if ((0, scaffold_eth_1.isValidInteger)(variant, value)) {
            setInputError(false);
        }
        else {
            setInputError(true);
        }
    }, [value, variant]);
    return (<scaffold_eth_1.InputBase name={name} value={value} placeholder={placeholder} error={inputError} onChange={onChange} disabled={disabled} suffix={!inputError &&
            !disableMultiplyBy1e18 && (<div className="space-x-4 flex tooltip tooltip-top tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none" data-tip="Multiply by 1e18 (wei)">
            <button className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} font-semibold px-4 text-accent`} onClick={multiplyBy1e18} disabled={disabled} type="button">
              ∗
            </button>
          </div>)}/>);
};
exports.IntegerInput = IntegerInput;
