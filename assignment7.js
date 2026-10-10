
// Assignment 7 - Drag and Drop

const suits = [
    { name: "Spades", symbol: "♠" },
    { name: "Hearts", symbol: "♥" },
    { name: "Diamonds", symbol: "♦" },
    { name: "Clubs", symbol: "♣" }
];

const ranks = [
    { name: "Ace", value: "A" },
    { name: "2", value: "2" },
    { name: "3", value: "3" },
    { name: "4", value: "4" },
    { name: "5", value: "5" },
    { name: "6", value: "6" },
    { name: "7", value: "7" },
    { name: "8", value: "8" },
    { name: "9", value: "9" },
    { name: "10", value: "10" },
    { name: "Jack", value: "J" },
    { name: "Queen", value: "Q" },
    { name: "King", value: "K" }
];

const dealButton = document.getElementById("dealButton");
const drawButton = document.getElementById("drawButton");
const playerHand = document.getElementById("playerHand");
const discardPile = document.getElementById("discardPile");
const gameMessage = document.getElementById("gameMessage");
const discardPlaceholder = document.getElementById("discardPlaceholder");

let deck = [];
let handStarted = false;

// Create all 52 cards.
function createDeck() {
    deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                name: rank.name + " of " + suit.name,
                value: rank.value,
                suit: suit.name,
                symbol: suit.symbol
            });
        }
    }
}

// Shuffle the deck.
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Create a visual playing card.
function createCard(card) {
    const cardElement = document.createElement("div");

    cardElement.classList.add("playing-card");

    if (card.suit === "Hearts" || card.suit === "Diamonds") {
        cardElement.classList.add("red-card");
    } else {
        cardElement.classList.add("black-card");
    }

    cardElement.draggable = true;
    cardElement.dataset.cardName = card.name;

    cardElement.setAttribute("role", "img");
    cardElement.setAttribute(
        "aria-label",
        card.name + ". Drag to the discard pile to discard."
    );

    cardElement.innerHTML = `
        <span class="card-corner">
            <span>${card.value}</span>
            <span>${card.symbol}</span>
        </span>

        <span class="card-center">${card.symbol}</span>

        <span class="card-corner card-corner-bottom">
            <span>${card.value}</span>
            <span>${card.symbol}</span>
        </span>
    `;

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
        drawButton.disabled = true;
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

// Deal a new hand of five cards.
function dealNewHand() {
    createDeck();
    shuffleDeck();

    playerHand.innerHTML = "";
    discardPile.innerHTML = "";

    discardPlaceholder.style.display = "block";
    discardPile.appendChild(discardPlaceholder);

    handStarted = true;

    // Deal the first five cards.
    for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        playerHand.appendChild(createCard(card));
    }

    gameMessage.textContent =
        "New hand dealt! Drag cards to the discard pile or draw one card.";

    updateDrawButton();
}

// Enable drawing only when a hand is active and cards remain.
function updateDrawButton() {
    drawButton.disabled = !handStarted || deck.length === 0;

    if (deck.length === 0 && handStarted) {
        drawButton.textContent = "Deck Empty";
    } else {
        drawButton.textContent = "Draw 1 Card";
    }
}

// Accept dragged cards over the discard pile.
discardPile.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    discardPile.classList.add("drag-over");
});

// Remove the highlight when the card leaves the pile.
discardPile.addEventListener("dragleave", function (event) {
    if (!discardPile.contains(event.relatedTarget)) {
        discardPile.classList.remove("drag-over");
    }
});

// Discard a card when dropped onto the discard pile.
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

    // Ignore cards that are not in the player's hand.
    if (!selectedCard) {
        return;
    }

    selectedCard.remove();

    
// Preserve the card's complete visual design in the discard pile.
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
