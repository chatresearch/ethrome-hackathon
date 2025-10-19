import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const FUNNY_MESSAGES = [
    "We're cooking up a good roast...",
    "Oh do we ever have a good one coming for you...",
    "Analyzing your questionable life choices...",
    "Crafting the perfect insult...",
    "Warming up the roast machine...",
    "This is gonna be savage...",
    "Hold tight, comedy incoming...",
    "Preparing maximum roast energy...",
    "Your roast is in the oven...",
];
export const LoadingDialog = ({ isOpen, message = 'Processing your roast...', isImageProcessing = false }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    useEffect(() => {
        if (!isOpen)
            return;
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
        }, 9000); // Change message every 9 seconds
        return () => clearInterval(interval);
    }, [isOpen]);
    if (!isOpen)
        return null;
    const displayMessage = isImageProcessing ? FUNNY_MESSAGES[messageIndex] : message;
    return (_jsx("div", { className: "loading-dialog-overlay", children: _jsxs("div", { className: "loading-dialog", children: [_jsx("div", { className: "loading-spinner", children: _jsx("div", { className: "spinner" }) }), _jsx("p", { className: "loading-message", children: displayMessage }), isImageProcessing && (_jsx("p", { className: "loading-submessage", children: "This might take a minute... \uD83D\uDD25" }))] }) }));
};
//# sourceMappingURL=LoadingDialog.js.map