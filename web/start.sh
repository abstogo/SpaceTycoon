#!/bin/bash

# Space Tycoon Web Edition - Startup Script

echo "Space Tycoon Web Edition"
echo "========================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting Python HTTP server..."
    echo "Game will be available at: http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "Starting Python HTTP server..."
    echo "Game will be available at: http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8080
else
    echo "Error: Python not found. Please install Python to run the web server."
    echo ""
    echo "Alternative options:"
    echo "1. Install Node.js and run: npx http-server -p 8080"
    echo "2. Open index.html directly in your browser"
    exit 1
fi