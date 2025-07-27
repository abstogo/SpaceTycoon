# Space Tycoon - Web Edition

A web-based version of Space Tycoon, built with HTML5 Canvas and JavaScript.

## Features

- **Modern Web Interface**: Responsive design with a space-themed UI
- **Event System**: Dynamic events based on location and actions
- **Ship Management**: Monitor and maintain ship systems
- **Crew Management**: Manage crew skills, morale, and performance
- **Trading System**: Buy and sell goods at different ports
- **Mission System**: Complete missions for credits and reputation
- **Save/Load**: Automatic save system with manual save option
- **Keyboard Shortcuts**: Quick access to game functions

## Game Mechanics

### Events
The game uses an event-driven system where events are triggered based on:
- Player actions (reactive events)
- Time progression (stacked events)
- Location changes
- Crew activities
- Ship conditions

### Ship Systems
- **Engines**: Required for travel and jumps
- **Life Support**: Essential for crew survival
- **Weapons**: Combat and defense capabilities
- **Sensors**: Detection and navigation
- **Computers**: System coordination

### Crew Management
- **Skills**: Each crew member has specific skills (pilot, engineering, medicine, etc.)
- **Morale**: Affects performance and can trigger events
- **Experience**: Increases over time and through training
- **Performance**: Based on morale and skills

## Controls

### Keyboard Shortcuts
- **T**: Travel to next port
- **1**: Trade opportunities
- **2**: Available missions
- **3**: Ship management
- **4**: Crew management
- **ESC**: Close modals

### Mouse Controls
- Click action buttons for various activities
- Use the help button (?) for detailed information
- Use the save button (💾) to manually save

## Setup and Running

### Option 1: Simple HTTP Server (Recommended for Development)

1. Install Node.js if you haven't already
2. Install http-server globally:
   ```bash
   npm install -g http-server
   ```
3. Navigate to the web directory:
   ```bash
   cd web
   ```
4. Start the server:
   ```bash
   http-server -p 8080
   ```
5. Open your browser and go to `http://localhost:8080`

### Option 2: Python HTTP Server

1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Start Python's built-in server:
   ```bash
   python -m http.server 8080
   ```
3. Open your browser and go to `http://localhost:8080`

### Option 3: Direct File Opening

You can also open `index.html` directly in your browser, but some features may be limited due to CORS restrictions.

## File Structure

```
web/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── js/
│   ├── main.js         # Main entry point
│   ├── game.js         # Game engine
│   ├── event-manager.js # Event system
│   ├── ship.js         # Ship management
│   ├── crew.js         # Crew management
│   └── ui.js           # UI management
├── requirements.txt    # Dependencies
└── README.md          # This file
```

## Game Tips

1. **Regular Maintenance**: Keep your ship in good condition to avoid breakdowns
2. **Crew Morale**: High morale improves performance and reduces negative events
3. **Resource Management**: Balance credits between maintenance, crew salaries, and trading
4. **Event Choices**: Consider the long-term consequences of your decisions
5. **Save Often**: Use the save button to preserve your progress

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The game is built with vanilla JavaScript and HTML5 Canvas. No external frameworks are required.

### Adding New Events

To add new events, modify the `loadEventDefinitions()` method in `event-manager.js`:

```javascript
'new_event_type': {
    title: 'Event Title',
    description: 'Event description...',
    choices: [
        {
            text: 'Choice text',
            action: () => {
                // Action logic
                return 'Result message';
            }
        }
    ]
}
```

### Adding New Ship Systems

To add new ship systems, modify the `systems` object in the `Ship` constructor in `ship.js`.

## License

This project is based on the Cepheus Engine SRD and follows the same licensing terms.

## Version History

- **v1.0**: Initial web version with core game mechanics