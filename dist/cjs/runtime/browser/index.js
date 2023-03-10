"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBuffer = exports.transportJSON = exports.transportFormatted = exports.prettyFormatErrorObj = exports.prettyFormatLogObj = exports.isError = exports.getErrorTrace = exports.getCallerStackFrame = exports.getMeta = void 0;
const formatTemplate_js_1 = require("../../formatTemplate.js");
const util_inspect_polyfil_js_1 = require("./util.inspect.polyfil.js");
const helper_jsonStringifyRecursive_js_1 = require("./helper.jsonStringifyRecursive.js");
const meta = {
    runtime: ![typeof window, typeof document].includes("undefined") ? "Browser" : "Generic",
    browser: globalThis?.["navigator"]?.userAgent,
};
const pathRegex = /(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+){2,})(?::(\d+))?(?::(\d+))?/;
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
    return stackLineToStackFrame(error?.stack?.split("\n")?.filter((line) => !line.includes("Error: "))?.[stackDepthLevel]);
}
exports.getCallerStackFrame = getCallerStackFrame;
function getErrorTrace(error) {
    return error?.stack
        ?.split("\n")
        ?.filter((line) => !line.includes("Error: "))
        ?.reduce((result, line) => {
        result.push(stackLineToStackFrame(line));
        return result;
    }, []);
}
exports.getErrorTrace = getErrorTrace;
function stackLineToStackFrame(line) {
    const href = globalThis.location.origin;
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
    if (line != null) {
        const match = line.match(pathRegex);
        if (match) {
            pathResult.filePath = match[1].replace(/\?.*$/, "");
            pathResult.fullFilePath = `${href}${pathResult.filePath}`;
            const pathParts = pathResult.filePath.split("/");
            pathResult.fileName = pathParts[pathParts.length - 1];
            pathResult.fileLine = match[2];
            pathResult.fileColumn = match[3];
            pathResult.filePathWithLine = `${pathResult.filePath}:${pathResult.fileLine}`;
            pathResult.fileNameWithLine = `${pathResult.fileName}:${pathResult.fileLine}`;
        }
    }
    return pathResult;
}
function isError(e) {
    return e instanceof Error;
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
    console.log(logMetaMarkup + (0, util_inspect_polyfil_js_1.formatWithOptions)(settings.prettyInspectOptions, ...logArgs) + logErrorsStr);
}
exports.transportFormatted = transportFormatted;
function transportJSON(json) {
    console.log((0, helper_jsonStringifyRecursive_js_1.jsonStringifyRecursive)(json));
}
exports.transportJSON = transportJSON;
function isBuffer(arg) {
    return arg ? undefined : undefined;
}
exports.isBuffer = isBuffer;
