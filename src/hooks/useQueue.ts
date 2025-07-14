import { useState, useEffect, useCallback } from 'react';

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

// Use relative URL to avoid mixed content issues
const API_BASE_URL = '/api';

export const useQueue = () => {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching status:', err);
      let errorMessage = 'Failed to fetch status';
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to backend server. Please ensure the Node.js server is running on port 3001 and access the app via http://localhost:5173 (not https)';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  }, []);

  const addChat = useCallback(async (customerName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add chat');
      }

      await fetchStatus(); // Refresh the status after adding
      return true;
    } catch (err) {
      console.error('Error adding chat:', err);
      let errorMessage = 'Failed to add chat';
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to backend server. Please ensure the Node.js server is running on port 3001 and access the app via http://localhost:5173 (not https)';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus]);

  const endChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to end chat');
      }

      await fetchStatus(); // Refresh the status after ending
      return true;
    } catch (err) {
      console.error('Error ending chat:', err);
      let errorMessage = 'Failed to end chat';
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to backend server. Please ensure the Node.js server is running on port 3001 and access the app via http://localhost:5173 (not https)';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    addChat,
    endChat,
    refresh: fetchStatus,
  };
};