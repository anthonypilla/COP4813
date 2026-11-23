
// Computer Crisis - Save the Computer!

// Game settings.
const totalRounds = 5;
const pointsPerCorrectAnswer = 100;
const pointsPerIncorrectAnswer = 25;

const healthPerCorrectAnswer = 5;
const healthLostPerIncorrectAnswer = 20;

// Game state.
let currentRound = 0;
let score = 0;
let correctAnswers = 0;
let health = 100;
let answered = false;

// Computer repair challenges.
const repairChallenges = [
    {
        title: "Challenge 1: Computer Won't Turn On",
        description:
            "A customer brings in a desktop computer that will not power on. You need to identify the most likely cause.",
        symptoms:
            "The computer shows no lights, makes no noise, and the fans do not spin when the power button is pressed.",
        answers: [
            "The power cable is disconnected.",
            "The computer has too many background programs.",
            "The hard drive is almost full.",
            "The computer needs a software update."
        ],
        correctAnswer: 0,
        explanation:
            "Correct! A disconnected power cable can prevent electricity from reaching the computer. Always check the power connection first."
    },
    {
        title: "Challenge 2: Computer Running Slowly",
        description:
            "A customer complains that their computer has become extremely slow, especially when multiple programs are open.",
        symptoms:
            "Programs take a long time to open, switching between applications is slow, and the computer frequently freezes.",
        answers: [
            "The monitor brightness is too low.",
            "The computer may not have enough RAM for the programs being used.",
            "The speakers are disconnected.",
            "The computer's keyboard needs replacing."
        ],
        correctAnswer: 1,
        explanation:
            "Correct! RAM temporarily stores information that active programs need. Insufficient RAM can cause slow performance when several programs are running."
    },
    {
        title: "Challenge 3: No Internet Connection",
        description:
            "A customer reports that their computer cannot access the internet, even though other devices in the building are connected.",
        symptoms:
            "The computer displays a disconnected network status. The Ethernet cable is plugged into the computer but is loose at the router.",
        answers: [
            "Replace the computer's RAM.",
            "Reinstall the operating system.",
            "Securely reconnect the Ethernet cable.",
            "Replace the computer monitor."
        ],
        correctAnswer: 2,
        explanation:
            "Correct! A loose Ethernet connection can interrupt the network connection. Check the cable at both ends before attempting more complicated repairs."
    },
    {
        title: "Challenge 4: Computer Overheating",
        description:
            "A customer says their computer becomes very hot and sometimes shuts itself down while running demanding programs.",
        symptoms:
            "The computer's fans are covered in dust, airflow is restricted, and the system temperature is unusually high.",
        answers: [
            "Clean the dust from the cooling fans and improve airflow.",
            "Increase the screen resolution.",
            "Delete old documents.",
            "Change the desktop wallpaper."
        ],
        correctAnswer: 0,
        explanation:
            "Correct! Dust buildup and restricted airflow can prevent proper cooling. Cleaning the fans and ensuring proper ventilation can help prevent overheating."
    },
    {
        title: "Challenge 5: Possible Malware Infection",
        description:
            "A customer notices strange pop-ups, unfamiliar programs, and unexpected browser behavior on their computer.",
        symptoms:
            "The computer recently downloaded a suspicious file from an unfamiliar website. Antivirus protection has detected a potential threat.",
        answers: [
            "Increase the screen brightness.",
            "Disconnect the speakers.",
            "Ignore the warning and continue using the computer.",
            "Run a trusted antivirus scan and quarantine detected threats."
        ],
        correctAnswer: 3,
        explanation:
            "Correct! A trusted antivirus scan can identify malicious software and quarantine threats to help protect the computer and its data."
    }
];


// Get HTML elements.
const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const resultsScreen = document.getElementById("resultsScreen");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");

