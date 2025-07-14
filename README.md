# Live Chat Queue Balancer

A comprehensive web-based application that demonstrates how live chat requests are managed and assigned to support agents using a **circular queue** data structure implemented in C++, with a modern React frontend and Node.js middleware.

## 🚀 Features

- **Circular Queue Implementation**: C++ backend with efficient circular queue data structure
- **Round-Robin Agent Assignment**: Fair distribution of chat requests among available agents
- **Real-time Web Interface**: Modern React frontend with real-time updates
- **REST API Integration**: Node.js server bridging frontend and C++ backend
- **Beautiful UI**: Production-ready interface with Tailwind CSS
- **Queue Management**: Add new chats, end current chats, and view queue status
- **Agent Monitoring**: Track agent workload and availability

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Node.js API   │    │   C++ Backend   │
│                 │    │                 │    │                 │
│  - Chat Form    │◄──►│  - REST API     │◄──►│  - Circular     │
│  - Queue Display│    │  - CORS Handler │    │    Queue        │
│  - Real-time UI │    │  - Process Exec │    │  - Agent        │
│                 │    │                 │    │    Assignment   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **C++ Compiler** (GCC/Clang/MSVC)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd live-chat-queue-balancer
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install express cors
```

### 4. Compile the C++ backend
```bash
# On Windows
g++ -o main.exe main.cpp

# On macOS/Linux
g++ -o main main.cpp
```

### 5. Start the Node.js server
```bash
cd backend
node server.js
```

### 6. Start the React development server
```bash
# In the root directory
npm run dev
```

## 🚀 Usage

### Web Interface
1. Open your browser and navigate to `http://localhost:5173`
2. Use the **"Add New Chat Request"** form to submit customer chat requests
3. Click **"End Current Chat"** to complete the oldest active chat
4. Monitor the queue status, agent assignments, and utilization in real-time

### API Endpoints
- `GET /api/status` - Get current queue status
- `POST /api/chat` - Add new chat request
- `DELETE /api/chat` - End current chat
- `GET /api/health` - Health check

### Command Line Interface (C++ Backend)
```bash
# Add a new chat request
./main add "John Doe"

# End the current chat
./main end

# List all active chats
./main list

# Get status in JSON format
./main json
```

## 🔧 Technical Details

### C++ Circular Queue Implementation
- **Data Structure**: Circular queue with configurable capacity
- **Agent Assignment**: Round-robin algorithm ensuring fair distribution
- **Time Tracking**: Automatic timestamp generation for each chat
- **JSON Output**: Structured data format for API communication

### Node.js Middleware
- **Express.js**: RESTful API server
- **CORS**: Cross-origin resource sharing enabled
- **Process Execution**: Bridge between web interface and C++ backend
- **Error Handling**: Comprehensive error management and logging

### React Frontend
- **Modern Components**: Functional components with hooks
- **Real-time Updates**: Automatic status polling every 5 seconds
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

## 📊 Features Breakdown

### Core Features
- ✅ Add new chat requests with customer names
- ✅ End current/oldest chat using FIFO principle
- ✅ View current queue with agent assignments
- ✅ Circular queue implementation in C++
- ✅ Round-robin agent assignment
- ✅ Real-time web interface
- ✅ REST API integration

### Advanced Features
- ✅ Queue utilization monitoring
- ✅ Agent availability tracking
- ✅ Timestamp tracking for each chat
- ✅ Visual queue status indicators
- ✅ Error handling and validation
- ✅ Responsive design for all devices

## 🎯 System Specifications

- **Queue Capacity**: 10 concurrent chats (configurable)
- **Agent Pool**: 5 agents (Alice, Bob, Charlie, Diana, Eve)
- **Assignment Algorithm**: Round-robin with circular queue
- **Update Frequency**: 5-second polling for real-time updates
- **API Response Time**: <100ms for typical operations

## 🤝 Development

### Project Structure
```
live-chat-queue-balancer/
├── backend/
│   ├── main.cpp           # C++ circular queue implementation
│   ├── server.js          # Node.js API server
│   └── package.json       # Backend dependencies
├── src/
│   ├── components/
│   │   ├── ChatForm.tsx   # Chat request form
│   │   └── QueueDisplay.tsx # Queue visualization
│   ├── hooks/
│   │   └── useQueue.ts    # Queue management hook
│   └── App.tsx            # Main application
├── package.json           # Frontend dependencies
└── README.md             # This file
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js, CORS
- **Core Logic**: C++ with STL containers and algorithms
- **Build Tools**: Vite, ESLint, PostCSS

## 📈 Performance Metrics

- **Queue Operations**: O(1) time complexity for add/remove
- **Memory Usage**: O(n) space complexity where n is queue capacity
- **API Latency**: <100ms for typical operations
- **UI Responsiveness**: 60fps animations and transitions

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with subtle animations
- **Visual Feedback**: Real-time status indicators and loading states
- **Accessibility**: ARIA labels and keyboard navigation support
- **Mobile Responsive**: Optimized for all screen sizes
- **Error Handling**: User-friendly error messages and recovery options

## 🔮 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Chat history and analytics
- [ ] Agent performance metrics
- [ ] Persistent queue state with database
- [ ] Advanced queue priorities
- [ ] Multi-queue support for different departments
- [ ] Administrative dashboard

## 📝 Notes

- The C++ backend must be compiled before running the Node.js server
- The application uses polling for updates; WebSocket integration could improve real-time performance
- Queue state is maintained in memory; consider persistent storage for production use
- The system is designed for demonstration purposes and can be extended for production deployment

## 🐛 Troubleshooting

### Common Issues
1. **C++ compilation errors**: Ensure you have a compatible C++ compiler installed
2. **Server connection errors**: Check that the Node.js server is running on port 3001
3. **CORS issues**: Verify that the frontend is running on the expected port (5173)
4. **Path issues**: Ensure the C++ executable path is correct in server.js

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=true node server.js
```

---

Built with ❤️ using React, Node.js, and C++