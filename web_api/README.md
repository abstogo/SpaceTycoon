# Space Tycoon - Flask Web API Edition

This is the **recommended approach** for creating a web version of Space Tycoon that leverages the existing Python development.

## 🎯 **Why This Approach is Better**

### **Advantages:**
✅ **Reuses Existing Code**: All Python game logic, event system, and data structures are preserved  
✅ **Maintains Development Flow**: Continue developing in Python, web interface updates automatically  
✅ **XML Event System**: Uses the existing XML-based event system from the Python version  
✅ **Data Consistency**: Same game mechanics, same save files, same event definitions  
✅ **Easy Maintenance**: Single source of truth for game logic  
✅ **Future-Proof**: Easy to add new features to the Python backend  

### **Architecture:**
```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   Web Frontend  │ ◄────────────► │  Python Backend │
│   (JavaScript)  │                │   (Flask API)   │
└─────────────────┘                └─────────────────┘
                                           │
                                           ▼
                                    ┌─────────────────┐
                                    │  Python Game    │
                                    │   Logic (src/)  │
                                    └─────────────────┘
```

## 🚀 **Quick Start**

### **Option 1: Use the Startup Script (Recommended)**
```bash
cd web_api
./start.sh
```

### **Option 2: Manual Setup**
```bash
cd web_api
pip3 install -r requirements.txt
python3 app.py
```

Then open your browser to `http://localhost:5000`

## 📁 **File Structure**

```
web_api/
├── app.py                    # Flask web server
├── requirements.txt          # Python dependencies
├── start.sh                  # Startup script
├── templates/
│   └── index.html           # Main game page
├── static/
│   ├── css/
│   │   └── styles.css       # Game styles
│   └── js/
│       └── game-client.js   # JavaScript client
└── README.md                # This file
```

## 🔧 **How It Works**

### **1. Flask Web Server (`app.py`)**
- Serves the web interface
- Provides REST API endpoints for game actions
- Manages the Python game instance
- Handles save/load operations

### **2. JavaScript Client (`game-client.js`)**
- Communicates with the Flask API
- Updates the web UI based on game state
- Handles user interactions
- Manages real-time game updates

### **3. Python Game Logic (`src/`)**
- **Unchanged** from the original Pygame version
- All game mechanics, events, and data structures preserved
- XML event loading system intact
- Same save/load format

## 🌐 **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main game page |
| `/api/game/state` | GET | Get current game state |
| `/api/game/action` | POST | Perform game action |
| `/api/events/check` | POST | Check for events |
| `/api/events/resolve` | POST | Resolve event choice |
| `/api/ship/maintenance` | POST | Perform ship maintenance |
| `/api/crew/train` | POST | Train crew member |
| `/api/game/save` | POST | Save game |
| `/api/game/load` | GET | Load game |
| `/api/game/update` | POST | Update game state |

## 🎮 **Game Features**

### **Preserved from Python Version:**
- ✅ **Event System**: XML-based events with activation rates and contexts
- ✅ **Ship Management**: Systems, maintenance, cargo, fuel
- ✅ **Crew System**: Skills, morale, experience, performance
- ✅ **Trading & Missions**: All original mechanics
- ✅ **Save/Load**: Compatible with Python version saves
- ✅ **Data Files**: Uses existing XML event definitions

### **Enhanced for Web:**
- 🌐 **Modern UI**: Responsive web interface
- ⌨️ **Keyboard Shortcuts**: T (travel), 1-4 (actions), ESC (close)
- 💾 **Auto-save**: Automatic progress saving
- 📱 **Mobile Friendly**: Works on all devices
- 🔄 **Real-time Updates**: Live game state synchronization

## 🔄 **Development Workflow**

### **Adding New Events:**
1. Edit XML files in `data/events/`
2. Restart Flask server
3. New events automatically available in web interface

### **Adding New Game Features:**
1. Modify Python code in `src/game/`
2. Add corresponding API endpoints in `app.py`
3. Update JavaScript client if needed
4. Restart Flask server

### **UI Changes:**
1. Modify `templates/index.html` or `static/css/styles.css`
2. Refresh browser (no server restart needed)

## 🛠 **Customization**

### **Adding New API Endpoints:**
```python
@app.route('/api/new-feature', methods=['POST'])
def new_feature():
    data = request.get_json()
    game = get_game()
    # Use existing Python game logic
    result = game.some_method(data)
    return jsonify({'success': True, 'result': result})
```

### **Adding New UI Elements:**
```javascript
// In game-client.js
async performNewAction() {
    const response = await fetch('/api/new-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ param: 'value' })
    });
    // Handle response
}
```

## 🔧 **Configuration**

### **Environment Variables:**
```bash
export FLASK_ENV=development  # Enable debug mode
export FLASK_DEBUG=1          # Auto-reload on changes
```

### **Port Configuration:**
Edit `app.py` to change the port:
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🚀 **Deployment**

### **Development:**
```bash
cd web_api
python3 app.py
```

### **Production (using Gunicorn):**
```bash
pip3 install gunicorn
cd web_api
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### **Docker (optional):**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🔍 **Debugging**

### **Python Backend:**
- Flask debug mode shows detailed error messages
- Check console output for Python errors
- Use `print()` statements in Python code

### **JavaScript Frontend:**
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for API request/response issues

### **Common Issues:**
1. **Port already in use**: Change port in `app.py`
2. **Module not found**: Ensure `src/` directory is in Python path
3. **CORS errors**: Flask-CORS is already configured
4. **Save file issues**: Check file permissions in web_api directory

## 📊 **Performance**

### **Optimizations:**
- Game state cached in memory
- API responses are JSON (lightweight)
- Static assets served efficiently
- Minimal network traffic (only state changes)

### **Scaling:**
- Multiple Flask workers with Gunicorn
- Redis for session storage (future enhancement)
- Database for save files (future enhancement)

## 🔮 **Future Enhancements**

### **Planned Features:**
- **WebSocket Support**: Real-time multiplayer
- **Database Integration**: PostgreSQL for saves
- **User Accounts**: Multiple save slots
- **Mod Support**: Dynamic event loading
- **Analytics**: Game statistics tracking

### **Easy to Add:**
- **Sound Effects**: Web Audio API
- **Animations**: CSS/JavaScript animations
- **Mobile App**: PWA capabilities
- **Cloud Saves**: Integration with cloud storage

## 🤝 **Contributing**

1. **Python Changes**: Modify files in `src/` directory
2. **Web Interface**: Modify files in `web_api/` directory
3. **Data Changes**: Modify XML files in `data/events/`
4. **Testing**: Test both Python and web versions

## 📝 **Comparison with Other Approaches**

| Approach | Pros | Cons |
|----------|------|------|
| **Flask API** (This) | ✅ Reuses Python code<br>✅ Easy development<br>✅ Data consistency | ⚠️ Requires server<br>⚠️ Network dependency |
| **Pure JavaScript** | ✅ No server needed<br>✅ Instant loading | ❌ Duplicate code<br>❌ Maintenance overhead |
| **Pygame Web** | ✅ Direct port | ❌ Complex setup<br>❌ Limited compatibility |

## 🎯 **Conclusion**

This Flask API approach provides the **best balance** of:
- **Code Reuse**: Leverages existing Python development
- **Modern UI**: Beautiful web interface
- **Easy Development**: Continue using Python
- **Future-Proof**: Easy to extend and enhance

It's the **recommended approach** for creating a web version while maintaining the benefits of the existing Python codebase.