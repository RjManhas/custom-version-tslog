import { BaseLogger } from "./BaseLogger.js";
export { BaseLogger };
export class Logger extends BaseLogger {
    constructor(settings, logObj) {
        super(settings, logObj, 5);
    }
    log(logLevelId, logLevelName, ...args) {
        return super.log(logLevelId, logLevelName, ...args);
    }
    silly(...args) {
        return super.log(0, "SILLY", ...args);
    }
    trace(...args) {
        return super.log(1, "TRACE", ...args);
    }
    debug(...args) {
        return super.log(2, "DEBUG", ...args);
    }
    info(...args) {
        return super.log(3, "INFO", ...args);
    }
    warn(...args) {
        return super.log(4, "WARN", ...args);
    }
    error(...args) {
        return super.log(5, "ERROR", ...args);
    }
    fatal(...args) {
        return super.log(6, "FATAL", ...args);
    }
    success(...args) {
        return  super.log(7, "SUCCESS", ...args);
    }
    notice(...args) {
        return  super.log(8, "NOTICE", ...args);
    }
    getSubLogger(settings, logObj) {
        return super.getSubLogger(settings, logObj);
    }
}
