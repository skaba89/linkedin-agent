#!/bin/bash
# LinkedInBoost Preview Server
# Run this script to start the server for preview

cd /home/z/my-project

echo "🚀 Starting LinkedInBoost server for preview..."
echo "📍 Server will run at http://localhost:3000"
echo "⚠️  Note: Server will stop automatically after timeout"
echo ""

# Kill any existing processes
pkill -f "node.*server" 2>/dev/null
sleep 1

# Start the production server
PORT=3000 node .next/standalone/server.js
