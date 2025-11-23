// Initialize Leaflet Map 
const map = L.map('map').setView([54.5, -3], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let allMarkers = [];
let sightings = [];
let cityFilter = null; 
let filteredCitySeverity = {}; 

// Severity color based on relative counts
function getSeverityColor(count, maxCount) {
    if (count >= 0.75 * maxCount) return "red";
    if (count >= 0.25 * maxCount) return "orange";
    return "green";
}

// Load sightings and setup 
(async function () {
    sightings = await window.fetchAllSightings(); 

    // Populate species dropdown dynamically
    const speciesSet = new Set(sightings.map(s => s.species));
    const speciesSelect = document.getElementById("filter-species");
    speciesSet.forEach(s => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        speciesSelect.appendChild(option);
    });

    // Precompute initial severity based on full dataset
    const cityCounts = {};
    sightings.forEach(s => {
        cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(cityCounts), 1);
    filteredCitySeverity = {};
    for (const [city, count] of Object.entries(cityCounts)) {
        filteredCitySeverity[city] = getSeverityColor(count, maxCount);
    }

    renderMarkersAndResults(sightings);
})();

// Render markers and results
function renderMarkersAndResults(filteredSightings) {
    // Remove old markers
    allMarkers.forEach(marker => map.removeLayer(marker));
    allMarkers = [];

    // Count sightings per city in filtered data (for popup counts)
    const cityCounts = {};
    filteredSightings.forEach(s => {
        cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });

    // Map markers
    Object.entries(cityCounts).forEach(([city, count]) => {
        // Use a fixed coordinate if cityCoordinates exists
        const coords = cityCoordinates?.[city] || [54.5, -3]; // fallback if city not in coordinates
        if (!coords) return;

        const marker = L.circleMarker(coords, {
            radius: 10,
            fillColor: filteredCitySeverity[city] || "green",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`<strong>${city}</strong><br>Cases: ${count}`)
        .bindTooltip(`${count} cases`, {permanent: false, direction: "top"});

        marker.on("click", () => {
            cityFilter = cityFilter === city ? null : city;
            window.lastSelectedCity = city;
            applyFilters(false);
        });

        allMarkers.push(marker);
    });

    // Results list
    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = "";

    filteredSightings.forEach(s => {
        const severityColor = filteredCitySeverity[s.city] || "green";

        const div = document.createElement("div");
        div.className = "result-item";
        div.innerHTML = `
            <div class="result-severity" style="background:${severityColor}"></div>
            <div class="result-details">
                <strong>${s.city}</strong> — ${s.species}<br>
                <span>${s.latinName}</span><br>
                <span>${s.date}</span>
            </div>
        `;
        resultsList.appendChild(div);
    });
}

// Recalculate severity based on species/date filter only 
function recalcSeverity(baseSightings) {
    const cityCounts = {};
    baseSightings.forEach(s => {
        cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(cityCounts), 1);

    filteredCitySeverity = {};
    for (const [city, count] of Object.entries(cityCounts)) {
        filteredCitySeverity[city] = getSeverityColor(count, maxCount);
    }
}

// Filter logic 
function applyFilters(recalcSeverityFlag = true) {
    const species = document.getElementById("filter-species").value;
    const severityFilter = document.getElementById("filter-severity").value;
    const dateRange = document.getElementById("filter-date").value;
    const today = new Date();

    let filtered = sightings.filter(s => {
        let keep = true;

        if (species) keep = keep && (s.species === species);

        if (dateRange) {
            const sightDate = new Date(s.date);
            if (dateRange === "1m") keep = keep && (today - sightDate <= 30*24*60*60*1000);
            if (dateRange === "1y") keep = keep && (today - sightDate <= 365*24*60*60*1000);
            if (dateRange === "2y") keep = keep && (today - sightDate <= 2*365*24*60*60*1000);
        }

        if (cityFilter) keep = keep && (s.city === cityFilter);

        return keep;
    });

    if (recalcSeverityFlag) {
        recalcSeverity(filtered);
    }

    if (severityFilter) {
        filtered = filtered.filter(s => {
            const sev = filteredCitySeverity[s.city];
            if (severityFilter === "low") return sev === "green";
            if (severityFilter === "medium") return sev === "orange";
            if (severityFilter === "high") return sev === "red";
        });
    }

    renderMarkersAndResults(filtered);
}

// Apply filters button 
document.getElementById("apply-filters").addEventListener("click", () => {
    applyFilters(true);
});

window.fetchAllSightings = async function () {
    try {
        const response = await fetch("http://localhost:3000/api");
        const data = await response.json();
        console.log("Loaded sightings from API:", data);
        return data;
    } catch (err) {
        console.error("Error loading sightings from API:", err);
        return [];
    }
};
