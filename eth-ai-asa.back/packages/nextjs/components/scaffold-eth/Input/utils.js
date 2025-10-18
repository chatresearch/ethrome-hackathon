"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isENS = exports.isValidInteger = exports.UNSIGNED_NUMBER_REGEX = exports.SIGNED_NUMBER_REGEX = exports.IntegerVariant = void 0;
var IntegerVariant;
(function (IntegerVariant) {
    IntegerVariant["UINT8"] = "uint8";
    IntegerVariant["UINT16"] = "uint16";
    IntegerVariant["UINT24"] = "uint24";
    IntegerVariant["UINT32"] = "uint32";
    IntegerVariant["UINT40"] = "uint40";
    IntegerVariant["UINT48"] = "uint48";
    IntegerVariant["UINT56"] = "uint56";
    IntegerVariant["UINT64"] = "uint64";
    IntegerVariant["UINT72"] = "uint72";
    IntegerVariant["UINT80"] = "uint80";
    IntegerVariant["UINT88"] = "uint88";
    IntegerVariant["UINT96"] = "uint96";
    IntegerVariant["UINT104"] = "uint104";
    IntegerVariant["UINT112"] = "uint112";
    IntegerVariant["UINT120"] = "uint120";
    IntegerVariant["UINT128"] = "uint128";
    IntegerVariant["UINT136"] = "uint136";
    IntegerVariant["UINT144"] = "uint144";
    IntegerVariant["UINT152"] = "uint152";
    IntegerVariant["UINT160"] = "uint160";
    IntegerVariant["UINT168"] = "uint168";
    IntegerVariant["UINT176"] = "uint176";
    IntegerVariant["UINT184"] = "uint184";
    IntegerVariant["UINT192"] = "uint192";
    IntegerVariant["UINT200"] = "uint200";
    IntegerVariant["UINT208"] = "uint208";
    IntegerVariant["UINT216"] = "uint216";
    IntegerVariant["UINT224"] = "uint224";
    IntegerVariant["UINT232"] = "uint232";
    IntegerVariant["UINT240"] = "uint240";
    IntegerVariant["UINT248"] = "uint248";
    IntegerVariant["UINT256"] = "uint256";
    IntegerVariant["INT8"] = "int8";
    IntegerVariant["INT16"] = "int16";
    IntegerVariant["INT24"] = "int24";
    IntegerVariant["INT32"] = "int32";
    IntegerVariant["INT40"] = "int40";
    IntegerVariant["INT48"] = "int48";
    IntegerVariant["INT56"] = "int56";
    IntegerVariant["INT64"] = "int64";
    IntegerVariant["INT72"] = "int72";
    IntegerVariant["INT80"] = "int80";
    IntegerVariant["INT88"] = "int88";
    IntegerVariant["INT96"] = "int96";
    IntegerVariant["INT104"] = "int104";
    IntegerVariant["INT112"] = "int112";
    IntegerVariant["INT120"] = "int120";
    IntegerVariant["INT128"] = "int128";
    IntegerVariant["INT136"] = "int136";
    IntegerVariant["INT144"] = "int144";
    IntegerVariant["INT152"] = "int152";
    IntegerVariant["INT160"] = "int160";
    IntegerVariant["INT168"] = "int168";
    IntegerVariant["INT176"] = "int176";
    IntegerVariant["INT184"] = "int184";
    IntegerVariant["INT192"] = "int192";
    IntegerVariant["INT200"] = "int200";
    IntegerVariant["INT208"] = "int208";
    IntegerVariant["INT216"] = "int216";
    IntegerVariant["INT224"] = "int224";
    IntegerVariant["INT232"] = "int232";
    IntegerVariant["INT240"] = "int240";
    IntegerVariant["INT248"] = "int248";
    IntegerVariant["INT256"] = "int256";
})(IntegerVariant || (exports.IntegerVariant = IntegerVariant = {}));
exports.SIGNED_NUMBER_REGEX = /^-?\d+\.?\d*$/;
exports.UNSIGNED_NUMBER_REGEX = /^\.?\d+\.?\d*$/;
const isValidInteger = (dataType, value) => {
    const isSigned = dataType.startsWith("i");
    const bitcount = Number(dataType.substring(isSigned ? 3 : 4));
    let valueAsBigInt;
    try {
        valueAsBigInt = BigInt(value);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (e) { }
    if (typeof valueAsBigInt !== "bigint") {
        if (!value || typeof value !== "string") {
            return true;
        }
        return isSigned ? exports.SIGNED_NUMBER_REGEX.test(value) || value === "-" : exports.UNSIGNED_NUMBER_REGEX.test(value);
    }
    else if (!isSigned && valueAsBigInt < 0) {
        return false;
    }
    const hexString = valueAsBigInt.toString(16);
    const significantHexDigits = hexString.match(/.*x0*(.*)$/)?.[1] ?? "";
    if (significantHexDigits.length * 4 > bitcount ||
        (isSigned && significantHexDigits.length * 4 === bitcount && parseInt(significantHexDigits.slice(-1)?.[0], 16) < 8)) {
        return false;
    }
    return true;
};
exports.isValidInteger = isValidInteger;
// Treat any dot-separated string as a potential ENS name
const ensRegex = /.+\..+/;
const isENS = (address = "") => ensRegex.test(address);
exports.isENS = isENS;
