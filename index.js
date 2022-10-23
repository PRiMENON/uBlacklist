const fs = require('fs');
const yaml = require('js-yaml');
const UBListFile = './uBlacklist.txt';
const UBOListFile = './uBlockOrigin.txt';

function remove_File(paths) {
    paths.forEach(item => {
        if (fs.existsSync(item)) {
            console.log(item + 'を削除します');
            fs.unlink(item, (err) => {
                if (err) throw err;
            })
        } else {
            console.log(item + 'がないので削除をスキップします');
        }
    });
}

function load_urlFile() {
    const yamlText = fs.readFileSync('./domain-list.yaml', 'utf-8')
    return yaml.load(yamlText);
}

function create_UBList(arrays) {
    for (const array of arrays) {
        let domainLists = array['domain'].replace(/\./g, '\\.');
        domainLists = domainLists.replace(/(^.+$)/g, '/([a-z\\.]+\\.)?$1/\n');
        fs.appendFileSync(UBListFile, domainLists, { flag: 'a+' }, err => {
            if (err) throw err;
        });
    }
}

function create_UBOList(arrays) {
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

        let datas = load_urlFile();

        datas = check_DuplicateDomain(datas);

        create_UBList(datas);
        create_UBOList(datas);
    } catch (err) {
        console.error(err.message);
    }
}
