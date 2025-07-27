#!/bin/bash

# Space Tycoon - Flask Web API Startup Script

echo "Space Tycoon - Flask Web API Edition"
echo "===================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    echo "Please install Python 3 to run the Flask web API."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is required but not installed."
    echo "Please install pip3 to install dependencies."
    exit 1
fi

echo "Installing dependencies..."
pip3 install -r requirements.txt

echo ""
echo "Starting Flask web server..."
echo "Game will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python3 app.py