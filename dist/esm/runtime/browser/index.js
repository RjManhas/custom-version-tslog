import { formatTemplate } from "../../formatTemplate.js";
import { formatWithOptions } from "./util.inspect.polyfil.js";
import { jsonStringifyRecursive } from "./helper.jsonStringifyRecursive.js";
const meta = {
    runtime: ![typeof window, typeof document].includes("undefined") ? "Browser" : "Generic",
    browser: globalThis?.["navigator"]?.userAgent,
};
const pathRegex = /(?:(?:file|https?|global code|[^@]+)@)?(?:file:)?((?:\/[^:/]+){2,})(?::(\d+))?(?::(\d+))?/;
export function getMeta(logLevelId, logLevelName, stackDepthLevel, hideLogPositionForPerformance, name, parentNames) {
    return Object.assign({}, meta, {
        name,
        parentNames,
        date: new Date(),
        logLevelId,
        logLevelName,
        path: !hideLogPositionForPerformance ? getCallerStackFrame(stackDepthLevel) : undefined,
    });
}
export function getCallerStackFrame(stackDepthLevel, error = Error()) {
    return stackLineToStackFrame(error?.stack?.split("\n")?.filter((line) => !line.includes("Error: "))?.[stackDepthLevel]);
}
export function getErrorTrace(error) {
    return error?.stack
        ?.split("\n")
        ?.filter((line) => !line.includes("Error: "))
        ?.reduce((result, line) => {
        result.push(stackLineToStackFrame(line));
        return result;
    }, []);
}
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
export function isError(e) {
    return e instanceof Error;
}
export function prettyFormatLogObj(maskedArgs, settings) {
    return maskedArgs.reduce((result, arg) => {
        isError(arg) ? result.errors.push(prettyFormatErrorObj(arg, settings)) : result.args.push(arg);
        return result;
    }, { args: [], errors: [] });
}
export function prettyFormatErrorObj(error, settings) {
    const errorStackStr = getErrorTrace(error).map((stackFrame) => {
        return formatTemplate(settings, settings.prettyErrorStackTemplate, { ...stackFrame }, true);
    });
    const placeholderValuesError = {
        errorName: ` ${error.name} `,
        errorMessage: error.message,
        errorStack: errorStackStr.join("\n"),
    };
    return formatTemplate(settings, settings.prettyErrorTemplate, placeholderValuesError);
}
export function transportFormatted(logMetaMarkup, logArgs, logErrors, settings) {
    const logErrorsStr = (logErrors.length > 0 && logArgs.length > 0 ? "\n" : "") + logErrors.join("\n");
    settings.prettyInspectOptions.colors = settings.stylePrettyLogs;
    console.log(logMetaMarkup + formatWithOptions(settings.prettyInspectOptions, ...logArgs) + logErrorsStr);
}
export function transportJSON(json) {
    console.log(jsonStringifyRecursive(json));
}
export function isBuffer(arg) {
    return arg ? undefined : undefined;
}
