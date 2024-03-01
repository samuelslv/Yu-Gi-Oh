const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points"),
    },
    cardSprite: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-image"),
        type: document.getElementById("card-image"),
    },
    fieldCards: {
        player: document.getElementById("player-field-cards"),
        computer: document.getElementById("computer-field-cards"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel"),
    }

};

const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}+"dragon.png`,
        WinOf: [1],
        LoseTo: [2],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseTo: [1],
    },
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}magican.png`,
        WinOf: [1],
        LoseTo: [2],
    },
]

const players = {
    player1: "player-cards"
}

async function getRadomCardId() {
    const randomIndex = Math.floor(Math.random() * (cardData.length - 1));
    return cardData[randomIndex].id;
}

async function hiddenCardsDetails(){
    state.cardSprite.avatar.src = "";
    state.cardSprite.name.innerText = "";
    state.cardSprite.type.innerText = "";
}

async function setCardsField(cardId) {
    await removeAllCardsImage();

    let computerCardId = await getRadomCardId();

    state.fieldCards.player.display = "block";
    state.fieldCards.computer.display = "block";

    await hiddenCardsDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";

}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function removeAllCardsImage() {
    let cards = state.playerSides.computerBOX;
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.player1BOX;
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}
async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(randomIdCard);
        });

        cardImage.addEventListener("click", () => {
            selectCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function playAudio(status) {
    const audio = new Audio(`.src/assets/audios/${status}.wav`);
    audio.play();
}

async function resetDuel() {
    state.cardSprite.avatar.src = "";
    state.actions.button.style.direction = "none";
    state.fieldCards.computer.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if (playerCard.LoseTo.includes(computerCardId)) {
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRadomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }

}

async function drawSelectedCard(index) {
    state.cardSprite.avatar.src = cardData[index].img;
    state.cardSprite.name.innerText = cardData[index].name;
    state.cardSprite.type.innerText = "Attribute: " + cardData[index].type;
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";


    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();