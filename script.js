//https://pptr.dev/
const puppeteer = require('puppeteer');
//https://www.npmjs.com/package/duden-search-api
const DudenSearchApi = require("duden-search-api");
//https://www.npmjs.com/package/cli-progress
const _cliProgress = require('cli-progress');
//https://github.com/punkave/random-words
const randomWords = require('random-words');

const language = "de";
const wordsPerRun = 22;
const useDudenApi = true;


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let startId = 817600;
    const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

    for (let y = 0; y < 100; y++) {
        let url = 'https://answergarden.ch/' + startId;
        let randomWord = await getRandomWords();
        let length = randomWord.length;

        console.log(url + ":");
        bar.start(length, 0);
        for (let i = 0; i < length; i++) {
            try {
                let word = randomWord[i].description.replace('Abkürzung - ', '')

                bar.update(i + 1);
                await page.goto(url);
                await page._client.send('Network.clearBrowserCookies');
                await page.evaluate((randomWord) => {
                    let answerInput = document.getElementById('answer');
                    answerInput.value = randomWord;
                    document.getElementsByTagName('form')[0].submit();
                }, word);
            } catch (err) {

            }
        }
        ++startId;
        bar.stop();
    }

    browser.close();
    process.exit();
})();

async function getRandomWords() {
    let words;
    if (useDudenApi) {
        let instance = new DudenSearchApi();
        words = await instance.search(getRandomLetter()).then((result) => {
            return result;
        }).catch((err) => {
            
        });
    }else{
        words = randomWords(wordsPerRun);
    }

    return words;
}

function getRandomLetter() {
    let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}