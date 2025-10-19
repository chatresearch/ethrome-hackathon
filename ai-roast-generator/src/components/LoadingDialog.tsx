import React, { useState, useEffect } from 'react';

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
  isImageProcessing?: boolean;
}

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

export const LoadingDialog: React.FC<LoadingDialogProps> = ({ 
  isOpen, 
  message = 'Processing your roast...',
  isImageProcessing = false 
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayMessage = isImageProcessing ? FUNNY_MESSAGES[messageIndex] : message;

  return (
    <div className="loading-dialog-overlay">
      <div className="loading-dialog">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-message">{displayMessage}</p>
        {isImageProcessing && (
          <p className="loading-submessage">
            This might take a minute... 🔥
          </p>
        )}
      </div>
    </div>
  );
};
