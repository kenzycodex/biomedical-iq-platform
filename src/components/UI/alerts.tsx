import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 

interface AlertProps {
  variant?: 'default' | 'error' | 'success';
  children: React.ReactNode;
  autoDismiss?: boolean;
  dismissTimeout?: number; // Time in milliseconds before auto-dismiss
  onDismiss?: () => void;  // Callback for when the alert is dismissed
}

// Updated Alert component with Framer Motion animations
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  autoDismiss = false,
  dismissTimeout = 5000,  // Default dismiss after 5 seconds
  onDismiss,
}) => {
  const baseStyles = 'p-2 mb-2 rounded-lg transition-opacity duration-300 ease-in-out';
  const variantStyles = {
    default: 'bg-blue-100 text-blue-700 border-blue-500 border-2',
    error: 'bg-red-100 text-red-700 border-red-500 border-2',
    success: 'bg-green-100 text-green-700 border-green-500 border-2',
  };

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, dismissTimeout);

      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or changes
    }
  }, [autoDismiss, dismissTimeout, onDismiss]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}    // Starting state: hidden and shifted upwards
      animate={{ opacity: 1, y: 0 }}      // Ending state: visible and back to original position
      exit={{ opacity: 0, y: -20 }}       // Exit state: fade out and shift upwards
      transition={{ duration: 0.5 }}      // Animation duration
      className={`${baseStyles} ${variantStyles[variant]}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3">
          {variant === 'error' && (
            <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414 0L7 10l-.707-.707a1 1 0 00-1.414 1.414L7 12l-2.707 2.707a1 1 0 101.414 1.414L8 13.414l2.707 2.707a1 1 0 001.414-1.414L9 12l2.707-2.707a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {variant === 'success' && (
            <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-8l-2-2a1 1 0 111.414-1.414L8 8.586 12.293 4.293a1 1 0 011.414 1.414L8.414 10l-2-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
};