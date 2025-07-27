class UIManager {
    constructor(game) {
        this.game = game;
        this.lastUpdate = 0;
        this.updateInterval = 1000; // Update UI every second
    }
    
    render(ctx) {
        // Render any UI elements that need to be drawn on the canvas
        this.renderStatusIndicators(ctx);
    }
    
    renderStatusIndicators(ctx) {
        const canvas = ctx.canvas;
        const margin = 20;
        
        // Render ship condition indicator
        this.renderConditionBar(ctx, margin, margin, 200, 20, 
            this.game.ship.condition / 100, 'Ship Condition');
        
        // Render fuel indicator
        this.renderConditionBar(ctx, margin, margin + 30, 200, 20, 
            this.game.ship.fuel / 100, 'Fuel');
        
        // Render crew morale indicator
        this.renderConditionBar(ctx, margin, margin + 60, 200, 20, 
            this.game.crewManager.morale / 100, 'Crew Morale');
    }
    
    renderConditionBar(ctx, x, y, width, height, percentage, label) {
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, width, height);
        
        // Border
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Fill based on percentage
        let fillColor;
        if (percentage > 0.7) {
            fillColor = '#00ff00'; // Green
        } else if (percentage > 0.4) {
            fillColor = '#ffff00'; // Yellow
        } else {
            fillColor = '#ff0000'; // Red
        }
        
        ctx.fillStyle = fillColor;
        ctx.fillRect(x + 2, y + 2, (width - 4) * percentage, height - 4);
        
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'left';
        ctx.fillText(label, x, y - 5);
        
        // Percentage text
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(percentage * 100)}%`, x + width / 2, y + height / 2 + 4);
    }
    
    updateShipInfo() {
        const shipInfo = document.getElementById('ship-info');
        const ship = this.game.ship;
        
        shipInfo.innerHTML = `
            <div class="ship-stat">
                <span>Condition:</span>
                <span>${ship.getOverallStatus()}</span>
            </div>
            <div class="ship-stat">
                <span>Fuel:</span>
                <span>${ship.fuel}%</span>
            </div>
            <div class="ship-stat">
                <span>Cargo:</span>
                <span>${ship.cargo.used}/${ship.cargo.capacity} tons</span>
            </div>
            <div class="ship-stat">
                <span>Engines:</span>
                <span>${ship.getSystemStatus().engines}</span>
            </div>
            <div class="ship-stat">
                <span>Life Support:</span>
                <span>${ship.getSystemStatus().lifeSupport}</span>
            </div>
            <div class="ship-stat">
                <span>Weapons:</span>
                <span>${ship.getSystemStatus().weapons}</span>
            </div>
        `;
    }
    
    updateCrewList() {
        const crewList = document.getElementById('crew-list');
        const crew = this.game.crewManager.crew;
        
        if (crew.length === 0) {
            crewList.innerHTML = '<div class="crew-member">No crew members</div>';
            return;
        }
        
        crewList.innerHTML = crew.map(member => `
            <div class="crew-member">
                <div>
                    <strong>${member.name}</strong><br>
                    <small>${member.role} - Exp: ${member.experience.toFixed(1)}</small>
                </div>
                <div>
                    <span style="color: ${this.getMoraleColor(member.morale)};">${member.morale}%</span>
                </div>
            </div>
        `).join('');
    }
    
    getMoraleColor(morale) {
        if (morale > 80) return '#00ff00';
        if (morale > 60) return '#ffff00';
        if (morale > 40) return '#ff8800';
        return '#ff0000';
    }
    
    updateEventLog(message) {
        const eventLog = document.getElementById('event-log');
        const eventEntry = document.createElement('div');
        eventEntry.className = 'event-entry';
        eventEntry.textContent = message;
        eventLog.appendChild(eventEntry);
        eventLog.scrollTop = eventLog.scrollHeight;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
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
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showShipDetails() {
        const ship = this.game.ship;
        const details = ship.getDetailedInfo();
        
        let content = `
            <h3>${details.specifications.name} - ${details.specifications.type}</h3>
            <div class="ship-details">
                <div class="detail-section">
                    <h4>Specifications</h4>
                    <p>Tonnage: ${details.specifications.tonnage}</p>
                    <p>Jump Range: ${details.specifications.jumpRange}</p>
                    <p>Maneuver: ${details.specifications.maneuver}</p>
                    <p>Armor: ${details.specifications.armor}</p>
                </div>
                <div class="detail-section">
                    <h4>Systems</h4>
                    ${Object.entries(details.systems).map(([system, data]) => 
                        `<p>${system.charAt(0).toUpperCase() + system.slice(1)}: ${data.condition.toFixed(1)}%</p>`
                    ).join('')}
                </div>
                <div class="detail-section">
                    <h4>Cargo</h4>
                    <p>Used: ${details.cargo.used}/${details.cargo.capacity} tons</p>
                    <p>Value: ${details.cargoValue} credits</p>
                </div>
            </div>
        `;
        
        this.showModal('Ship Details', content);
    }
    
    showCrewDetails() {
        const crew = this.game.crewManager;
        const summary = crew.getCrewSummary();
        
        let content = `
            <h3>Crew Summary</h3>
            <div class="crew-details">
                <p>Total Crew: ${summary.totalCrew}/${summary.maxCrew}</p>
                <p>Overall Morale: ${summary.overallMorale.toFixed(1)}%</p>
                <p>Total Salaries: ${summary.totalSalaries} credits</p>
                <p>Average Experience: ${summary.averageExperience.toFixed(1)} years</p>
            </div>
            <h4>Crew Members</h4>
            <div class="crew-members">
                ${crew.crew.map(member => `
                    <div class="crew-detail">
                        <strong>${member.name}</strong> - ${member.role}<br>
                        <small>Morale: ${member.morale}% | Performance: ${member.performance}% | Experience: ${member.experience.toFixed(1)} years</small><br>
                        <small>Skills: ${Object.entries(member.skills).map(([skill, level]) => `${skill} ${level}`).join(', ')}</small>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.showModal('Crew Details', content);
    }
    
    showModal(title, content) {
        const modal = document.getElementById('event-modal');
        const modalTitle = document.getElementById('event-title');
        const modalBody = document.getElementById('event-description');
        const modalChoices = document.getElementById('event-choices');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modalChoices.innerHTML = '<button class="choice-btn" onclick="document.getElementById(\'event-modal\').style.display=\'none\'">Close</button>';
        
        modal.style.display = 'block';
    }
    
    updateActionButtons() {
        const buttons = document.querySelectorAll('.action-btn');
        
        buttons.forEach(button => {
            // Disable buttons based on game state
            if (button.id === 'btn-travel' && this.game.location === 'In Transit') {
                button.disabled = true;
                button.textContent = 'Traveling...';
            } else if (button.id === 'btn-travel') {
                button.disabled = false;
                button.textContent = 'Travel';
            }
        });
    }
    
    // Animation styles for notifications
    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize UI
    init() {
        this.addNotificationStyles();
        this.updateShipInfo();
        this.updateCrewList();
        this.updateActionButtons();
    }
}