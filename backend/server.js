const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Path to the C++ executable - dynamically determine based on OS
const executableName = process.platform === 'win32' ? 'main.exe' : 'main';
const EXECUTABLE_PATH = path.join(__dirname, executableName);

// Helper function to execute C++ program
function executeCppProgram(command, params = []) {
    return new Promise((resolve, reject) => {
        const args = [command, ...params];
        const fullCommand = `"${EXECUTABLE_PATH}" ${args.join(' ')}`;
        
        exec(fullCommand, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing C++ program: ${error}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.error(`C++ program stderr: ${stderr}`);
            }
            
            resolve(stdout.trim());
        });
    });
}

// API Routes

// Get current queue status
app.get('/api/status', async (req, res) => {
    try {
        const result = await executeCppProgram('json');
        const status = JSON.parse(result);
        res.json(status);
    } catch (error) {
        console.error('Error getting status:', error);
        res.status(500).json({ 
            error: 'Failed to get queue status',
            message: error.message 
        });
    }
});

// Add new chat request
app.post('/api/chat', async (req, res) => {
    try {
        const { customerName } = req.body;
        
        if (!customerName || customerName.trim() === '') {
            return res.status(400).json({ error: 'Customer name is required' });
        }
        
        const result = await executeCppProgram('add', [customerName.trim()]);
        
        if (result.includes('Error')) {
            return res.status(400).json({ error: result });
        }
        
        res.json({ message: result, success: true });
    } catch (error) {
        console.error('Error adding chat:', error);
        res.status(500).json({ 
            error: 'Failed to add chat request',
            message: error.message 
        });
    }
});

// End current chat
app.delete('/api/chat', async (req, res) => {
    try {
        const result = await executeCppProgram('end');
        
        if (result.includes('Error')) {
            return res.status(400).json({ error: result });
        }
        
        res.json({ message: result, success: true });
    } catch (error) {
        console.error('Error ending chat:', error);
        res.status(500).json({ 
            error: 'Failed to end chat',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using executable: ${executableName}`);
    console.log(`API endpoints:`);
    console.log(`  GET  /api/status - Get queue status`);
    console.log(`  POST /api/chat - Add new chat`);
    console.log(`  DELETE /api/chat - End current chat`);
    console.log(`  GET  /api/health - Health check`);
});