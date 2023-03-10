import { ISettingsParam, ISettings, ILogObjMeta } from "./interfaces.js";
export * from "./interfaces.js";
export declare class BaseLogger<LogObj> {
    private logObj?;
    private stackDepthLevel;
    private readonly runtime;
    settings: ISettings<LogObj>;
    constructor(settings?: ISettingsParam<LogObj>, logObj?: LogObj | undefined, stackDepthLevel?: number);
    /**
     * Logs a message with a custom log level.
     * @param logLevelId    - Log level ID e.g. 0
     * @param logLevelName  - Log level name e.g. silly
     * @param args          - Multiple log attributes that should be logged out.
     * @return LogObject with meta property, when log level is >= minLevel
     */
    log(logLevelId: number, logLevelName: string, ...args: unknown[]): (LogObj & ILogObjMeta) | undefined;
    /**
     *  Attaches external Loggers, e.g. external log services, file system, database
     *
     * @param transportLogger - External logger to be attached. Must implement all log methods.
     */
    attachTransport(transportLogger: (transportLogger: LogObj & ILogObjMeta) => void): void;
    /**
     *  Returns a child logger based on the current instance with inherited settings
     *
     * @param settings - Overwrite settings inherited from parent logger
     * @param logObj - Overwrite logObj for sub-logger
     */
    getSubLogger(settings?: ISettingsParam<LogObj>, logObj?: LogObj): BaseLogger<LogObj>;
    private _mask;
    private _recursiveCloneAndMaskValuesOfKeys;
    private _recursiveCloneAndExecuteFunctions;
    private _toLogObj;
    private _cloneError;
    private _toErrorObject;
    private _addMetaToLogObj;
    private _prettyFormatLogObjMeta;
}
