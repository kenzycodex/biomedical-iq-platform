"use client";

import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastNotification.css'; 

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  type: ToastType;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ type, message }) => {
  const iconMap: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <span className="custom-toast-icon">{iconMap[type]}</span>
      <div className="custom-toast-body">{message}</div>
    </div>
  );
};

// Wrapper function to show a toast with a consistent look and feel
const showToast = (message: string, type: ToastType) => {
  const options: ToastOptions = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    closeButton: true,
    icon: false,
    className: `custom-toast custom-toast-${type}`,
    bodyClassName: 'custom-toast-body',
  };
  
  toast(<CustomToast type={type} message={message} />, options);
};

// Custom ToastContainer to be used throughout the app
const CustomToastContainer: React.FC = () => (
  <ToastContainer
    position="top-center"
    autoClose={4000}
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover
    theme="light"
    className="custom-toast-container"
  />
);

export { showToast, CustomToastContainer as ToastContainer };
