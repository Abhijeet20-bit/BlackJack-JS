let blackjack = {
    'you': {'scoreSpan':'#your-score', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan':'#dealer-score', 'div': '#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K', 'A'],
    'cardMap': {'2': 2, '3': 3, '4': 4, '5': 5 , '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1,11]},
    'wins': 0,
    'loss': 0,
    'draws': 0,
    'isStand': false,
    'turnover': false,
};

const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];

const hitsound = new Audio('static/sounds/swish.m4a');
const winsound = new Audio('static/sounds/cash.mp3');
const losesound = new Audio('static/sounds/aww.mp3');

//selection id hit-button eventlistener says on click call function blackjackhit
document.querySelector('#hit-button').addEventListener('click',blackjackhit);

document.querySelector('#stand-button').addEventListener('click',dealerLogic);

document.querySelector('#deal-button').addEventListener('click',blackjackdeal);

function blackjackhit() {
    if(blackjack['isStand']===false) {
        let card = randomCard();
        ScoreCal(card,YOU);
        Showcard(YOU,card);
        ShowScore(YOU);
    }
    //Showcard(DEALER);
}

function randomCard() {
    let index = Math.floor((Math.random()*13));
    return blackjack['cards'][index];
}

function Showcard(player,card) {
    if(player['score']<=21) {
        let createimg = document.createElement('img');
        createimg.src = `static/images/${card}_.png`;
        document.querySelector(player['div']).appendChild(createimg);
        hitsound.play();
    }
}

function ScoreCal(card,player) {
    if(card==='A') {
        if(player['score']+blackjack['cardMap'][card][1]<=21) {
            player['score']+=blackjack['cardMap'][card][1];
        } else {
            player['score']+=blackjack['cardMap'][card][0];
        }
    } else {
        let points = blackjack['cardMap'][card];
        player['score']+=points;
    }
}

function ShowScore(player) {
    if(player['score']<=21) {
        document.querySelector(player['scoreSpan']).textContent = player['score'];
    } else {
        document.querySelector(player['scoreSpan']).textContent = 'BUST!!!';
        document.querySelector(player['scoreSpan']).style.color = 'red';
    }
}

function blackjackdeal() {
    // showResult(computeWinner());
    if(blackjack['turnover']===true) {
        blackjack['isStand']=false;
        let yourBoxImg = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerBoxImg = document.querySelector(DEALER['div']).querySelectorAll('img');

        for(let i=0;i<yourBoxImg.length;i++) {
            yourBoxImg[i].remove();
        }
        for(let i=0;i<dealerBoxImg.length;i++) {
            dealerBoxImg[i].remove();
        }
        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector(YOU['scoreSpan']).textContent = '0';
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).textContent = '0';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector("#blackjack-result").textContent = "Let's Play";
        document.querySelector("#blackjack-result").style.color = "black";
        blackjack['turnover']=false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic() {
    blackjack['isStand']=true;
    while(DEALER['score']<16 && blackjack['isStand']===true) {
        let card = randomCard();
        ScoreCal(card,DEALER);
        Showcard(DEALER,card);
        ShowScore(DEALER);
        await sleep(1000);
    }
    blackjack['turnover']=true;
    let winner =computeWinner();
    showResult(winner);
}

function computeWinner() {
    let winner;
    if(YOU['score']<=21) {
        if(YOU['score'] > DEALER['score'] || DEALER['score']>21) {
            winner = YOU;
            blackjack['wins']++;
        } else if(YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjack['loss']++;
        } else if(YOU['score']===DEALER['score']) {
            blackjack['draws']++;
        }
    } else if(YOU['score']>21 && DEALER['score'] <=21) {
        winner = DEALER;
        blackjack['loss']++;
    } else if(YOU['score']>21 && DEALER['score']>21) {
        console.log("drew");
        blackjack['draws']++;
    }

    console.log("winner is ", winner);
    return winner;
}

function showResult(winner) {
    let message,messageColor;
        if(blackjack['turnover']===true) {
        if(winner===YOU) {
            message="You Won!";
            messageColor="green";
            winsound.play();
        } else if(winner===DEALER) {
            message="You Lost!";
            messageColor="red";
            losesound.play();
        } else {
            message="Draw!";
            messageColor = "black";
        }
        document.querySelector("#blackjack-result").textContent = message;
        document.querySelector("#blackjack-result").style.color = messageColor;
        document.querySelector("#wins").textContent = blackjack['wins'];
        document.querySelector("#loss").textContent = blackjack['loss'];
        document.querySelector("#draws").textContent = blackjack['draws'];
    }
}