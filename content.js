// https://a8r.evo-games.com/frontend/evo/r2/#game=roulette&category=roulette

// API CONFIG
const apiUrl = 'http://localhost:5000/api/message';

let lastMsg = {};

// FUNCTION TO SEND ALART
const sendAlert = async (numbers, title, dozResult) => {
    // send alart
    const msg = `
😈 Confirmed Entry 😈
🏦 Roulette: ${title}
🏦 Lobby: Evolution
⚔️ Strategy: Standard Robin

🔢 ${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]}

💰 Bet on ${dozResult[0]} and ${dozResult[1]} Dozen
❗Protect the 0 with an amount less than the bet ❗

❗❗Make the most 2 galley !
    `;
    const data = {
        message: msg,
        msgID: `confirmed${title}${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}${numbers[5]}${numbers[6]}${numbers[7]}`,
        type: "confirmed",
        tableName: title,
        prompt: [dozResult[0], dozResult[1]],
        numbers: [numbers[0], numbers[1], numbers[2], numbers[3]]
    };
    const jsonData = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: jsonData, // The JSON data to send in the request body
    };

    const res = await fetch(apiUrl, requestOptions)
    return res.json();
}

const sendReadyAlert = async (numbers, title, position) => {
    // send alart
    const msg = `
😈 PENDING CONFIRMATION 😈
🏦 Roulette: ${title}
🏦 Lobby: Evolution
⚔️ Strategy: Standard Robin

🔢 ${numbers[0]}, ${numbers[1]}, ${numbers[2]}    ~${position}~

❗GET READY❗
    `;

    const data = {
        message: msg,
        msgID: `ready${title}${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}${numbers[5]}${numbers[6]}${numbers[7]}`,
        type: "ready"
    };
    const jsonData = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: jsonData, // The JSON data to send in the request body
    };

    const res = await fetch(apiUrl, requestOptions)
    return res.json();
}

const sendWinAlert = async (numbers, title) => {
    const msg = `
😈 THAT'S A WIN !!!! 🎉 😈
🏦 Roulette: ${title}
🏦 Lobby: Evolution
⚔️ Strategy: Standard Robin

That's a win 🔥🔥🔥(${numbers[0]}) ✅✅✅✅
    `;

    const data = {
        message: msg,
        msgID: `win${title}${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}${numbers[5]}${numbers[6]}${numbers[7]}`,
        type: "win",
        tableName: title,
        resultType: "won"
    };
    const jsonData = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: jsonData, // The JSON data to send in the request body
    };

    const res = await fetch(apiUrl, requestOptions)
    return res.json();
}

const sendLossAlert = async (numbers, title) => {
    const msg = `
😈  TOOK A LOSS 😈
🏦 Roulette: ${title}
🏦 Lobby: Evolution
⚔️ Strategy: Standard Robin

❌Took a loss here, onto next❌ (${numbers[0]}, ${numbers[1]})
    `;

    const data = {
        message: msg,
        msgID: `loss${title}${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}${numbers[5]}${numbers[6]}${numbers[7]}`,
        type: "loss",
        tableName: title,
        resultType: "loss"
    };
    const jsonData = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json',
        // Add any other headers if needed
    };
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: jsonData, // The JSON data to send in the request body
    };

    const res = await fetch(apiUrl, requestOptions)
    return res.json();
}


