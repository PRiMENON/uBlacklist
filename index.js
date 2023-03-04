const fs = require('fs');
const yaml = require('js-yaml');
const UBListFile = './uBlacklist.txt';
const UBOListFile = './uBlockOrigin.txt';
const urlFile = process.argv[2];

function remove_File(path) {
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => { if (err) throw err })
    }
}

function load_urlFile() {
    const yamls = fs.readFileSync(urlFile, 'utf-8')
    return yaml.load(yamls);
}

function setTime(file) {
    const date = new Date()
    let dateISO = date.toISOString()
    file = file.replace('{UPDATE}', dateISO)
    return file
}

function init_uBlacklistFile() {
    let UBL_text = fs.readFileSync('./src/ublacklist.md', 'utf-8');
    UBL_text = setTime(UBL_text)
    fs.appendFileSync(UBListFile, UBL_text, { flag: 'w' }, function (err) { if (err) throw err })
}

function init_uBlockOriginFile() {
    let UBO_text = fs.readFileSync('./src/ublockorigin.md', 'utf-8');
    UBO_text = setTime(UBO_text)
    fs.appendFileSync(UBOListFile, UBO_text, { flag: 'w' }, function (err) { if (err) { throw err } })
}

try {
    // load YAML
    let yamls = load_urlFile();

    // check duplicate domain.
    yamls = yamls.filter((item, index, self) => {
        const domainList = self.map(item => item['domain']);
        if (domainList.indexOf(item.domain) === index) {
            return item;
        } else {
            throw new Error('Found duplicate domain => ' + item['domain']);
        }
    });

    // remove files.
    remove_File(UBListFile);
    remove_File(UBOListFile);

    // init files.
    init_uBlacklistFile();
    init_uBlockOriginFile();

    for (const yaml of yamls) {
        let yaml_domain = yaml['domain'];

        // validate domain format.
        let regex_pattern2 = "\\*";
        regex_pattern2 = new RegExp(regex_pattern2);
        if (regex_pattern2.test(yaml_domain) == true) {
            console.log('NOTE:"' + yaml_domain + '" is not domain format. skip it.')
            continue;
        }
        let regex_pattern3 = "^/";
        regex_pattern3 = new RegExp(regex_pattern3);
        if (regex_pattern3.test(yaml_domain) == true) {
            console.log('NOTE:"' + yaml_domain + '" is not domain format. skip it.')
            continue;
        }

        // create uBlacklist.txt
        let UBL_domainLists = yaml_domain.replace(/\./g, '\\.');
        UBL_domainLists = UBL_domainLists.replace(/(^.+$)/g, '/([a-z\\.]+\\.)?$1/\n');
        fs.appendFileSync(UBListFile, UBL_domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });

        // create uBlockOrigin.txt
        let UBO_domainLists = yaml_domain.replace(/(^.+$)/g, 'www.google.*##.xpd:has([href*="$1"])\n');
        fs.appendFileSync(UBOListFile, UBO_domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
} catch (err) {
    console.error(err.message);
} finally {
    console.log('script completed.')
}
