import React from 'react';

function LeavePopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Leave Meeting?</h2>
        <p className="mb-6">Are you sure you want to leave?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Leave 🚪
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeavePopup;
