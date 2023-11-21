const fs = require('fs');

const VALUE_TO_CHECK = 0.75;
const PERCENTILE_TO_CHECK = 95;

let finalResultFile;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-r" || process.argv[i] === "--result")
        finalResultFile = process.argv[i+1];
}

if (finalResultFile === undefined)
    throw("final result file of P-Boxes not given. Use -r or --result to indicate the file location")

const pBoxes = JSON.parse(fs.readFileSync(finalResultFile, "utf-8"));

const idxValue = pBoxes.x.findIndex(val => val > VALUE_TO_CHECK) - 1;
const idxPercentile_left = pBoxes.p_left.findIndex(p => p >= PERCENTILE_TO_CHECK/100);
const idxPercentile_right = pBoxes.p_right.findIndex(p => p >= PERCENTILE_TO_CHECK/100);

console.log("The probability that the jerk is below 0.75 m/s³ is between " + String(100*pBoxes.p_right[idxValue]) + " and " + String(100*pBoxes.p_left[idxValue]) + " %");
console.log("For the " + String(PERCENTILE_TO_CHECK) + "th percentile, the jerk lies between " + String(pBoxes.x[idxPercentile_left]) + " and " + String(pBoxes.x[idxPercentile_right]) + " m/s³");