

const form = document.getElementById("gravityForm");

const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");

const G = 6.67430e-11;


form.addEventListener("submit", function (event) {

    event.preventDefault();

    errorMessage.textContent = "";
    errorMessage.style.display = "none";


    // Get user input

    const mass1 = parseFloat(document.getElementById("mass1").value);
    const mass2 = parseFloat(document.getElementById("mass2").value);
    const startDistance = parseFloat(
        document.getElementById("startDistance").value
    );
    const endDistance = parseFloat(
        document.getElementById("endDistance").value
    );


    // Validate input

    if (
        isNaN(mass1) ||
        isNaN(mass2) ||
        isNaN(startDistance) ||
        isNaN(endDistance)
    ) {
        showError("Please enter a value in every field.");
        return;
    }


    if (mass1 <= 0 || mass2 <= 0) {
        showError("Mass values must be greater than zero.");
        return;
    }


    if (startDistance <= 0 || endDistance <= 0) {
        showError("Distance values must be greater than zero.");
        return;
    }


    if (endDistance <= startDistance) {
        showError(
            "The ending distance must be greater than the starting distance."
        );
        return;
    }


    // Create arrays

    const distances = [];
    const forces = [];

    const numberOfPoints = 100;

    const distanceStep =
        (endDistance - startDistance) / (numberOfPoints - 1);


    for (let i = 0; i < numberOfPoints; i++) {

        const distance =
            startDistance + (distanceStep * i);

        const force =
            (G * mass1 * mass2) / (distance * distance);

        distances.push(distance);
        forces.push(force);
    }


    // Calculate force at starting distance

    const startingForce =
        (G * mass1 * mass2) /
        (startDistance * startDistance);


    // Display results

    document.getElementById("resultMass1").textContent =
        mass1.toLocaleString() + " kg";

    document.getElementById("resultMass2").textContent =
        mass2.toLocaleString() + " kg";

    document.getElementById("resultStart").textContent =
        startDistance.toLocaleString() + " m";

    document.getElementById("resultEnd").textContent =
        endDistance.toLocaleString() + " m";

    document.getElementById("resultForce").textContent =
        formatScientific(startingForce) + " N";


    results.style.display = "block";


    // Create the Plotly graph

    const graphData = [
        {
            x: distances,
            y: forces,
            type: "scatter",
            mode: "lines",
            name: "Gravitational Force"
        }
    ];


    const graphLayout = {

        title: {
            text: "Newton's Law of Universal Gravitation"
        },

        xaxis: {
            title: {
                text: "Distance (m)"
            }
        },

        yaxis: {
            title: {
                text: "Gravitational Force (N)"
            },
            exponentformat: "e"
        },

        margin: {
            t: 60,
            r: 30,
            b: 70,
            l: 80
        },

        hovermode: "x unified"
    };


    const graphConfig = {
        responsive: true,
        displaylogo: false
    };


    Plotly.newPlot(
        "gravityPlot",
        graphData,
        graphLayout,
        graphConfig
    );

});


function formatScientific(number) {

    return number.toExponential(4);
}


function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    results.style.display = "none";
}

