# TIMTIM-like Interface as used by NS for Zwolle-Groningen DLC of Train Sim World
NS TIMTIM Interface for Zwolle-Groningen DLC of Train Sim World
## Prerequisites
- TSW6 Build 493 (API 1.5)
- Zwolle-Groningen route DLC
## Setup
For reference on the API, see [the API manual on the DTG forum](https://forums.dovetailgames.com/attachments/tsw-external-interface-api-1-5-1-pdf.203411/).

- Launch TSW with the `-HTTPAPI` flag option.
- Serve the project root folder with PHP development server (using the provided script) or an alternative.
- Navigate to `http://localhost:[server-port]?tr=runningNumber&len=carriages`, where `runningNumber` is the service you are playing, and `carriages` is the amount of carriages your EMU has in total.
## How does it work?
To provide you with accurate information, this applet reads data about the current game (like in-game time, speed limit and position) and combines it with real-life data like timetables and coasting data. 
The interface of this applet is strictly based on the interface used by Dutch railway operator NS in their active operations (TIMTIM Pro with Routelint).
