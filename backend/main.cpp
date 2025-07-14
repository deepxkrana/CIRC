#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <ctime>
#include <iomanip>
#include <cstdio>
#include "json.hpp"
using json = nlohmann::json;

class ChatRequest {
public:
    std::string customerName;
    std::string agentName;
    std::string timestamp;
    int id;
    
    ChatRequest(const std::string& customer, const std::string& agent, int requestId) 
        : customerName(customer), agentName(agent), id(requestId) {
        // Get current timestamp
        auto now = std::time(nullptr);
        auto tm = *std::localtime(&now);
        std::ostringstream oss;
        oss << std::put_time(&tm, "%Y-%m-%d %H:%M:%S");
        timestamp = oss.str();
    }
    
    ChatRequest() : customerName(""), agentName(""), timestamp(""), id(0) {}
};

class CircularQueue {
private:
    std::vector<ChatRequest> queue;
    int front;
    int rear;
    int size;
    int capacity;
    std::vector<std::string> agents;
    int currentAgentIndex;
    int nextId;
    std::string stateFile;
    
    void saveState() {
        json j;
        j["front"] = front;
        j["rear"] = rear;
        j["size"] = size;
        j["capacity"] = capacity;
        j["currentAgentIndex"] = currentAgentIndex;
        j["nextId"] = nextId;
        j["agents"] = agents;
        j["queue"] = json::array();
        for (const auto& chat : queue) {
            j["queue"].push_back({
                {"customerName", chat.customerName},
                {"agentName", chat.agentName},
                {"timestamp", chat.timestamp},
                {"id", chat.id}
            });
        }
        std::ofstream ofs(stateFile);
        ofs << j.dump();
    }
    
    void loadState() {
        std::ifstream ifs(stateFile);
        if (!ifs.is_open()) return;
        json j;
        ifs >> j;
        front = j.value("front", 0);
        rear = j.value("rear", -1);
        size = j.value("size", 0);
        capacity = j.value("capacity", capacity);
        currentAgentIndex = j.value("currentAgentIndex", 0);
        nextId = j.value("nextId", 1);
        agents = j.value("agents", agents);
        queue.clear();
        for (const auto& item : j["queue"]) {
            ChatRequest chat;
            chat.customerName = item.value("customerName", "");
            chat.agentName = item.value("agentName", "");
            chat.timestamp = item.value("timestamp", "");
            chat.id = item.value("id", 0);
            queue.push_back(chat);
        }
        // Ensure queue size
        if ((int)queue.size() < capacity) queue.resize(capacity);
    }
    
public:
    CircularQueue(int cap, const std::string& file = "queue_state.json") : capacity(cap), front(0), rear(-1), size(0), currentAgentIndex(0), nextId(1), stateFile(file) {
        queue.resize(capacity);
        agents = {"Agent Alice", "Agent Bob", "Agent Charlie", "Agent Diana", "Agent Eve"};
        loadState();
    }
    
    bool isFull() {
        return size == capacity;
    }
    
    bool isEmpty() {
        return size == 0;
    }
    
    bool addChat(const std::string& customerName) {
        if (isFull()) {
            return false;
        }
        
        rear = (rear + 1) % capacity;
        queue[rear] = ChatRequest(customerName, agents[currentAgentIndex], nextId++);
        size++;
        
        // Move to next agent (round-robin)
        currentAgentIndex = (currentAgentIndex + 1) % agents.size();
        saveState();
        
        return true;
    }
    
    bool endChat() {
        if (isEmpty()) {
            return false;
        }
        
        front = (front + 1) % capacity;
        size--;
        saveState();
        return true;
    }
    
    void listChats() {
        if (isEmpty()) {
            std::cout << "No active chats." << std::endl;
            return;
        }
        
        std::cout << "Active Chats:" << std::endl;
        std::cout << "ID | Customer | Agent | Timestamp" << std::endl;
        std::cout << "---|----------|-------|----------" << std::endl;
        
        for (int i = 0; i < size; i++) {
            int index = (front + i) % capacity;
            const ChatRequest& chat = queue[index];
            std::cout << chat.id << " | " << chat.customerName << " | " 
                     << chat.agentName << " | " << chat.timestamp << std::endl;
        }
    }
    
    std::string getJsonStatus() {
        std::ostringstream json;
        json << "{";
        json << "\"totalChats\":" << size << ",";
        json << "\"capacity\":" << capacity << ",";
        json << "\"chats\":[";
        
        for (int i = 0; i < size; i++) {
            int index = (front + i) % capacity;
            const ChatRequest& chat = queue[index];
            if (i > 0) json << ",";
            json << "{";
            json << "\"id\":" << chat.id << ",";
            json << "\"customerName\":\"" << chat.customerName << "\",";
            json << "\"agentName\":\"" << chat.agentName << "\",";
            json << "\"timestamp\":\"" << chat.timestamp << "\"";
            json << "}";
        }
        
        json << "],";
        json << "\"agents\":[";
        for (size_t i = 0; i < agents.size(); i++) {
            if (i > 0) json << ",";
            json << "\"" << agents[i] << "\"";
        }
        json << "]";
        json << "}";
        
        return json.str();
    }
};

int main(int argc, char* argv[]) {
    CircularQueue chatQueue(10); // Maximum 10 concurrent chats
    
    if (argc < 2) {
        std::cout << "Usage: " << argv[0] << " <command> [parameters]" << std::endl;
        std::cout << "Commands:" << std::endl;
        std::cout << "  add <customer_name> - Add new chat request" << std::endl;
        std::cout << "  end - End the oldest chat" << std::endl;
        std::cout << "  list - List all active chats" << std::endl;
        std::cout << "  json - Get status in JSON format" << std::endl;
        return 1;
    }
    
    std::string command = argv[1];
    
    if (command == "add") {
        if (argc < 3) {
            std::cout << "Error: Customer name required" << std::endl;
            return 1;
        }
        
        std::string customerName = argv[2];
        if (chatQueue.addChat(customerName)) {
            std::cout << "Chat request added for " << customerName << std::endl;
        } else {
            std::cout << "Error: Queue is full" << std::endl;
        }
    } else if (command == "end") {
        if (chatQueue.endChat()) {
            std::cout << "Oldest chat ended" << std::endl;
        } else {
            std::cout << "Error: No active chats to end" << std::endl;
        }
    } else if (command == "list") {
        chatQueue.listChats();
    } else if (command == "json") {
        std::cout << chatQueue.getJsonStatus() << std::endl;
    } else {
        std::cout << "Unknown command: " << command << std::endl;
        return 1;
    }
    
    return 0;
}