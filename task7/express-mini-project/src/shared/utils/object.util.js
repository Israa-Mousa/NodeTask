"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonNullableArray = void 0;
exports.extractFields = extractFields;
exports.cleanObject = cleanObject;
exports.removeFields = removeFields;
exports.addArrayItemIfNotIncluded = addArrayItemIfNotIncluded;
exports.sumOfArrayLengths = sumOfArrayLengths;
exports.isArrayWithLength = isArrayWithLength;
exports.arrayHasMatches = arrayHasMatches;
exports.chunkArray = chunkArray;
exports.isEqualIgnoringArrayOrder = isEqualIgnoringArrayOrder;
var util_1 = require("util");
var nonNullableArray = function (arr) {
    return arr.filter(function (item) { return item !== null && item !== undefined; });
};
exports.nonNullableArray = nonNullableArray;
function extractFields(obj, keys) {
    var pickedObj = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            pickedObj[key] = obj[key];
        }
    }
    return pickedObj;
}
function cleanObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var value = _a[1];
        return value !== undefined && value !== null;
    }));
}
function removeFields(obj, keys) {
    var filteredObj = structuredClone(obj);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        delete filteredObj[key];
    }
    return filteredObj;
}
function addArrayItemIfNotIncluded(array, newItem, optionalFindFunction) {
    // Check if the new item is already included in the array
    var itemExists = optionalFindFunction
        ? array.some(optionalFindFunction)
        : array.includes(newItem);
    // If the item doesn't exist, add it to the array
    if (!itemExists) {
        return __spreadArray(__spreadArray([], array, true), [newItem], false); // Return a new array with the new item added
    }
    // If the item exists, return the original array
    return array;
}
function sumOfArrayLengths() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    return arrays.reduce(function (acc, arr) { return acc + arr.length; }, 0);
}
function isArrayWithLength(array) {
    return Array.isArray(array) && array.length > 0;
}
function arrayHasMatches(array1, array2) {
    return array1.some(function (item) { return array2.includes(item); });
}
function chunkArray(array, size) {
    if (size <= 0) {
        throw new Error('Size must be greater than 0');
    }
    var chunks = [];
    for (var i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function sortArraysDeep(input) {
    if (Array.isArray(input)) {
        var sortedArray = input.map(sortArraysDeep);
        // Sort primitives directly
        if (sortedArray.every(function (item) { return isPrimitive(item); })) {
            return __spreadArray([], sortedArray, true).sort();
        }
        // Sort objects/arrays using JSON representation (fallback)
        return __spreadArray([], sortedArray, true).sort(function (a, b) {
            return JSON.stringify(a).localeCompare(JSON.stringify(b));
        });
    }
    if (isObject(input)) {
        var result = {};
        for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
            var key = _a[_i];
            result[key] = sortArraysDeep(input[key]);
        }
        return result;
    }
    return input;
}
function isPrimitive(value) {
    return typeof value !== 'object' || value === null;
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isEqualIgnoringArrayOrder(a, b) {
    return (0, util_1.isDeepStrictEqual)(sortArraysDeep(a), sortArraysDeep(b));
}