// MAIN FUNCTION
async function main() {
    const tables = {};

    // GET ALL TABLES AND NUMBERS
    const tableElements = document.querySelectorAll("iframe")[0].contentWindow.document.querySelectorAll('[data-role="grid-list-item"]');

    tableElements.forEach(async (_, index, arr) => {
        const numbers = [];

        const title = document.querySelectorAll("iframe")[0].contentWindow.document.querySelectorAll("[data-role='tile-name']")[index].innerText

        tableElements[index].querySelectorAll("[data-role='history-grid'] text").forEach(el => {
            numbers.push(el.innerHTML);
        });

        tables[title] = {
            title,
            numbers
        }

        if (numbers?.length > 0) {

            const dozResult = getRouletteDozenPosition(numbers.slice(0, 4));
            // const colResult = getRouletteColumnPosition(numbers.slice(0, 4));
            const readyResult = getRouletteDozenPosition(numbers.slice(0, 3));
            // const colReadyResult = getRouletteColumnPosition(numbers.slice(0, 3));
            const wonResult = checkResult(numbers.slice(0, 5));

            const wonString = `won${numbers[0]}${numbers[1]}${numbers[0]}${numbers[2]}${numbers[3]}${numbers[4]}`;
            const lossString = `loss${numbers[0]}${numbers[1]}${numbers[0]}${numbers[2]}${numbers[3]}${numbers[4]}`;
            const entryString = `entry${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}`;
            // const colEntryString = `colEntryString${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}`;
            const readyString = `ready${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}`;
            // const colReadyString = `colReadyString${numbers[0]}${numbers[1]}${numbers[2]}${numbers[3]}${numbers[4]}`;

            const blackList = [
                "MONOPOLY Live",
                "Crazy Time",
                "Craps"
            ];

            if (blackList.includes(title)) {
                window.location.href = "https://a8r.evo-games.com/frontend/evo/r2/#game=roulette&category=roulette";
                return;
            }

            if (wonResult === 1 && !lastMsg[wonString]) {
                lastMsg[wonString] = true;
                sendWinAlert(numbers, title)
            } else if (wonResult == 2 && !lastMsg[lossString]) {
                lastMsg[lossString] = true;
                sendLossAlert(numbers, title)
            }

            if (dozResult !== 0 && !lastMsg[entryString]) {
                lastMsg[entryString] = true;
                sendAlert(numbers, title, dozResult);
            }

            // if (colResult !== 0 && !lastMsg[colEntryString]) {
            //     lastMsg[colEntryString] = true;
            //     sendColAlert(numbers, title, colResult);
            // }

            if (readyResult !== 0 && dozResult === 0 && !lastMsg[readyString]) {
                lastMsg[readyString] = true;
                sendReadyAlert(numbers, title, "DOZEN");
            }

            // if (colReadyResult !== 0 && colResult === 0 && !lastMsg[colReadyString]) {
            //     lastMsg[colReadyString] = true;
            //     sendReadyAlert(numbers, title, "COLUMN");
            // }
        }
    });
}

// FUNCTION TO CHECK FOR DOZENS
function getRouletteDozenPosition(numbers) {
    const firstDozen = numbers.every(number => number >= 1 && number <= 12);
    const secondDozen = numbers.every(number => number >= 13 && number <= 24);
    const thirdDozen = numbers.every(number => number >= 25 && number <= 36);
    if (firstDozen) {
        return [2, 3];
    } else if (secondDozen) {
        return [1, 3];
    } else if (thirdDozen) {
        return [1, 2];
    } else {
        return 0; // Numbers don't belong to any dozen
    }
}

// FUNCTION TO CHECK FOR COLUMN
function getRouletteColumnPosition(numbers) {
    const firstColumn = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    const secondColumn = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const thirdColumn = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

    const belongsToFirstColumn = numbers.every(number => firstColumn.includes(Number(number)));
    const belongsToSecondColumn = numbers.every(number => secondColumn.includes(Number(number)));
    const belongsToThirdColumn = numbers.every(number => thirdColumn.includes(Number(number)));

    if (belongsToFirstColumn) {
        return [2, 3];
    } else if (belongsToSecondColumn) {
        return [1, 3];
    } else if (belongsToThirdColumn) {
        return [1, 2];
    } else {
        return 0; // Numbers don't belong to any column
    }
}

// FUNCTIONN TO CHECK FOR WIN AND LOSS
function checkResult(numbers) {
    const allResult = getRouletteDozenPosition(numbers.slice(0, 5));
    const fourResult = getRouletteDozenPosition(numbers.slice(1, 5));

    if (allResult == 0 && fourResult != 0) {
        return 1
    }

    else if (allResult != 0) {
        return 2
    }

    return 0
}


const init = () => {
    const url = "#game=roulette&category=all_games"
    const url2 = "#category=roulette&game=roulette"
    const endUrl = "entry";

    setInterval(() => {
        if (window.location.hash != url || !window.location.href.endsWith(endUrl)) {
            main()
        } else {
            console.log("redirecting")
            window.location.hash = url2;
            return;
        }
    }, 1000)

}

setTimeout(() => {
    init();
}, 5000)