const fs = require('fs');
const { addUncertainty } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/util/uncertainty')
const { calcAreaValidationMetric } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/metrics/evaluation/level_3/src/uncertainty');
let measurement, simulation;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-s" || process.argv[i] === "--simulation")
        simulation = process.argv[i+1];
    if (process.argv[i] === "-m" || process.argv[i] === "--measurement")
        measurement = process.argv[i+1];
}

if (measurement === undefined || simulation === undefined)
    throw("measurement or simulation distribution files not given, use -s or --simulation and -m or --measurement to indicate its path");

const distSim = JSON.parse(fs.readFileSync(simulation, "utf-8"));
const distRef = JSON.parse(fs.readFileSync(measurement, "utf-8"));
const modelFormUncertainty = calcAreaValidationMetric(distSim, distRef);
const expandedPBoxesSim = addUncertainty(distSim, modelFormUncertainty);

console.log(JSON.stringify(expandedPBoxesSim));