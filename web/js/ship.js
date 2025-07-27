class Ship {
    constructor() {
        this.name = "Free Trader";
        this.type = "Type A2";
        this.condition = 100;
        this.fuel = 100;
        this.cargo = {
            capacity: 100,
            used: 0,
            items: []
        };
        
        // Ship systems
        this.systems = {
            engines: { condition: 100, efficiency: 1.0 },
            lifeSupport: { condition: 100, efficiency: 1.0 },
            weapons: { condition: 100, efficiency: 1.0 },
            sensors: { condition: 100, efficiency: 1.0 },
            computers: { condition: 100, efficiency: 1.0 }
        };
        
        // Ship specifications
        this.specs = {
            tonnage: 200,
            jumpRange: 1,
            maneuver: 1,
            armor: 0,
            hull: 100
        };
        
        // Maintenance schedule
        this.lastMaintenance = 0;
        this.maintenanceInterval = 30; // days
    }
    
    update(deltaTime) {
        // Natural degradation over time
        this.degradeSystems();
        
        // Check maintenance needs
        this.checkMaintenance();
    }
    
    degradeSystems() {
        // Systems degrade slowly over time
        const degradationRate = 0.1; // per day
        
        Object.keys(this.systems).forEach(system => {
            this.systems[system].condition = Math.max(0, 
                this.systems[system].condition - degradationRate);
            
            // Update efficiency based on condition
            this.systems[system].efficiency = this.systems[system].condition / 100;
        });
        
        // Overall ship condition affects all systems
        this.condition = Math.max(0, this.condition - degradationRate * 0.5);
    }
    
    checkMaintenance() {
        // Trigger maintenance events when systems are in poor condition
        const criticalSystems = Object.values(this.systems).filter(
            system => system.condition < 30
        );
        
        if (criticalSystems.length > 0) {
            // This will be handled by the event manager
            return true;
        }
        
        return false;
    }
    
    performMaintenance(type = 'basic') {
        const cost = type === 'full' ? 500 : 200;
        const effectiveness = type === 'full' ? 1.0 : 0.5;
        
        Object.keys(this.systems).forEach(system => {
            const currentCondition = this.systems[system].condition;
            const improvement = (100 - currentCondition) * effectiveness;
            this.systems[system].condition = Math.min(100, currentCondition + improvement);
            this.systems[system].efficiency = this.systems[system].condition / 100;
        });
        
        // Improve overall condition
        const overallImprovement = (100 - this.condition) * effectiveness;
        this.condition = Math.min(100, this.condition + overallImprovement);
        
        this.lastMaintenance = 0;
        
        return {
            cost: cost,
            effectiveness: effectiveness,
            systemsImproved: Object.keys(this.systems).length
        };
    }
    
    addCargo(item, quantity = 1) {
        const totalWeight = quantity * (item.weight || 1);
        
        if (this.cargo.used + totalWeight <= this.cargo.capacity) {
            // Check if item already exists in cargo
            const existingItem = this.cargo.items.find(i => i.name === item.name);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.cargo.items.push({
                    name: item.name,
                    quantity: quantity,
                    weight: item.weight || 1,
                    value: item.value || 0
                });
            }
            
            this.cargo.used += totalWeight;
            return true;
        }
        
        return false; // Not enough space
    }
    
    removeCargo(itemName, quantity = 1) {
        const item = this.cargo.items.find(i => i.name === itemName);
        
        if (item && item.quantity >= quantity) {
            item.quantity -= quantity;
            this.cargo.used -= quantity * item.weight;
            
            if (item.quantity <= 0) {
                const index = this.cargo.items.indexOf(item);
                this.cargo.items.splice(index, 1);
            }
            
            return true;
        }
        
        return false;
    }
    
    getCargoValue() {
        return this.cargo.items.reduce((total, item) => {
            return total + (item.value * item.quantity);
        }, 0);
    }
    
    getSystemStatus() {
        const status = {};
        
        Object.keys(this.systems).forEach(system => {
            const condition = this.systems[system].condition;
            if (condition > 80) {
                status[system] = 'Excellent';
            } else if (condition > 60) {
                status[system] = 'Good';
            } else if (condition > 40) {
                status[system] = 'Fair';
            } else if (condition > 20) {
                status[system] = 'Poor';
            } else {
                status[system] = 'Critical';
            }
        });
        
        return status;
    }
    
    getOverallStatus() {
        if (this.condition > 80) return 'Excellent';
        if (this.condition > 60) return 'Good';
        if (this.condition > 40) return 'Fair';
        if (this.condition > 20) return 'Poor';
        return 'Critical';
    }
    
    canJump() {
        return this.fuel >= 10 && this.systems.engines.condition > 20;
    }
    
    performJump() {
        if (this.canJump()) {
            this.fuel -= 10;
            this.systems.engines.condition = Math.max(0, this.systems.engines.condition - 5);
            return true;
        }
        return false;
    }
    
    refuel(amount) {
        const cost = amount * 10; // 10 credits per fuel unit
        this.fuel = Math.min(100, this.fuel + amount);
        return cost;
    }
    
    getSpecifications() {
        return {
            name: this.name,
            type: this.type,
            tonnage: this.specs.tonnage,
            jumpRange: this.specs.jumpRange,
            maneuver: this.specs.maneuver,
            armor: this.specs.armor,
            hull: this.specs.hull,
            cargoCapacity: this.cargo.capacity,
            cargoUsed: this.cargo.used
        };
    }
    
    getDetailedInfo() {
        return {
            specifications: this.getSpecifications(),
            condition: this.condition,
            fuel: this.fuel,
            systems: this.systems,
            systemStatus: this.getSystemStatus(),
            cargo: this.cargo,
            cargoValue: this.getCargoValue(),
            overallStatus: this.getOverallStatus()
        };
    }
}