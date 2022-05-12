"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHashedString = exports.generateHash = void 0;
const bcrypt = require("bcrypt");
function generateHash(value) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value, salt);
    return hash;
}
exports.generateHash = generateHash;
function verifyHashedString(valueToBeCompared, hashValue) {
    return bcrypt.compareSync(valueToBeCompared, hashValue);
}
exports.verifyHashedString = verifyHashedString;
exports.default = { generateHash, verifyHashedString };
