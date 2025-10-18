"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCopyToClipboard = void 0;
const react_1 = require("react");
const useCopyToClipboard = () => {
    const [isCopiedToClipboard, setIsCopiedToClipboard] = (0, react_1.useState)(false);
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopiedToClipboard(true);
            setTimeout(() => {
                setIsCopiedToClipboard(false);
            }, 800);
        }
        catch (err) {
            console.error("Failed to copy text:", err);
        }
    };
    return { copyToClipboard, isCopiedToClipboard };
};
exports.useCopyToClipboard = useCopyToClipboard;
