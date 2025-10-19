import React from 'react';

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
  isImageProcessing?: boolean;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({ 
  isOpen, 
  message = 'Processing your roast...',
  isImageProcessing = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="loading-dialog-overlay">
      <div className="loading-dialog">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p className="loading-message">{message}</p>
        {isImageProcessing && (
          <p className="loading-submessage">
            Image analysis takes a bit longer... ⏳
          </p>
        )}
      </div>
    </div>
  );
};
