/**
 * CV2WEB SSE Client Library
 * Provides a robust EventSource wrapper with automatic reconnection,
 * proper error handling, and type-safe event handling
 */

class CV2WebSSEClient {
    constructor(config = {}) {
        this.config = {
            baseUrl: config.baseUrl || 'http://localhost:2000/api/v1/sse',
            sessionId: config.sessionId || null,
            connectionToken: config.connectionToken || null,
            autoReconnect: config.autoReconnect !== false,
            maxReconnectAttempts: config.maxReconnectAttempts || 5,
            reconnectDelay: config.reconnectDelay || 1000,
            heartbeatTimeout: config.heartbeatTimeout || 60000,
            ...config
        };
        
        this.eventSource = null;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.lastEventId = null;
        this.connectionId = null;
        this.heartbeatTimer = null;
        this.eventHandlers = new Map();
        this.genericHandlers = [];
        
        // Bind methods
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleError = this.handleError.bind(this);
    }
    
    /**
     * Connect to SSE endpoint
     */
    connect(endpoint = '/heartbeat', headers = {}) {
        if (this.isConnecting || this.isConnected()) {
            console.warn('Already connected or connecting');
            return;
        }
        
        this.isConnecting = true;
        this.endpoint = endpoint;
        
        const url = new URL(endpoint, this.config.baseUrl);
        
        // Add Last-Event-ID if available
        if (this.lastEventId) {
            headers['Last-Event-ID'] = this.lastEventId;
        }
        
        // Add authentication headers
        if (this.config.sessionId) {
            headers['X-Session-ID'] = this.config.sessionId;
        }
        if (this.config.connectionToken) {
            headers['X-Connection-Token'] = this.config.connectionToken;
        }
        
        try {
            this.eventSource = new EventSource(url.toString());
            this.setupEventListeners();
            this.startHeartbeatMonitor();
            
            console.log(`🔗 Connecting to SSE: ${url}`);
            
        } catch (error) {
            console.error('Failed to create EventSource:', error);
            this.isConnecting = false;
            this.handleConnectionError(error);
        }
    }
    
    /**
     * Disconnect from SSE
     */
    disconnect() {
        this.config.autoReconnect = false; // Prevent auto-reconnection
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        
        this.isConnecting = false;
        this.connectionId = null;
        this.reconnectAttempts = 0;
        
        this.emit('disconnect');
        console.log('🔌 Disconnected from SSE');
    }
    
    /**
     * Check if connected
     */
    isConnected() {
        return this.eventSource && this.eventSource.readyState === EventSource.OPEN;
    }
    
    /**
     * Get connection ID
     */
    getConnectionId() {
        return this.connectionId;
    }
    
    /**
     * Setup EventSource event listeners
     */
    setupEventListeners() {
        if (!this.eventSource) return;
        
        this.eventSource.onopen = this.handleOpen;
        this.eventSource.onmessage = this.handleMessage;
        this.eventSource.onerror = this.handleError;
        
        // Add specific event type listeners
        const eventTypes = ['progress', 'step', 'complete', 'error', 'warning', 'heartbeat', 'sentinel'];
        eventTypes.forEach(type => {
            this.eventSource.addEventListener(type, (event) => {
                this.handleTypedMessage(type, event);
            });
        });
    }
    
    /**
     * Handle connection open
     */
    handleOpen(event) {
        console.log('✅ SSE Connection opened');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.connectionId = `sse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        this.emit('connect', { timestamp: new Date().toISOString() });
    }
    
    /**
     * Handle incoming messages
     */
    handleMessage(event) {
        try {
            const data = JSON.parse(event.data);
            this.lastEventId = event.lastEventId;
            
            console.log('📨 SSE Message:', { type: 'default', data });
            
            // Emit to generic handlers
            this.emit('message', { type: 'default', data, id: event.lastEventId });
            
        } catch (error) {
            console.warn('Failed to parse SSE message:', event.data);
            this.emit('message', { type: 'default', data: event.data, id: event.lastEventId });
        }
    }
    
    /**
     * Handle typed messages (progress, step, etc.)
     */
    handleTypedMessage(type, event) {
        try {
            const data = JSON.parse(event.data);
            this.lastEventId = event.lastEventId;
            
            console.log(`📨 SSE ${type.toUpperCase()}:`, data);
            
            // Handle special message types
            if (type === 'heartbeat') {
                this.handleHeartbeat(data);
            } else if (type === 'sentinel') {
                this.handleSentinel(data);
            } else if (type === 'error') {
                this.handleErrorMessage(data);
            }
            
            // Emit to specific handlers
            this.emit(type, data);
            
            // Emit to generic handlers
            this.emit('message', { type, data, id: event.lastEventId });
            
        } catch (error) {
            console.warn(`Failed to parse ${type} message:`, event.data);
            this.emit(type, event.data);
        }
    }
    
    /**
     * Handle heartbeat messages
     */
    handleHeartbeat(data) {
        // Reset heartbeat timer
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.startHeartbeatMonitor();
        }
    }
    
    /**
     * Handle sentinel messages
     */
    handleSentinel(data) {
        const { sentinelType, reason } = data;
        
        console.log(`🚨 Sentinel: ${sentinelType} - ${reason}`);
        
        if (sentinelType === 'CLOSED' || sentinelType === 'ERROR') {
            console.log('Connection will be closed due to sentinel');
            this.handleConnectionClosed();
        } else if (sentinelType === 'COMPLETE') {
            console.log('✅ Operation completed successfully');
        } else if (sentinelType === 'TIMEOUT') {
            console.log('⏰ Operation timed out');
        }
    }
    
    /**
     * Handle error messages
     */
    handleErrorMessage(data) {
        const { isCritical, message, recoverySuggestion } = data;
        
        if (isCritical) {
            console.error('🚨 Critical SSE Error:', message);
            if (recoverySuggestion) {
                console.log('💡 Recovery suggestion:', recoverySuggestion);
            }
        } else {
            console.warn('⚠️ SSE Warning:', message);
        }
    }
    
    /**
     * Handle EventSource errors
     */
    handleError(event) {
        console.error('❌ SSE Error:', event);
        
        if (this.eventSource?.readyState === EventSource.CLOSED) {
            this.handleConnectionClosed();
        } else {
            this.handleConnectionError(new Error('SSE connection error'));
        }
    }
    
    /**
     * Handle connection closed
     */
    handleConnectionClosed() {
        console.log('🔌 SSE Connection closed');
        this.isConnecting = false;
        
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        
        this.emit('disconnect');
        
        if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
        }
    }
    
    /**
     * Handle connection errors
     */
    handleConnectionError(error) {
        console.error('💥 SSE Connection error:', error);
        this.emit('error', error);
        
        if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
        }
    }
    
    /**
     * Schedule reconnection attempt
     */
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} in ${delay}ms`);
        
