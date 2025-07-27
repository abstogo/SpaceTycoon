class EventManager {
    constructor(game) {
        this.game = game;
        this.eventStack = [];
        this.activeEvents = [];
        this.eventDefinitions = this.loadEventDefinitions();
        
        // Initialize event stack with some default events
        this.initializeEventStack();
    }
    
    loadEventDefinitions() {
        return {
            'trade_opportunity': {
                title: 'Trade Opportunity',
                description: 'A local merchant approaches you with an interesting proposition. They have goods that could be valuable at other ports.',
                choices: [
                    {
                        text: 'Listen to their offer',
                        action: () => {
                            const profit = Math.floor(Math.random() * 1000) + 500;
                            this.game.addCredits(profit);
                            this.game.logEvent(`Trade deal completed. Earned ${profit} credits.`);
                            return `You negotiate a good deal and earn ${profit} credits.`;
                        }
                    },
                    {
                        text: 'Decline politely',
                        action: () => {
                            this.game.logEvent('Declined trade opportunity.');
                            return 'You politely decline the offer.';
                        }
                    }
                ]
            },
            'mission_available': {
                title: 'Mission Available',
                description: 'The local authorities have posted a mission that could earn you some credits and reputation.',
                choices: [
                    {
                        text: 'Accept the mission',
                        action: () => {
                            const reward = Math.floor(Math.random() * 2000) + 1000;
                            this.game.addCredits(reward);
                            this.game.logEvent(`Mission completed. Earned ${reward} credits.`);
                            return `Mission successful! You earn ${reward} credits.`;
                        }
                    },
                    {
                        text: 'Ask for more details',
                        action: () => {
                            this.game.logEvent('Requested mission details.');
                            return 'The mission involves transporting sensitive cargo to a nearby system.';
                        }
                    },
                    {
                        text: 'Decline',
                        action: () => {
                            this.game.logEvent('Declined mission.');
                            return 'You decide to pass on this opportunity.';
                        }
                    }
                ]
            },
            'ship_maintenance': {
                title: 'Ship Maintenance',
                description: 'Your ship\'s systems need attention. Regular maintenance is crucial for safe space travel.',
                choices: [
                    {
                        text: 'Perform full maintenance (500 credits)',
                        action: () => {
                            if (this.game.spendCredits(500)) {
                                this.game.ship.condition = 100;
                                this.game.logEvent('Full ship maintenance completed.');
                                return 'Your ship is now in excellent condition.';
                            } else {
                                return 'You don\'t have enough credits for full maintenance.';
                            }
                        }
                    },
                    {
                        text: 'Basic maintenance (200 credits)',
                        action: () => {
                            if (this.game.spendCredits(200)) {
                                this.game.ship.condition = Math.min(100, this.game.ship.condition + 30);
                                this.game.logEvent('Basic ship maintenance completed.');
                                return 'Your ship\'s condition has improved.';
                            } else {
                                return 'You don\'t have enough credits for basic maintenance.';
                            }
                        }
                    },
                    {
                        text: 'Skip maintenance',
                        action: () => {
                            this.game.ship.condition = Math.max(0, this.game.ship.condition - 10);
                            this.game.logEvent('Skipped ship maintenance.');
                            return 'Your ship\'s condition has deteriorated slightly.';
                        }
                    }
                ]
            },
            'crew_activity': {
                title: 'Crew Activity',
                description: 'Your crew members are looking for ways to improve their skills and contribute to the ship.',
                choices: [
                    {
                        text: 'Organize training session (300 credits)',
                        action: () => {
                            if (this.game.spendCredits(300)) {
                                this.game.crewManager.improveSkills();
                                this.game.logEvent('Crew training session completed.');
                                return 'Your crew\'s skills have improved.';
                            } else {
                                return 'You don\'t have enough credits for training.';
                            }
                        }
                    },
                    {
                        text: 'Let them rest',
                        action: () => {
                            this.game.crewManager.improveMorale();
                            this.game.logEvent('Crew morale improved.');
                            return 'Your crew is well-rested and morale is high.';
                        }
                    },
                    {
                        text: 'Assign work duties',
                        action: () => {
                            const bonus = Math.floor(Math.random() * 200) + 100;
                            this.game.addCredits(bonus);
                            this.game.logEvent(`Crew work generated ${bonus} credits.`);
                            return `Your crew\'s work generates ${bonus} credits.`;
                        }
                    }
                ]
            },
            'random_encounter': {
                title: 'Space Encounter',
                description: 'While traveling through space, you encounter something unexpected.',
                choices: [
                    {
                        text: 'Investigate',
                        action: () => {
                            const outcome = Math.random();
                            if (outcome > 0.7) {
                                const reward = Math.floor(Math.random() * 1500) + 500;
                                this.game.addCredits(reward);
                                this.game.logEvent(`Encounter investigation successful. Found ${reward} credits.`);
                                return `You discover valuable salvage worth ${reward} credits.`;
                            } else {
                                const damage = Math.floor(Math.random() * 200) + 100;
                                this.game.spendCredits(damage);
                                this.game.logEvent(`Encounter investigation failed. Lost ${damage} credits.`);
                                return `The encounter proves dangerous. You lose ${damage} credits in repairs.`;
                            }
                        }
                    },
                    {
                        text: 'Avoid',
                        action: () => {
                            this.game.logEvent('Avoided space encounter.');
                            return 'You successfully avoid the encounter.';
                        }
                    }
                ]
            },
            'market_fluctuation': {
                title: 'Market Fluctuation',
                description: 'The local market prices have changed significantly.',
                choices: [
                    {
                        text: 'Take advantage',
                        action: () => {
                            const profit = Math.floor(Math.random() * 800) + 200;
                            this.game.addCredits(profit);
                            this.game.logEvent(`Market opportunity exploited. Earned ${profit} credits.`);
                            return `You profit ${profit} credits from the market change.`;
                        }
                    },
                    {
                        text: 'Wait and see',
                        action: () => {
                            this.game.logEvent('Waited for market to stabilize.');
                            return 'You decide to wait for the market to stabilize.';
                        }
                    }
                ]
            }
        };
    }
    
    initializeEventStack() {
        // Add some default events to the stack
        this.addToStack('random_encounter', 0.3, 'In Transit');
        this.addToStack('market_fluctuation', 0.4, 'Docked');
        this.addToStack('random_encounter', 0.2, 'Any');
    }
    
    addToStack(eventType, activationRate, activationContext) {
        this.eventStack.push({
            type: eventType,
            activationRate: activationRate,
            activationContext: activationContext,
            source: 'random'
        });
    }
    
    update(deltaTime) {
        // Check for event triggers based on current context
        this.checkEventTriggers();
    }
    
    checkEventTriggers() {
        const currentContext = this.getCurrentContext();
        const applicableEvents = this.eventStack.filter(event => 
            event.activationContext === currentContext || event.activationContext === 'Any'
        );
        
        applicableEvents.forEach(event => {
            if (Math.random() < event.activationRate) {
                this.triggerEvent(event.type);
                // Remove from stack if it's a one-time event
                const index = this.eventStack.indexOf(event);
                if (index > -1) {
                    this.eventStack.splice(index, 1);
                }
            }
        });
    }
    
    getCurrentContext() {
        const location = this.game.getLocation();
        if (location === 'In Transit') {
            return 'In Space';
        } else {
            return 'Docked';
        }
    }
    
    triggerEvent(eventType) {
        const eventDef = this.eventDefinitions[eventType];
        if (eventDef) {
            this.showEventModal(eventDef);
        }
    }
    
    triggerDailyEvents() {
        // Trigger daily maintenance events
        if (Math.random() < 0.3) {
            this.triggerEvent('ship_maintenance');
        }
        
        // Add new events to stack
        if (Math.random() < 0.5) {
            this.addToStack('random_encounter', 0.2, 'In Transit');
        }
        
        if (Math.random() < 0.4) {
            this.addToStack('market_fluctuation', 0.3, 'Docked');
        }
    }
    
    triggerLocationEvent(location) {
        this.game.logEvent(`Arrived at ${location}.`);
        
        // Location-specific events
        if (location.includes('Port')) {
            if (Math.random() < 0.6) {
                this.triggerEvent('trade_opportunity');
            }
            if (Math.random() < 0.4) {
                this.triggerEvent('mission_available');
            }
        }
    }
    
    showEventModal(eventDef) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const choices = document.getElementById('event-choices');
        
        title.textContent = eventDef.title;
        description.textContent = eventDef.description;
        
        // Clear previous choices
        choices.innerHTML = '';
        
        // Add choice buttons
        eventDef.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                const result = choice.action();
                this.game.logEvent(result);
                
                // Close modal after a short delay
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 2000);
            });
            choices.appendChild(button);
        });
        
        modal.style.display = 'block';
    }
    
    getEventStack() {
        return this.eventStack;
    }
    
    getActiveEvents() {
        return this.activeEvents;
    }
}