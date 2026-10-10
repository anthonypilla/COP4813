
 // Assignment 7 - Drag and Drop with Playing Card Images

const suits = ["clubs", "diamonds", "hearts", "spades"];

const ranks = [
    { name: "Ace", file: "ace" },
    { name: "2", file: "2" },
    { name: "3", file: "3" },
    { name: "4", file: "4" },
    { name: "5", file: "5" },
    { name: "6", file: "6" },
    { name: "7", file: "7" },
    { name: "8", file: "8" },
    { name: "9", file: "9" },
    { name: "10", file: "10" },
    { name: "Jack", file: "jack" },
    { name: "Queen", file: "queen" },
    { name: "King", file: "king" }
];

const dealButton = document.getElementById("dealButton");
const drawButton = document.getElementById("drawButton");
const playerHand = document.getElementById("playerHand");
const discardPile = document.getElementById("discardPile");
const gameMessage = document.getElementById("gameMessage");
const discardPlaceholder = document.getElementById("discardPlaceholder");

let deck = [];
let handStarted = false;

// Create a standard 52-card deck.
function createDeck() {
    deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                name: rank.name + " of " +
                    suit.charAt(0).toUpperCase() + suit.slice(1),
                image: "PNG-cards-1.3/" +
                    rank.file + "_of_" + suit + ".png"
            });
        }
    }
}

// Shuffle the deck so cards are dealt randomly.
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Create a playing card using its actual image file.
function createCard(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("playing-card");
    cardElement.draggable = true;
    cardElement.dataset.cardName = card.name;

    const cardImage = document.createElement("img");
    cardImage.src = card.image;
    cardImage.alt = card.name;
    cardImage.draggable = false;

    cardElement.appendChild(cardImage);

    cardElement.setAttribute(
        "aria-label",
        card.name + ". Drag to the discard pile to discard."
    );

    cardElement.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", card.name);
        event.dataTransfer.effectAllowed = "move";
        cardElement.classList.add("dragging");
    });

    cardElement.addEventListener("dragend", function () {
        cardElement.classList.remove("dragging");
    });

    return cardElement;
}

// Draw one card from the remaining deck.
function drawOneCard() {
    if (!handStarted) {
        gameMessage.textContent =
            "Click Deal New Hand before drawing cards.";
        return;
    }

    if (deck.length === 0) {
        updateDrawButton();
        gameMessage.textContent =
            "The deck is empty! Deal a new hand to start again.";
        return;
    }

    const card = deck.pop();
    playerHand.appendChild(createCard(card));

    gameMessage.textContent =
        card.name + " drawn successfully! " +
        deck.length + " cards remain in the deck.";

    updateDrawButton();
}

// Deal five cards from a newly shuffled deck.
function dealNewHand() {
    createDeck();
    shuffleDeck();

    playerHand.innerHTML = "";
    discardPile.innerHTML = "";

    discardPlaceholder.style.display = "block";
    discardPile.appendChild(discardPlaceholder);

    handStarted = true;

    for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        playerHand.appendChild(createCard(card));
    }

    gameMessage.textContent =
        "New hand dealt! Drag cards to the discard pile or draw one card.";

    updateDrawButton();
}

// Enable or disable the draw button as needed.
function updateDrawButton() {
    drawButton.disabled = !handStarted || deck.length === 0;

    if (deck.length === 0 && handStarted) {
        drawButton.textContent = "Deck Empty";
    } else {
        drawButton.textContent = "Draw 1 Card";
    }
}

// Allow cards to be dragged over the discard pile.
discardPile.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    discardPile.classList.add("drag-over");
});

// Remove the highlight when the dragged card leaves.
discardPile.addEventListener("dragleave", function (event) {
    if (!discardPile.contains(event.relatedTarget)) {
        discardPile.classList.remove("drag-over");
    }
});

// Handle the drop event and confirm the discard.
discardPile.addEventListener("drop", function (event) {
    event.preventDefault();
    discardPile.classList.remove("drag-over");

    if (!handStarted) {
        return;
    }

    const cardName = event.dataTransfer.getData("text/plain");

    if (!cardName) {
        return;
    }

    const cards = playerHand.querySelectorAll(".playing-card");
    let selectedCard = null;

    for (const card of cards) {
        if (card.dataset.cardName === cardName) {
            selectedCard = card;
            break;
        }
    }

    // Only accept cards currently in the player's hand.
    if (!selectedCard) {
        return;
    }

    // Remove the card from the player's hand.
    selectedCard.remove();

    // Keep the actual image in the discard pile.
    const discardedCard = selectedCard.cloneNode(true);
    discardedCard.classList.remove("dragging");
    discardedCard.classList.add("discarded-playing-card");
    discardedCard.draggable = false;

    discardedCard.setAttribute(
        "aria-label",
        cardName + ", discarded"
    );

    discardPlaceholder.style.display = "none";
    discardPile.appendChild(discardedCard);

    // Display a visible confirmation of the drop event.
    gameMessage.textContent =
        cardName + " discarded successfully! You can draw a replacement.";

    updateDrawButton();

    if (playerHand.children.length === 0) {
        gameMessage.textContent =
            "Your hand is empty! Draw a card or deal a new hand.";
    }
});

// Connect the buttons to their actions.
dealButton.addEventListener("click", dealNewHand);
drawButton.addEventListener("click", drawOneCard);
