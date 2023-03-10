import { ILogObjMeta, ISettings, IStackFrame } from "../../interfaces.js";
export interface IMetaStatic {
    name?: string;
    parentNames?: string[];
    runtime: "Nodejs" | "Browser" | "Generic";
    browser: string;
}
export interface IMeta extends IMetaStatic {
    date: Date;
    logLevelId: number;
    logLevelName: string;
    path?: IStackFrame;
}
export declare function getMeta(logLevelId: number, logLevelName: string, stackDepthLevel: number, hideLogPositionForPerformance: boolean, name?: string, parentNames?: string[]): IMeta;
export declare function getCallerStackFrame(stackDepthLevel: number, error?: Error): IStackFrame;
export declare function getErrorTrace(error: Error): IStackFrame[];
export declare function isError(e: Error | unknown): boolean;
export declare function prettyFormatLogObj<LogObj>(maskedArgs: unknown[], settings: ISettings<LogObj>): {
    args: unknown[];
    errors: string[];
};
export declare function prettyFormatErrorObj<LogObj>(error: Error, settings: ISettings<LogObj>): string;
export declare function transportFormatted<LogObj>(logMetaMarkup: string, logArgs: unknown[], logErrors: string[], settings: ISettings<LogObj>): void;
export declare function transportJSON<LogObj>(json: LogObj & ILogObjMeta): void;
export declare function isBuffer(arg?: unknown): undefined;
