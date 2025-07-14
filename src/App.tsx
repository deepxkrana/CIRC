import React from 'react';
import { MessageSquare, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import ChatForm from './components/ChatForm';
import QueueDisplay from './components/QueueDisplay';
import { useQueue } from './hooks/useQueue';

function App() {
  const { status, isLoading, error, addChat, endChat, refresh } = useQueue();

  const handleAddChat = async (customerName: string) => {
    const success = await addChat(customerName);
    if (success) {
      // Could add a toast notification here
      console.log('Chat added successfully');
    }
  };

  const handleEndChat = async () => {
    const success = await endChat();
    if (success) {
      // Could add a toast notification here
      console.log('Chat ended successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Chat Queue Balancer</h1>
                <p className="text-sm text-gray-500">Manage customer support chats with round-robin assignment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {status && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">System Online</span>
                </div>
              )}
              
              <button
                onClick={refresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium">Connection Error</p>
                <p className="text-red-600 text-sm">
                  {error}. Make sure the backend server is running on port 3001.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message for Demo */}
        {!error && status && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">System Ready</p>
                <p className="text-green-600 text-sm">
                  Chat queue system is running. You can add new chat requests and manage the queue.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Chat Form */}
          <div className="xl:col-span-1">
            <ChatForm onAddChat={handleAddChat} isLoading={isLoading} />
          </div>

          {/* Right Column - Queue Display */}
          <div className="xl:col-span-2">
            <QueueDisplay 
              status={status} 
              onEndChat={handleEndChat} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Live Chat Queue Balancer - Built with React + Node.js + C++ Circular Queue</p>
            <p className="mt-1">Features round-robin agent assignment for fair workload distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;