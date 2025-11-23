# UK Tick Tracker

A interactive web app to track and visualize tick sightings across the UK. Users can view sightings on a map, filter by date, species, and severity, and report new sightings.

---

## Features & Core Requirements

This project implements several core requirements across different areas. Specifically, the following have been completed:

### 1. Interactive Map Visualisation
- **1a. Dynamic map interface:** Displays tick sightings across the UK on a Leaflet map.  
- **1c. Filter controls:** Users can filter sightings by date range, species, and severity level.

### 2. Sighting Information
- **2a. Modal/Sidebar panel:** Displays detailed sighting information when a user clicks on a sighting on the map.  
- **2c. Quick action buttons:** Includes:
  - “Report a Sighting” → navigates to the report form  
  - “Get Directions” → opens Google Maps for selected city  
  - “Share” → opens email client  

### 3. Education Content
- **3a. Species identification guide:** Lists common tick species with their Latin names.  
- **3b. Prevention tips:** Provides guidelines for preventing tick exposure.

### 4. Report a Sighting
- **4a. Submission form:** Users can submit new sightings with date, location, species, and Latin name.  
- **4b. Form validation:** Ensures all fields are completed, with success or error messaging.

**Features implemented cover at least two requirements in each area.**

---

## Project Structure
```
├── css/
│ └── style.css # Main styling for the app
├── js/
│ ├── api.js # Handles API calls
│ ├── cityCoordinates.js # City latitude/longitude data
│ ├── map.js # Map initialization, markers, and filtering
│ ├── sightings.json # Data for tick sightings
│ └── ui.js # UI interactions (tabs)
├── index.html # Main app page
├── report.html # Page for reporting a new sighting
├── server.js # Node.js server
├── package.json # Dependencies and scripts
├── package-lock.json # Auto-generated dependency tree
├── node_modules/ # Installed packages
└── README.md # Project documentation
```

## Installation & Setup

### 1. Clone the repository
- git clone `<your-repo-url>`
- cd `<repo-folder>`
### 2. Install dependencies
- npm install
### 3. Start the server
- node server.js
- The server runs on http://localhost:3000
### 4. Open the app
- Open **index.html** to view the map and filter sightings.
- Open **report.html** to submit new tick sightings.

---

## Usage

### Viewing Sightings
- Click markers on the map to select a city.
- Apply filters for date, species, or severity.
- Results appear in the right-hand panel.

### Reporting Sightings
- Go to the **Report a Sighting** page.
- Fill in date, city, species, and Latin name.
- Submit to add the sighting to the database via the API.

### Quick Actions
- **Get Directions:** Opens Google Maps for the selected city.
- **Share:** Opens the default email client with a pre-filled message.

---

## Tech Stack
- HTML, CSS, JavaScript  
- **Leaflet.js** for interactive maps  
- Node.js server for API and data handling

---

## Future Improvements
- Replace JSON with a real database
- Add user authentication for reporting
- Add visual charts for sightings over time
- Allow image uploading
