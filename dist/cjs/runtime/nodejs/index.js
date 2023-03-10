"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBuffer = exports.transportJSON = exports.transportFormatted = exports.prettyFormatErrorObj = exports.prettyFormatLogObj = exports.isError = exports.getErrorTrace = exports.getCallerStackFrame = exports.getMeta = void 0;
const os_1 = require("os");
const path_1 = require("path");
const util_1 = require("util");
const formatTemplate_js_1 = require("../../formatTemplate.js");
const meta = {
    runtime: "Nodejs",
    runtimeVersion: process.version,
    hostname: (0, os_1.hostname)(),
};
function getMeta(logLevelId, logLevelName, stackDepthLevel, hideLogPositionForPerformance, name, parentNames) {
    return Object.assign({}, meta, {
        name,
        parentNames,
        date: new Date(),
        logLevelId,
        logLevelName,
        path: !hideLogPositionForPerformance ? getCallerStackFrame(stackDepthLevel) : undefined,
    });
}
exports.getMeta = getMeta;
function getCallerStackFrame(stackDepthLevel, error = Error()) {
    return stackLineToStackFrame(error?.stack?.split("\n")?.filter((thisLine) => thisLine.includes("    at "))?.[stackDepthLevel]);
}
exports.getCallerStackFrame = getCallerStackFrame;
function getErrorTrace(error) {
    return error?.stack?.split("\n")?.reduce((result, line) => {
        if (line.includes("    at ")) {
            result.push(stackLineToStackFrame(line));
        }
        return result;
    }, []);
}
exports.getErrorTrace = getErrorTrace;
function stackLineToStackFrame(line) {
    const pathResult = {
        fullFilePath: undefined,
        fileName: undefined,
        fileNameWithLine: undefined,
        fileColumn: undefined,
        fileLine: undefined,
        filePath: undefined,
        filePathWithLine: undefined,
        method: undefined,
    };
    if (line != null && line.includes("    at ")) {
        line = line.replace(/^\s+at\s+/gm, "");
        const errorStackLine = line.split(" (");
        const fullFilePath = line?.slice(-1) === ")" ? line?.match(/\(([^)]+)\)/)?.[1] : line;
        const pathArray = fullFilePath?.includes(":") ? fullFilePath?.replace("file://", "")?.replace(process.cwd(), "")?.split(":") : undefined;
        const fileColumn = pathArray?.pop();
        const fileLine = pathArray?.pop();
        const filePath = pathArray?.pop();
        const filePathWithLine = (0, path_1.normalize)(`${filePath}:${fileLine}`);
        const fileName = filePath?.split("/")?.pop();
        const fileNameWithLine = `${fileName}:${fileLine}`;
        if (filePath != null && filePath.length > 0) {
            pathResult.fullFilePath = fullFilePath;
            pathResult.fileName = fileName;
            pathResult.fileNameWithLine = fileNameWithLine;
            pathResult.fileColumn = fileColumn;
            pathResult.fileLine = fileLine;
            pathResult.filePath = filePath;
            pathResult.filePathWithLine = filePathWithLine;
            pathResult.method = errorStackLine?.[1] != null ? errorStackLine?.[0] : undefined;
        }
    }
    return pathResult;
}
function isError(e) {
    return util_1.types?.isNativeError != null ? util_1.types.isNativeError(e) : e instanceof Error;
}
exports.isError = isError;
function prettyFormatLogObj(maskedArgs, settings) {
    return maskedArgs.reduce((result, arg) => {
        isError(arg) ? result.errors.push(prettyFormatErrorObj(arg, settings)) : result.args.push(arg);
        return result;
    }, { args: [], errors: [] });
}
exports.prettyFormatLogObj = prettyFormatLogObj;
function prettyFormatErrorObj(error, settings) {
    const errorStackStr = getErrorTrace(error).map((stackFrame) => {
        return (0, formatTemplate_js_1.formatTemplate)(settings, settings.prettyErrorStackTemplate, { ...stackFrame }, true);
    });
    const placeholderValuesError = {
        errorName: ` ${error.name} `,
        errorMessage: error.message,
        errorStack: errorStackStr.join("\n"),
    };
    return (0, formatTemplate_js_1.formatTemplate)(settings, settings.prettyErrorTemplate, placeholderValuesError);
}
exports.prettyFormatErrorObj = prettyFormatErrorObj;
function transportFormatted(logMetaMarkup, logArgs, logErrors, settings) {
    const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
    settings.prettyInspectOptions.colors = settings.stylePrettyLogs;
    console.log(logMetaMarkup + (0, util_1.formatWithOptions)(settings.prettyInspectOptions, ...logArgs) + logErrorsStr);
}
exports.transportFormatted = transportFormatted;
function transportJSON(json) {
    console.log(jsonStringifyRecursive(json));
    function jsonStringifyRecursive(obj) {
        const cache = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (cache.has(value)) {
                    return "[Circular]";
                }
                cache.add(value);
            }
            return value;
        });
    }
}
exports.transportJSON = transportJSON;
function isBuffer(arg) {
    return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;
