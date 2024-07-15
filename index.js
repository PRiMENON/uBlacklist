const fs = require('fs')
const yaml = require('js-yaml')
const UBResultFile = './uBlacklist.txt'
const urlFile = process.argv[2]

function remove_File(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path, (err) => { if (err) throw err })
    }
}

try {
    // read YAML
    let yamls = fs.readFileSync(urlFile, 'utf-8')
    yamls = yaml.load(yamls)

    yamls = yamls
        // domain に正規表現が指定されていたら除外
        .filter(item => item.domain.match(/^[a-z0-9.]+/g))
        .map(item => {
            let d = item.domain

            // https://... => *://www.example.com/path/to/*
            if (d.match(/^https?:\/\//g)) {
                d = d.replace(/^https?:\/\/(.+)\/$/g, '*://$1/')
            }

            // abc.domain.com/path/to/ => *://abc.example.com/path/to/*
            if (d.match(/^[^/]+\/[^/]+\//g)) {
                d = d.replace(/(^.+$)/g, '*://$1*')
            }

            // replace regex
            if (d.match()) {
                d = d.replace(/(^[^*]+)/g, '/([a-z0-9.]+.)?$1/')
            }
            console.log(d)
            return { ...item, domain: d };
        })

    // check duplicate domain.
    yamls = yamls.filter((item, index, self) => {
        const domainList = self.map(item => item['domain'])
        if (domainList.indexOf(item.domain) === index) {
            return item
        } else {
            throw new Error('Found duplicate domain => ' + item['domain'])
        }
    })

    // remove files.
    remove_File(UBResultFile)
    
    // get time.
    const date = new Date()
    let dateISO = date.toISOString()

    // create uBlacklist.
    let UBL_val = fs.readFileSync('./src/ublacklist.md', 'utf-8')
    UBL_val = UBL_val.replace('{UPDATE}', dateISO)
    fs.appendFileSync(UBResultFile, UBL_val, { flag: 'w' }, function (err) {
        if (err) throw err
    })

    for (const yaml of yamls) {
        let yaml_domain = yaml['domain']

        let UBL_line = yaml_domain
        UBL_line = yaml_domain.replace(/$/g, '\n')
        fs.appendFileSync(UBResultFile, UBL_line, { flag: 'a' }, err => {
            if (err) throw err
        })
    }
} catch (err) {
    console.error('Error:' + err.message)
} finally {
    console.log('script finished.')
}
