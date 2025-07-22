import React from "react";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl p-6 min-w-[320px] relative max-w-md w-full">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-2xl text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Modal Content */}
      {children}
    </div>
  </div>
);

export default Modal;
