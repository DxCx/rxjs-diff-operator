export type IObservableDiffType = 'init' | 'update' | 'error' | 'complete';

export interface IObservableDiff {
    type: IObservableDiffType;
    payload?: any;
    isObject?: boolean;
}
