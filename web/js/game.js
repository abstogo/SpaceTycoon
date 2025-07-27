class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize core systems
        this.eventManager = new EventManager(this);
        this.ship = new Ship();
        this.crewManager = new CrewManager();
        this.uiManager = new UIManager(this);
        
        // Game state
        this.running = true;
        this.lastTime = 0;
        this.gameTime = 0;
        this.date = { year: 1105, day: 1 };
        
        // Game data
        this.credits = 10000;
        this.location = 'Port Alpha';
        
        // Initialize UI
        this.updateUI();
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Action button listeners
        document.getElementById('btn-travel').addEventListener('click', () => this.handleTravel());
        document.getElementById('btn-trade').addEventListener('click', () => this.handleTrade());
        document.getElementById('btn-missions').addEventListener('click', () => this.handleMissions());
        document.getElementById('btn-ship').addEventListener('click', () => this.handleShipManagement());
        document.getElementById('btn-crew').addEventListener('click', () => this.handleCrewManagement());
        
        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('event-modal').style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('event-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    gameLoop(currentTime = 0) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update game time (1 second real time = 1 day game time)
        this.gameTime += deltaTime;
        if (this.gameTime >= 1000) { // 1000ms = 1 second
            this.advanceDay();
            this.gameTime = 0;
        }
        
        // Update game systems
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Update game state
        this.eventManager.update(deltaTime);
        this.ship.update(deltaTime);
        this.crewManager.update(deltaTime);
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render current location/background
        this.renderBackground();
        
        // Render UI elements on canvas if needed
        this.uiManager.render(this.ctx);
    }
    
    renderBackground() {
        // Simple starfield background
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            const size = Math.sin(this.gameTime * 0.001 + i) * 0.5 + 0.5;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Render location name
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.location, this.canvas.width / 2, this.canvas.height / 2);
        
        // Render ship if in space
        if (this.location === 'In Transit') {
            this.renderShip();
        }
    }
    
    renderShip() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 100;
        
        // Simple ship representation
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 20);
        this.ctx.lineTo(centerX - 15, centerY + 10);
        this.ctx.lineTo(centerX + 15, centerY + 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Engine glow
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 8, centerY + 10, 3, 0, Math.PI * 2);
        this.ctx.arc(centerX + 8, centerY + 10, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    advanceDay() {
        this.date.day++;
        if (this.date.day > 365) {
            this.date.day = 1;
            this.date.year++;
        }
        this.updateUI();
        
        // Trigger daily events
        this.eventManager.triggerDailyEvents();
    }
    
    updateUI() {
        // Update header stats
        document.getElementById('credits').textContent = this.credits.toLocaleString();
        document.getElementById('location').textContent = this.location;
        document.getElementById('date').textContent = `${this.date.year}-${this.date.day.toString().padStart(3, '0')}`;
        
        // Update ship info
        this.uiManager.updateShipInfo();
        
        // Update crew list
        this.uiManager.updateCrewList();
    }
    
    // Action handlers
    handleTravel() {
        const destinations = ['Port Alpha', 'Port Beta', 'Port Gamma', 'Port Delta'];
        const currentIndex = destinations.indexOf(this.location);
        const nextIndex = (currentIndex + 1) % destinations.length;
        
        this.location = 'In Transit';
        this.updateUI();
        
        // Simulate travel time (3 days)
        setTimeout(() => {
            this.location = destinations[nextIndex];
            this.updateUI();
            this.eventManager.triggerLocationEvent(this.location);
        }, 3000); // 3 seconds for demo
    }
    
    handleTrade() {
        this.eventManager.triggerEvent('trade_opportunity');
    }
    
    handleMissions() {
        this.eventManager.triggerEvent('mission_available');
    }
    
    handleShipManagement() {
        this.eventManager.triggerEvent('ship_maintenance');
    }
    
    handleCrewManagement() {
        this.eventManager.triggerEvent('crew_activity');
    }
    
    // Game state methods
    addCredits(amount) {
        this.credits += amount;
        this.updateUI();
    }
    
    spendCredits(amount) {
        if (this.credits >= amount) {
            this.credits -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }
    
    getCredits() {
        return this.credits;
    }
    
    getLocation() {
        return this.location;
    }
    
    getDate() {
        return this.date;
    }
    
    // Event logging
    logEvent(message) {
        const eventLog = document.getElementById('event-log');
        const eventEntry = document.createElement('div');
        eventEntry.className = 'event-entry';
        eventEntry.textContent = `${this.formatDate()}: ${message}`;
        eventLog.appendChild(eventEntry);
        eventLog.scrollTop = eventLog.scrollHeight;
    }
    
    formatDate() {
        return `${this.date.year}-${this.date.day.toString().padStart(3, '0')}`;
    }
}