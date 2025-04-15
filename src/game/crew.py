from typing import Dict, List
import random

class CrewMember:
    def __init__(self, name: str, skills: Dict[str, int], characteristics: Dict[str, int]):
        self.name = name
        self.skills = skills
        self.characteristics = characteristics
        self.morale = 1.0  # 0.0 to 1.0
        self.health = 1.0  # 0.0 to 1.0
        self.relationships: Dict[str, float] = {}  # crew_name: relationship_value
        
    def update(self):
        """Update crew member status"""
        # Update morale based on ship conditions
        # Update health
        # Update relationships
        pass
        
    def skill_check(self, skill: str, difficulty: int = 0) -> bool:
        """Make a skill check using Cepheus Engine rules"""
        if skill not in self.skills:
            return False  # Untrained skill check
        
        # Roll 2d6
        roll = random.randint(1, 6) + random.randint(1, 6)
        
        # Add skill level and characteristic modifier
        total = roll + self.skills[skill] + difficulty
        
        # Success if total >= 8
        return total >= 8

class CrewManager:
    def __init__(self):
        self.crew: List[CrewMember] = []
        
    def update(self):
        """Update all crew members"""
        for member in self.crew:
            member.update()
            
    def add_crew(self, member: CrewMember):
        """Add a crew member"""
        self.crew.append(member)
        
    def remove_crew(self, member: CrewMember):
        """Remove a crew member"""
        if member in self.crew:
            self.crew.remove(member)
            
    def get_crew_with_skill(self, skill: str) -> List[CrewMember]:
        """Get all crew members with a specific skill"""
        return [member for member in self.crew if skill in member.skills]
        
    def get_crew_relationships(self, member: CrewMember) -> Dict[str, float]:
        """Get relationships for a specific crew member"""
        return member.relationships 