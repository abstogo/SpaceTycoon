from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sys
import os
import json
from datetime import datetime

# Add the src directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from game.game import Game
from game.event_manager import EventManager
from game.ship import Ship
from game.crew import CrewManager

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Global game instance
game_instance = None

def get_game():
    """Get or create the game instance"""
    global game_instance
    if game_instance is None:
        game_instance = Game()
    return game_instance

@app.route('/')
def index():
    """Serve the main game page"""
    return render_template('index.html')

@app.route('/api/game/state', methods=['GET'])
def get_game_state():
    """Get the current game state"""
    game = get_game()
    
    return jsonify({
        'credits': game.credits,
        'location': game.location,
        'date': game.date,
        'ship': {
            'name': game.ship.name,
            'condition': game.ship.condition,
            'fuel': game.ship.fuel,
            'systems': game.ship.systems,
            'cargo': game.ship.cargo,
            'specs': game.ship.specs
        },
        'crew': {
            'members': game.crew_manager.crew,
            'morale': game.crew_manager.morale,
            'summary': game.crew_manager.getCrewSummary()
        }
    })

@app.route('/api/game/action', methods=['POST'])
def perform_action():
    """Perform a game action"""
    data = request.get_json()
    action = data.get('action')
    params = data.get('params', {})
    
    game = get_game()
    
    try:
        if action == 'travel':
            result = game.handleTravel()
            return jsonify({'success': True, 'result': result})
        elif action == 'trade':
            result = game.handleTrade()
            return jsonify({'success': True, 'result': result})
        elif action == 'missions':
            result = game.handleMissions()
            return jsonify({'success': True, 'result': result})
        elif action == 'ship_maintenance':
            result = game.handleShipManagement()
            return jsonify({'success': True, 'result': result})
        elif action == 'crew_management':
            result = game.handleCrewManagement()
            return jsonify({'success': True, 'result': result})
        else:
            return jsonify({'success': False, 'error': f'Unknown action: {action}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/events/check', methods=['POST'])
def check_events():
    """Check for events in the current context"""
    data = request.get_json()
    context = data.get('context', 'Any')
    
    game = get_game()
    active_events = game.event_manager.get_active_events(context)
    
    return jsonify({
        'events': [
            {
                'title': event.title,
                'description': event.description,
                'choices': event.choices,
                'source': event.source,
                'context': event.context
            }
            for event in active_events
        ]
    })

@app.route('/api/events/resolve', methods=['POST'])
def resolve_event():
    """Resolve an event choice"""
    data = request.get_json()
    event_title = data.get('event_title')
    choice_index = data.get('choice_index')
    
    game = get_game()
    
    # Find the event by title
    for event in game.event_manager.active_events:
        if event.title == event_title:
            game.event_manager.resolve_event(event, choice_index)
            return jsonify({'success': True, 'message': 'Event resolved'})
    
    return jsonify({'success': False, 'error': 'Event not found'})

@app.route('/api/ship/maintenance', methods=['POST'])
def perform_maintenance():
    """Perform ship maintenance"""
    data = request.get_json()
    maintenance_type = data.get('type', 'basic')
    
    game = get_game()
    result = game.ship.performMaintenance(maintenance_type)
    
    return jsonify({
        'success': True,
        'result': result,
        'ship_condition': game.ship.condition,
        'systems': game.ship.systems
    })

@app.route('/api/crew/train', methods=['POST'])
def train_crew():
    """Train crew members"""
    data = request.get_json()
    member_id = data.get('member_id')
    skill_name = data.get('skill_name')
    
    game = get_game()
    result = game.crew_manager.trainCrewMember(member_id, skill_name)
    
    return jsonify({
        'success': result,
        'crew': game.crew_manager.crew
    })

@app.route('/api/game/save', methods=['POST'])
def save_game():
    """Save the current game state"""
    game = get_game()
    
    save_data = {
        'credits': game.credits,
        'location': game.location,
        'date': game.date,
        'ship': {
            'condition': game.ship.condition,
            'fuel': game.ship.fuel,
            'systems': game.ship.systems,
            'cargo': game.ship.cargo
        },
        'crew': game.crew_manager.crew,
        'morale': game.crew_manager.morale,
        'timestamp': datetime.now().isoformat()
    }
    
    # Save to file (in a real app, you'd use a database)
    with open('save_game.json', 'w') as f:
        json.dump(save_data, f, indent=2)
    
    return jsonify({'success': True, 'message': 'Game saved'})

@app.route('/api/game/load', methods=['GET'])
def load_game():
    """Load a saved game"""
    try:
        with open('save_game.json', 'r') as f:
            save_data = json.load(f)
        
        game = get_game()
        
        # Restore game state
        game.credits = save_data['credits']
        game.location = save_data['location']
        game.date = save_data['date']
        game.ship.condition = save_data['ship']['condition']
        game.ship.fuel = save_data['ship']['fuel']
        game.ship.systems = save_data['ship']['systems']
        game.ship.cargo = save_data['ship']['cargo']
        game.crew_manager.crew = save_data['crew']
        game.crew_manager.morale = save_data['morale']
        
        return jsonify({'success': True, 'message': 'Game loaded'})
    except FileNotFoundError:
        return jsonify({'success': False, 'error': 'No save file found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/game/update', methods=['POST'])
def update_game():
    """Update the game state (called periodically)"""
    data = request.get_json()
    delta_time = data.get('delta_time', 0)
    
    game = get_game()
    game.update(delta_time)
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)