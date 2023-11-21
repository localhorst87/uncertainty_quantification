const fs = require('fs');
const path = require('path');
const { SsvCrud } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/util/ssv-crud');
const { integrateSsvIntoSsd } = require('./ssv_to_ssd_inline');

let ssdFileIn, ssdFolderOut, ssvBasepath, doeFileIn;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-i" || process.argv[i] === "--ssdIn")
        ssdFileIn = process.argv[i+1];
    if (process.argv[i] === "-o" || process.argv[i] === "--ssdOut")
        ssdFolderOut = process.argv[i+1];
    if (process.argv[i] === "-p" || process.argv[i] === "--ssv")
        ssvBasepath = process.argv[i+1];
    if (process.argv[i] === "-d" || process.argv[i] === "--doe")
        doeFileIn = process.argv[i+1];
}

if (ssdFileIn === undefined || ssdFolderOut === undefined || ssvBasepath === undefined || doeFileIn == undefined)
    throw("some command line arguments are missing")

let doe = fs.readFileSync(doeFileIn, 'utf-8');
doe = JSON.parse(doe);

for (let i_exp = 0; i_exp < doe.values.length; i_exp++) {
    for (let i_run = 0; i_run < doe.values[0].length; i_run++) {
        for (let i_param = 0; i_param < doe.values[0][0].length; i_param++) {
            let componentAndParameter = doe.names[i_param];
            let ssvFilename = componentAndParameter.split('.')[0] + ".ssv";
            let ssvPath = path.join(ssvBasepath, ssvFilename);
            let parameterName = componentAndParameter.split('.')[1];
            let parameterValue = doe.values[i_exp][i_run][i_param];
            let ssvString = fs.readFileSync(ssvPath, "utf-8");
            let ssvCrud = new SsvCrud(ssvString);
            ssvCrud.setParameterValue(parameterName, parameterValue);
            
            fs.writeFileSync(ssvPath, ssvCrud.export());
        }

        let ssdFilename = "experiment_" + String(i_exp + 1) + "_run_" + String(i_run + 1) + ".ssd";
        let ssdFileOut = path.join(ssdFolderOut, ssdFilename);

        integrateSsvIntoSsd(ssdFileIn, ssdFileOut);
    }
}