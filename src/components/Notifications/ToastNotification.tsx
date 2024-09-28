"use client";

import { ToastContainer, toast, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastNotification.css';

const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const toastConfig = {
        position: "top-right" as ToastPosition,
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        className: 'custom-toast', 
        bodyClassName: 'custom-toast-body' 
    };

    if (type === 'warning') {
        toast(message, { 
            ...toastConfig, 
            style: { backgroundColor: '#3498db', color: '#fff' } // Blue for warning
        });
    } else {
        toast[type](message, toastConfig); // Default for success and error
    }
};

// Exporting both the showToast function and the ToastContainer
export { showToast, ToastContainer };
