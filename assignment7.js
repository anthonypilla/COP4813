
// Assignment 7 - Drag and Drop
// Create a standard deck of 52 playing cards.

const suits = [
    { name: "Spades", symbol: "♠", letter: "S" },
    { name: "Hearts", symbol: "♥", letter: "H" },
    { name: "Diamonds", symbol: "♦", letter: "D" },
    { name: "Clubs", symbol: "♣", letter: "C" }
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
const playerHand = document.getElementById("playerHand");
const discardPile = document.getElementById("discardPile");
const gameMessage = document.getElementById("gameMessage");
const discardPlaceholder = document.getElementById("discardPlaceholder");

let deck = [];
let discardedCards = [];

// Build the standard 52-card deck.
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

// Randomize the deck using the Fisher-Yates shuffle.
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Create a visual playing card.
function createCard(card, index) {
    const cardElement = document.createElement("div");

    cardElement.classList.add("playing-card");

    if (card.suit === "Hearts" || card.suit === "Diamonds") {
        cardElement.classList.add("red-card");
    } else {
        cardElement.classList.add("black-card");
    }

    cardElement.draggable = true;
    cardElement.dataset.cardName = card.name;
    cardElement.dataset.cardIndex = index;
    cardElement.setAttribute("role", "img");
    cardElement.setAttribute(
        "aria-label",
        card.name + ". Drag to the discard pile to discard."
    );

    cardElement.innerHTML = `
        <span class="card-corner">
            ${card.value}<br>${card.symbol}
        </span>
        <span class="card-center">${card.symbol}</span>
        <span class="card-corner card-corner-bottom">
            ${card.value}<br>${card.symbol}
        </span>
    `;

    // Start dragging a card.
    cardElement.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", card.name);
        event.dataTransfer.effectAllowed = "move";

        cardElement.classList.add("dragging");
    });

    // Remove the dragging appearance when the drag ends.
    cardElement.addEventListener("dragend", function () {
        cardElement.classList.remove("dragging");
    });

    return cardElement;
}

// Deal five cards to the player's hand.
function dealCards() {
    createDeck();
    shuffleDeck();

    playerHand.innerHTML = "";
    discardedCards = [];

    discardPile.innerHTML = "";
    discardPile.appendChild(discardPlaceholder);
    discardPlaceholder.style.display = "block";

    for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        const cardElement = createCard(card, i);

        playerHand.appendChild(cardElement);
    }

    gameMessage.textContent =
        "Five cards dealt! Drag a card into the discard pile to discard it.";
}

// Allow cards to be dropped into the discard pile.
discardPile.addEventListener("dragover", function (event) {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
    discardPile.classList.add("drag-over");
});

// Remove the highlight when the card leaves the discard pile.
discardPile.addEventListener("dragleave", function (event) {
    if (!discardPile.contains(event.relatedTarget)) {
        discardPile.classList.remove("drag-over");
    }
});

// Handle a card dropped into the discard pile.
discardPile.addEventListener("drop", function (event) {
    event.preventDefault();

    discardPile.classList.remove("drag-over");

    const cardName = event.dataTransfer.getData("text/plain");

    if (!cardName) {
        return;
    }

    // Find the card being dragged from the player's hand.
    const cards = playerHand.querySelectorAll(".playing-card");

    let selectedCard = null;

    for (const card of cards) {
        if (card.dataset.cardName === cardName) {
            selectedCard = card;
            break;
        }
    }

    // Ignore the drop if the card is not in the player's hand.
    if (!selectedCard) {
        return;
    }

    // Record the discarded card and remove it from the hand.
    discardedCards.push(cardName);
    selectedCard.remove();

    // Show the discarded card in the discard pile.
    const discardedCard = document.createElement("div");
    discardedCard.classList.add("discarded-card");
    discardedCard.textContent = cardName;
    discardPile.appendChild(discardedCard);

    discardPlaceholder.style.display = "none";

    // Confirm the successful drag-and-drop action.
    gameMessage.textContent =
        cardName + " discarded successfully!";

    // Explain when the player's hand is empty.
    if (playerHand.children.length === 0) {
        gameMessage.textContent =
            "All cards discarded! Click Deal Cards to play again.";
    }
});

// Deal cards when the user clicks the button.
dealButton.addEventListener("click", dealCards);

