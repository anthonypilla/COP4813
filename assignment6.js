// Load the baseball data from the JSON file

fetch("baseball.json")
    .then(function (response) {

        if (!response.ok) {
            throw new Error("Could not load baseball.json");
        }

        return response.json();
    })
    .then(function (data) {

        // Display the title from the JSON file
        document.getElementById("tableTitle").textContent = data.title;

        // Get the table body
        const table = document.getElementById("playerTable");

        // Add each player to the table
        data.players.forEach(function (player) {

            const row = document.createElement("tr");

            row.innerHTML =
                "<td>" + player.rank + "</td>" +
                "<td>" + player.playerName + "</td>" +
                "<td>" + player.team + "</td>" +
                "<td>" + player.position + "</td>" +
                "<td>" + player.battingAverage.toFixed(3) + "</td>" +
                "<td>" + player.homeRuns + "</td>" +
                "<td>" + player.fWAR.toFixed(1) + "</td>" +
                "<td>" + player.wRCPlus + "</td>";

            table.appendChild(row);
        });
    })
    .catch(function (error) {

        document.getElementById("errorMessage").textContent =
            "There was an error loading the baseball data.";

        console.error(error);
    });
