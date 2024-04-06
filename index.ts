import SlotGame from "./slotengine";
import dataset from "./dataset";

const slot = new SlotGame();

const results = slot.multipleSpins(30);

function doAnimationRoll(currentSymbols: number[][], callback: Function) {
    const animationDuration = 200; 
    const framesPerStep = 5; 
    const symbolsCount = currentSymbols.length;

    let frameIndex = 0;

    const interval = setInterval(() => {
        console.clear();
        const rolledSymbols = currentSymbols.map((row, rowIndex) => {
            const frameOffset = (frameIndex + rowIndex) % symbolsCount;
            return row.map((symbol, columnIndex) => {
                const nextSymbolIndex = (symbol + frameOffset) % symbolsCount;
                return currentSymbols[nextSymbolIndex][columnIndex];
            });
        });
        slot.printSymbols(rolledSymbols);
        frameIndex++;
        if (frameIndex >= framesPerStep) {
            clearInterval(interval);
            callback(); 
        }
    }, animationDuration / framesPerStep);
}

let currentIndex = 0;

function displayGameInfo() {
    console.clear();
    const currentResult = results[currentIndex];
    console.log("====================================================");
    console.log("Slot Reel:");
    slot.printSymbols(currentResult.SymbolsShownOnScreen);
    console.log("====================================================");
    console.log("Results from game id #" + currentIndex);
    console.log("Reels Position:");
    console.log(currentResult.ReelsPosition);
    console.log("Symbols on Screen:");
    console.log(currentResult.SymbolsShownOnScreen);
    console.log("Lines Payout:");
    console.log(currentResult.PayoutLines);
    console.log("Payout breakdown:");
    for(let i = 0; i < currentResult.PayoutLines.length; i++) {
        let currentLineReward = currentResult.PayoutLines[i];
        console.log(`- Line #${i+1}: $${currentLineReward}`);
    }
    console.log(`Total win from all lines: $${currentResult.TotalWin}`);
    currentIndex++;
    if (currentIndex < results.length) {
        setTimeout(() => {
            doAnimationRoll(results[currentIndex].SymbolsShownOnScreen, displayGameInfo);
        }, 1000);
    } else {
        setTimeout(displayAllGamesInfo, 1000);
    }
}

function displayAllGamesInfo() {
    console.clear();
    let totalWinAmount = 0;
    for(let i = 0; i < results.length; i++) {
        let currentResult = results[i];
        let currIdx = i;
        console.log("====================================================");
        console.log("Slot Roll:");
        slot.printSymbols(currentResult.SymbolsShownOnScreen);
        console.log("====================================================");
        console.log("Results from game id #" + currIdx);
        console.log("Reels Position:");
        console.log(currentResult.ReelsPosition);
        console.log("Symbols on Screen:");
        console.log(currentResult.SymbolsShownOnScreen);
        console.log("Lines Payout:");
        console.log(currentResult.PayoutLines);
        console.log("Payout breakdown:");
        for(let i = 0; i < currentResult.PayoutLines.length; i++) {
            let currentLineReward = currentResult.PayoutLines[i];
            console.log(`- Line #${i+1}: $${currentLineReward}`);
        }
        console.log(`Total win from all lines: $${currentResult.TotalWin}`);
        totalWinAmount += currentResult.TotalWin;
    }
    console.log("====================================================");
    console.log("              Slot Game Configuration               ");
    console.log(`   Rows: ${dataset.rowsCount}                       `);
    console.log(`   Reels: ${dataset.reelsCount}                     `);
    console.log(`   Payout Lines: ${dataset.lines.length}            `);
    console.log("               Games breakdown                      ");
    console.log(`   Total games: ${results.length}                   `);
    console.log(`   Total win: $${totalWinAmount}                   `);
    console.log("====================================================");

}

doAnimationRoll(results[currentIndex].SymbolsShownOnScreen, displayGameInfo);
