export type IObservableDiffType = "init" | "next" | "error" | "complete";

export interface IObservableDiff {
    type: IObservableDiffType;
    payload?: any;
    isObject?: boolean;
}
