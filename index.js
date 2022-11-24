const fs = require('fs');
const yaml = require('js-yaml');
const UBListFile = './uBlacklist.txt';
const UBOListFile = './uBlockOrigin.txt';
const urlFile = process.argv[2];

function remove_File(path) {
    if (fs.existsSync(path)) {
        console.log('remove ' + path + '.');
        fs.unlink(path, (err) => {
            if (err) throw err;
        })
    } else {
        console.log(path + ' is not found. Skip this function.');
    }
}

function load_urlFile() {
    const yamls = fs.readFileSync(urlFile, 'utf-8')
    return yaml.load(yamls);
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

function init_uBlacklistFile() {
    console.log('initilize src/ublacklist.md.');
    const UBL_text = fs.readFileSync('./src/ublacklist.md', 'utf-8');
    fs.appendFileSync(UBListFile, UBL_text, function (err) {
        if (err) {
            throw err;
        }
    });
}

function init_uBlockOriginFile() {
    console.log('initilize src/ublockorigin.md.');
    const UBO_text = fs.readFileSync('./src/ublockorigin.md', 'utf-8');
    fs.appendFileSync(UBOListFile, UBO_text, function (err) {
        if (err) {
            throw err;
        }
    });
}

if (require.main === module) {
    try {
        //remove uBlacklist.txt, uBlockOrigin.txt
        remove_File(UBListFile);
        remove_File(UBOListFile);

        //init uBlacklist.txt, uBlockOrigin.txt
        if (!fs.existsSync(UBListFile)) {
            init_uBlacklistFile();
        }
        if (!fs.existsSync(UBOListFile)) {
            init_uBlockOriginFile();
        }

        //load domain-list.yaml
        let yamls = load_urlFile();

        //check duplicate domain.
        yamls = check_DuplicateDomain(yamls);

        for (const yaml of yamls) {
            let yaml_domain = yaml['domain'];

            //validate domain format.
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

            //create uBlacklist.txt
            let UBL_domainLists = yaml_domain.replace(/\./g, '\\.');
            UBL_domainLists = UBL_domainLists.replace(/(^.+$)/g, '/([a-z\\.]+\\.)?$1/\n');
            fs.appendFileSync(UBListFile, UBL_domainLists, { flag: 'a+' }, err => {
                if (err) throw err;
            });

            //create uBlockOrigin.txt
            let UBO_domainLists = yaml_domain.replace(/(^.+$)/g, 'www.google.*##.xpd:has([href*=*"$1"])\n');
            fs.appendFileSync(UBOListFile, UBO_domainLists, { flag: 'a+' }, err => {
                if (err) throw err;
            });
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        console.log('script completed.')
    }
}
