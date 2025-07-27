// Main entry point for the web version of Space Tycoon
document.addEventListener('DOMContentLoaded', function() {
    console.log('Space Tycoon Web Edition - Initializing...');
    
    // Initialize the game
    const game = new Game();
    
    // Initialize UI
    game.uiManager.init();
    
    // Add some initial events to the log
    game.logEvent('Welcome to Space Tycoon!');
    game.logEvent('Your ship is ready for adventure.');
    game.logEvent('Click the action buttons to begin your journey.');
    
    // Make game globally accessible for debugging
    window.game = game;
    
    console.log('Space Tycoon Web Edition - Ready!');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 't':
            case 'T':
                if (game.location !== 'In Transit') {
                    game.handleTravel();
                }
                break;
            case '1':
                game.handleTrade();
                break;
            case '2':
                game.handleMissions();
                break;
            case '3':
                game.handleShipManagement();
                break;
            case '4':
                game.handleCrewManagement();
                break;
            case 'Escape':
                document.getElementById('event-modal').style.display = 'none';
                break;
        }
    });
    
    // Add tooltips for keyboard shortcuts
    const tooltips = {
        'btn-travel': 'Travel to next port (T)',
        'btn-trade': 'Trade opportunities (1)',
        'btn-missions': 'Available missions (2)',
        'btn-ship': 'Ship management (3)',
        'btn-crew': 'Crew management (4)'
    };
    
    Object.entries(tooltips).forEach(([id, tooltip]) => {
        const button = document.getElementById(id);
        if (button) {
            button.title = tooltip;
        }
    });
    
    // Add help button
    const helpButton = document.createElement('button');
    helpButton.textContent = '?';
    helpButton.className = 'help-btn';
    helpButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00ffff 0%, #88ccff 100%);
        color: #000;
        border: 2px solid #00ffff;
        font-family: 'Orbitron', monospace;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        transition: all 0.3s ease;
    `;
    
    helpButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
    });
    
    helpButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
    });
    
    helpButton.addEventListener('click', function() {
        const helpContent = `
            <h3>Space Tycoon - Help</h3>
            <div class="help-content">
                <h4>Game Overview</h4>
                <p>Space Tycoon is a space trading and exploration game based on the Cepheus Engine rules system. 
                Manage your ship, crew, and finances as you travel between ports.</p>
                
                <h4>Controls</h4>
                <ul>
                    <li><strong>T</strong> - Travel to next port</li>
                    <li><strong>1</strong> - Trade opportunities</li>
                    <li><strong>2</strong> - Available missions</li>
                    <li><strong>3</strong> - Ship management</li>
                    <li><strong>4</strong> - Crew management</li>
                    <li><strong>ESC</strong> - Close modals</li>
                </ul>
                
                <h4>Game Mechanics</h4>
                <ul>
                    <li><strong>Events:</strong> Random events occur based on your location and actions</li>
                    <li><strong>Ship Systems:</strong> Maintain your ship's systems for optimal performance</li>
                    <li><strong>Crew Management:</strong> Keep your crew happy and skilled</li>
                    <li><strong>Trading:</strong> Buy and sell goods at different ports</li>
                    <li><strong>Missions:</strong> Complete missions for credits and reputation</li>
                </ul>
                
                <h4>Tips</h4>
                <ul>
                    <li>Regular ship maintenance prevents breakdowns</li>
                    <li>High crew morale improves performance</li>
                    <li>Different ports have different trade opportunities</li>
                    <li>Save credits for emergencies and upgrades</li>
                </ul>
            </div>
        `;
        
        game.uiManager.showModal('Help', helpContent);
    });
    
    document.body.appendChild(helpButton);
    
    // Add save/load functionality
    const saveButton = document.createElement('button');
    saveButton.textContent = '💾';
    saveButton.className = 'save-btn';
    saveButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 80px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00ff00 0%, #88ff88 100%);
        color: #000;
        border: 2px solid #00ff00;
        font-family: 'Orbitron', monospace;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        transition: all 0.3s ease;
    `;
    
    saveButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
    });
    
    saveButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    });
    
    saveButton.addEventListener('click', function() {
        const saveData = {
            credits: game.credits,
            location: game.location,
            date: game.date,
            ship: {
                condition: game.ship.condition,
                fuel: game.ship.fuel,
                systems: game.ship.systems,
                cargo: game.ship.cargo
            },
            crew: game.crewManager.crew,
            morale: game.crewManager.morale
        };
        
        localStorage.setItem('spaceTycoonSave', JSON.stringify(saveData));
        game.uiManager.showNotification('Game saved!', 'success');
    });
    
    document.body.appendChild(saveButton);
    
    // Load saved game if available
    const savedGame = localStorage.getItem('spaceTycoonSave');
    if (savedGame) {
        try {
            const saveData = JSON.parse(savedGame);
            game.credits = saveData.credits;
            game.location = saveData.location;
            game.date = saveData.date;
            game.ship.condition = saveData.ship.condition;
            game.ship.fuel = saveData.ship.fuel;
            game.ship.systems = saveData.ship.systems;
            game.ship.cargo = saveData.ship.cargo;
            game.crewManager.crew = saveData.crew;
            game.crewManager.morale = saveData.morale;
            
            game.updateUI();
            game.logEvent('Game loaded from save.');
        } catch (error) {
            console.error('Error loading save:', error);
            game.logEvent('Error loading save file.');
        }
    }
    
    // Auto-save every 30 seconds
    setInterval(() => {
        const saveData = {
            credits: game.credits,
            location: game.location,
            date: game.date,
            ship: {
                condition: game.ship.condition,
                fuel: game.ship.fuel,
                systems: game.ship.systems,
                cargo: game.ship.cargo
            },
            crew: game.crewManager.crew,
            morale: game.crewManager.morale
        };
        
        localStorage.setItem('spaceTycoonSave', JSON.stringify(saveData));
    }, 30000);
    
    // Add version info
    const versionInfo = document.createElement('div');
    versionInfo.textContent = 'Space Tycoon Web Edition v1.0';
    versionInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        font-family: 'Orbitron', monospace;
        font-size: 12px;
        color: #00ffff;
        opacity: 0.7;
        z-index: 1000;
    `;
    document.body.appendChild(versionInfo);
});