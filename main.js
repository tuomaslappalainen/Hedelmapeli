

const symbols = ['kuvat/apple.jpg', 'kuvat/cherry.png', 'kuvat/melon.png', 'kuvat/numberer7.jpg', 'kuvat/pear.png'];
const payouts = {
    'kuvat/numberer7.jpg': 10,
    'kuvat/apple.jpg': 6,
    'kuvat/melon.png': 5,
    'kuvat/pear.png': 4,
    'kuvat/cherry.png': 3,
};

let lockUsed = false

const reels = document.querySelectorAll('.reel');
let lockedReels = [];

function lock(i) {
    if (!lockedReels.includes(reels[i])) {
        lockedReels.push(reels[i])
        reels[i].style.filter="brightness(50%)";
        
    } else if (lockedReels.includes(reels[i])) {
        lockedReels.splice(lockedReels.indexOf(reels[i]), 1)
        reels[i].style.filter="brightness(100%)";
    }
    console.log(lockedReels.includes(reels[i]))
}

let money = 100;

document.getElementById('spinButton').addEventListener('click', spin);

function spin() {
    if(lockedReels.length > 0 ) {
        lockUsed = true
    } else {
        lockUsed = false
    }
    const bet = parseInt(document.getElementById('bet').value);

    if (bet > money) {
        alert('Panos on suurempi kuin käytössä oleva raha');
        return;
    }

    money -= bet;
    updateMoney();

    console.log(reels)
    let result = [];

    for (let i = 0; i < reels.length; i++) {
        if (!lockedReels.includes(reels[i])) {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reels[i].src = randomSymbol
        }
    }

    reels.forEach(reel => {
        const xd = reel.src.split('5500/')
        result.push(xd[1]);
    })

    const winAmount = calculateWin(result, bet);
    console.log('win: ' + winAmount)
    money += winAmount;
    updateMoney();

    if (winAmount > 0) {
        document.getElementById('output').textContent = `Voitit ${winAmount} euroa!`;
    } else {
        document.getElementById('output').textContent = 'Ei voittoa tällä kertaa';
    }

    if(lockUsed) {
        reels.forEach(reel => reel.disabled = true)
        lockedReels = []
    } else {
        reels.forEach(reel => reel.disabled = false)
    }

}

function calculateWin(result, bet) {
    let counts = {};
    result.forEach(symbol => {
        counts[symbol] = (counts[symbol] || 0) + 1;
    });

    let winAmount = 0;

    for (let symbol in counts) {
        if (counts[symbol] === 4 && !symbol.includes('numberer7')) {
            winAmount += payouts[symbol] * bet;
        }
        if (counts[symbol] === 3 && symbol.includes('numberer7')) {
            winAmount += payouts[symbol] * bet;
        }
    }

    return winAmount;
}

function updateMoney() {
    document.getElementById('money').textContent = money;
}