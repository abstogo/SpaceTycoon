import sys
import os
from pathlib import Path
import unittest
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from game.event_manager import EventManager, Event

def print_separator():
    print("\n" + "="*80 + "\n")

class TestEventSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test events once for all tests"""
        print_separator()
        print("Setting up test environment...")
        cls.setup_test_events()
        print_separator()
        
    @staticmethod
    def setup_test_events():
        """Create test event file if it doesn't exist"""
        events_dir = Path("data/events")
        events_dir.mkdir(parents=True, exist_ok=True)
        print(f"Created/ensured events directory at {events_dir}")
        
        test_event_file = events_dir / "test_events.xml"
        test_event_file.write_text("""<?xml version="1.0" encoding="UTF-8"?>
<events>
    <event source="random" activation_rate="1.0" context="In Space">
        <title>Test Space Event</title>
        <description>A test event in space.</description>
        <choice text="Option 1" outcome="test1" />
        <choice text="Option 2" outcome="test2" />
    </event>
    <event source="location" activation_rate="1.0" context="Docked">
        <title>Test Dock Event</title>
        <description>A test event while docked.</description>
        <choice text="Option A" outcome="testA" />
        <choice text="Option B" outcome="testB" />
    </event>
</events>""")
        print(f"Created/Updated test events file at {test_event_file}")
        
        # Remove sample events file if it exists
        sample_file = events_dir / "sample_events.xml"
        if sample_file.exists():
            sample_file.unlink()
            print(f"Removed sample events file at {sample_file}")
    
    def setUp(self):
        """Create a fresh EventManager for each test"""
        self.manager = EventManager()
    
    def test_event_loading(self):
        """Test that events are loaded correctly from XML"""
        print("\nTesting event loading...")
        
        # Verify events were loaded
        event_count = len(self.manager.event_stack)
        print(f"Found {event_count} events in stack")
        self.assertEqual(event_count, 2, f"Expected 2 events, got {event_count}")
        
        # Check space event
        space_event = next((e for e in self.manager.event_stack if e.context == "In Space"), None)
        self.assertIsNotNone(space_event, "Space event not found")
        print(f"Found space event: {space_event}")
        self.assertEqual(space_event.source, "random", "Incorrect event source")
        self.assertEqual(space_event.activation_rate, 1.0, "Incorrect activation rate")
        self.assertEqual(len(space_event.choices), 2, "Incorrect number of choices")
        
        # Check dock event
        dock_event = next((e for e in self.manager.event_stack if e.context == "Docked"), None)
        self.assertIsNotNone(dock_event, "Dock event not found")
        print(f"Found dock event: {dock_event}")
        self.assertEqual(dock_event.source, "location", "Incorrect event source")
        self.assertEqual(dock_event.activation_rate, 1.0, "Incorrect activation rate")
        self.assertEqual(len(dock_event.choices), 2, "Incorrect number of choices")
    
    def test_event_activation(self):
        """Test event activation logic"""
        print("\nTesting event activation...")
        
        # Test context filtering
        space_events = self.manager.get_active_events("In Space")
        print(f"Found {len(space_events)} space events")
        self.assertTrue(any(e.context == "In Space" for e in space_events), 
                       "No space events found")
        
        # Test activation rate (using 1.0 rate for deterministic testing)
        docked_events = self.manager.get_active_events("Docked")
        print(f"Found {len(docked_events)} dock events")
        self.assertTrue(any(e.context == "Docked" for e in docked_events), 
                       "No dock events found")
    
    def test_event_resolution(self):
        """Test event resolution"""
        print("\nTesting event resolution...")
        
        # Get an event and add it to active events
        event = self.manager.event_stack[0]
        print(f"Testing with event: {event}")
        self.manager.active_events.append(event)
        initial_stack_size = len(self.manager.event_stack)
        print(f"Initial stack size: {initial_stack_size}")
        
        # Resolve the event
        self.manager.resolve_event(event, 0)
        print(f"Final stack size: {len(self.manager.event_stack)}")
        
        # Verify event was removed from active events
        self.assertNotIn(event, self.manager.active_events, 
                        "Event not removed from active events")
        print("Event successfully resolved")

if __name__ == "__main__":
    print("\nRunning event system tests...")
    unittest.main(verbosity=2) 