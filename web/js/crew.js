class CrewManager {
    constructor() {
        this.crew = [];
        this.maxCrew = 6;
        this.morale = 75;
        
        // Initialize with some default crew members
        this.initializeCrew();
    }
    
    initializeCrew() {
        const defaultCrew = [
            {
                name: "Captain Sarah Chen",
                role: "Captain",
                skills: {
                    pilot: 2,
                    navigation: 2,
                    leadership: 3
                },
                morale: 80,
                experience: 5,
                salary: 1000
            },
            {
                name: "Engineer Marcus Rodriguez",
                role: "Engineer",
                skills: {
                    engineering: 3,
                    mechanics: 2,
                    electronics: 2
                },
                morale: 75,
                experience: 3,
                salary: 800
            },
            {
                name: "Medic Dr. Emily Watson",
                role: "Medic",
                skills: {
                    medicine: 3,
                    biology: 2,
                    firstAid: 2
                },
                morale: 70,
                experience: 4,
                salary: 900
            }
        ];
        
        defaultCrew.forEach(member => {
            this.addCrewMember(member);
        });
    }
    
    addCrewMember(member) {
        if (this.crew.length < this.maxCrew) {
            this.crew.push({
                ...member,
                id: Date.now() + Math.random(),
                hired: this.getCurrentDate(),
                performance: 100
            });
            return true;
        }
        return false;
    }
    
    removeCrewMember(memberId) {
        const index = this.crew.findIndex(member => member.id === memberId);
        if (index !== -1) {
            this.crew.splice(index, 1);
            return true;
        }
        return false;
    }
    
    update(deltaTime) {
        // Update crew morale and performance over time
        this.updateCrewStatus();
        
        // Check for crew-related events
        this.checkCrewEvents();
    }
    
    updateCrewStatus() {
        this.crew.forEach(member => {
            // Morale affects performance
            if (member.morale < 50) {
                member.performance = Math.max(50, member.performance - 1);
            } else if (member.morale > 80) {
                member.performance = Math.min(100, member.performance + 1);
            }
            
            // Experience increases over time
            if (Math.random() < 0.01) { // 1% chance per update
                member.experience += 0.1;
            }
        });
        
        // Update overall morale
        this.updateOverallMorale();
    }
    
    updateOverallMorale() {
        if (this.crew.length === 0) {
            this.morale = 50;
            return;
        }
        
        const totalMorale = this.crew.reduce((sum, member) => sum + member.morale, 0);
        this.morale = totalMorale / this.crew.length;
    }
    
    checkCrewEvents() {
        // Low morale can trigger events
        if (this.morale < 40) {
            // This will be handled by the event manager
            return 'low_morale';
        }
        
        // High performance can trigger positive events
        const highPerformers = this.crew.filter(member => member.performance > 90);
        if (highPerformers.length > 0) {
            return 'high_performance';
        }
        
        return null;
    }
    
    improveSkills() {
        this.crew.forEach(member => {
            // Improve a random skill
            const skills = Object.keys(member.skills);
            if (skills.length > 0) {
                const randomSkill = skills[Math.floor(Math.random() * skills.length)];
                member.skills[randomSkill] = Math.min(5, member.skills[randomSkill] + 0.5);
            }
        });
    }
    
    improveMorale() {
        this.crew.forEach(member => {
            member.morale = Math.min(100, member.morale + 10);
        });
        this.updateOverallMorale();
    }
    
    paySalaries() {
        const totalSalaries = this.crew.reduce((sum, member) => sum + member.salary, 0);
        return totalSalaries;
    }
    
    getCrewMember(memberId) {
        return this.crew.find(member => member.id === memberId);
    }
    
    getCrewByRole(role) {
        return this.crew.filter(member => member.role === role);
    }
    
    getBestSkill(skillName) {
        let bestMember = null;
        let bestSkill = 0;
        
        this.crew.forEach(member => {
            if (member.skills[skillName] && member.skills[skillName] > bestSkill) {
                bestSkill = member.skills[skillName];
                bestMember = member;
            }
        });
        
        return { member: bestMember, skill: bestSkill };
    }
    
    performSkillCheck(skillName, difficulty = 8) {
        const { member, skill } = this.getBestSkill(skillName);
        
        if (!member) {
            return { success: false, member: null, skill: 0, roll: 0 };
        }
        
        // 2D6 + skill level
        const roll = this.roll2D6() + skill;
        const success = roll >= difficulty;
        
        return {
            success: success,
            member: member,
            skill: skill,
            roll: roll,
            difficulty: difficulty
        };
    }
    
    roll2D6() {
        return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    }
    
    getCrewSummary() {
        return {
            totalCrew: this.crew.length,
            maxCrew: this.maxCrew,
            overallMorale: this.morale,
            totalSalaries: this.paySalaries(),
            roles: this.getRoleDistribution(),
            averageExperience: this.getAverageExperience()
        };
    }
    
    getRoleDistribution() {
        const roles = {};
        this.crew.forEach(member => {
            roles[member.role] = (roles[member.role] || 0) + 1;
        });
        return roles;
    }
    
    getAverageExperience() {
        if (this.crew.length === 0) return 0;
        
        const totalExperience = this.crew.reduce((sum, member) => sum + member.experience, 0);
        return totalExperience / this.crew.length;
    }
    
    getCurrentDate() {
        // This should be synchronized with the game's date system
        return new Date().toISOString();
    }
    
    // Crew hiring system
    getAvailableCrew() {
        // This would typically load from a database or configuration
        return [
            {
                name: "Pilot Alex Johnson",
                role: "Pilot",
                skills: { pilot: 3, navigation: 2 },
                experience: 4,
                salary: 850
            },
            {
                name: "Gunner Mike Thompson",
                role: "Gunner",
                skills: { gunnery: 3, tactics: 2 },
                experience: 3,
                salary: 750
            },
            {
                name: "Scientist Dr. Lisa Park",
                role: "Scientist",
                skills: { science: 3, research: 2 },
                experience: 6,
                salary: 950
            }
        ];
    }
    
    hireCrewMember(candidateIndex) {
        const availableCrew = this.getAvailableCrew();
        if (candidateIndex >= 0 && candidateIndex < availableCrew.length) {
            const candidate = availableCrew[candidateIndex];
            return this.addCrewMember(candidate);
        }
        return false;
    }
    
    // Crew training and development
    trainCrewMember(memberId, skillName) {
        const member = this.getCrewMember(memberId);
        if (member && member.skills[skillName] !== undefined) {
            member.skills[skillName] = Math.min(5, member.skills[skillName] + 0.5);
            member.morale = Math.min(100, member.morale + 5);
            return true;
        }
        return false;
    }
    
    // Crew relationships and conflicts
    resolveConflict(member1Id, member2Id) {
        const member1 = this.getCrewMember(member1Id);
        const member2 = this.getCrewMember(member2Id);
        
        if (member1 && member2) {
            // Simple conflict resolution
            const resolution = Math.random();
            if (resolution > 0.5) {
                member1.morale += 5;
                member2.morale += 5;
                return "Conflict resolved amicably.";
            } else {
                member1.morale -= 10;
                member2.morale -= 10;
                return "Conflict resolution failed.";
            }
        }
        return "Invalid crew members.";
    }
}