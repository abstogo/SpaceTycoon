from typing import Dict, List
from .crew import CrewMember

class Ship:
    def __init__(self):
        self.name = "Default Ship"
        self.crew: List[CrewMember] = []
        self.cargo: Dict[str, int] = {}  # item: quantity
        self.passengers: List[Dict] = []
        self.systems: Dict[str, float] = {
            "jump_drive": 1.0,  # System health/status (0.0 to 1.0)
            "life_support": 1.0,
            "weapons": 1.0,
            "shields": 1.0,
            "sensors": 1.0,
            "engines": 1.0
        }
        self.fuel = 100.0
        self.credits = 1000
        self.location = "Start System"
        
    def update(self):
        """Update ship systems and status"""
        # Update system status
        # Check for maintenance needs
        # Update fuel consumption
        pass
        
    def add_crew(self, crew_member: CrewMember):
        """Add a crew member to the ship"""
        self.crew.append(crew_member)
        
    def remove_crew(self, crew_member: CrewMember):
        """Remove a crew member from the ship"""
        if crew_member in self.crew:
            self.crew.remove(crew_member)
            
    def add_cargo(self, item: str, quantity: int):
        """Add cargo to the ship"""
        self.cargo[item] = self.cargo.get(item, 0) + quantity
        
    def remove_cargo(self, item: str, quantity: int):
        """Remove cargo from the ship"""
        if item in self.cargo:
            self.cargo[item] -= quantity
            if self.cargo[item] <= 0:
                del self.cargo[item]
                
    def add_passenger(self, passenger: Dict):
        """Add a passenger to the ship"""
        self.passengers.append(passenger)
        
    def remove_passenger(self, passenger: Dict):
        """Remove a passenger from the ship"""
        if passenger in self.passengers:
            self.passengers.remove(passenger)
            
    def repair_system(self, system: str, amount: float):
        """Repair a ship system"""
        if system in self.systems:
            self.systems[system] = min(1.0, self.systems[system] + amount)
            
    def damage_system(self, system: str, amount: float):
        """Damage a ship system"""
        if system in self.systems:
            self.systems[system] = max(0.0, self.systems[system] - amount) 