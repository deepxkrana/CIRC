import React from 'react';
import { Users, Clock, UserCheck, AlertTriangle } from 'lucide-react';

interface Chat {
  id: number;
  customerName: string;
  agentName: string;
  timestamp: string;
}

interface QueueStatus {
  totalChats: number;
  capacity: number;
  chats: Chat[];
  agents: string[];
}

interface QueueDisplayProps {
  status: QueueStatus | null;
  onEndChat: () => void;
  isLoading: boolean;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({ status, onEndChat, isLoading }) => {
  if (!status) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const { totalChats, capacity, chats, agents } = status;
  const utilizationPercentage = (totalChats / capacity) * 100;

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Chats</p>
              <p className="text-2xl font-bold text-gray-900">{totalChats}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Queue Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{capacity}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{utilizationPercentage.toFixed(1)}%</p>
            </div>
            <div className={`p-3 rounded-lg ${utilizationPercentage > 80 ? 'bg-red-100' : 'bg-orange-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${utilizationPercentage > 80 ? 'text-red-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Queue Management */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Queue Management</h2>
          </div>
          
          {totalChats > 0 && (
            <button
              onClick={onEndChat}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Ending...
                </>
              ) : (
                'End Current Chat'
              )}
            </button>
          )}
        </div>

        {/* Utilization Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Queue Utilization</span>
            <span>{totalChats}/{capacity} chats</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                utilizationPercentage > 80 ? 'bg-red-500' : 
                utilizationPercentage > 60 ? 'bg-orange-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${utilizationPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Active Chats */}
        {chats.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Active Chats</h3>
            {chats.map((chat, index) => (
              <div
                key={chat.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  index === 0 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{chat.customerName}</p>
                      <p className="text-sm text-gray-600">{chat.agentName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{chat.timestamp}</p>
                    {index === 0 && (
                      <p className="text-xs text-blue-600 font-medium">Next to end</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No active chats</p>
            <p className="text-gray-400 text-sm">Add a new chat request to get started</p>
          </div>
        )}
      </div>

      {/* Available Agents */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Agents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent, index) => (
            <div
              key={agent}
              className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{agent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;