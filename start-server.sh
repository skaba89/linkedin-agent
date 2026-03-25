#!/bin/bash
# LinkedInBoost Server Startup Script
# This script keeps the server running by restarting it if it crashes

cd /home/z/my-project

echo "Starting LinkedInBoost server..."

# Kill any existing servers
pkill -f "node.*server.js" 2>/dev/null
sleep 2

# Start the server with auto-restart
while true; do
    echo "Starting Next.js server on port 3000..."
    PORT=3000 node .next/standalone/server.js
    
    # If server exits, wait and restart
    echo "Server stopped. Restarting in 2 seconds..."
    sleep 2
done
