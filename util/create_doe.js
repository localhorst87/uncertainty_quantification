const { ScalarParameter, createSamples } = require('../Credibility-Assessment-Framework/Credibility-Development-Kit/util/parameter');
const fs = require('fs');
const path = require('path');

let parameterSpecFolder, doeFileOut;

for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "-p" || process.argv[i] === "--parameterspecs")
        parameterSpecFolder = process.argv[i+1];
    if (process.argv[i] === "-o" || process.argv[i] === "--output")
        doeFileOut = process.argv[i+1];
}

if (parameterSpecFolder === undefined || doeFileOut === undefined)
    throw("parameter specification directory and desired output file path must be given, use -p or --parameterspecs and -o or --output")

// load parameters
let vehicle_mass_real = fs.readFileSync(path.join(parameterSpecFolder, 'vehicle.mass_real.json'), 'utf-8');
let wheel_front_left_friction_brake_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_left.friction_brake_real.json'), 'utf-8');
let wheel_front_right_friction_brake_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_right.friction_brake_real.json'), 'utf-8');
let wheel_rear_left_friction_brake_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_left.friction_brake_real.json'), 'utf-8');
let wheel_rear_right_friction_brake_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_right.friction_brake_real.json'), 'utf-8');
let wheel_front_left_r_brakepad_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_left.r_brakepad_real.json'), 'utf-8');
let wheel_front_right_r_brakepad_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_right.r_brakepad_real.json'), 'utf-8');
let wheel_rear_left_r_brakepad_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_left.r_brakepad_real.json'), 'utf-8');
let wheel_rear_right_r_brakepad_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_right.r_brakepad_real.json'), 'utf-8');
let wheel_front_left_r_dyn_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_left.r_dyn_real.json'), 'utf-8');
let wheel_front_right_r_dyn_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_front_right.r_dyn_real.json'), 'utf-8');
let wheel_rear_left_r_dyn_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_left.r_dyn_real.json'), 'utf-8');
let wheel_rear_right_r_dyn_real = fs.readFileSync(path.join(parameterSpecFolder, 'wheel_rear_right.r_dyn_real.json'), 'utf-8');

// create ScalarParameter objects of parameters, to create a DoE out of it
vehicle_mass_real = new ScalarParameter(vehicle_mass_real);
wheel_front_left_friction_brake_real = new ScalarParameter(wheel_front_left_friction_brake_real);
wheel_front_right_friction_brake_real = new ScalarParameter(wheel_front_right_friction_brake_real);
wheel_rear_left_friction_brake_real = new ScalarParameter(wheel_rear_left_friction_brake_real);
wheel_rear_right_friction_brake_real = new ScalarParameter(wheel_rear_right_friction_brake_real);
wheel_front_left_r_brakepad_real = new ScalarParameter(wheel_front_left_r_brakepad_real);
wheel_front_right_r_brakepad_real = new ScalarParameter(wheel_front_right_r_brakepad_real);
wheel_rear_left_r_brakepad_real = new ScalarParameter(wheel_rear_left_r_brakepad_real);
wheel_rear_right_r_brakepad_real = new ScalarParameter(wheel_rear_right_r_brakepad_real);
wheel_front_left_r_dyn_real = new ScalarParameter(wheel_front_left_r_dyn_real);
wheel_front_right_r_dyn_real = new ScalarParameter(wheel_front_right_r_dyn_real);
wheel_rear_left_r_dyn_real = new ScalarParameter(wheel_rear_left_r_dyn_real);
wheel_rear_right_r_dyn_real = new ScalarParameter(wheel_rear_right_r_dyn_real);

// create a Doe
// will create a multidim array of size [25 x 40 x 13]
// this will result in a DoE with 1000 simulation runs
const doe = createSamples([
    vehicle_mass_real,
    wheel_front_left_friction_brake_real,
    wheel_front_right_friction_brake_real,
    wheel_rear_left_friction_brake_real,
    wheel_rear_right_friction_brake_real,
    wheel_front_left_r_brakepad_real,
    wheel_front_right_r_brakepad_real,
    wheel_rear_left_r_brakepad_real,
    wheel_rear_right_r_brakepad_real,
    wheel_front_left_r_dyn_real,
    wheel_front_right_r_dyn_real,
    wheel_rear_left_r_dyn_real,
    wheel_rear_right_r_dyn_real],
    {
        samples_aleatory: 25,
        samples_epistemic: 40,
        method_aleatory: "equally_spaced",
        method_epistemic: "monte_carlo"
    }
);

fs.writeFileSync(doeFileOut, JSON.stringify(doe));