"use client";

import React from 'react';
import { ToastContainer, toast, ToastPosition, ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastNotification.css';

// Custom Toast component
const CustomToast: React.FC<ToastContentProps> = ({ closeToast, type, message }) => {
  let icon = '✉️'; // Default icon

  switch (type) {
    case 'success':
      icon = '✅';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    case 'info':
      icon = 'ℹ️';
      break;
  }

  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <span className="custom-toast-icon">{icon}</span>
      <div className="custom-toast-body">{message}</div>
      <button onClick={closeToast} className="custom-toast-close">×</button>
    </div>
  );
};

// Configuration for toast
const toastConfig = {
  position: "top-center" as ToastPosition,
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  closeButton: false,
  icon: false,
};

// Function to show toast
const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
  toast(<CustomToast type={type} message={message} />, {
    ...toastConfig,
    className: `custom-toast custom-toast-${type}`,
    bodyClassName: 'custom-toast-body',
  });
};

// Custom ToastContainer component
const CustomToastContainer: React.FC = () => (
  <ToastContainer
    position="top-center"
    autoClose={4000}
    hideProgressBar
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