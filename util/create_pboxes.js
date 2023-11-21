const fs = require('fs');
const path = require('path');
const { createEmpiricalDistribution, createPBoxes } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/util/uncertainty');

let resultDir;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-r" || process.argv[i] === "--results")
        resultDir = process.argv[i+1];
}

if (resultDir === undefined)
    throw("result file not given, use -r or --result to indicate path")

const resultFiles = fs.readdirSync(resultDir);

let edfs = [];

for (let resultFile of resultFiles) {
    let experimentValuesRaw = fs.readFileSync(path.join(resultDir, resultFile), "utf-8");
    let discreteValues = experimentValuesRaw.split('\n').filter(strVal => strVal !== '').map(strVal => Number(strVal));
    edfs.push(createEmpiricalDistribution(discreteValues));
}

const pBoxes = createPBoxes(edfs);

console.log(pBoxes);