const { translate } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/adapters/openmcx-csv-adapter');

const VELOCITY_START_BLENDING_KMH = 18;
const VELOCITY_END_BLENDING_KMH = 15;

let resultFilePath;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-r" || process.argv[i] === "--result")
        resultFilePath = process.argv[i+1];
}

if (resultFilePath === undefined)
    throw("result file not given, use -r or --result to indicate path")

let signals = translate(resultFilePath);

let velocity = signals.find(signal => signal.name === "v_x");
let acceleration = signals.find(signal => signal.name === "a_x");
let jerk = signals.find(signal => signal.name === "j_x");

const idxBeforeBlending = velocity.values.findIndex(v => 3.6*v < (VELOCITY_START_BLENDING_KMH + 2));
const idxStartBlending = velocity.values.findIndex(v => 3.6*v < (VELOCITY_START_BLENDING_KMH));
const idxEndBlending = velocity.values.findIndex(v => 3.6*v < (VELOCITY_END_BLENDING_KMH));
const idxAfterBlending = velocity.values.findIndex(v => 3.6*v < (VELOCITY_END_BLENDING_KMH - 2));

let accelerationBeforeBlending = acceleration.sliceToIndex(idxBeforeBlending, idxStartBlending);
let accelerationAfterBleinding = acceleration.sliceToIndex(idxEndBlending, idxAfterBlending);
let jerkDuringBlending = jerk.sliceToIndex(idxBeforeBlending, idxAfterBlending);

const accBeforeBlendingMean = accelerationBeforeBlending.values.reduce((accSum, acc) => accSum += acc) / accelerationBeforeBlending.values.length;
const accAfterBlendingMean = accelerationAfterBleinding.values.reduce((accSum, acc) => accSum += acc) / accelerationBeforeBlending.values.length;

const accDiff = Math.abs(accAfterBlendingMean - accBeforeBlendingMean);
const jerkMax = Math.max(...jerkDuringBlending.values.map(jerk => Math.abs(jerk)));

console.log(String(jerkMax));