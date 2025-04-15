import random
from typing import List, Dict
import xml.etree.ElementTree as ET
from pathlib import Path
import os

class Event:
    def __init__(self, source: str, activation_rate: float, context: str, 
                 title: str, description: str, choices: List[Dict]):
        self.source = source
        self.activation_rate = activation_rate
        self.context = context
        self.title = title
        self.description = description
        self.choices = choices
        self.return_to_stack = True  # Default behavior
        
    def should_activate(self, current_context: str) -> bool:
        """Check if the event should activate based on context and rate"""
        if self.context != "Any" and self.context != current_context:
            return False
        return random.random() < self.activation_rate
        
    def __str__(self):
        return f"Event(title='{self.title}', context='{self.context}', rate={self.activation_rate})"

class EventManager:
    def __init__(self):
        self.event_stack: List[Event] = []
        self.active_events: List[Event] = []
        print("Initializing EventManager...")
        self.load_events()
        
    def load_events(self):
        """Load events from XML files"""
        events_dir = Path("data/events")
        print(f"Looking for events in {events_dir.absolute()}")
        
        # Create events directory if it doesn't exist
        if not events_dir.exists():
            events_dir.mkdir(parents=True, exist_ok=True)
            print(f"Created events directory at {events_dir}")
            return
            
        # Load all XML files in the events directory
        xml_files = list(events_dir.glob("*.xml"))
        if not xml_files:
            print("No event XML files found")
            return
            
        print(f"Found {len(xml_files)} event file(s)")
        for event_file in xml_files:
            try:
                print(f"Loading events from {event_file}")
                tree = ET.parse(event_file)
                root = tree.getroot()
                
                for event_elem in root.findall("event"):
                    event = Event(
                        source=event_elem.get("source"),
                        activation_rate=float(event_elem.get("activation_rate")),
                        context=event_elem.get("context"),
                        title=event_elem.find("title").text,
                        description=event_elem.find("description").text,
                        choices=[{
                            "text": choice.get("text"),
                            "outcome": choice.get("outcome")
                        } for choice in event_elem.findall("choice")]
                    )
                    self.event_stack.append(event)
                    print(f"Loaded event: {event}")
            except Exception as e:
                print(f"Error loading event file {event_file}: {e}")
                
        print(f"Total events loaded: {len(self.event_stack)}")
                
    def update(self):
        """Update event states and check for activations"""
        # Check for timed events
        # Check for random events
        # Check for location-based events
        # etc.
        
    def get_active_events(self, context: str) -> List[Event]:
        """Get events that should activate in the current context"""
        print(f"Checking for events in context: {context}")
        active = [event for event in self.event_stack 
                 if event.should_activate(context)]
        print(f"Found {len(active)} active events")
        return active
                
    def resolve_event(self, event: Event, choice_index: int):
        """Resolve an event based on player choice"""
        print(f"Resolving event: {event}")
        if event.return_to_stack:
            self.event_stack.append(event)
        if event in self.active_events:
            self.active_events.remove(event)
        print("Event resolved") 