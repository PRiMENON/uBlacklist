const puppeteer = require('puppeteer');
const fs = require('fs');
const yaml = require('js-yaml');

function load_urlFile(){
    const yamls = fs.readFileSync('./domain-list.yaml', 'utf-8');
    return yaml.load(yamls);
}

function write_logFile(count, data) {

    const text = fs.readFileSync('./head.md', 'utf-8');

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
        let yamls = load_urlFile();
        let count = 0;
        for (const yaml of yamls) {
            count++;
            let yaml_domain = yaml['domain'];
            let yaml_evidence = yaml['evidence'];
            console.log('check => ' + yaml['domain']);
            const response = await page.goto(yaml_evidence, { waitUntil: 'networkidle2' });
            console.log(`status: ${response.status()}`);
            let data = '|' + count + '|`' + yaml_domain + '`|' + yaml_evidence + '|' + response.status() + '|\n';
            write_logFile(count, data);
        }
    }
    catch (err) {
        console.error('error=>', err);
    } finally {
        await browser.close();
    }
})();
