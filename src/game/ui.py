import pygame
from typing import List, Dict
from .event_manager import Event

class UIManager:
    def __init__(self, game):
        self.game = game
        self.font = pygame.font.Font(None, 24)
        self.active_event = None
        self.screen_state = "main"  # main, event, crew, ship, etc.
        
    def handle_event(self, pygame_event):
        """Handle pygame events"""
        if pygame_event.type == pygame.MOUSEBUTTONDOWN:
            self.handle_click(pygame_event.pos)
            
    def handle_click(self, pos):
        """Handle mouse clicks"""
        if self.active_event:
            # Handle event choice clicks
            pass
        else:
            # Handle main screen clicks
            pass
            
    def render(self, screen):
        """Render the current UI state"""
        if self.active_event:
            self.render_event(screen)
        else:
            self.render_main_screen(screen)
            
    def render_main_screen(self, screen):
        """Render the main game screen"""
        # Render ship status
        self.render_ship_status(screen)
        
        # Render crew list
        self.render_crew_list(screen)
        
        # Render cargo/passengers
        self.render_cargo(screen)
        
    def render_ship_status(self, screen):
        """Render ship status information"""
        y = 10
        # Ship name and location
        text = f"{self.game.ship.name} - {self.game.ship.location}"
        text_surface = self.font.render(text, True, (255, 255, 255))
        screen.blit(text_surface, (10, y))
        
        # Systems status
        y += 30
        for system, status in self.game.ship.systems.items():
            text = f"{system}: {status*100:.0f}%"
            text_surface = self.font.render(text, True, (255, 255, 255))
            screen.blit(text_surface, (10, y))
            y += 20
            
    def render_crew_list(self, screen):
        """Render the crew list"""
        y = 200
        for member in self.game.ship.crew:
            text = f"{member.name} - Health: {member.health*100:.0f}% Morale: {member.morale*100:.0f}%"
            text_surface = self.font.render(text, True, (255, 255, 255))
            screen.blit(text_surface, (10, y))
            y += 20
            
    def render_cargo(self, screen):
        """Render cargo and passenger information"""
        y = 400
        # Cargo
        text = "Cargo:"
        text_surface = self.font.render(text, True, (255, 255, 255))
        screen.blit(text_surface, (10, y))
        y += 20
        
        for item, quantity in self.game.ship.cargo.items():
            text = f"{item}: {quantity}"
            text_surface = self.font.render(text, True, (255, 255, 255))
            screen.blit(text_surface, (10, y))
            y += 20
            
        # Passengers
        y += 20
        text = "Passengers:"
        text_surface = self.font.render(text, True, (255, 255, 255))
        screen.blit(text_surface, (10, y))
        y += 20
        
        for passenger in self.game.ship.passengers:
            text = passenger.get("name", "Unknown")
            text_surface = self.font.render(text, True, (255, 255, 255))
            screen.blit(text_surface, (10, y))
            y += 20
            
    def render_event(self, screen):
        """Render an active event"""
        if not self.active_event:
            return
            
        # Event title
        title = self.font.render(self.active_event.title, True, (255, 255, 255))
        screen.blit(title, (10, 10))
        
        # Event description
        y = 50
        description = self.font.render(self.active_event.description, True, (255, 255, 255))
        screen.blit(description, (10, y))
        
        # Event choices
        y += 100
        for i, choice in enumerate(self.active_event.choices):
            text = f"{i+1}. {choice['text']}"
            text_surface = self.font.render(text, True, (255, 255, 255))
            screen.blit(text_surface, (10, y))
            y += 30 