        setTimeout(() => {
            if (this.config.autoReconnect && !this.isConnected()) {
                console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}`);
                this.emit('reconnect', { attempt: this.reconnectAttempts });
                this.connect(this.endpoint);
            }
        }, delay);
    }
    
    /**
     * Start heartbeat monitoring
     */
    startHeartbeatMonitor() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }
        
        this.heartbeatTimer = setInterval(() => {
            console.warn('💔 Heartbeat timeout - connection may be dead');
            this.handleConnectionError(new Error('Heartbeat timeout'));
        }, this.config.heartbeatTimeout);
    }
    
    /**
     * Add event listener
     */
    addEventListener(type, handler) {
        if (!this.eventHandlers.has(type)) {
            this.eventHandlers.set(type, []);
        }
        this.eventHandlers.get(type).push(handler);
    }
    
    /**
     * Remove event listener
     */
    removeEventListener(type, handler) {
        if (this.eventHandlers.has(type)) {
            const handlers = this.eventHandlers.get(type);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    /**
     * Add generic event listener
     */
    onMessage(handler) {
        this.genericHandlers.push(handler);
    }
    
    /**
     * Emit event to handlers
     */
    emit(type, data) {
        // Emit to specific handlers
        if (this.eventHandlers.has(type)) {
            this.eventHandlers.get(type).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in ${type} handler:`, error);
                }
            });
        }
        
        // Emit to generic handlers
        if (type === 'message') {
            this.genericHandlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error('Error in generic message handler:', error);
                }
            });
        }
    }
}

// Convenience methods for specific endpoints
CV2WebSSEClient.prototype.connectHeartbeat = function() {
    return this.connect('/heartbeat');
};

CV2WebSSEClient.prototype.connectCVExtraction = function(jobId) {
    return this.connect(`/cv/extract-streaming/${jobId}`);
};

CV2WebSSEClient.prototype.connectPortfolioGeneration = function(jobId) {
    return this.connect(`/portfolio/generate-streaming/${jobId}`);
};

CV2WebSSEClient.prototype.connectSandboxStatus = function(sandboxId) {
    return this.connect(`/sandbox/status-streaming/${sandboxId}`);
};

CV2WebSSEClient.prototype.connectErrorTest = function() {
    return this.connect('/test-error-handling');
};

CV2WebSSEClient.prototype.connectTimeoutTest = function(duration = 5) {
    return this.connect(`/test-timeout/${duration}`);
};

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CV2WebSSEClient;
} else if (typeof window !== 'undefined') {
    window.CV2WebSSEClient = CV2WebSSEClient;
}

// Example usage:
/*
const client = new CV2WebSSEClient({
    baseUrl: 'http://localhost:2000/api/v1/sse',
    sessionId: 'your-session-id',
    autoReconnect: true,
    maxReconnectAttempts: 3
});

// Add event listeners
client.addEventListener('progress', (data) => {
    console.log(`Progress: ${data.progress}% - ${data.message}`);
    updateProgressBar(data.progress);
});

client.addEventListener('complete', (data) => {
    console.log('Processing complete:', data.result);
    hideProgressBar();
});

client.addEventListener('error', (data) => {
    console.error('Error:', data.message);
    if (data.isCritical) {
        showErrorDialog(data.message, data.recoverySuggestion);
    }
});

// Connect to heartbeat endpoint
client.connectHeartbeat();
*/