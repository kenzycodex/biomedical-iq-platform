"use client";

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
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

const showToast = (message: string, type: ToastType) => {
  toast(<CustomToast type={type} message={message} />, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    closeButton: true,
    icon: false,
    className: `custom-toast custom-toast-${type}`,
    bodyClassName: 'custom-toast-body',
  });
};

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