import * as readline from 'readline';

interface Style {
    [key: string]: string;
}

const styles: Style = {
    bold: '\x1b[1m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    grey: '\x1b[90m'
};

function prompt(question: string, initial?: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    question = `${konsol.green('?')} ${question} `

    if (initial) {
        question += konsol.italic(konsol.grey(`(${initial}) `));
    }

    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            const answered = initial && !answer ? initial : answer;
            resolve(answered);
            rl.close();
        });
        rl.prompt();
    }).then((answer) => {
        // Mengganti teks setelah jawaban di input
        rl.setPrompt(answer);
        return answer;
    });
}

function confirm(question: string, initial?: boolean): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    question = `${konsol.green('?')} ${question} `

    if (initial) {
        question += '[Y/n] ';
    } else {
        question += '[y/N] ';
    }

    return new Promise<boolean>((resolve) => {
        rl.question(question, (answer) => {
            // Mengganti teks setelah jawaban di input
            const isYes = answer === 'y' || answer === 'Y' || answer === 'yes' || answer === 'YES' || answer === 'Yes';
            const answered = initial && !answer ? initial : isYes;
            resolve(answered);
            rl.close();
        });
    });
}

class StyledText {
    text: any;

    constructor(text: any) {
        this.text = text;
    }

    applyStyle(style: string): string {
        return `${styles[style]}${this.text}${styles.reset}`;
    }
}


const konsol = {
    blue: (text: any) => new StyledText(text).applyStyle('blue'),
    bold: (text: any) => new StyledText(text).applyStyle('bold'),
    red: (text: any) => new StyledText(text).applyStyle('red'),
    green: (text: any) => new StyledText(text).applyStyle('green'),
    yellow: (text: any) => new StyledText(text).applyStyle('yellow'),
    white: (text: any) => new StyledText(text).applyStyle('white'),
    grey: (text: any) => new StyledText(text).applyStyle('grey'),
    italic: (text: any) => new StyledText(text).applyStyle('italic'),
    underline: (text: any) => new StyledText(text).applyStyle('underline'),
    reset: (text: any) => new StyledText(text).applyStyle('reset'),
    log: (text: any) => console.log(text)
};

export {
    prompt,
    confirm,
    konsol
}