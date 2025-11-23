// --- Initialize Leaflet Map ---
const map = L.map('map').setView([54.5, -3], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let allMarkers = [];
let sightings = [];
let cityFilter = null; // currently selected city
let filteredCitySeverity = {}; // severity based on species/date filter

// --- Severity color based on relative counts ---
function getSeverityColor(count, maxCount) {
    if (count >= 0.75 * maxCount) return "red";
    if (count >= 0.25 * maxCount) return "orange";
    return "green";
}

// --- Load sightings and setup ---
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

// --- Render markers and results ---
function renderMarkersAndResults(filteredSightings) {
    // Remove old markers
    allMarkers.forEach(marker => map.removeLayer(marker));
    allMarkers = [];

    // Count sightings per city in filtered data (for popup counts)
    const cityCounts = {};
    filteredSightings.forEach(s => {
        cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });

    // --- Map markers ---
    Object.entries(cityCounts).forEach(([city, count]) => {
        const coords = cityCoordinates[city];
        if (!coords) return;

        const marker = L.circleMarker(coords, {
            radius: 10,
            fillColor: filteredCitySeverity[city], // always use precomputed colors
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`<strong>${city}</strong><br>Cases: ${count}`)
        .bindTooltip(`${count} cases`, {permanent: false, direction: "top"}); // <-- Tooltip on hover

        // Click toggles city filter
        marker.on("click", () => {
            if (cityFilter === city) {
                // Click same city again -> reset
                cityFilter = null;
                applyFilters(false); // false = don't recalc severity
            } else {
                cityFilter = city;
                applyFilters(false); // false = don't recalc severity
            }
        });

        allMarkers.push(marker);
    });

    // --- Results list ---
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

// --- Recalculate severity based on species/date filter only ---
function recalcSeverity(baseSightings) {
    const cityCounts = {};
    baseSightings.forEach(s => {
        cityCounts[s.city] = (cityCounts[s.city] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(cityCounts), 1);

    // Recalculate severity
    filteredCitySeverity = {};
    for (const [city, count] of Object.entries(cityCounts)) {
        filteredCitySeverity[city] = getSeverityColor(count, maxCount);
    }
}

// --- Filter logic ---
function applyFilters(recalcSeverityFlag = true) {
    const species = document.getElementById("filter-species").value;
    const severityFilter = document.getElementById("filter-severity").value;
    const dateRange = document.getElementById("filter-date").value;
    const today = new Date();

    // Filter by species/date first
    let filtered = sightings.filter(s => {
        let keep = true;

        // Species filter
        if (species) keep = keep && (s.species === species);

        // Date range filter
        if (dateRange) {
            const sightDate = new Date(s.date);
            if (dateRange === "1m") keep = keep && (today - sightDate <= 30*24*60*60*1000);
            if (dateRange === "1y") keep = keep && (today - sightDate <= 365*24*60*60*1000);
            if (dateRange === "2y") keep = keep && (today - sightDate <= 2*365*24*60*60*1000);
            if (dateRange === "more") keep = keep && (today - sightDate > 2*365*24*60*60*1000);
        }

        // City filter toggle
        if (cityFilter) keep = keep && (s.city === cityFilter);

        return keep;
    });

    // Recalculate severity only if recalcSeverityFlag is true
    if (recalcSeverityFlag) {
        recalcSeverity(filtered);
    }

    // Severity filter (does not recalc colors)
    if (severityFilter) {
        filtered = filtered.filter(s => {
            const sev = filteredCitySeverity[s.city]; // use precomputed
            if (severityFilter === "low") return sev === "green";
            if (severityFilter === "medium") return sev === "orange";
            if (severityFilter === "high") return sev === "red";
        });
    }

    renderMarkersAndResults(filtered);
}

// --- Apply filters button ---
document.getElementById("apply-filters").addEventListener("click", () => {
    applyFilters(true); // true = recalc severity based on species/date
});
