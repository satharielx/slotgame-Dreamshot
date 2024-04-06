import dataset from './dataset';

/**
 * Represents the result of a slot game spin.
 */
interface GameResult {
    /** The positions of reels after spinning. */
    ReelsPosition: number[][];
    /** The symbols shown on the screen after spinning. */
    SymbolsShownOnScreen: number[][];
    /** Payouts for each payout line. */
    PayoutLines: number[];
    /** Total winnings from the spin. */
    TotalWin: number;
}

/**
 * Class representing a slot game.
 */
export default class SlotGame {
    private reelsCount: number;
    private rowsCount: number;
    private symbolsTable: { [key: number]: number[] };
    private lines: number[][];
    private reels: number[][];

    /**
     * Constructs a new SlotGame instance.
     */
    constructor() {
        // Initialize game parameters from dataset
        this.reelsCount = dataset.reelsCount;
        this.rowsCount = dataset.rowsCount;
        this.symbolsTable = dataset.symbols;
        this.lines = dataset.lines;
        this.reels = dataset.reels;
    }

    /**
     * Generates reels based on the dataset.
     * @private
     * @returns {number[][]} The generated reels.
     */
    private generateReels(): number[][] {
        return this.reels.map(column => column.slice(0, this.rowsCount));
    }

    /**
     * Calculates symbols shown on the screen based on reel positions.
     * @private
     * @param {number[][]} reelsPos - Positions of the reels.
     * @returns {number[][]} Symbols shown on the screen.
     */
    private calculateSymbolsOnScreen(reelsPos: number[][]): number[][] {
        const symbolsOnScreen: number[][] = [];
        for (let i = 0; i < this.rowsCount; i++) {
            const currentRow: number[] = [];
            for (let j = 0; j < this.reelsCount; j++) {
                currentRow.push(reelsPos[j] ? reelsPos[j][i] : 0); 
            }
            symbolsOnScreen.push(currentRow);
        }
        return symbolsOnScreen;
    }
    
    /**
     * Calculates payout lines based on symbols shown on the screen.
     * @private
     * @param {number[][]} symbolsOnScreen - Symbols shown on the screen.
     * @returns {number[]} Payout lines.
     */
    private calculatePayout(symbolsOnScreen: number[][]): number[] {
        const linesPayout: number[] = [];
        for (let i = 0; i < this.lines.length; i++) {
            linesPayout.push(0);
        }
        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            let symbol = symbolsOnScreen[line[0]][0];
            let count = 1;
            for (let j = 1; j < line.length; j++) {
                if (symbolsOnScreen[line[j]][j] === symbol || symbolsOnScreen[line[j]][j] === 0) {
                    count++;
                } else {
                    break;
                }
            }
            if (this.symbolsTable[symbol][count - 1] !== undefined) {
                linesPayout[i] = this.symbolsTable[symbol][count - 1];
            }
        }
        return linesPayout;
    }

    /**
     * Simulates spinning the slot reels and returns the game result.
     * @returns {GameResult} The result of the spin.
     */
    spin(): GameResult {
        console.clear();

        const reelShifts: number[] = [];
        for (let i = 0; i < this.reelsCount; i++) {
            reelShifts.push(Math.floor(Math.random() * this.rowsCount));
        }

        const ReelsPosition = this.generateReels().map((reel, index) => {
            const shift = reelShifts[index];
            return reel.slice(shift).concat(reel.slice(0, shift));
        });
        
        const SymbolsShownOnScreen = this.calculateSymbolsOnScreen(ReelsPosition);
        const PayoutLines = this.calculatePayout(SymbolsShownOnScreen);
        const TotalWin = PayoutLines.reduce((acc, payout) => acc + payout, 0);

        const result: GameResult = {
            ReelsPosition,
            SymbolsShownOnScreen,
            PayoutLines,
            TotalWin
        };

        return result;
    }
    
    /**
     * Performs multiple spins and returns an array of game results.
     * @param {number} times - Number of spins to perform.
     * @returns {GameResult[]} Array of game results.
     */
    multipleSpins(times: number): GameResult[] {
        let results: GameResult[] = [];
        for (let i = 0; i < times; i++) {
            let result = this.spin();
            results.push(result);
        }
        return results;
    }

    /**
     * Prints the symbols shown on the screen.
     * @param {number[][]} symbols - Symbols to print.
     */
    printSymbols(symbols: number[][]) {
        for (let i = 0; i < symbols.length; i++) {
            let row = symbols[i];
            let rowString = "";
            for (let j = 0; j < row.length; j++) {
                let symbol = symbols[i][j];
                rowString += `${symbol} | `;
            }
            console.log(rowString);
        }
    }
}
