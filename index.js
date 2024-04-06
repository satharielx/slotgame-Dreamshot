"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slotengine_1 = require("./slotengine");
var dataset_1 = require("./dataset");
var slot = new slotengine_1.default();
var results = slot.multipleSpins(30);
function doAnimationRoll(currentSymbols, callback) {
    var animationDuration = 200;
    var framesPerStep = 5;
    var symbolsCount = currentSymbols.length;
    var frameIndex = 0;
    var interval = setInterval(function () {
        console.clear();
        var rolledSymbols = currentSymbols.map(function (row, rowIndex) {
            var frameOffset = (frameIndex + rowIndex) % symbolsCount;
            return row.map(function (symbol, columnIndex) {
                var nextSymbolIndex = (symbol + frameOffset) % symbolsCount;
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
var currentIndex = 0;
function displayGameInfo() {
    console.clear();
    var currentResult = results[currentIndex];
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
    for (var i = 0; i < currentResult.PayoutLines.length; i++) {
        var currentLineReward = currentResult.PayoutLines[i];
        console.log("- Line #".concat(i + 1, ": $").concat(currentLineReward));
    }
    console.log("Total win from all lines: $".concat(currentResult.TotalWin));
    currentIndex++;
    if (currentIndex < results.length) {
        setTimeout(function () {
            doAnimationRoll(results[currentIndex].SymbolsShownOnScreen, displayGameInfo);
        }, 1000);
    }
    else {
        setTimeout(displayAllGamesInfo, 1000);
    }
}
function displayAllGamesInfo() {
    console.clear();
    var totalWinAmount = 0;
    for (var i = 0; i < results.length; i++) {
        var currentResult = results[i];
        var currIdx = i;
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
        for (var i_1 = 0; i_1 < currentResult.PayoutLines.length; i_1++) {
            var currentLineReward = currentResult.PayoutLines[i_1];
            console.log("- Line #".concat(i_1 + 1, ": $").concat(currentLineReward));
        }
        console.log("Total win from all lines: $".concat(currentResult.TotalWin));
        totalWinAmount += currentResult.TotalWin;
    }
    console.log("====================================================");
    console.log("              Slot Game Configuration               ");
    console.log("   Rows: ".concat(dataset_1.default.rowsCount, "                       "));
    console.log("   Reels: ".concat(dataset_1.default.reelsCount, "                     "));
    console.log("   Payout Lines: ".concat(dataset_1.default.lines.length, "            "));
    console.log("               Games breakdown                      ");
    console.log("   Total games: ".concat(results.length, "                   "));
    console.log("   Total win: $".concat(totalWinAmount, "                   "));
    console.log("====================================================");
}
doAnimationRoll(results[currentIndex].SymbolsShownOnScreen, displayGameInfo);
