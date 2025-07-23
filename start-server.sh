#!/bin/bash
cd /Users/robertlijbers/Desktop/gambit
echo "Starting server in directory: $(pwd)"
echo "Node version: $(node --version)"
nohup node storybook-demo-server.js > server.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
echo $SERVER_PID > server.pid
sleep 2
if ps -p $SERVER_PID > /dev/null; then
   echo "✅ Server is running successfully on http://localhost:8000"
   echo "Server logs are in server.log"
   cat server.log
else
   echo "❌ Server failed to start"
   cat server.log
fi