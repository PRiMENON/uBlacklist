const fs = require('fs');
const yaml = require('js-yaml');
const UBListFile = './uBlacklist.txt';
const UBOListFile = './uBlockOrigin.txt';
const urlFile = './domain-list.yaml';

function remove_File(paths) {
    paths.forEach(item => {
        if (fs.existsSync(item)) {
            console.log('remove ' + item + ' file(s).');
            fs.unlink(item, (err) => {
                if (err) throw err;
            })
        } else {
            console.log( item + ' is not found. skip this function. BUT no problem.');
        }
    });
}

function load_urlFile() {
    const yamls = fs.readFileSync(urlFile, 'utf-8')
    return yaml.load(yamls);
}

function create_UBLfile(arrays) {
    const text = fs.readFileSync('./src/ublacklist.md', 'utf-8');
    fs.appendFileSync(UBListFile, text, function (err) {
        if (err) {
            throw err;
        }
    });
    for (const array of arrays) {
        let domainLists = array['domain'].replace(/\./g, '\\.');
        domainLists = domainLists.replace(/(^.+$)/g, '/([a-z\\.]+\\.)?$1/\n');
        fs.appendFileSync(UBListFile, domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
}

function create_UBOLfile(arrays) {
    const text = fs.readFileSync('./src/ublockorigin.md', 'utf-8');
    fs.appendFileSync(UBOListFile, text, function (err) {
        if (err) {
            throw err;
        }
    });
    for (const array of arrays) {
        let domainLists = array['domain'].replace(/(^.+$)/g, 'www.google.*##.xpd:has([href*=*"$1"])\n');

        fs.appendFileSync(UBOListFile, domainLists, { flag: 'a+' }, err => {
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
        let removeFiles = [UBListFile, UBOListFile];
        remove_File(removeFiles);

        let yamls = load_urlFile();

        yamls = check_DuplicateDomain(yamls);

        create_UBLfile(yamls);
        create_UBOLfile(yamls);
    } catch (err) {
        console.error(err.message);
    }
}
