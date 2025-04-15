# Space Tycoon

A game based on the Cepheus Engine rules system.

## Project Overview

Space Tycoon is a space exploration and trading game that is roughly based on the structure of the classic game King of Dragon Pass. The player controls a ship and its crew, which takes the place of the "Circle" in KoDP, and manages the facilities, trading, finances and activities of the ship in the same fashion the player controls their capital in KoDP. 
The space trading and exploration rules in Space Tycoon will be taken from Cepheus Engine, an OGL conversion of the well-loved and tested Traveller tabletop RPG. 

## Core Mechanism Ideas
Most of the game is managed through Events. These occur in response to the player taking actions, and present the player's ship and crew with a specific challenge or opportunity that they can potentially handle with their skills and equipment.
What specific events occur is a combination of the following Event Sources: 
- Timed events (for example, a planet might descend into a civil war at a specific time, or a device planted aboard the ship might activate at a specified time later)
- Random events (events that can occur at any time based on probability, such as encountering pirates or discovering a derelict ship)
- Location-based events (specific events that can occur when visiting certain planets, stations, or sectors)
- Skill-triggered events (events that occur when crew members with certain skills are present, like a medic identifying a disease outbreak)
- Resource-based events (events triggered by having certain equipment, cargo, or passengers aboard)
- Reputation events (events that occur based on the player's standing with various factions)
- Crew-related events (events triggered by crew relationships, morale, or personal histories)
- Mission events (events that are part of specific missions or quest lines the player has accepted)
- Trade events (events related to market changes, trade opportunities, or economic shifts)

Beyond this, events are divided into two Event Types: Reactive Events (which are triggered in response to the player takes a specific action) and Stacked Events (which happen when the player is doing something which causes time to progress, such as waiting, travelling or working).

### Event Stacking
With so many potential Event Sources, it would easily be possible for the player to be overwhelmed with too many Events whenever they move or wait. To prevent this, Passive Events are stored in a Stack and activated based on an Activation Rate whenever an appropriate Activation Context occurs. (There is no need to stack Reactive Events as they always trigger when the player does something specific and are therefore expected.)

Example of an Event Stack:
1) Sabotaged Jump Engines (Source: Resource - Jump Engines, Activation Rate 1.0, Activation Context - Jump Engines Activated)
2) Bounty Hunter Attacks (Source: Resource - Passenger 'Nelegar', Activation Rate 0.4, Activation Context - In Space)
3) Distress Signal (Source: Random, Activation Rate 0.1, Activation Context - In Space)
4) Crew Conflict (Source: Crew, Activation Rate 0.2, Activation Context - Any)
5) Market Price Shift (Source: Trade, Activation Rate 0.3, Activation Context - Docked)
6) Local Authority Inspection (Source: Location - High Law Level Port, Activation Rate 0.5, Activation Context - Docked)
7) Maintenance Required (Source: Timed, Activation Rate 0.8, Activation Context - Weekly)
8) Faction Representative Contact (Source: Reputation, Activation Rate 0.4, Activation Context - Docked)
9) Medical Emergency (Source: Skill - Medical, Activation Rate 0.2, Activation Context - Any)
10) Mission Update (Source: Mission, Activation Rate 0.6, Activation Context - Any)
11) Crew Training Opportunity (Source: Skill, Activation Rate 0.3, Activation Context - Docked)
12) Ship Systems Malfunction (Source: Random, Activation Rate 0.2, Activation Context - In Space)
13) Passenger Request (Source: Resource - Any Passenger, Activation Rate 0.4, Activation Context - Any)
14) Local News Update (Source: Location, Activation Rate 0.7, Activation Context - Docked)
15) Rival Trader Encounter (Source: Trade, Activation Rate 0.3, Activation Context - In Space)

The game will look at the current situation (eg - In Space) and then filter the Event Stack accordingly, before selecting which Events (if any) to trigger based on the Activation Rate.

Each Event's data will indicate if it returns to the Event Stack after success or failure. 

### Event Definitions

All Events will be stored in XML data files so they can be easily modded by the player if desired. Being based on KoDP event screens, we should generally have some artwork available depicting each Event and its conclusion.

## Rules Reference

The game rules are based on the Cepheus Engine SRD and are available in the `rules/` directory after running the PDF conversion system (see `pdf/README.md` for details).

## Project Plan

This project will be built using Pygame.

## PDF to Markdown Conversion

This project includes a system to convert the Cepheus Engine SRD PDF into structured Markdown files, which can be found in the 'pdf/' folder.

### Directory Structure

The converted rules will be organized into:
- `rules/core/` - Basic game mechanics and concepts
- `rules/character/` - Character creation and development
- `rules/skills/` - Skills and skill checks
- `rules/combat/` - Combat rules and mechanics
- `rules/trade/` - Trade and commerce rules
- `rules/space/` - Space travel and ship operations
