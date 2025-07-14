import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';

interface ChatFormProps {
  onAddChat: (customerName: string) => void;
  isLoading: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({ onAddChat, isLoading }) => {
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
      onAddChat(customerName.trim());
      setCustomerName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Add New Chat Request</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter customer name..."
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !customerName.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Chat Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;