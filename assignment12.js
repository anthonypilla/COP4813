
// Get the table body and status message.
const cmsTableBody = document.getElementById("cmsTableBody");
const tableStatus = document.getElementById("tableStatus");

// Load CMS information from the external JSON file.
async function loadCMSData() {
    try {
        const response = await fetch("cms.json");

        if (!response.ok) {
            throw new Error("Could not load cms.json.");
        }

        const data = await response.json();

        displayCMSData(data.cmsSystems);

    } catch (error) {
        console.error("Error loading CMS information:", error);

        tableStatus.textContent =
            "Unable to load CMS information. Please try again later.";
    }
}

// Create a bullet list from an array of items.
function createList(items) {
    const list = document.createElement("ul");

    items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
    });

    return list;
}

// Create a clickable link.
function createLink(name, url) {
    const link = document.createElement("a");

    link.href = url;
    link.textContent = name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
}

// Generate the CMS comparison table.
function displayCMSData(cmsSystems) {

    cmsTableBody.innerHTML = "";

    cmsSystems.forEach(cms => {

        // Create a new table row.
        const row = document.createElement("tr");

        // System name.
        const systemCell = document.createElement("td");
        const systemHeading = document.createElement("strong");

        systemHeading.textContent = cms.system;
        systemCell.appendChild(systemHeading);

        // Produced/Sold By.
        const supportCell = document.createElement("td");
        supportCell.textContent = cms.support;

        // Technology Base.
        const technologyCell = document.createElement("td");
        technologyCell.textContent = cms.technology;

        // Major Capabilities.
        const capabilitiesCell = document.createElement("td");
        capabilitiesCell.appendChild(createList(cms.capabilities));

        // Major Limitations.
        const limitationsCell = document.createElement("td");
        limitationsCell.appendChild(createList(cms.limitations));

        // Example Website and Research Sources.
        const exampleCell = document.createElement("td");

        const exampleLink = createLink(
            cms.exampleSite.name,
            cms.exampleSite.url
        );

        exampleCell.appendChild(exampleLink);

        // Add research source links.
        const sourceHeading = document.createElement("h4");
        sourceHeading.textContent = "Research Sources:";
        exampleCell.appendChild(sourceHeading);

        const sourceList = document.createElement("ul");

        cms.sources.forEach(source => {
            const sourceItem = document.createElement("li");

            sourceItem.appendChild(
                createLink(source.name, source.url)
            );

            sourceList.appendChild(sourceItem);
        });

        exampleCell.appendChild(sourceList);

        // Add all six cells to the table row.
        row.appendChild(systemCell);
        row.appendChild(supportCell);
        row.appendChild(technologyCell);
        row.appendChild(capabilitiesCell);
        row.appendChild(limitationsCell);
        row.appendChild(exampleCell);

        // Add the completed row to the table.
        cmsTableBody.appendChild(row);
    });

    // Update the loading message.
    tableStatus.textContent =
        `Showing ${cmsSystems.length} content management systems.`;
}

// Load the information when the page opens.
loadCMSData();

