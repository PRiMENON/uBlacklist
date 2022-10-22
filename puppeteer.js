const puppeteer = require('puppeteer');
const fs = require('fs');

function load_urlFile() {
    let a = fs.readFileSync('./puppeteer-sample.txt', 'utf-8');
    a = a.toString().split('\n');
    a = a.filter(value => value.match(/^http.+/g));
    return a;
}

function write_logFile(count, data) {

    const text = fs.readFileSync('./head.md', 'utf-8');
    console.log(text);

    if (count <= 1) {
        fs.appendFile('./puppeteer.md', text, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    fs.appendFile('./puppeteer.md', data, function (err) {
        if (err) {
            throw err;
        }
    });

}

(async () => {
    const browser = await puppeteer.launch({
        headless: true, // defalut:true, enable debug only 'true';
        sloMo: 1000, //defalut: comment out, enable debug only.
        devtools: true, //default: false, enable debug only 'true';
        defaultViewport: {
            width: 1200,
            height: 900
        },
        timeout: 10000,
        args: [
            '--incognito'
        ],
    });
    const page = await browser.newPage();
    try {
        let urls = load_urlFile();
        let count = 0;
        for (const url of urls) {
            count++;
            console.log('check => ' + url);
            const response = await page.goto(url, { waitUntil: 'networkidle2' });
            console.log(`status: ${response.status()}`);
            let data = '|' + count + '|`' + url + '`|' + response.status() + '|\n';
            write_logFile(count, data);
        }
    }
    catch (err) {
        console.error('error=>', err);
    } finally {
        await browser.close();
    }
})();
