import sys
import pygame
from .event_manager import EventManager
from .ship import Ship
from .crew import CrewManager
from .ui import UIManager

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((1024, 768))
        pygame.display.set_caption("Space Tycoon")
        
        # Initialize core systems
        self.event_manager = EventManager()
        self.ship = Ship()
        self.crew_manager = CrewManager()
        self.ui_manager = UIManager(self)
        
        # Game state
        self.running = True
        self.clock = pygame.time.Clock()
        
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            self.ui_manager.handle_event(event)
            
    def update(self):
        # Update game state
        self.event_manager.update()
        self.ship.update()
        self.crew_manager.update()
        
    def render(self):
        self.screen.fill((0, 0, 0))  # Clear screen
        self.ui_manager.render(self.screen)
        pygame.display.flip()
        
    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.render()
            self.clock.tick(60)  # Cap at 60 FPS
            
        pygame.quit()
        sys.exit() 