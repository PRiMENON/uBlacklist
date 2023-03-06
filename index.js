const fs = require('fs');
const yaml = require('js-yaml');
const UBResultFile = './uBlacklist.txt';
const UBOResultFile = './uBlockOrigin.txt';
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

async function main() {
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
        remove_File(UBResultFile);
        remove_File(UBOResultFile);

        // make uBlacklist.
        let basefileUBL = await fs.readFileSync('./src/ublacklist.md', 'utf-8');
        basefileUBL = setTime(basefileUBL)
        await fs.appendFileSync(UBResultFile, basefileUBL, { flag: 'w' }, function (err) {
            if (err) throw err
        })

        // make uBlockOrigin.
        let basefileUBO = await fs.readFileSync('./src/ublockorigin.md', 'utf-8');
        basefileUBO = setTime(basefileUBO)
        await fs.appendFileSync(UBOResultFile, basefileUBO, { flag: 'w' }, function (err) {
            if (err) throw err
        })

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

            // append uBlacklist
            let UBL_line = yaml_domain.replace(/\./g, '\\.');
            UBL_line = UBL_line.replace(/(^.+$)/g, '/([a-z\\.]+\\.)?$1/\n');
            await fs.appendFileSync(UBResultFile, UBL_line, { flag: 'a' }, err => {
                if (err) throw err;
            });

            // append uBlockOrigin
            let UBO_line = yaml_domain.replace(/(^.+$)/g, 'www.google.*##.xpd:has([href*="$1"])\n');
            await fs.appendFileSync(UBOResultFile, UBO_line, { flag: 'a' }, err => {
                if (err) throw err;
            });
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        console.log('script completed.')
    }
}

main()
