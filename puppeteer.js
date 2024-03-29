const puppeteer = require('puppeteer');
const fs = require('fs');
const yaml = require('js-yaml');
const EvidenceFile = './evidence.md';
const urlFile = process.argv[2];

function remove_File(paths) {
    paths.forEach(item => {
        if (fs.existsSync(item)) {
            console.log('remove ' + item + ' file(s).');
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

function output_evidenceFile(data) {
    fs.appendFile(EvidenceFile, data, function (err) {
        if (err) {
            throw err;
        }
    });
}

function init_evidenceFile() {
    const Evidence_text = fs.readFileSync('./src/evidence.md', 'utf-8');
    fs.appendFileSync(EvidenceFile, Evidence_text, function (err) {
        if (err) {
            throw err;
        }
    });
}

if (require.main === module) {
    (async () => {
        const browser = await puppeteer.launch({
            headless: true, // defalut:true, enable debug only 'true';
            // sloMo: 1000, //defalut: comment out, enable debug only.
            // devtools: true, //default: false, enable debug only 'true';
            ignoreHTTPSErrors: true, //Defaults to false, Whether to ignore HTTPS errors during navigation. 
            defaultViewport: {//Sets the viewport for each page.
                width: 1200,
                height: 900
            },
            timeout: 1000,
            // List of Chromium Command Line Switches
            // https://peter.sh/experiments/chromium-command-line-switches/
            args: [
                '--incognito', // Enable seacret mode
                '--disable-gpu', // Disable gpu
                '--disable-dev-shm-usage', // Change shared memory path /dev/shm to /tmp
                '--disable-setuid-sandbox', // Disable the setuid sandbox (Linux only)
                '--no-first-run', // Skip First Run tasks
                '--no-sandbox', // Disables the sandbox for all process types that are normally sandboxed
                '--no-zygote', // Disables the use of a zygote process for forking child processes
                '--single-process', // Runs the renderer and plugins in the same process as the browser 
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list', // A set of public key hashes for which to ignore certificate-related errors. 
                '--ignore-urlfetcher-cert-requests', // Causes net::URLFetchers to ignore requests for SSL client certificates, causing them to attempt an unauthenticated SSL/TLS session.
                '--enable-features=NetworkService,NetworkServiceInProcess'
            ],
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', request => {
            if (request.isInterceptResolutionHandled()) return;
            if (
                request.url().match(/\.(css|js|png|jpeg|jpg|tiff|json)$/g) ||
                request.url().match(/.+wp-(content|includes).+/g) || 
                request.url().match(/.+(dr6\.biz|matomolib\.xyz|ingmar\.club).+/g)
            ) {
                request.abort().catch(err => console.error(err));
            } else {
                request.continue();
            }
        });

        try {
            //remove evidence.md
            let removeFiles = [EvidenceFile];
            remove_File(removeFiles);

            //init evidence.md
            init_evidenceFile();

            //load domain-list.yaml
            let yamls = load_urlFile();

            //reset count
            let count = 0;
            for (const yaml of yamls) {
                count++;
                let yaml_domain = yaml['domain'];
                let yaml_evidence = yaml['evidence'];

                let regex = new RegExp(/^http/, 'gi');
                if (regex.test(yaml_evidence) == false) {
                    console.log('NOTE:' + yaml_evidence + 'is not URL format. skip it.')
                    continue;
                }

                const response = await page.goto(yaml_evidence, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                }).catch(err => console.error(err));

                if (!response) {
                    let data = '|' + count + '|`' + yaml_domain + '`|' + yaml_evidence + '| net::ERR_SSL_PROTOCOL_ERROR,or ERR_CONECTION_TIMED_OUT |\n';
                    output_evidenceFile(data);
                    continue;
                }
                console.log('check => ' + yaml_evidence + ` [status: ${response.status()}]`);
                let data = '|' + count + '|`' + yaml_domain + '`|' + yaml_evidence + '|' + response.status() + '|\n';
                output_evidenceFile(data);
            }
        }
        catch (err) {
            console.error('error =>', err);
        } finally {
            console.log('script completed.')
            await page.close();
            await browser.close();
        }
    })();
}
