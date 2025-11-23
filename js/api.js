window.fetchAllSightings = async function () {
    try {
        const response = await fetch("http://localhost:3000/api");
        const data = await response.json();
        console.log("Loaded sightings:", data);
        return data;
    } catch (err) {
        console.error("Error loading API:", err);
        return [];
    }
};
