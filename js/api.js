window.fetchAllSightings = async function () {
    console.log("Loading local sightings.json…");

    const response = await fetch("./js/sightings.json");
    const data = await response.json();

    console.log("Local JSON loaded:", data);
    return data;
};
