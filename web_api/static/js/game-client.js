class GameClient {
    constructor() {
        this.apiBase = '/api';
        this.gameState = null;
        this.lastUpdate = 0;
        this.updateInterval = null;
        
        // Initialize UI elements
        this.initializeUI();
        
        // Start the game loop
        this.startGameLoop();
    }
    
    async initializeUI() {
        // Load initial game state
        await this.loadGameState();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update UI with initial state
        this.updateUI();
    }
    
    setupEventListeners() {
        // Action button listeners
        document.getElementById('btn-travel')?.addEventListener('click', () => this.performAction('travel'));
        document.getElementById('btn-trade')?.addEventListener('click', () => this.performAction('trade'));
        document.getElementById('btn-missions')?.addEventListener('click', () => this.performAction('missions'));
        document.getElementById('btn-ship')?.addEventListener('click', () => this.performAction('ship_maintenance'));
        document.getElementById('btn-crew')?.addEventListener('click', () => this.performAction('crew_management'));
        
        // Modal close button
        document.querySelector('.close')?.addEventListener('click', () => {
            document.getElementById('event-modal').style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('event-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 't':
                case 'T':
                    this.performAction('travel');
                    break;
                case '1':
                    this.performAction('trade');
                    break;
                case '2':
                    this.performAction('missions');
                    break;
                case '3':
                    this.performAction('ship_maintenance');
                    break;
                case '4':
                    this.performAction('crew_management');
                    break;
                case 'Escape':
                    document.getElementById('event-modal').style.display = 'none';
                    break;
            }
        });
    }
    
    async loadGameState() {
        try {
            const response = await fetch(`${this.apiBase}/game/state`);
            if (response.ok) {
                this.gameState = await response.json();
                console.log('Game state loaded:', this.gameState);
            } else {
                console.error('Failed to load game state:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }
    
    async performAction(action, params = {}) {
        try {
            const response = await fetch(`${this.apiBase}/game/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action, params })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Reload game state after action
                    await this.loadGameState();
                    this.updateUI();
                    
                    // Check for events
                    await this.checkEvents();
                    
                    return result;
                } else {
                    console.error('Action failed:', result.error);
                    this.showNotification(result.error, 'error');
                }
            } else {
                console.error('Action request failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error performing action:', error);
            this.showNotification('Network error', 'error');
        }
    }
    
    async checkEvents() {
        if (!this.gameState) return;
        
        const context = this.gameState.location === 'In Transit' ? 'In Space' : 'Docked';
        
        try {
            const response = await fetch(`${this.apiBase}/events/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ context })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.events && result.events.length > 0) {
                    this.showEventModal(result.events[0]);
                }
            }
        } catch (error) {
            console.error('Error checking events:', error);
        }
    }
    
    async resolveEvent(eventTitle, choiceIndex) {
        try {
            const response = await fetch(`${this.apiBase}/events/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_title: eventTitle, choice_index: choiceIndex })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Reload game state after event resolution
                    await this.loadGameState();
                    this.updateUI();
                    
                    // Close modal
                    document.getElementById('event-modal').style.display = 'none';
                    
                    return result;
                }
            }
        } catch (error) {
            console.error('Error resolving event:', error);
        }
    }
    
    showEventModal(event) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const choices = document.getElementById('event-choices');
        
        title.textContent = event.title;
        description.textContent = event.description;
        
        // Clear previous choices
        choices.innerHTML = '';
        
        // Add choice buttons
        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.resolveEvent(event.title, index);
            });
            choices.appendChild(button);
        });
        
        modal.style.display = 'block';
    }
    
    updateUI() {
        if (!this.gameState) return;
        
        // Update header stats
        document.getElementById('credits').textContent = this.gameState.credits.toLocaleString();
        document.getElementById('location').textContent = this.gameState.location;
        document.getElementById('date').textContent = `${this.gameState.date.year}-${this.gameState.date.day.toString().padStart(3, '0')}`;
        
        // Update ship info
        this.updateShipInfo();
        
        // Update crew list
        this.updateCrewList();
        
        // Update action buttons
        this.updateActionButtons();
    }
    
    updateShipInfo() {
        const shipInfo = document.getElementById('ship-info');
        const ship = this.gameState.ship;
        
        if (!shipInfo || !ship) return;
        
        shipInfo.innerHTML = `
            <div class="ship-stat">
                <span>Condition:</span>
                <span>${this.getShipStatus(ship.condition)}</span>
            </div>
            <div class="ship-stat">
                <span>Fuel:</span>
                <span>${ship.fuel}%</span>
            </div>
            <div class="ship-stat">
                <span>Cargo:</span>
                <span>${ship.cargo.used || 0}/${ship.cargo.capacity || 100} tons</span>
            </div>
            <div class="ship-stat">
                <span>Engines:</span>
                <span>${this.getSystemStatus(ship.systems.engines)}</span>
            </div>
            <div class="ship-stat">
                <span>Life Support:</span>
                <span>${this.getSystemStatus(ship.systems.life_support)}</span>
            </div>
            <div class="ship-stat">
                <span>Weapons:</span>
                <span>${this.getSystemStatus(ship.systems.weapons)}</span>
            </div>
        `;
    }
    
    updateCrewList() {
        const crewList = document.getElementById('crew-list');
        const crew = this.gameState.crew.members;
        
        if (!crewList || !crew) return;
        
        if (crew.length === 0) {
            crewList.innerHTML = '<div class="crew-member">No crew members</div>';
            return;
        }
        
        crewList.innerHTML = crew.map(member => `
            <div class="crew-member">
                <div>
                    <strong>${member.name}</strong><br>
                    <small>${member.role} - Exp: ${member.experience?.toFixed(1) || '0.0'}</small>
                </div>
                <div>
                    <span style="color: ${this.getMoraleColor(member.morale)};">${member.morale}%</span>
                </div>
            </div>
        `).join('');
    }
    
    updateActionButtons() {
        const buttons = document.querySelectorAll('.action-btn');
        
        buttons.forEach(button => {
            if (button.id === 'btn-travel' && this.gameState.location === 'In Transit') {
                button.disabled = true;
                button.textContent = 'Traveling...';
            } else if (button.id === 'btn-travel') {
                button.disabled = false;
                button.textContent = 'Travel';
            }
        });
    }
    
    getShipStatus(condition) {
        if (condition > 80) return 'Excellent';
        if (condition > 60) return 'Good';
        if (condition > 40) return 'Fair';
        if (condition > 20) return 'Poor';
        return 'Critical';
    }
    
    getSystemStatus(systemValue) {
        if (systemValue > 0.8) return 'Excellent';
        if (systemValue > 0.6) return 'Good';
        if (systemValue > 0.4) return 'Fair';
        if (systemValue > 0.2) return 'Poor';
        return 'Critical';
    }
    
    getMoraleColor(morale) {
        if (morale > 80) return '#00ff00';
        if (morale > 60) return '#ffff00';
        if (morale > 40) return '#ff8800';
        return '#ff0000';
    }
    
    startGameLoop() {
        // Update game state every second
        this.updateInterval = setInterval(async () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdate;
            this.lastUpdate = currentTime;
            
            // Update game state on server
            await this.updateGameState(deltaTime);
            
            // Reload game state
            await this.loadGameState();
            this.updateUI();
            
            // Check for events
            await this.checkEvents();
        }, 1000);
    }
    
    async updateGameState(deltaTime) {
        try {
            await fetch(`${this.apiBase}/game/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delta_time: deltaTime })
            });
        } catch (error) {
            console.error('Error updating game state:', error);
        }
    }
    
    async saveGame() {
        try {
            const response = await fetch(`${this.apiBase}/game/save`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.showNotification('Game saved!', 'success');
                }
            }
        } catch (error) {
            console.error('Error saving game:', error);
            this.showNotification('Save failed', 'error');
        }
    }
    
    async loadGame() {
        try {
            const response = await fetch(`${this.apiBase}/game/load`);
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    await this.loadGameState();
                    this.updateUI();
                    this.showNotification('Game loaded!', 'success');
                }
            }
        } catch (error) {
            console.error('Error loading game:', error);
            this.showNotification('Load failed', 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff0000' : '#00ffff'};
            color: #000;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}