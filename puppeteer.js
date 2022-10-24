const puppeteer = require('puppeteer');
const fs = require('fs');
const yaml = require('js-yaml');
const EvidenceFile = './evidence.md';
const urlFile = './domain-list.yaml';
// const urlFile = './test/domain-list.yaml';

function remove_File(paths) {
    paths.forEach(item => {
        if (fs.existsSync(item)) {
            console.log('remove ' + item + 'file(s).');
            fs.unlink(item, (err) => {
                if (err) throw err;
            })
        } else {
            console.log(item + ' is not found. skip this function. BUT no problem.');
        }
    });
}

function load_urlFile() {
    const yamls = fs.readFileSync(urlFile, 'utf-8');
    return yaml.load(yamls);
}

function create_evidenceFile(count, data) {

    const text = fs.readFileSync('./src/evidence.md', 'utf-8');

    if (count <= 1) {
        fs.appendFile(EvidenceFile, text, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    fs.appendFile(EvidenceFile, data, function (err) {
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
        let removeFiles = [EvidenceFile];
        remove_File(removeFiles);
        let yamls = load_urlFile();
        let count = 0;
        for (const yaml of yamls) {
            count++;
            let yaml_domain = yaml['domain'];
            let yaml_evidence = yaml['evidence'];
            console.log('check => ' + yaml_evidence);
            const response = await page.goto(yaml_evidence, { waitUntil: 'networkidle2' });
            console.log(`status: ${response.status()}`);
            let data = '|' + count + '|`' + yaml_domain + '`|' + yaml_evidence + '|' + response.status() + '|\n';
            create_evidenceFile(count, data);
        }
    }
    catch (err) {
        console.error('error=>', err);
    } finally {
        await browser.close();
    }
})();
