// --- TAB SWITCHING ---
document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// --- CLOSE DETAILS PANEL ---
document.getElementById("close-details").addEventListener("click", () => {
    document.getElementById("details-panel").classList.add("hidden");
});

// --- SHOWN WHEN A MARKER IS CLICKED ---
window.showDetails = function (s) {

    document.getElementById("d-city").textContent = s.city;
    document.getElementById("d-species").textContent = s.species;
    document.getElementById("d-date").textContent = s.date;
    document.getElementById("d-latin").textContent = s.latinName;

    document.getElementById("details-panel").classList.remove("hidden");
};
