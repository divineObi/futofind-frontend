import React from 'react';
import { FiX } from 'react-icons/fi';
import type { IconType, IconBaseProps } from 'react-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // The main modal container and overlay
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      {/* The modal panel */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-down">
        {/* Modal Header */}
          <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <div className="w-5 h-5">{React.createElement(FiX as IconType as React.ComponentType<IconBaseProps>, { size: 20 })}</div>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;