"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_1 = require("./dataset");
var SlotGame = /** @class */ (function () {
    function SlotGame() {
        this.reelsCount = dataset_1.default.reelsCount;
        this.rowsCount = dataset_1.default.rowsCount;
        this.symbolsTable = dataset_1.default.symbols;
        this.lines = dataset_1.default.lines;
        this.reels = dataset_1.default.reels;
    }
    SlotGame.prototype.generateReels = function () {
        var _this = this;
        return this.reels.map(function (column) { return column.slice(0, _this.rowsCount); });
    };
    SlotGame.prototype.calculateSymbolsOnScreen = function (reelsPos) {
        var symbolsOnScreen = [];
        for (var i = 0; i < this.rowsCount; i++) {
            var currentRow = [];
            for (var j = 0; j < this.reelsCount; j++) {
                currentRow.push(reelsPos[j] ? reelsPos[j][i] : 0);
            }
            symbolsOnScreen.push(currentRow);
        }
        return symbolsOnScreen;
    };
    SlotGame.prototype.calculatePayout = function (symbolsOnScreen) {
        var linesPayout = [];
        for (var i = 0; i < this.lines.length; i++) {
            linesPayout.push(0);
        }
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var symbol = symbolsOnScreen[line[0]][0];
            var count = 1;
            for (var j = 1; j < line.length; j++) {
                if (symbolsOnScreen[line[j]][j] === symbol || symbolsOnScreen[line[j]][j] === 0) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (this.symbolsTable[symbol][count - 1] !== undefined) {
                linesPayout[i] = this.symbolsTable[symbol][count - 1];
            }
        }
        return linesPayout;
    };
    SlotGame.prototype.spin = function () {
        console.clear();
        var reelShifts = [];
        for (var i = 0; i < this.reelsCount; i++) {
            reelShifts.push(Math.floor(Math.random() * this.rowsCount));
        }
        var ReelsPosition = this.generateReels().map(function (reel, index) {
            var shift = reelShifts[index];
            return reel.slice(shift).concat(reel.slice(0, shift));
        });
        var SymbolsShownOnScreen = this.calculateSymbolsOnScreen(ReelsPosition);
        var PayoutLines = this.calculatePayout(SymbolsShownOnScreen);
        var TotalWin = PayoutLines.reduce(function (acc, payout) { return acc + payout; }, 0);
        var result = {
            ReelsPosition: ReelsPosition,
            SymbolsShownOnScreen: SymbolsShownOnScreen,
            PayoutLines: PayoutLines,
            TotalWin: TotalWin
        };
        return result;
    };
    SlotGame.prototype.multipleSpins = function (times) {
        var results = [];
        for (var i = 0; i < times; i++) {
            var result = this.spin();
            results.push(result);
        }
        return results;
    };
    SlotGame.prototype.printSymbols = function (symbols) {
        for (var i = 0; i < symbols.length; i++) {
            var row = symbols[i];
            var rowString = "";
            for (var j = 0; j < row.length; j++) {
                var symbol = symbols[i][j];
                rowString += "".concat(symbol, " | ");
            }
            console.log(rowString);
        }
    };
    return SlotGame;
}());
exports.default = SlotGame;