const roundDisplay = document.getElementById("roundDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const statusMessage = document.getElementById("statusMessage");

const healthDisplay = document.getElementById("healthDisplay");
const healthProgress = document.getElementById("healthProgress");
const healthFill = document.getElementById("healthFill");

const problemTitle = document.getElementById("problemTitle");
const problemDescription = document.getElementById("problemDescription");
const problemSymptoms = document.getElementById("problemSymptoms");

const answerChoices = document.getElementById("answerChoices");
const feedbackMessage = document.getElementById("feedbackMessage");

const finalMessage = document.getElementById("finalMessage");
const finalScore = document.getElementById("finalScore");
const correctAnswersDisplay = document.getElementById("correctAnswers");
const accuracyDisplay = document.getElementById("accuracyDisplay");


// Update the computer health display.
function updateHealthDisplay() {
    healthDisplay.textContent = `${health}%`;
    healthFill.style.width = `${health}%`;

    healthProgress.setAttribute("aria-valuenow", health);

    // Change the health bar color based on remaining health.
    if (health <= 30) {
        healthFill.className = "health-fill critical-health";
    } else if (health <= 60) {
        healthFill.className = "health-fill warning-health";
    } else {
        healthFill.className = "health-fill";
    }
}


// Start or restart the game.
function startGame() {
    currentRound = 0;
    score = 0;
    correctAnswers = 0;
    health = 100;
    answered = false;

    scoreDisplay.textContent = score;
    roundDisplay.textContent = `0 / ${totalRounds}`;

    updateHealthDisplay();

    startScreen.hidden = true;
    resultsScreen.hidden = true;
    questionScreen.hidden = false;

    statusMessage.textContent = "Diagnostic system active.";

    displayChallenge();
}


// Display the current repair challenge.
function displayChallenge() {
    answered = false;

    const challenge = repairChallenges[currentRound];

    roundDisplay.textContent =
        `${currentRound + 1} / ${totalRounds}`;

    problemTitle.textContent = challenge.title;
    problemDescription.textContent = challenge.description;
    problemSymptoms.textContent = challenge.symptoms;

    feedbackMessage.textContent = "";
    feedbackMessage.className = "";

    nextButton.hidden = true;

    answerChoices.innerHTML = "";

    challenge.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = answer;

        button.addEventListener("click", function () {
            checkAnswer(index);
        });

        answerChoices.appendChild(button);
    });

    statusMessage.textContent = "Awaiting technician diagnosis...";
}


// Check the selected answer.
function checkAnswer(selectedAnswer) {
    if (answered) {
        return;
    }

    answered = true;

    const challenge = repairChallenges[currentRound];

    const answerButtons =
        answerChoices.querySelectorAll("button");

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedAnswer === challenge.correctAnswer) {
        // Correct repair.
        score += pointsPerCorrectAnswer;
        correctAnswers++;

        health = Math.min(
            100,
            health + healthPerCorrectAnswer
        );

        feedbackMessage.textContent =
            `REPAIR SUCCESSFUL! +${pointsPerCorrectAnswer} points. Computer health restored by ${healthPerCorrectAnswer}%. ${challenge.explanation}`;

        feedbackMessage.className = "correct-feedback";

        statusMessage.textContent = "System repair successful.";

        answerButtons[selectedAnswer].classList.add("correct-answer");

    } else {
        // Incorrect repair.
        score -= pointsPerIncorrectAnswer;

        health = Math.max(
            0,
            health - healthLostPerIncorrectAnswer
        );

        feedbackMessage.textContent =
            `REPAIR FAILED! -${pointsPerIncorrectAnswer} points. Computer health decreased by ${healthLostPerIncorrectAnswer}%. ${challenge.explanation}`;

        feedbackMessage.className = "incorrect-feedback";

        statusMessage.textContent = "Incorrect diagnosis. System health damaged.";

        answerButtons[selectedAnswer].classList.add("incorrect-answer");
        answerButtons[challenge.correctAnswer].classList.add("correct-answer");
    }

    scoreDisplay.textContent = score;

    updateHealthDisplay();

    // Check whether the computer has crashed.
    if (health <= 0) {
        displayResults(true);
        return;
    }

    nextButton.hidden = false;

    if (currentRound === totalRounds - 1) {
        nextButton.textContent = "View Final Results";
    } else {
        nextButton.textContent = "Next Challenge";
    }
}


// Move to the next challenge.
function nextChallenge() {
    if (!answered) {
        return;
    }

    currentRound++;

    if (currentRound < totalRounds) {
        displayChallenge();
    } else {
        displayResults(false);
    }
}


// Display the final game results.
function displayResults(gameOver) {
    questionScreen.hidden = true;
    resultsScreen.hidden = false;

    const accuracy =
        Math.round((correctAnswers / totalRounds) * 100);

    roundDisplay.textContent =
        `${currentRound + 1} / ${totalRounds}`;

    finalScore.textContent = score;

    correctAnswersDisplay.textContent =
        `${correctAnswers} / ${totalRounds}`;

    accuracyDisplay.textContent = `${accuracy}%`;

    if (gameOver) {
        finalMessage.textContent =
            "SYSTEM FAILURE! The computer's health reached 0%. The repair session has ended. Try again and make better repair decisions.";

        statusMessage.textContent = "CRITICAL ERROR: Computer crashed.";

    } else if (correctAnswers === totalRounds) {
        finalMessage.textContent =
            `Outstanding work! You successfully repaired every computer and finished with ${health}% computer health. You're a master technician!`;

        statusMessage.textContent = "All repairs successful.";

    } else if (correctAnswers >= 3) {
        finalMessage.textContent =
            `Good job! You completed all five challenges with ${health}% computer health remaining. Keep practicing your troubleshooting skills.`;

        statusMessage.textContent = "Repair session complete.";

    } else {
        finalMessage.textContent =
            `The repair shop needs more practice! You finished with ${health}% computer health remaining. Review the troubleshooting explanations and try again.`;

        statusMessage.textContent = "Repair session complete.";
    }
}


// Button event listeners.
startButton.addEventListener("click", startGame);

nextButton.addEventListener("click", nextChallenge);

restartButton.addEventListener("click", startGame);
