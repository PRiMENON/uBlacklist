const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const UBListFile = './uBlacklist.txt';
const UBOListFile = './uBlockOrigin.txt';
const PuppeteerFile = './puppeteer.txt';

function remove_Files(path) {
    if (fs.existsSync(path)) {
        console.log(path + 'を削除します');
        fs.unlink(path, (err) => {
            if (err) throw err;
        })
    } else {
        console.log(path + 'がないので削除をスキップします');
    }
}

function loadYamlFile(filename) {
    const yamlText = fs.readFileSync(filename, 'utf-8')
    return yaml.load(yamlText);
}

function create_UBList(arrays) {
    for (const array of arrays) {
        let domainLists = array['domain'].replace(/\./g, '\\.');
        domainLists = domainLists.replace(/(^.+$)/g, '\/\(\[a-z\\.\]+\\.\)?$1/\n');
        fs.appendFileSync(UBListFile, domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
}

function create_UBOList(arrays) {
    for (const array of arrays) {
        let domainLists = array['domain'].replace(/(^.+$)/g, 'www\.google\.\*##\.xpd:has\([href*=*"$1"]\)\n');

        fs.appendFileSync(UBOListFile, domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
}

function create_PuppeteerList(arrays) {
    for (const array of arrays) {
        let urlLists = array['evidence'].replace(/(^.+$)/g, '$1\n');
        fs.appendFileSync(PuppeteerFile, urlLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
}

function check_DuplicateDomain(arrays) {
    const results = arrays.filter((item, index, self) => {
        const domainList = self.map(item => item['domain']);
        if (domainList.indexOf(item.domain) === index) {
            return item;
        }
    });
    return results;
}

if (require.main === module) {

    try {
        remove_Files(UBListFile);
        remove_Files(UBOListFile);
        remove_Files(PuppeteerFile);
        let datas = loadYamlFile(path.join(__dirname, 'domain-list.yaml'));
        datas = check_DuplicateDomain(datas);
        create_UBList(datas);
        create_UBOList(datas);
        create_PuppeteerList(datas);
    } catch (err) {
        console.error(err.message);
    }
}
